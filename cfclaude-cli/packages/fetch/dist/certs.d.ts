/**
 * Extracts content from either a file path or data URI
 */
export declare function getCertificateContent(input: string): string;
export declare class CertsCache {
    private static instance;
    private _fixedCa;
    private _initialized;
    private _customCerts;
    private constructor();
    static getInstance(): CertsCache;
    get fixedCa(): string[];
    getCachedCustomCert(path: string): Promise<string | undefined>;
    getAllCachedCustomCerts(caBundlePath: string[] | string): Promise<string[]>;
    getCa(caBundlePath: undefined | string | string[]): Promise<string[]>;
    clear(): Promise<void>;
}
