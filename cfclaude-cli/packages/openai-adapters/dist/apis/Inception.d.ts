import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Model } from "openai/resources/index";
import { InceptionConfig } from "../types.js";
import { OpenAIApi } from "./OpenAI.js";
import { FimCreateParamsStreaming } from "./base.js";
export declare const UNIQUE_TOKEN = "<|!@#IS_NEXT_EDIT!@#|>";
export declare const APPLY_UNIQUE_TOKEN = "<|!@#IS_APPLY!@#|>";
export declare const INCEPTION_API_BASE = "https://api.inceptionlabs.ai/v1/";
export declare class InceptionApi extends OpenAIApi {
    constructor(config: InceptionConfig);
    editCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    editCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    applyCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    applyCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    list(): Promise<Model[]>;
    private isNextEdit;
    private isApply;
    private removeToken;
    private streamCustomEndpoint;
    private nonStreamCustomEndpoint;
}
