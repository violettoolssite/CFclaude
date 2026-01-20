import { RequestOptions } from "@continuedev/config-types";
import { patchedFetch } from "@continuedev/fetch";
import { ChatCompletionChunk, CompletionUsage, CreateEmbeddingResponse, Model } from "openai/resources/index";
import { ChatCompletion } from "openai/resources/index.js";
import { CreateRerankResponse } from "./apis/base.js";
export declare function chatChunk(options: {
    content: string | null | undefined;
    model: string;
    finish_reason?: ChatCompletionChunk.Choice["finish_reason"];
    id?: string | null;
    usage?: CompletionUsage;
}): ChatCompletionChunk;
export declare function usageChatChunk(options: {
    model: string;
    id?: string | null;
    usage?: CompletionUsage;
}): ChatCompletionChunk;
export declare function chatChunkFromDelta(options: {
    delta: ChatCompletionChunk.Choice["delta"];
    model: string;
    finish_reason?: ChatCompletionChunk.Choice["finish_reason"];
    id?: string | null;
    usage?: CompletionUsage;
}): ChatCompletionChunk;
export declare function chatCompletion(options: {
    content: string | null | undefined;
    model: string;
    finish_reason?: ChatCompletion.Choice["finish_reason"];
    id?: string | null;
    usage?: CompletionUsage;
    index?: number | null;
}): ChatCompletion;
export declare function embedding(options: {
    data: number[][];
    model: string;
    usage?: CreateEmbeddingResponse.Usage;
}): CreateEmbeddingResponse;
export declare function rerank(options: {
    model: string;
    data: number[];
    usage?: CreateRerankResponse["usage"];
}): CreateRerankResponse;
export declare function model(options: {
    id: string;
    owned_by?: string;
}): Model;
export declare function customFetch(requestOptions: RequestOptions | undefined): typeof patchedFetch;
