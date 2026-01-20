export function parseDataUrl(dataUrl) {
    const urlParts = dataUrl.split(",");
    if (urlParts.length < 2) {
        return undefined;
    }
    const [mimeType, ...base64Parts] = urlParts;
    const base64Data = base64Parts.join(",");
    return { mimeType, base64Data };
}
export function extractBase64FromDataUrl(dataUrl) {
    return parseDataUrl(dataUrl)?.base64Data;
}
//# sourceMappingURL=url.js.map