import { MessageCreateParams } from "@anthropic-ai/sdk/resources";
import { OpenAI } from "openai/index";
import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming } from "openai/resources/index";
import { ChatCompletionCreateParams } from "openai/resources/index.js";
import { AnthropicConfig } from "../types.js";
import { CachingStrategyName } from "./AnthropicCachingStrategies.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
export declare class AnthropicApi implements BaseLlmApi {
    protected config: AnthropicConfig & {
        cachingStrategy?: CachingStrategyName;
    };
    apiBase: string;
    private anthropicProvider?;
    private useVercelSDK;
    constructor(config: AnthropicConfig & {
        cachingStrategy?: CachingStrategyName;
    });
    private initializeVercelProvider;
    private _convertBody;
    private maxTokensForModel;
    _convertToCleanAnthropicBody(oaiBody: ChatCompletionCreateParams): MessageCreateParams;
    private convertToolCallsToBlocks;
    private convertMessageContentToBlocks;
    private getContentBlocksFromChatMessage;
    private _convertMessages;
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    private chatCompletionNonStreamVercel;
    handleStreamResponse(response: any, model: string): AsyncGenerator<OpenAI.Chat.Completions.ChatCompletionChunk, void, unknown>;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    private chatCompletionStreamVercel;
    private getHeaders;
    completionNonStream(body: CompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<Completion>;
    completionStream(body: CompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<Completion>;
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    embed(body: OpenAI.Embeddings.EmbeddingCreateParams): Promise<OpenAI.Embeddings.CreateEmbeddingResponse>;
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
    list(): Promise<OpenAI.Models.Model[]>;
}
