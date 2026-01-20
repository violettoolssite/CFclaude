export function safeParseArgs(args, errorId) {
    try {
        return JSON.parse(args?.trim() || "{}");
    }
    catch (e) {
        const identifier = errorId ? `Call: ${errorId}\nArgs:${args}\n` : "";
        console.error(`Failed to parse tool call arguments\n${identifier}Error:`, e);
        return {};
    }
}
//# sourceMappingURL=parseArgs.js.map