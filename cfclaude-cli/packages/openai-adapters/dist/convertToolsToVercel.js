/**
 * Converts OpenAI tool format to Vercel AI SDK format
 */
/**
 * Converts OpenAI tool format to Vercel AI SDK format.
 *
 * OpenAI format: { type: "function", function: { name, description, parameters: JSONSchema } }
 * Vercel format: { [toolName]: { description, parameters: aiJsonSchema(JSONSchema) } }
 *
 * @param openaiTools - Array of OpenAI tools or undefined
 * @returns Object with tool names as keys, or undefined if no tools
 */
export async function convertToolsToVercelFormat(openaiTools) {
    if (!openaiTools || openaiTools.length === 0) {
        return undefined;
    }
    const { jsonSchema: aiJsonSchema } = await import("ai");
    const vercelTools = {};
    for (const tool of openaiTools) {
        if (tool.type === "function") {
            vercelTools[tool.function.name] = {
                description: tool.function.description,
                parameters: aiJsonSchema(tool.function.parameters ?? { type: "object", properties: {} }),
            };
        }
    }
    return Object.keys(vercelTools).length > 0 ? vercelTools : undefined;
}
//# sourceMappingURL=convertToolsToVercel.js.map