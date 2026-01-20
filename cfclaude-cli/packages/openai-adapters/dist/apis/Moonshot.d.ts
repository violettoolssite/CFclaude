import { ChatCompletionChunk, Model } from "openai/resources/index";
import { MoonshotConfig } from "../types.js";
import { OpenAIApi } from "./OpenAI.js";
import { FimCreateParamsStreaming } from "./base.js";
export declare class MoonshotApi extends OpenAIApi {
    apiBase: string;
    constructor(config: MoonshotConfig);
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    list(): Promise<Model[]>;
}
