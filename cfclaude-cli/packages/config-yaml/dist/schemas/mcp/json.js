import z from "zod";
// This is the schema for an entry in e.g. Claude Desktop, Claude code mcp config
const httpOrSseMcpJsonSchema = z.object({
    type: z.union([z.literal("sse"), z.literal("http")]).optional(),
    url: z.string(), // .url() fails with e.g. IP addresses
    headers: z.record(z.string(), z.string()).optional(),
});
const stdioMcpJsonSchema = z.object({
    type: z.literal("stdio").optional(),
    command: z.string(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string(), z.string()).optional(),
    envFile: z.string().optional(),
});
export const mcpServersJsonSchema = z.union([
    httpOrSseMcpJsonSchema,
    stdioMcpJsonSchema,
]);
export const mcpServersRecordSchema = z.record(z.string(), mcpServersJsonSchema);
export const claudeDesktopLikeConfigFileSchema = z.object({
    mcpServers: mcpServersRecordSchema,
});
export const claudeCodeLikeConfigFileSchema = z.object({
    mcpServers: mcpServersRecordSchema.optional(),
    projects: z.record(z.string(), z.object({
        mcpServers: mcpServersRecordSchema.optional(),
    })),
});
//# sourceMappingURL=json.js.map