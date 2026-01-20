import { BaseLlmApi } from "./apis/base.js";
import { LLMConfig } from "./types.js";
export declare function constructLlmApi(config: LLMConfig): BaseLlmApi | undefined;
export { type ChatCompletion, type ChatCompletionChunk, type ChatCompletionCreateParams, type ChatCompletionCreateParamsNonStreaming, type ChatCompletionCreateParamsStreaming, type Completion, type CompletionCreateParams, type CompletionCreateParamsNonStreaming, type CompletionCreateParamsStreaming, } from "openai/resources/index";
export type { BaseLlmApi } from "./apis/base.js";
export type { LLMConfig } from "./types.js";
export { addCacheControlToLastTwoUserMessages, getAnthropicErrorMessage, getAnthropicHeaders, getAnthropicMediaTypeFromDataUrl, } from "./apis/AnthropicUtils.js";
export { isResponsesModel } from "./apis/openaiResponses.js";
export { parseDataUrl, extractBase64FromDataUrl } from "./util/url.js";
