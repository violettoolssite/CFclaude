export declare function parseDataUrl(dataUrl: string): {
    mimeType: string;
    base64Data: string;
} | undefined;
export declare function extractBase64FromDataUrl(dataUrl: string): string | undefined;
