import { ChatCompletionCreateParams } from "openai/resources/index";
import { OpenAIConfig } from "../types.js";
import { OpenAIApi } from "./OpenAI.js";
export interface OpenRouterConfig extends OpenAIConfig {
    cachingStrategy?: import("./AnthropicCachingStrategies.js").CachingStrategyName;
}
export declare class OpenRouterApi extends OpenAIApi {
    constructor(config: OpenRouterConfig);
    private isAnthropicModel;
    modifyChatBody<T extends ChatCompletionCreateParams>(body: T): T;
}
export default OpenRouterApi;
