import { chatChunk, chatCompletion, customFetch, usageChatChunk, } from "../util.js";
// Relace only supports apply through a /v1/apply endpoint
export class RelaceApi {
    config;
    apiBase = "https://instantapply.endpoint.relace.run/v1/";
    constructor(config) {
        this.config = config;
        this.apiBase = config.apiBase ?? this.apiBase;
        if (!this.apiBase.endsWith("/")) {
            this.apiBase += "/";
        }
        this.config = config;
    }
    async chatCompletionNonStream(body, signal) {
        let content = "";
        let usage = undefined;
        // Convert the non-streaming params to streaming params
        const streamingBody = {
            ...body,
            stream: true,
        };
        for await (const chunk of this.chatCompletionStream(streamingBody, signal)) {
            if (chunk.choices.length > 0) {
                content += chunk.choices[0]?.delta?.content || "";
            }
            if (chunk.usage) {
                usage = chunk.usage;
            }
        }
        return chatCompletion({
            content,
            model: body.model,
            usage,
        });
    }
    // We convert from what would be sent to OpenAI (a prediction for the existing code and a user message with the new code)
    // to Relace's format
    async *chatCompletionStream(body, signal) {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
        };
        const prediction = body.prediction?.content ?? "";
        const initialCode = typeof prediction === "string"
            ? prediction
            : prediction.map((p) => p.text).join("");
        const userContent = body.messages.find((m) => m.role === "user")?.content;
        if (!userContent) {
            throw new Error("No edit snippet provided.");
        }
        const editSnippet = typeof userContent === "string"
            ? userContent
            : userContent
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("");
        const data = {
            initialCode,
            editSnippet,
        };
        const url = this.apiBase + "code/apply";
        const response = await customFetch(this.config.requestOptions)(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
            signal,
        });
        if (response.status === 499) {
            return; // Aborted by user
        }
        const result = (await response.json());
        const mergedCode = result.mergedCode;
        yield chatChunk({
            content: mergedCode,
            model: body.model,
        });
        yield usageChatChunk({
            model: body.model,
            usage: {
                prompt_tokens: result.usage.prompt_tokens || 0,
                completion_tokens: result.usage.completion_tokens || 0,
                total_tokens: result.usage.total_tokens,
            },
        });
    }
    completionNonStream(body, signal) {
        throw new Error("Relace provider does not support non-streaming completion.");
    }
    completionStream(body, signal) {
        throw new Error("Relace provider does not support streaming completion.");
    }
    fimStream(body, signal) {
        throw new Error("Relace provider does not support streaming FIM completion.");
    }
    embed(body) {
        throw new Error("Relace provider does not support embeddings.");
    }
    rerank(body) {
        throw new Error("Relace provider does not support reranking.");
    }
    list() {
        throw new Error("Relace provider does not support model listing.");
    }
}
//# sourceMappingURL=Relace.js.map