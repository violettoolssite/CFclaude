import { fetchwithRequestOptions, patchedFetch } from "@continuedev/fetch";
export function chatChunk(options) {
    return {
        choices: [
            {
                delta: {
                    content: options.content,
                    role: "assistant",
                },
                finish_reason: options.finish_reason ?? "stop",
                index: 0,
                logprobs: null,
            },
        ],
        usage: options.usage,
        created: Date.now(),
        id: options.id ?? "",
        model: options.model,
        object: "chat.completion.chunk",
    };
}
export function usageChatChunk(options) {
    return {
        choices: [],
        usage: options.usage,
        created: Date.now(),
        id: options.id ?? "",
        model: options.model,
        object: "chat.completion.chunk",
    };
}
export function chatChunkFromDelta(options) {
    return {
        choices: [
            {
                delta: options.delta,
                finish_reason: options.finish_reason ?? "stop",
                index: 0,
                logprobs: null,
            },
        ],
        usage: options.usage,
        created: Date.now(),
        id: options.id ?? "",
        model: options.model,
        object: "chat.completion.chunk",
    };
}
export function chatCompletion(options) {
    return {
        choices: [
            {
                finish_reason: options.finish_reason ?? "stop",
                index: options.index ?? 0,
                logprobs: null,
                message: {
                    content: options.content ?? null,
                    role: "assistant",
                    refusal: null,
                },
            },
        ],
        usage: options.usage,
        created: Date.now(),
        id: options.id ?? "",
        model: options.model,
        object: "chat.completion",
    };
}
export function embedding(options) {
    return {
        data: options.data.map((embedding, i) => ({
            index: i,
            embedding: embedding,
            object: "embedding",
        })),
        model: options.model,
        object: "list",
        usage: options.usage ?? {
            prompt_tokens: 0,
            total_tokens: 0,
        },
    };
}
export function rerank(options) {
    return {
        data: options.data.map((score, index) => ({
            index,
            relevance_score: score,
        })),
        model: options.model,
        object: "list",
        usage: options.usage ?? {
            total_tokens: 0,
        },
    };
}
export function model(options) {
    return {
        id: options.id,
        object: "model",
        created: Date.now(),
        owned_by: options.owned_by ?? "organization-owner",
    };
}
export function customFetch(requestOptions) {
    if (process.env.FEATURE_FLAG_DISABLE_CUSTOM_FETCH) {
        return patchedFetch;
    }
    function letRequestOptionsOverrideAuthHeaders(init) {
        if (!init || !init.headers || !requestOptions || !requestOptions.headers) {
            return init;
        }
        // Check if custom Authorization or x-api-key headers are provided
        const hasCustomAuth = requestOptions.headers["Authorization"] ||
            requestOptions.headers["authorization"];
        const hasCustomXApiKey = requestOptions.headers["x-api-key"] ||
            requestOptions.headers["X-Api-Key"];
        // Remove default auth headers if custom ones are provided
        if (hasCustomAuth || hasCustomXApiKey) {
            if (init.headers instanceof Headers) {
                if (hasCustomAuth) {
                    init.headers.delete("Authorization");
                }
                if (hasCustomXApiKey) {
                    init.headers.delete("x-api-key");
                }
            }
            else if (Array.isArray(init.headers)) {
                init.headers = init.headers.filter((header) => {
                    const headerLower = (header[0] ?? "").toLowerCase();
                    if (hasCustomAuth && headerLower === "authorization")
                        return false;
                    if (hasCustomXApiKey && headerLower === "x-api-key")
                        return false;
                    return true;
                });
            }
            else if (typeof init.headers === "object") {
                if (hasCustomAuth) {
                    delete init.headers["Authorization"];
                    delete init.headers["authorization"];
                }
                if (hasCustomXApiKey) {
                    delete init.headers["x-api-key"];
                    delete init.headers["X-Api-Key"];
                }
            }
        }
        return init;
    }
    return (req, init) => {
        init = letRequestOptionsOverrideAuthHeaders(init);
        if (typeof req === "string" || req instanceof URL) {
            return fetchwithRequestOptions(req, init, requestOptions);
        }
        else {
            return fetchwithRequestOptions(req.url, init, requestOptions);
        }
    };
}
//# sourceMappingURL=util.js.map