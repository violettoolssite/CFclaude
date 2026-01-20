import * as z from "zod";
export const policySchema = z.object({
    allowAnonymousTelemetry: z.boolean().optional(),
    allowOtherOrgs: z.boolean().optional(),
    allowCodebaseIndexing: z.boolean().optional(),
    allowMcpServers: z.boolean().optional(),
    // allowLocalConfigFile: z.boolean().optional(),
});
//# sourceMappingURL=policy.js.map