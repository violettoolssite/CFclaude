/**
 * Converts OpenAI ChatCompletionMessageParam format to Vercel AI SDK CoreMessage format
 */
import type { ChatCompletionMessageParam } from "openai/resources/index.js";
export interface VercelCoreMessage {
    role: "system" | "user" | "assistant" | "tool";
    content: string | Array<any>;
}
/**
 * Converts OpenAI messages to Vercel AI SDK CoreMessage format.
 *
 * Key differences:
 * - OpenAI tool results: { role: "tool", tool_call_id: "...", content: "string" }
 * - Vercel tool results: { role: "tool", content: [{ type: "tool-result", toolCallId: "...", toolName: "...", result: any }] }
 *
 * IMPORTANT: For multi-turn conversations with tools:
 * - We EXCLUDE assistant messages that have tool_calls because Vercel AI SDK manages tool call state internally
 * - We only include tool results, and Vercel will associate them with its internal tool call tracking
 */
export declare function convertOpenAIMessagesToVercel(messages: ChatCompletionMessageParam[]): VercelCoreMessage[];
