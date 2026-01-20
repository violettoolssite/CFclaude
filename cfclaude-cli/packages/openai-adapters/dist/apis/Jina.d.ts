import { OpenAI } from "openai/index";
import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming, Model } from "openai/resources/index";
import { JinaConfig } from "../types.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
export declare class JinaApi implements BaseLlmApi {
    protected config: JinaConfig;
    apiBase: string;
    constructor(config: JinaConfig);
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming): Promise<ChatCompletion>;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    completionNonStream(body: CompletionCreateParamsNonStreaming): Promise<Completion>;
    completionStream(body: CompletionCreateParamsStreaming): AsyncGenerator<Completion, any, unknown>;
    fimStream(body: FimCreateParamsStreaming): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    embed(body: OpenAI.Embeddings.EmbeddingCreateParams): Promise<OpenAI.Embeddings.CreateEmbeddingResponse>;
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
    list(): Promise<Model[]>;
}
