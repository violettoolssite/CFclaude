import { ChatCompletionChunk, Model } from "openai/resources/index";
import { DeepseekConfig } from "../types.js";
import { OpenAIApi } from "./OpenAI.js";
import { FimCreateParamsStreaming } from "./base.js";
export declare const DEEPSEEK_API_BASE = "https://api.deepseek.com/";
export declare class DeepSeekApi extends OpenAIApi {
    constructor(config: DeepseekConfig);
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    list(): Promise<Model[]>;
}
