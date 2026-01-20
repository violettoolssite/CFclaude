/**
 * Converts OpenAI tool_choice format to Vercel AI SDK toolChoice format
 */
import type { ChatCompletionToolChoiceOption } from "openai/resources/index.js";
/**
 * Converts OpenAI tool_choice to Vercel AI SDK toolChoice format
 *
 * OpenAI format:
 * - 'auto' | 'none' | 'required'
 * - { type: 'function', function: { name: string } }
 *
 * Vercel AI SDK format:
 * - 'auto' | 'none' | 'required'
 * - { type: 'tool', toolName: string }
 */
export declare function convertToolChoiceToVercel(toolChoice: ChatCompletionToolChoiceOption | undefined): "auto" | "none" | "required" | {
    type: "tool";
    toolName: string;
} | undefined;
