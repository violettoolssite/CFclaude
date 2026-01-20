import { ChatCompletionChunk, ChatCompletionCreateParams, ChatCompletionCreateParamsStreaming } from "openai/resources/index";
import { z } from "zod";
import { AzureConfigSchema } from "../types.js";
import { OpenAIApi } from "./OpenAI.js";
export declare class AzureApi extends OpenAIApi {
    private azureConfig;
    constructor(azureConfig: z.infer<typeof AzureConfigSchema>);
    /**
     * Default is `azure-openai`, but previously was `azure`
     * @param apiType
     * @returns
     */
    private _isAzureOpenAI;
    private _getAzureBaseURL;
    /**
     * Filters out empty text content parts from messages.
     *
     * Azure models may not support empty content parts, which can cause issues.
     * This function removes any text content parts that are empty or contain only whitespace.
     */
    private _filterEmptyContentParts;
    modifyChatBody<T extends ChatCompletionCreateParams>(body: T): T;
    chatCompletionStream(body: ChatCompletionCreateParamsStreaming, signal: AbortSignal): AsyncGenerator<ChatCompletionChunk, any, unknown>;
}
