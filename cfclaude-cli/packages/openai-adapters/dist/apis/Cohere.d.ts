import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming, CreateEmbeddingResponse, EmbeddingCreateParams, Model } from "openai/resources/index";
import { CohereConfig } from "../types.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
export declare class CohereApi implements BaseLlmApi {
    protected config: CohereConfig;
    apiBase: string;
    static maxStopSequences: number;
    constructor(config: CohereConfig);
    private _convertMessages;
    private _convertBody;
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    completionNonStream(body: CompletionCreateParamsNonStreaming): Promise<Completion>;
    completionStream(body: CompletionCreateParamsStreaming): AsyncGenerator<Completion>;
    fimStream(body: FimCreateParamsStreaming): AsyncGenerator<ChatCompletionChunk>;
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
    embed(body: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;
    list(): Promise<Model[]>;
}
