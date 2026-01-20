import z from "zod";
import { requestOptionsSchema } from "../../schemas/models.js";
const baseMcpServerSchema = z.object({
    name: z.string(),
    serverName: z.string().optional(),
    faviconUrl: z.string().optional(),
    sourceFile: z.string().optional(), // Added during loading
    sourceSlug: z.string().optional(), // Added during loading
    connectionTimeout: z.number().gt(0).optional(),
});
const stdioMcpServerSchema = baseMcpServerSchema.extend({
    command: z.string(),
    type: z.literal("stdio").optional(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string()).optional(),
    cwd: z.string().optional(),
});
const sseOrHttpMcpServerSchema = baseMcpServerSchema.extend({
    url: z.string(), // .url() fails with e.g. IP addresses
    type: z.union([z.literal("sse"), z.literal("streamable-http")]).optional(),
    apiKey: z.string().optional(),
    requestOptions: requestOptionsSchema.optional(),
});
export const mcpServerSchema = z.union([
    stdioMcpServerSchema,
    sseOrHttpMcpServerSchema,
]);
export const partialMcpServerSchema = z.union([
    stdioMcpServerSchema.partial(),
    sseOrHttpMcpServerSchema.partial(),
]);
//# sourceMappingURL=index.js.map