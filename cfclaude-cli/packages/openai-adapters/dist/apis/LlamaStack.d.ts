import { ChatCompletionChunk } from "openai/resources/index";
import { LlamastackConfig } from "../types.js";
import { OpenAIApi } from "./OpenAI.js";
import { FimCreateParamsStreaming } from "./base.js";
export declare const Llamastack_API_BASE = "http://localhost:8321/v1/openai/v1/";
export declare class LlamastackApi extends OpenAIApi {
    constructor(config: LlamastackConfig);
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
}
