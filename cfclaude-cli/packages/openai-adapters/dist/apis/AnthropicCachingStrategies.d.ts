import { MessageCreateParams } from "@anthropic-ai/sdk/resources";
export type CachingStrategy = (anthropicBody: MessageCreateParams) => MessageCreateParams;
export declare const CACHING_STRATEGIES: {
    readonly none: CachingStrategy;
    readonly systemOnly: CachingStrategy;
    readonly systemAndTools: CachingStrategy;
    readonly optimized: CachingStrategy;
};
export type CachingStrategyName = keyof typeof CACHING_STRATEGIES;
export declare const getAvailableStrategies: () => CachingStrategyName[];
export declare const getStrategyDescription: (strategy: CachingStrategyName) => string;
