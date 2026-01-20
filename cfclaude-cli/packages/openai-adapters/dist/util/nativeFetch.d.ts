/**
 * Preserve the native fetch implementation before any modules can pollute it.
 * This is critical for @google/genai which requires native fetch behavior.
 *
 * The Vercel AI SDK packages (ai, @ai-sdk/openai, @ai-sdk/anthropic) can
 * pollute the global fetch/Response objects, breaking stream handling in
 * @google/genai (causing "getReader is not a function" errors).
 *
 * This module MUST be imported before any other modules that might modify fetch.
 */
export declare const nativeFetch: typeof fetch;
export declare const nativeResponse: {
    new (body?: BodyInit | null, init?: ResponseInit): Response;
    prototype: Response;
    error(): Response;
    json(data: any, init?: ResponseInit): Response;
    redirect(url: string | URL, status?: number): Response;
};
export declare const nativeRequest: {
    new (input: RequestInfo | URL, init?: RequestInit): Request;
    prototype: Request;
};
export declare const nativeHeaders: {
    new (init?: HeadersInit): Headers;
    prototype: Headers;
};
/**
 * Temporarily restores native fetch for the duration of a callback.
 * Use this when you need to ensure native fetch behavior for specific operations.
 *
 * This wrapper:
 * 1. Saves the current (possibly polluted) fetch globals
 * 2. Restores the native implementations
 * 3. Executes the callback
 * 4. Restores the previous (possibly polluted) implementations
 *
 * This ensures GoogleGenAI gets native fetch while other packages
 * (like Vercel SDK) can still use their modified fetch implementations.
 */
export declare function withNativeFetch<T>(callback: () => T): T;
