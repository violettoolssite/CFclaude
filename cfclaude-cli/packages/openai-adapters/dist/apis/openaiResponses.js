const RESPONSES_MODEL_REGEX = /^(?:gpt-5|gpt-5-codex|o[0-9])/i;
export function isResponsesModel(model) {
    return !!model && RESPONSES_MODEL_REGEX.test(model);
}
function convertTextPart(text) {
    return {
        text,
        type: "input_text",
    };
}
function convertImagePart(image) {
    const converted = {
        type: "input_image",
        image_url: image.image_url.url,
        detail: image.image_url.detail ?? "auto",
    };
    if (image.image_url.file_id) {
        converted.file_id = image.image_url.file_id;
    }
    return converted;
}
function convertAudioPart(part) {
    return {
        type: "input_audio",
        input_audio: {
            data: part.input_audio.data,
            format: part.input_audio.format,
        },
    };
}
function convertFilePart(part) {
    return {
        type: "input_file",
        file_id: part.file.file_id ?? undefined,
        file_data: part.file.file_data ?? undefined,
        filename: part.file.filename ?? undefined,
        file_url: part.file.file_url ?? undefined,
    };
}
function convertMessageContentPart(part) {
    switch (part.type) {
        case "text":
            return convertTextPart(part.text);
        case "image_url":
            return convertImagePart(part);
        case "input_audio":
            return convertAudioPart(part);
        case "file":
            return convertFilePart(part);
        case "refusal":
            // Skip refusal parts - they're not input content
            return undefined;
        default:
            return undefined;
    }
}
function collectMessageContentParts(content) {
    if (typeof content === "string") {
        return [convertTextPart(content)];
    }
    if (!Array.isArray(content)) {
        return [];
    }
    const parts = [];
    for (const part of content) {
        const converted = convertMessageContentPart(part);
        if (!converted) {
            continue;
        }
        parts.push(converted);
    }
    return parts;
}
function createOutputTextPart(text, source) {
    const annotations = Array.isArray(source?.annotations) && source.annotations.length > 0
        ? source.annotations
        : [];
    const part = {
        text,
        type: "output_text",
        annotations,
    };
    if (Array.isArray(source?.logprobs) && source.logprobs.length > 0) {
        part.logprobs = source.logprobs;
    }
    return part;
}
function createRefusalPart(refusal) {
    return {
        refusal,
        type: "refusal",
    };
}
function collectAssistantContentParts(content, refusal) {
    const parts = [];
    if (typeof content === "string") {
        if (content.trim().length > 0) {
            parts.push(createOutputTextPart(content));
        }
    }
    else if (Array.isArray(content)) {
        for (const rawPart of content) {
            // Content array should be ChatCompletionContentPartText | ChatCompletionContentPartRefusal
            // but we handle "output_text" type which may come from Response API conversions
            const part = rawPart;
            if (!part) {
                continue;
            }
            const partType = part.type;
            if (partType === "text") {
                const textPart = part;
                if (typeof textPart.text === "string" &&
                    textPart.text.trim().length > 0) {
                    parts.push(createOutputTextPart(textPart.text));
                }
            }
            else if (partType === "output_text") {
                const textValue = part.text;
                if (typeof textValue === "string" && textValue.trim().length > 0) {
                    parts.push(createOutputTextPart(textValue));
                }
            }
            else if (partType === "refusal") {
                const refusalPart = part;
                const refusalText = refusalPart.refusal;
                if (typeof refusalText === "string" && refusalText.trim().length > 0) {
                    parts.push(createRefusalPart(refusalText));
                }
            }
        }
    }
    if (typeof refusal === "string" && refusal.trim().length > 0) {
        parts.push(createRefusalPart(refusal));
    }
    return parts;
}
function extractToolResultContent(content) {
    if (typeof content === "string") {
        return content;
    }
    if (!Array.isArray(content)) {
        return "";
    }
    return content
        .map((part) => {
        if (part.type === "text") {
            return part.text;
        }
        return "";
    })
        .join("");
}
function convertTools(tools, legacyFunctions) {
    if (tools?.length) {
        return tools.map((tool) => {
            if (tool.type === "function") {
                return {
                    type: "function",
                    name: tool.function.name,
                    description: tool.function.description ?? null,
                    parameters: tool.function.parameters ?? null,
                    strict: tool.function.strict !== undefined ? tool.function.strict : null,
                };
            }
            return tool;
        });
    }
    if (legacyFunctions?.length) {
        return legacyFunctions.map((fn) => ({
            type: "function",
            name: fn.name,
            description: fn.description ?? null,
            parameters: fn.parameters ?? null,
            strict: null,
        }));
    }
    return undefined;
}
function resolveToolChoice(params) {
    if (params.tool_choice) {
        return params.tool_choice;
    }
    if (params.function_call) {
        if (typeof params.function_call === "string") {
            if (params.function_call === "none") {
                return "none";
            }
            if (params.function_call === "auto") {
                return "auto";
            }
        }
        else if (params.function_call?.name) {
            return {
                type: "function",
                name: params.function_call.name,
            };
        }
    }
    return undefined;
}
export function toResponsesInput(messages) {
    const inputItems = [];
    let assistantMessageCounter = 0;
    for (const message of messages) {
        if (message.role === "tool") {
            if (!message.tool_call_id) {
                continue;
            }
            const rawContent = extractToolResultContent(message.content);
            inputItems.push({
                type: "function_call_output",
                call_id: message.tool_call_id,
                output: rawContent,
            });
            continue;
        }
        if (message.role === "system" || message.role === "developer") {
            const contentParts = collectMessageContentParts(message.content);
            if (contentParts.length === 0) {
                continue;
            }
            inputItems.push({
                type: "message",
                role: "developer",
                content: contentParts,
            });
            continue;
        }
        if (message.role === "user") {
            const contentParts = collectMessageContentParts(message.content);
            if (contentParts.length === 0) {
                continue;
            }
            inputItems.push({
                type: "message",
                role: "user",
                content: contentParts,
            });
            continue;
        }
        if (message.role === "assistant") {
            const assistantMessage = message;
            const assistantContentParts = collectAssistantContentParts(assistantMessage.content, assistantMessage.refusal ?? null);
            if (assistantContentParts.length > 0) {
                const providedId = message.id;
                const assistantId = typeof providedId === "string" && providedId.startsWith("msg_")
                    ? providedId
                    : `msg_${(assistantMessageCounter++).toString().padStart(4, "0")}`;
                inputItems.push({
                    type: "message",
                    role: "assistant",
                    content: assistantContentParts,
                    id: assistantId,
                    status: "completed",
                });
            }
            if (assistantMessage.tool_calls?.length) {
                assistantMessage.tool_calls.forEach((toolCall, index) => {
                    if (toolCall.type === "function") {
                        const callId = toolCall.id ?? `tool_call_${index}`;
                        const functionCall = {
                            type: "function_call",
                            call_id: callId,
                            name: toolCall.function.name ?? "",
                            arguments: toolCall.function.arguments ?? "{}",
                        };
                        if (typeof toolCall.id === "string" &&
                            toolCall.id.startsWith("fc_")) {
                            functionCall.id = toolCall.id;
                        }
                        inputItems.push(functionCall);
                    }
                });
            }
            continue;
        }
    }
    return inputItems;
}
export function toResponsesParams(params) {
    const input = toResponsesInput(params.messages);
    const responsesParams = {
        model: params.model,
        input,
        stream: params.stream === true
            ? true
            : false,
        tool_choice: resolveToolChoice(params),
        tools: convertTools(params.tools, params.functions),
    };
    if (params.temperature !== undefined && params.temperature !== null) {
        responsesParams.temperature = params.temperature;
    }
    if (params.top_p !== undefined && params.top_p !== null) {
        responsesParams.top_p = params.top_p;
    }
    if (params.metadata !== undefined) {
        responsesParams.metadata = params.metadata ?? null;
    }
    if (params.prompt_cache_key !== undefined) {
        responsesParams.prompt_cache_key = params.prompt_cache_key;
    }
    const maxOutputTokens = params.max_completion_tokens ?? params.max_tokens ?? null;
    if (maxOutputTokens !== null) {
        responsesParams.max_output_tokens = maxOutputTokens;
    }
    if (params.parallel_tool_calls !== undefined) {
        responsesParams.parallel_tool_calls = params.parallel_tool_calls;
    }
    else if (params.tools?.length) {
        responsesParams.parallel_tool_calls = false;
    }
    if (params.reasoning_effort) {
        responsesParams.reasoning = {
            effort: params.reasoning_effort,
        };
    }
    // Remove undefined properties to avoid overriding server defaults
    Object.keys(responsesParams).forEach((key) => {
        const typedKey = key;
        if (responsesParams[typedKey] === undefined) {
            delete responsesParams[typedKey];
        }
    });
    return responsesParams;
}
function mapUsage(usage) {
    if (!usage) {
        return undefined;
    }
    const mapped = {
        completion_tokens: usage.output_tokens,
        prompt_tokens: usage.input_tokens,
        total_tokens: usage.total_tokens,
    };
    return mapped;
}
export function createResponsesStreamState(context) {
    return {
        context: {
            id: context.responseId,
            model: context.model,
            created: context.created,
            pendingFinish: null,
        },
        messages: new Map(),
        toolCalls: new Map(),
        indexToToolCallId: new Map(),
    };
}
function buildChunk(state, delta = {}, finishReason = null, usage, options) {
    const includeChoices = options?.includeChoices ?? true;
    const created = state.context.created ?? Math.floor(Date.now() / 1000);
    const id = state.context.id ?? "";
    const chunk = {
        id,
        object: "chat.completion.chunk",
        created,
        model: state.context.model,
        choices: includeChoices
            ? [
                {
                    index: 0,
                    delta: delta,
                    finish_reason: finishReason,
                    logprobs: null,
                },
            ]
            : [],
    };
    if (usage) {
        chunk.usage = usage;
    }
    return chunk;
}
function mapIncompleteReason(event) {
    const reason = event.response.incomplete_details?.reason;
    if (reason === "max_output_tokens") {
        return "length";
    }
    if (reason === "content_filter") {
        return "content_filter";
    }
    return "stop";
}
function upsertToolCallState(state, item, outputIndex) {
    const callId = item.call_id ?? item.id ?? `tool_call_${state.toolCalls.size}`;
    const toolState = {
        id: item.id ?? callId,
        callId,
        index: outputIndex,
        name: item.name ?? undefined,
        arguments: item.arguments ?? "",
    };
    state.toolCalls.set(item.id ?? callId, toolState);
    state.indexToToolCallId.set(outputIndex, callId);
    return toolState;
}
function getToolCallState(state, itemId, outputIndex) {
    const existing = state.toolCalls.get(itemId);
    if (existing) {
        return existing;
    }
    const byIndex = state.indexToToolCallId.get(outputIndex);
    if (!byIndex) {
        return undefined;
    }
    return state.toolCalls.get(byIndex);
}
export function fromResponsesChunk(state, event) {
    switch (event.type) {
        case "response.created": {
            state.context.id = event.response.id;
            state.context.created = event.response.created_at;
            if (event.response.model) {
                state.context.model = event.response.model;
            }
            return undefined;
        }
        case "response.output_item.added": {
            const item = event.item;
            if (item.type === "message") {
                state.messages.set(item.id, { content: "", refusal: null });
            }
            else if (item.type === "function_call") {
                upsertToolCallState(state, item, event.output_index);
            }
            return undefined;
        }
        case "response.output_text.delta": {
            const messageState = state.messages.get(event.item_id);
            if (messageState) {
                messageState.content += event.delta;
            }
            return buildChunk(state, { content: event.delta });
        }
        case "response.reasoning_text.delta": {
            return buildChunk(state, {
                reasoning: {
                    content: [
                        {
                            type: "reasoning_text",
                            text: event.delta,
                        },
                    ],
                },
            });
        }
        case "response.reasoning_summary_text.delta": {
            const summaryEvent = event;
            return buildChunk(state, {
                reasoning: {
                    content: [
                        {
                            type: "reasoning_text",
                            text: summaryEvent.delta,
                        },
                    ],
                },
            });
        }
        case "response.refusal.delta": {
            const messageState = state.messages.get(event.item_id);
            if (messageState) {
                messageState.refusal = (messageState.refusal ?? "") + event.delta;
            }
            return buildChunk(state, { refusal: event.delta });
        }
        case "response.function_call_arguments.delta": {
            const callState = getToolCallState(state, event.item_id, event.output_index);
            if (!callState) {
                return undefined;
            }
            callState.arguments += event.delta;
            return buildChunk(state, {
                tool_calls: [
                    {
                        index: callState.index,
                        id: callState.callId,
                        type: "function",
                        function: {
                            name: callState.name,
                            arguments: event.delta,
                        },
                    },
                ],
            });
        }
        case "response.function_call_arguments.done": {
            const doneEvent = event;
            const callState = getToolCallState(state, doneEvent.item_id, doneEvent.output_index);
            if (callState) {
                callState.arguments = doneEvent.arguments;
            }
            return undefined;
        }
        case "response.output_item.done": {
            if (event.item.type === "function_call") {
                return buildChunk(state, {}, "tool_calls");
            }
            if (event.item.type === "message") {
                return buildChunk(state, {}, state.context.pendingFinish ?? "stop");
            }
            return undefined;
        }
        case "response.completed": {
            state.context.id = event.response.id;
            state.context.created = event.response.created_at;
            state.context.model = event.response.model ?? state.context.model;
            const usage = mapUsage(event.response.usage);
            if (usage) {
                return buildChunk(state, {}, null, usage, {
                    includeChoices: false,
                });
            }
            return undefined;
        }
        case "response.incomplete": {
            const reason = mapIncompleteReason(event);
            state.context.pendingFinish = reason;
            const usage = mapUsage(event.response.usage);
            if (usage) {
                return buildChunk(state, {}, null, usage, {
                    includeChoices: false,
                });
            }
            return buildChunk(state, {}, reason);
        }
        case "response.failed":
        case "error": {
            state.context.pendingFinish = "content_filter";
            return undefined;
        }
        default:
            return undefined;
    }
}
export function responseToChatCompletion(response) {
    const usage = mapUsage(response.usage);
    let finishReason = "stop";
    if (response.incomplete_details?.reason === "max_output_tokens") {
        finishReason = "length";
    }
    else if (response.incomplete_details?.reason === "content_filter") {
        finishReason = "content_filter";
    }
    const messageContent = [];
    let refusal = null;
    const toolCalls = [];
    response.output.forEach((item) => {
        if (item.type === "message") {
            item.content.forEach((contentPart) => {
                if (contentPart.type === "output_text") {
                    messageContent.push(contentPart.text);
                }
                else if (contentPart.type === "refusal") {
                    refusal = (refusal ?? "") + contentPart.refusal;
                }
            });
        }
        else if (item.type === "function_call") {
            toolCalls.push({
                id: item.call_id ?? item.id,
                type: "function",
                function: {
                    name: item.name,
                    arguments: item.arguments,
                },
            });
        }
    });
    if (toolCalls.length > 0) {
        finishReason = "tool_calls";
    }
    const message = {
        role: "assistant",
        content: messageContent.length ? messageContent.join("") : null,
        refusal,
        tool_calls: toolCalls.length ? toolCalls : undefined,
    };
    const chatCompletion = {
        id: response.id,
        object: "chat.completion",
        created: response.created_at,
        model: response.model,
        choices: [
            {
                index: 0,
                message,
                finish_reason: finishReason,
                logprobs: null,
            },
        ],
    };
    if (usage) {
        chatCompletion.usage = usage;
    }
    return chatCompletion;
}
//# sourceMappingURL=openaiResponses.js.map