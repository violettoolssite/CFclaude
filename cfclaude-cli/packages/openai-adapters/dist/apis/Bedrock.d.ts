import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParamsNonStreaming, ChatCompletionCreateParamsStreaming, Completion, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming, CreateEmbeddingResponse, EmbeddingCreateParams, Model } from "openai/resources/index";
import { BedrockConfig } from "../types.js";
import { BaseLlmApi, CreateRerankResponse, FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
export declare class BedrockApi implements BaseLlmApi {
    protected config: BedrockConfig;
    constructor(config: BedrockConfig);
    getCreds(): Promise<import("@smithy/types").AwsCredentialIdentity>;
    getClient(): Promise<BedrockRuntimeClient>;
    private _oaiPartToBedrockPart;
    private _convertMessages;
    private _addCachingToLastTwoUserMessages;
    private _convertBody;
    chatCompletionNonStream(body: ChatCompletionCreateParamsNonStreaming, signal: AbortSignal): Promise<ChatCompletion>;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk>;
    completionNonStream(body: CompletionCreateParamsNonStreaming): Promise<Completion>;
    completionStream(body: CompletionCreateParamsStreaming): AsyncGenerator<Completion>;
    fimStream(body: FimCreateParamsStreaming): AsyncGenerator<ChatCompletionChunk>;
    private getInvokeModelResponseBody;
    private getEmbedTexts;
    embed(body: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;
    rerank(body: RerankCreateParams): Promise<CreateRerankResponse>;
    list(): Promise<Model[]>;
}
