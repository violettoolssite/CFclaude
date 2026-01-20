import { OpenAI } from "openai/index";
import { ChatCompletionCreateParams, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming } from "openai/resources/index";
import { z } from "zod";
import { ContinueProxyConfigSchema } from "../types.js";
import { FimCreateParamsStreaming, RerankCreateParams } from "./base.js";
import { OpenAIApi } from "./OpenAI.js";
export interface ContinueProperties {
    apiKeyLocation?: string;
    envSecretLocations?: Record<string, string>;
    apiBase?: string;
    orgScopeId?: string | null;
    env?: Record<string, any>;
}
export interface ProxyModelName {
    ownerSlug: string;
    packageSlug: string;
    provider: string;
    model: string;
}
export declare class ContinueProxyApi extends OpenAIApi {
    private actualApiBase?;
    private configEnv?;
    private continueProxyConfig;
    constructor(config: z.infer<typeof ContinueProxyConfigSchema>);
    protected extraBodyProperties(): Record<string, any>;
    private modifyBodyWithContinueProperties;
    modifyChatBody<T extends ChatCompletionCreateParams>(body: T): T;
    modifyCompletionBody<T extends CompletionCreateParamsNonStreaming | CompletionCreateParamsStreaming>(body: T): T;
    modifyFimBody<T extends FimCreateParamsStreaming>(body: T): T;
    protected getHeaders(): Record<string, string>;
    modifyEmbedBody<T extends OpenAI.Embeddings.EmbeddingCreateParams>(body: T): T;
    modifyRerankBody<T extends RerankCreateParams>(body: T): T;
}
