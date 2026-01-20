import { Base64ImageSource, ErrorResponse, MessageParam, Tool, ToolChoice } from "@anthropic-ai/sdk/resources";
import { ChatCompletionTool, ChatCompletionToolChoiceOption } from "openai/resources";
export declare function getAnthropicErrorMessage(response: ErrorResponse): string;
/**
 * Detects if the given API base URL is an Azure-hosted Anthropic endpoint.
 * Azure AI Foundry hosts Anthropic models but requires a different auth header.
 *
 * Supported Azure endpoint patterns:
 * - *.services.ai.azure.com (Azure AI Foundry)
 * - *.cognitiveservices.azure.com (Azure Cognitive Services)
 *
 * @param apiBase - The API base URL to check
 * @returns true if the endpoint is an Azure-hosted Anthropic endpoint
 */
export declare function isAzureAnthropicEndpoint(apiBase?: string): boolean;
export declare function getAnthropicHeaders(apiKey: string, enableCaching: boolean, apiBase?: string): Record<string, string>;
export declare function addCacheControlToLastTwoUserMessages(messages: MessageParam[]): void;
export declare function openAiToolChoiceToAnthropicToolChoice(toolChoice: ChatCompletionToolChoiceOption | undefined): ToolChoice | undefined;
export declare function openaiToolToAnthropicTool(tool: ChatCompletionTool): Tool;
export declare function getAnthropicMediaTypeFromDataUrl(dataUrl: string): Base64ImageSource["media_type"];
