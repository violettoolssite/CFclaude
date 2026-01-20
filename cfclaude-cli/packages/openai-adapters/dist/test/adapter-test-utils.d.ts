import { BaseLlmApi } from "../apis/base.js";
import { LLMConfig } from "../types.js";
interface AdapterTestCase {
    config: LLMConfig;
    methodToTest: keyof BaseLlmApi;
    params: any[];
    expectedRequest: {
        url: string;
        method: string;
        headers?: Record<string, string>;
        body?: Record<string, any>;
    };
    mockResponse?: any;
    mockStream?: any[];
}
export declare function runAdapterTest(testCase: AdapterTestCase): Promise<void>;
export interface AdapterTestConfig {
    providerName: string;
    config: LLMConfig;
    expectedApiBase: string;
    customHeaders?: Record<string, string>;
    customBodyOptions?: any;
}
export declare const createAdapterTests: (testConfig: AdapterTestConfig) => void;
export {};
