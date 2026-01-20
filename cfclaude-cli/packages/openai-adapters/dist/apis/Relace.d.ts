import { Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming } from "openai/resources/completions.mjs";
import { CreateEmbeddingResponse, EmbeddingCreateParams } from "openai/resources/embeddings.mjs";
import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming } from "openai/resources/index.mjs";
import { Model } from "openai/resources/models.mjs";
import { z } from "zod";
import { OpenAIConfigSchema } from "../types.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
export declare class RelaceApi implements BaseLlmApi {
    private readonly config;
    private apiBase;
    constructor(config: z.infer<typeof OpenAIConfigSchema>);
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    completionNonStream(body: CompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<Completion>;
    completionStream(body: CompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<Completion>;
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    embed(body: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
    list(): Promise<Model[]>;
}
