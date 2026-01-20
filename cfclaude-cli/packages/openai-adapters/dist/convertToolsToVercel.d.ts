/**
 * Converts OpenAI tool format to Vercel AI SDK format
 */
import type { ChatCompletionCreateParams } from "openai/resources/index.js";
/**
 * Converts OpenAI tool format to Vercel AI SDK format.
 *
 * OpenAI format: { type: "function", function: { name, description, parameters: JSONSchema } }
 * Vercel format: { [toolName]: { description, parameters: aiJsonSchema(JSONSchema) } }
 *
 * @param openaiTools - Array of OpenAI tools or undefined
 * @returns Object with tool names as keys, or undefined if no tools
 */
export declare function convertToolsToVercelFormat(openaiTools?: ChatCompletionCreateParams["tools"]): Promise<Record<string, any> | undefined>;
