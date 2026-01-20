import { OpenAI } from "openai/index";
import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming } from "openai/resources/index";
import { WatsonXConfig } from "../types.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
export declare class WatsonXApi implements BaseLlmApi {
    protected config: WatsonXConfig;
    apiBase: string;
    apiVersion: string;
    projectId?: string;
    deploymentId?: string;
    constructor(config: WatsonXConfig);
    getBearerToken(): Promise<{
        token: string;
        expiration: number;
    }>;
    private getEndpoint;
    private _convertBody;
    private getHeaders;
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    completionNonStream(body: CompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<Completion>;
    completionStream(body: CompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<Completion, any, unknown>;
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
    embed(body: OpenAI.Embeddings.EmbeddingCreateParams): Promise<OpenAI.Embeddings.CreateEmbeddingResponse>;
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
    list(): Promise<OpenAI.Models.Model[]>;
}
