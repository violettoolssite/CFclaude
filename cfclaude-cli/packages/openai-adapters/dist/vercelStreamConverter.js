/**
 * Converts Vercel AI SDK stream events to OpenAI ChatCompletionChunk format
 */
import { chatChunk, chatChunkFromDelta, usageChatChunk } from "./util.js";
/**
 * Converts a Vercel AI SDK stream event to OpenAI ChatCompletionChunk format.
 * Returns null for events that don't map to OpenAI chunks (like step-start, step-finish, etc.)
 */
export function convertVercelStreamPart(part, options) {
    const { model } = options;
    switch (part.type) {
        case "text-delta":
            return chatChunk({
                content: part.textDelta,
                model,
            });
        case "reasoning":
            // For o1 models, reasoning is also treated as text content
            return chatChunk({
                content: part.textDelta,
                model,
            });
        case "tool-call":
            return chatChunkFromDelta({
                delta: {
                    tool_calls: [
                        {
                            index: 0,
                            id: part.toolCallId,
                            type: "function",
                            function: {
                                name: part.toolName,
                                arguments: JSON.stringify(part.args),
                            },
                        },
                    ],
                },
                model,
            });
        case "tool-call-delta":
            return chatChunkFromDelta({
                delta: {
                    tool_calls: [
                        {
                            index: 0,
                            function: {
                                arguments: part.argsTextDelta,
                            },
                        },
                    ],
                },
                model,
            });
        case "finish":
            // Emit usage from finish event if available
            // The finish event DOES contain the final usage in most cases
            if (part.usage) {
                const promptTokens = typeof part.usage.promptTokens === "number"
                    ? part.usage.promptTokens
                    : 0;
                const completionTokens = typeof part.usage.completionTokens === "number"
                    ? part.usage.completionTokens
                    : 0;
                const totalTokens = typeof part.usage.totalTokens === "number"
                    ? part.usage.totalTokens
                    : promptTokens + completionTokens;
                // Check for Anthropic-specific cache token details
                const promptTokensDetails = part.usage.promptTokensDetails?.cachedTokens !== undefined
                    ? {
                        cached_tokens: part.usage.promptTokensDetails.cachedTokens ?? 0,
                        cache_read_tokens: part.usage.promptTokensDetails.cachedTokens ?? 0,
                        cache_write_tokens: 0,
                    }
                    : undefined;
                return usageChatChunk({
                    model,
                    usage: {
                        prompt_tokens: promptTokens,
                        completion_tokens: completionTokens,
                        total_tokens: totalTokens,
                        ...(promptTokensDetails
                            ? { prompt_tokens_details: promptTokensDetails }
                            : {}),
                    },
                });
            }
            return null;
        case "error":
            // Errors should be thrown, not converted to chunks
            throw part.error;
        // Events that don't map to OpenAI chunks - return null to skip
        case "reasoning-signature":
        case "redacted-reasoning":
        case "source":
        case "file":
        case "tool-call-streaming-start":
        case "tool-result":
        case "step-start":
        case "step-finish":
            return null;
        default:
            // Exhaustiveness check
            const _exhaustive = part;
            return null;
    }
}
/**
 * Async generator that converts Vercel AI SDK stream to OpenAI ChatCompletionChunk stream
 */
export async function* convertVercelStream(stream, options) {
    for await (const part of stream) {
        const chunk = convertVercelStreamPart(part, options);
        if (chunk !== null) {
            yield chunk;
        }
    }
}
//# sourceMappingURL=vercelStreamConverter.js.map