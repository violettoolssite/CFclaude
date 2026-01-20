/**
 * Converts Vercel AI SDK stream events to OpenAI ChatCompletionChunk format
 */
import type { ChatCompletionChunk } from "openai/resources/index";
export type VercelStreamPart = {
    type: "text-delta";
    textDelta: string;
} | {
    type: "reasoning";
    textDelta: string;
} | {
    type: "reasoning-signature";
    signature: string;
} | {
    type: "redacted-reasoning";
    data: string;
} | {
    type: "source";
    source: any;
} | {
    type: "file";
    name: string;
    content: string;
} | {
    type: "tool-call";
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
} | {
    type: "tool-call-streaming-start";
    toolCallId: string;
    toolName: string;
} | {
    type: "tool-call-delta";
    toolCallId: string;
    toolName: string;
    argsTextDelta: string;
} | {
    type: "tool-result";
    toolCallId: string;
    result: unknown;
} | {
    type: "step-start";
    messageId: string;
    request: any;
    warnings: any[];
} | {
    type: "step-finish";
    messageId: string;
    request: any;
    response: any;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason: string;
} | {
    type: "finish";
    finishReason: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
} | {
    type: "error";
    error: unknown;
};
export interface VercelStreamConverterOptions {
    model: string;
}
/**
 * Converts a Vercel AI SDK stream event to OpenAI ChatCompletionChunk format.
 * Returns null for events that don't map to OpenAI chunks (like step-start, step-finish, etc.)
 */
export declare function convertVercelStreamPart(part: VercelStreamPart, options: VercelStreamConverterOptions): ChatCompletionChunk | null;
/**
 * Async generator that converts Vercel AI SDK stream to OpenAI ChatCompletionChunk stream
 */
export declare function convertVercelStream(stream: AsyncIterable<VercelStreamPart>, options: VercelStreamConverterOptions): AsyncGenerator<ChatCompletionChunk, void, unknown>;
