import { RequestOptions } from "@continuedev/config-types";
/**
 * Gets the proxy settings from environment variables
 * @param protocol The URL protocol (http: or https:)
 * @returns The proxy URL if available, otherwise undefined
 */
export declare function getProxyFromEnv(protocol: string): string | undefined;
export declare function getProxy(protocol: string, requestOptions?: RequestOptions): string | undefined;
export declare function getEnvNoProxyPatterns(): string[];
export declare function getReqOptionsNoProxyPatterns(options: RequestOptions | undefined): string[];
export declare function patternMatchesHostname(hostname: string, pattern: string): boolean;
/**
 * Checks if a hostname should bypass proxy based on NO_PROXY environment variable
 * @param hostname The hostname to check
 * @returns True if the hostname should bypass proxy
 */
export declare function shouldBypassProxy(hostname: string, requestOptions: RequestOptions | undefined): boolean;
