import { LlmInfoWithProvider, ModelProvider, UseCase } from "./types.js";
export declare const allModelProviders: ModelProvider[];
export declare const allLlms: LlmInfoWithProvider[];
export declare function findLlmInfo(model: string, preferProviderId?: string): LlmInfoWithProvider | undefined;
export declare function getAllRecommendedFor(useCase: UseCase): LlmInfoWithProvider[];
