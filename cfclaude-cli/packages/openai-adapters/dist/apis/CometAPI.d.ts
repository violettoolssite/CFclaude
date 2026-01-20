import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming, CreateEmbeddingResponse, EmbeddingCreateParams, Model } from "openai/resources/index";
import { CometAPIConfig } from "../types.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
import { OpenAIApi } from "./OpenAI.js";
/**
 * CometAPI adapter - extends OpenAI adapter since CometAPI is OpenAI-compatible
 *
 * CometAPI provides access to multiple LLM providers (GPT, Claude, Gemini, etc.)
 * through a unified OpenAI-compatible API interface.
 */
export declare class CometAPIApi extends OpenAIApi implements BaseLlmApi {
    private cometConfig;
    constructor(config: CometAPIConfig);
    /**
     * Override list method to handle CometAPI-specific model filtering
     * The core filtering logic is handled in the CometAPI provider class
     */
    list(): Promise<Model[]>;
    /**
     * Chat completion - uses OpenAI-compatible format
     */
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    /**
     * Streaming chat completion - uses OpenAI-compatible format
     */
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    /**
     * Legacy completion endpoint support
     */
    completionNonStream(body: CompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<Completion>;
    /**
     * Legacy streaming completion endpoint support
     */
    completionStream(body: CompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<Completion>;
    /**
     * Fill-in-the-middle completion support
     */
    fimStream(body: FimCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    /**
     * Embeddings support (if available through CometAPI)
     */
    embed(body: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;
    /**
     * Reranking support (if available through CometAPI)
     */
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
}
