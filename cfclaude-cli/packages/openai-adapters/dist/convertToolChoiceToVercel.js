/**
 * Converts OpenAI tool_choice format to Vercel AI SDK toolChoice format
 */
/**
 * Converts OpenAI tool_choice to Vercel AI SDK toolChoice format
 *
 * OpenAI format:
 * - 'auto' | 'none' | 'required'
 * - { type: 'function', function: { name: string } }
 *
 * Vercel AI SDK format:
 * - 'auto' | 'none' | 'required'
 * - { type: 'tool', toolName: string }
 */
export function convertToolChoiceToVercel(toolChoice) {
    if (!toolChoice) {
        return undefined;
    }
    // String values pass through
    if (typeof toolChoice === "string") {
        return toolChoice;
    }
    // Convert object format
    if (toolChoice.type === "function") {
        return {
            type: "tool",
            toolName: toolChoice.function.name,
        };
    }
    // Unknown format - return undefined to let Vercel handle it
    return undefined;
}
//# sourceMappingURL=convertToolChoiceToVercel.js.map