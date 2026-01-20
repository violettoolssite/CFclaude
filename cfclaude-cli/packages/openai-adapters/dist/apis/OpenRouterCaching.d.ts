import { ChatCompletionCreateParams } from "openai/resources/index";
import { CachingStrategyName } from "./AnthropicCachingStrategies.js";
export declare const applyAnthropicCachingToOpenRouterBody: (body: ChatCompletionCreateParams, strategy: CachingStrategyName) => void;
