import { RequestOptions } from "@continuedev/config-types";
/**
 * Prepares agent options based on request options and certificates
 */
export declare function getAgentOptions(requestOptions?: RequestOptions): Promise<{
    [key: string]: any;
}>;
