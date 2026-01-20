import { BaseLlmApi } from "../index.js";
import { LLMConfig } from "../types.js";
import { TestConfigOptions } from "./main.test.js";
export declare function getLlmApi(config: LLMConfig): BaseLlmApi;
export declare function testEmbed(api: BaseLlmApi, model: string): void;
export declare function testRerank(api: BaseLlmApi, model: string): void;
export declare function testFim(api: BaseLlmApi, model: string): void;
export declare function testChat(api: BaseLlmApi, model: string, options?: TestConfigOptions): void;
export declare function testCompletion(api: BaseLlmApi, model: string): void;
