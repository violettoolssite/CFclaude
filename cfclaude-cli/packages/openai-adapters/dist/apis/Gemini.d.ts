import { GoogleGenAI } from "@google/genai";
import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParams, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming, CreateEmbeddingResponse, EmbeddingCreateParams, Model } from "openai/resources/index";
import { GeminiConfig } from "../types.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
export declare class GeminiApi implements BaseLlmApi {
    protected config: GeminiConfig;
    apiBase: string;
    private genAI;
    static maxStopSequences: number;
    constructor(config: GeminiConfig);
    private _oaiPartToGeminiPart;
    _convertBody(oaiBody: ChatCompletionCreateParams, isV1API: boolean, includeToolCallIds: boolean): any;
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    private processStreamResponse;
    /**generates stream from @google/genai sdk */
    private generateStream;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, _signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    streamWithGenAI(genAI: GoogleGenAI, body: ChatCompletionCreateParamsStreaming): AsyncGenerator<ChatCompletionChunk>;
    completionNonStream(_body: CompletionCreateParamsNonStreaming): Promise<Completion>;
    completionStream(body: CompletionCreateParamsStreaming): AsyncGenerator<Completion>;
    fimStream(body: FimCreateParamsStreaming): AsyncGenerator<ChatCompletionChunk>;
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
    embed(body: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;
    list(): Promise<Model[]>;
}
