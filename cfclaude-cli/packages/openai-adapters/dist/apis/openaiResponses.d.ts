import { ChatCompletion, ChatCompletionChunk, ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources/index.js";
import { Response, ResponseCreateParams, ResponseInput, ResponseStreamEvent } from "openai/resources/responses/responses.js";
export declare function isResponsesModel(model: string): boolean;
export declare function toResponsesInput(messages: ChatCompletionMessageParam[]): ResponseInput;
export declare function toResponsesParams(params: ChatCompletionCreateParams): ResponseCreateParams;
interface ToolCallState {
    id: string;
    callId: string;
    index: number;
    name?: string;
    arguments: string;
}
interface MessageState {
    content: string;
    refusal: string | null;
}
export interface ResponsesStreamState {
    context: {
        id?: string;
        model: string;
        created?: number;
        pendingFinish?: ChatCompletionChunk.Choice["finish_reason"];
    };
    messages: Map<string, MessageState>;
    toolCalls: Map<string, ToolCallState>;
    indexToToolCallId: Map<number, string>;
}
export declare function createResponsesStreamState(context: {
    model: string;
    responseId?: string;
    created?: number;
}): ResponsesStreamState;
export declare function fromResponsesChunk(state: ResponsesStreamState, event: ResponseStreamEvent): ChatCompletionChunk | undefined;
export declare function responseToChatCompletion(response: Response): ChatCompletion;
export {};
