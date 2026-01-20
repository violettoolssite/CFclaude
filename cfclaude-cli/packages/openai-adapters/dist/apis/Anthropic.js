import { streamSse } from "@continuedev/fetch";
import { chatChunk, chatChunkFromDelta, customFetch, usageChatChunk, } from "../util.js";
import { EMPTY_CHAT_COMPLETION } from "../util/emptyChatCompletion.js";
import { safeParseArgs } from "../util/parseArgs.js";
import { extractBase64FromDataUrl } from "../util/url.js";
import { CACHING_STRATEGIES, } from "./AnthropicCachingStrategies.js";
import { getAnthropicHeaders, getAnthropicMediaTypeFromDataUrl, openAiToolChoiceToAnthropicToolChoice, openaiToolToAnthropicTool, } from "./AnthropicUtils.js";
export class AnthropicApi {
    config;
    apiBase = "https://api.anthropic.com/v1/";
    anthropicProvider;
    useVercelSDK;
    constructor(config) {
        this.config = config;
        this.apiBase = config.apiBase ?? this.apiBase;
        if (!this.apiBase.endsWith("/")) {
            this.apiBase += "/";
        }
        this.useVercelSDK = process.env.USE_VERCEL_AI_SDK_ANTHROPIC === "true";
    }
    async initializeVercelProvider() {
        if (!this.anthropicProvider && this.useVercelSDK) {
            const { createAnthropic } = await import("@ai-sdk/anthropic");
            // Only use customFetch if we have request options that need it
            // Otherwise use native fetch (Vercel AI SDK requires Web Streams API)
            const hasRequestOptions = this.config.requestOptions &&
                (this.config.requestOptions.headers ||
                    this.config.requestOptions.proxy ||
                    this.config.requestOptions.caBundlePath ||
                    this.config.requestOptions.clientCertificate ||
                    this.config.requestOptions.extraBodyProperties);
            this.anthropicProvider = createAnthropic({
                apiKey: this.config.apiKey ?? "",
                baseURL: this.apiBase !== "https://api.anthropic.com/v1/" &&
                    this.apiBase !== "https://api.anthropic.com/v1"
                    ? this.apiBase.replace(/\/$/, "")
                    : undefined,
                fetch: hasRequestOptions
                    ? customFetch(this.config.requestOptions)
                    : undefined,
            });
        }
    }
    _convertBody(oaiBody) {
        // Step 1: Convert to clean Anthropic body (no caching)
        const cleanBody = this._convertToCleanAnthropicBody(oaiBody);
        // Step 2: Apply caching strategy
        const cachingStrategy = CACHING_STRATEGIES[this.config.cachingStrategy ?? "systemAndTools"];
        return cachingStrategy(cleanBody);
    }
    maxTokensForModel(model) {
        if (model.includes("haiku")) {
            return 8192;
        }
        return 32_000;
    }
    _convertToCleanAnthropicBody(oaiBody) {
        let stop = undefined;
        if (oaiBody.stop && Array.isArray(oaiBody.stop)) {
            stop = oaiBody.stop.filter((x) => x.trim() !== "");
        }
        else if (typeof oaiBody.stop === "string" && oaiBody.stop.trim() !== "") {
            stop = [oaiBody.stop];
        }
        const systemMessage = oaiBody.messages.find((msg) => msg.role === "system")?.content;
        // TODO support custom tools
        const functionTools = oaiBody.tools?.filter((t) => t.type === "function");
        let tools = undefined;
        if (oaiBody.tool_choice !== "none" &&
            functionTools &&
            functionTools.length > 0) {
            if (typeof oaiBody.tool_choice !== "string" &&
                oaiBody.tool_choice?.type === "allowed_tools") {
                const allowedToolNames = new Set(oaiBody.tool_choice?.allowed_tools.tools.map((tool) => tool["name"]) ?? []);
                const allowedTools = functionTools.filter((t) => allowedToolNames.has(t.function.name));
                tools = allowedTools.map(openaiToolToAnthropicTool);
            }
            else {
                tools = functionTools.map(openaiToolToAnthropicTool);
            }
        }
        const anthropicBody = {
            messages: this._convertMessages(oaiBody.messages.filter((msg) => msg.role !== "system")),
            system: typeof systemMessage === "string"
                ? [
                    {
                        type: "text",
                        text: systemMessage,
                    },
                ]
                : systemMessage,
            top_p: oaiBody.top_p ?? undefined,
            temperature: oaiBody.temperature ?? undefined,
            max_tokens: oaiBody.max_tokens ?? this.maxTokensForModel(oaiBody.model), // max_tokens is required
            model: oaiBody.model,
            stop_sequences: stop,
            stream: oaiBody.stream ?? undefined,
            tools,
            tool_choice: openAiToolChoiceToAnthropicToolChoice(oaiBody.tool_choice),
        };
        return anthropicBody;
    }
    convertToolCallsToBlocks(toolCall) {
        const toolCallId = toolCall.id;
        const toolName = toolCall.function?.name;
        if (toolCallId && toolName) {
            return {
                type: "tool_use",
                id: toolCallId,
                name: toolName,
                input: safeParseArgs(toolCall.function.arguments, `${toolName} ${toolCallId}`),
            };
        }
    }
    // 1. ignores empty content
    // 2. converts string content to text parts
    // 3. converts text and refusal parts to text blocks
    // 4. converts image parts to image blocks
    convertMessageContentToBlocks(content) {
        const blocks = [];
        if (typeof content === "string") {
            if (content) {
                blocks.push({
                    type: "text",
                    text: content,
                });
            }
        }
        else {
            const supportedParts = content.filter((p) => p.type === "text" || p.type === "image_url" || p.type === "refusal");
            for (const part of supportedParts) {
                if (part.type === "image_url") {
                    const dataUrl = part.image_url.url;
                    if (dataUrl?.startsWith("data:")) {
                        const base64Data = extractBase64FromDataUrl(dataUrl);
                        if (base64Data) {
                            blocks.push({
                                type: "image",
                                source: {
                                    type: "base64",
                                    media_type: getAnthropicMediaTypeFromDataUrl(dataUrl),
                                    data: base64Data,
                                },
                            });
                        }
                        else {
                            console.warn("Anthropic: skipping image with invalid data URL format", dataUrl);
                        }
                    }
                }
                else {
                    const text = part.type === "text" ? part.text : part.refusal;
                    if (text) {
                        blocks.push({
                            type: "text",
                            text,
                        });
                    }
                }
            }
        }
        return blocks;
    }
    getContentBlocksFromChatMessage(message) {
        switch (message.role) {
            // One tool message = one tool_result block
            case "tool":
                return [
                    {
                        type: "tool_result",
                        tool_use_id: message.tool_call_id,
                        content: message.content,
                    },
                ];
            case "user":
                return this.convertMessageContentToBlocks(message.content);
            case "assistant":
                const blocks = message.content
                    ? this.convertMessageContentToBlocks(message.content)
                    : [];
                // If any tool calls are present, always put them last
                // Loses order vs what was originally sent, but they typically come last
                for (const toolCall of message.tool_calls ?? []) {
                    if (toolCall.type !== "function") {
                        // TODO support custom tool calls
                        continue;
                    }
                    const block = this.convertToolCallsToBlocks(toolCall);
                    if (block) {
                        blocks.push(block);
                    }
                }
                return blocks;
            // system, etc.
            default:
                return [];
        }
    }
    _convertMessages(msgs) {
        const nonSystemMessages = msgs.filter((m) => m.role !== "system");
        const convertedMessages = [];
        let currentRole = undefined;
        let currentParts = [];
        const flushCurrentMessage = () => {
            if (currentRole && currentParts.length > 0) {
                convertedMessages.push({
                    role: currentRole,
                    content: currentParts,
                });
                currentParts = [];
            }
        };
        for (const message of nonSystemMessages) {
            const newRole = message.role === "user" || message.role === "tool"
                ? "user"
                : "assistant";
            if (currentRole !== newRole) {
                flushCurrentMessage();
                currentRole = newRole;
            }
            currentParts.push(...this.getContentBlocksFromChatMessage(message));
        }
        flushCurrentMessage();
        return convertedMessages;
    }
    async chatCompletionNonStream(body, signal) {
        // Check if message history contains tool results
        // Vercel SDK cannot handle pre-existing tool call conversations
        const hasToolMessages = body.messages.some((msg) => msg.role === "tool");
        if (this.useVercelSDK && !hasToolMessages) {
            return this.chatCompletionNonStreamVercel(body, signal);
        }
        const response = await customFetch(this.config.requestOptions)(new URL("messages", this.apiBase), {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(this._convertBody(body)),
            signal,
        });
        if (response.status === 499) {
            return EMPTY_CHAT_COMPLETION;
        }
        const completion = await response.json();
        const usage = completion.usage;
        return {
            id: completion.id,
            object: "chat.completion",
            model: body.model,
            created: Math.floor(Date.now() / 1000),
            usage: {
                total_tokens: (usage?.input_tokens ?? 0) + (usage?.output_tokens ?? 0),
                completion_tokens: usage?.output_tokens ?? 0,
                prompt_tokens: usage?.input_tokens ?? 0,
                prompt_tokens_details: {
                    cached_tokens: usage?.cache_read_input_tokens ?? 0,
                    cache_read_tokens: usage?.cache_read_input_tokens ?? 0,
                    cache_write_tokens: usage?.cache_creation_input_tokens ?? 0,
                },
            },
            choices: [
                {
                    logprobs: null,
                    finish_reason: "stop",
                    message: {
                        role: "assistant",
                        content: completion.content[0].text,
                        refusal: null,
                    },
                    index: 0,
                },
            ],
        };
    }
    async chatCompletionNonStreamVercel(body, signal) {
        await this.initializeVercelProvider();
        if (!this.anthropicProvider) {
            throw new Error("Vercel AI SDK Anthropic provider not initialized");
        }
        const { generateText } = await import("ai");
        const { convertOpenAIMessagesToVercel } = await import("../openaiToVercelMessages.js");
        const { convertToolsToVercelFormat } = await import("../convertToolsToVercel.js");
        const { convertToolChoiceToVercel } = await import("../convertToolChoiceToVercel.js");
        // Convert OpenAI messages to Vercel AI SDK CoreMessage format
        const vercelMessages = convertOpenAIMessagesToVercel(body.messages);
        // Extract system message
        const systemMsg = vercelMessages.find((msg) => msg.role === "system");
        const systemText = systemMsg && typeof systemMsg.content === "string"
            ? systemMsg.content
            : undefined;
        // Filter out system messages - Vercel AI SDK handles them separately
        const nonSystemMessages = vercelMessages.filter((msg) => msg.role !== "system");
        const model = this.anthropicProvider(body.model);
        // Convert OpenAI tools to Vercel AI SDK format
        const vercelTools = await convertToolsToVercelFormat(body.tools);
        const result = await generateText({
            model,
            system: systemText,
            messages: nonSystemMessages,
            temperature: body.temperature ?? undefined,
            maxTokens: body.max_tokens ?? undefined,
            topP: body.top_p ?? undefined,
            stopSequences: body.stop
                ? Array.isArray(body.stop)
                    ? body.stop
                    : [body.stop]
                : undefined,
            tools: vercelTools,
            toolChoice: convertToolChoiceToVercel(body.tool_choice),
            abortSignal: signal,
        });
        // Convert Vercel AI SDK result to OpenAI ChatCompletion format
        const toolCalls = result.toolCalls?.map((tc) => ({
            id: tc.toolCallId,
            type: "function",
            function: {
                name: tc.toolName,
                arguments: JSON.stringify(tc.args),
            },
        }));
        return {
            id: result.response?.id ?? "",
            object: "chat.completion",
            created: Math.floor(Date.now() / 1000),
            model: body.model,
            choices: [
                {
                    index: 0,
                    message: {
                        role: "assistant",
                        content: result.text,
                        tool_calls: toolCalls,
                        refusal: null,
                    },
                    finish_reason: result.finishReason === "tool-calls" ? "tool_calls" : "stop",
                    logprobs: null,
                },
            ],
            usage: {
                prompt_tokens: result.usage.promptTokens,
                completion_tokens: result.usage.completionTokens,
                total_tokens: result.usage.totalTokens,
                prompt_tokens_details: {
                    cached_tokens: result.usage.promptTokensDetails?.cachedTokens ?? 0,
                    cache_read_tokens: result.usage.promptTokensDetails?.cachedTokens ?? 0,
                    cache_write_tokens: 0,
                },
            },
        };
    }
    // This is split off so e.g. VertexAI can use it
    async *handleStreamResponse(response, model) {
        let lastToolUseId;
        let lastToolUseName;
        const usage = {
            completion_tokens: 0,
            prompt_tokens: 0,
            total_tokens: 0,
        };
        for await (const event of streamSse(response)) {
            // https://docs.anthropic.com/en/api/messages-streaming#event-types
            const rawEvent = event;
            switch (rawEvent.type) {
                case "content_block_start":
                    const blockStartEvent = rawEvent;
                    if (blockStartEvent.content_block.type === "tool_use") {
                        lastToolUseId = blockStartEvent.content_block.id;
                        lastToolUseName = blockStartEvent.content_block.name;
                    }
                    break;
                case "message_start":
                    const startEvent = rawEvent;
                    usage.prompt_tokens = startEvent.message.usage?.input_tokens ?? 0;
                    usage.prompt_tokens_details = {
                        cache_write_tokens: startEvent.message.usage?.cache_creation_input_tokens ?? 0,
                        cache_read_tokens: startEvent.message.usage?.cache_read_input_tokens ?? 0,
                        cached_tokens: startEvent.message.usage?.cache_read_input_tokens ?? 0,
                    };
                    break;
                case "message_delta":
                    const deltaEvent = rawEvent;
                    usage.completion_tokens = deltaEvent.usage?.output_tokens ?? 0;
                    break;
                case "content_block_delta":
                    // https://docs.anthropic.com/en/api/messages-streaming#delta-types
                    const blockDeltaEvent = rawEvent;
                    switch (blockDeltaEvent.delta.type) {
                        case "text_delta":
                            yield chatChunk({
                                content: blockDeltaEvent.delta.text,
                                model,
                            });
                            break;
                        case "input_json_delta":
                            if (!lastToolUseId || !lastToolUseName) {
                                throw new Error("No tool use found");
                            }
                            yield chatChunkFromDelta({
                                model,
                                delta: {
                                    tool_calls: [
                                        {
                                            id: lastToolUseId,
                                            type: "function",
                                            index: 0,
                                            function: {
                                                name: lastToolUseName,
                                                arguments: blockDeltaEvent.delta.partial_json,
                                            },
                                        },
                                    ],
                                },
                            });
                            break;
                    }
                    break;
                case "content_block_stop":
                    lastToolUseId = undefined;
                    lastToolUseName = undefined;
                    break;
                default:
                    break;
            }
        }
        yield usageChatChunk({
            model,
            usage: {
                ...usage,
                total_tokens: usage.completion_tokens + usage.prompt_tokens,
            },
        });
    }
    async *chatCompletionStream(body, signal) {
        // Check if message history contains tool results
        // Vercel SDK cannot handle pre-existing tool call conversations
        const hasToolMessages = body.messages.some((msg) => msg.role === "tool");
        if (this.useVercelSDK && !hasToolMessages) {
            yield* this.chatCompletionStreamVercel(body, signal);
            return;
        }
        const response = await customFetch(this.config.requestOptions)(new URL("messages", this.apiBase), {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(this._convertBody(body)),
            signal,
        });
        yield* this.handleStreamResponse(response, body.model);
    }
    async *chatCompletionStreamVercel(body, signal) {
        await this.initializeVercelProvider();
        if (!this.anthropicProvider) {
            throw new Error("Vercel AI SDK Anthropic provider not initialized");
        }
        const { streamText } = await import("ai");
        const { convertOpenAIMessagesToVercel } = await import("../openaiToVercelMessages.js");
        const { convertToolsToVercelFormat } = await import("../convertToolsToVercel.js");
        const { convertVercelStream } = await import("../vercelStreamConverter.js");
        const { convertToolChoiceToVercel } = await import("../convertToolChoiceToVercel.js");
        // Convert OpenAI messages to Vercel AI SDK CoreMessage format
        const vercelMessages = convertOpenAIMessagesToVercel(body.messages);
        // Extract system message
        const systemMsg = vercelMessages.find((msg) => msg.role === "system");
        const systemText = systemMsg && typeof systemMsg.content === "string"
            ? systemMsg.content
            : undefined;
        // Filter out system messages - Vercel AI SDK handles them separately
        const nonSystemMessages = vercelMessages.filter((msg) => msg.role !== "system");
        const model = this.anthropicProvider(body.model);
        // Convert OpenAI tools to Vercel AI SDK format
        const vercelTools = await convertToolsToVercelFormat(body.tools);
        const stream = await streamText({
            model,
            system: systemText,
            messages: nonSystemMessages,
            temperature: body.temperature ?? undefined,
            maxTokens: body.max_tokens ?? undefined,
            topP: body.top_p ?? undefined,
            stopSequences: body.stop
                ? Array.isArray(body.stop)
                    ? body.stop
                    : [body.stop]
                : undefined,
            tools: vercelTools,
            toolChoice: convertToolChoiceToVercel(body.tool_choice),
            abortSignal: signal,
        });
        // Convert Vercel AI SDK stream to OpenAI format
        // The finish event in fullStream contains the usage data
        yield* convertVercelStream(stream.fullStream, {
            model: body.model,
        });
    }
    getHeaders() {
        const enableCaching = this.config?.cachingStrategy !== "none";
        return getAnthropicHeaders(this.config.apiKey, enableCaching, this.apiBase);
    }
    async completionNonStream(body, signal) {
        throw new Error("Method not implemented.");
    }
    async *completionStream(body, signal) {
        throw new Error("Method not implemented.");
    }
    async *fimStream(body, signal) {
        throw new Error("Method not implemented.");
    }
    async embed(body) {
        throw new Error("Method not implemented.");
    }
    async rerank(body) {
        throw new Error("Method not implemented.");
    }
    list() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=Anthropic.js.map