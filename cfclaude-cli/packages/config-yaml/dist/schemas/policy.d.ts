import * as z from "zod";
export declare const policySchema: z.ZodObject<{
    allowAnonymousTelemetry: z.ZodOptional<z.ZodBoolean>;
    allowOtherOrgs: z.ZodOptional<z.ZodBoolean>;
    allowCodebaseIndexing: z.ZodOptional<z.ZodBoolean>;
    allowMcpServers: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    allowAnonymousTelemetry?: boolean | undefined;
    allowOtherOrgs?: boolean | undefined;
    allowCodebaseIndexing?: boolean | undefined;
    allowMcpServers?: boolean | undefined;
}, {
    allowAnonymousTelemetry?: boolean | undefined;
    allowOtherOrgs?: boolean | undefined;
    allowCodebaseIndexing?: boolean | undefined;
    allowMcpServers?: boolean | undefined;
}>;
export type Policy = z.infer<typeof policySchema>;
