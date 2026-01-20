import z from "zod";
declare const httpOrSseMcpJsonSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"http">]>>;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    type?: "sse" | "http" | undefined;
    headers?: Record<string, string> | undefined;
}, {
    url: string;
    type?: "sse" | "http" | undefined;
    headers?: Record<string, string> | undefined;
}>;
export type HttpMcpJsonConfig = z.infer<typeof httpOrSseMcpJsonSchema>;
export type SseMcpJsonConfig = z.infer<typeof httpOrSseMcpJsonSchema>;
declare const stdioMcpJsonSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodLiteral<"stdio">>;
    command: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    envFile: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    args?: string[] | undefined;
    envFile?: string | undefined;
}, {
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    args?: string[] | undefined;
    envFile?: string | undefined;
}>;
export type StdioMcpJsonConfig = z.infer<typeof stdioMcpJsonSchema>;
export declare const mcpServersJsonSchema: z.ZodUnion<[z.ZodObject<{
    type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"http">]>>;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    type?: "sse" | "http" | undefined;
    headers?: Record<string, string> | undefined;
}, {
    url: string;
    type?: "sse" | "http" | undefined;
    headers?: Record<string, string> | undefined;
}>, z.ZodObject<{
    type: z.ZodOptional<z.ZodLiteral<"stdio">>;
    command: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    envFile: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    args?: string[] | undefined;
    envFile?: string | undefined;
}, {
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    args?: string[] | undefined;
    envFile?: string | undefined;
}>]>;
export type McpJsonConfig = z.infer<typeof mcpServersJsonSchema>;
export declare const mcpServersRecordSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
    type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"http">]>>;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    type?: "sse" | "http" | undefined;
    headers?: Record<string, string> | undefined;
}, {
    url: string;
    type?: "sse" | "http" | undefined;
    headers?: Record<string, string> | undefined;
}>, z.ZodObject<{
    type: z.ZodOptional<z.ZodLiteral<"stdio">>;
    command: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    envFile: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    args?: string[] | undefined;
    envFile?: string | undefined;
}, {
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    args?: string[] | undefined;
    envFile?: string | undefined;
}>]>>;
export type McpServersJsonConfigRecord = z.infer<typeof mcpServersRecordSchema>;
export declare const claudeDesktopLikeConfigFileSchema: z.ZodObject<{
    mcpServers: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"http">]>>;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    }, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    }>, z.ZodObject<{
        type: z.ZodOptional<z.ZodLiteral<"stdio">>;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        envFile: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }, {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }>]>>;
}, "strip", z.ZodTypeAny, {
    mcpServers: Record<string, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    } | {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }>;
}, {
    mcpServers: Record<string, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    } | {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }>;
}>;
export type McpServersJsonConfigFile = z.infer<typeof claudeDesktopLikeConfigFileSchema>;
export declare const claudeCodeLikeConfigFileSchema: z.ZodObject<{
    mcpServers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
        type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"http">]>>;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    }, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    }>, z.ZodObject<{
        type: z.ZodOptional<z.ZodLiteral<"stdio">>;
        command: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        envFile: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }, {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }>]>>>;
    projects: z.ZodRecord<z.ZodString, z.ZodObject<{
        mcpServers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodObject<{
            type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"http">]>>;
            url: z.ZodString;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            type?: "sse" | "http" | undefined;
            headers?: Record<string, string> | undefined;
        }, {
            url: string;
            type?: "sse" | "http" | undefined;
            headers?: Record<string, string> | undefined;
        }>, z.ZodObject<{
            type: z.ZodOptional<z.ZodLiteral<"stdio">>;
            command: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            envFile: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            command: string;
            type?: "stdio" | undefined;
            env?: Record<string, string> | undefined;
            args?: string[] | undefined;
            envFile?: string | undefined;
        }, {
            command: string;
            type?: "stdio" | undefined;
            env?: Record<string, string> | undefined;
            args?: string[] | undefined;
            envFile?: string | undefined;
        }>]>>>;
    }, "strip", z.ZodTypeAny, {
        mcpServers?: Record<string, {
            url: string;
            type?: "sse" | "http" | undefined;
            headers?: Record<string, string> | undefined;
        } | {
            command: string;
            type?: "stdio" | undefined;
            env?: Record<string, string> | undefined;
            args?: string[] | undefined;
            envFile?: string | undefined;
        }> | undefined;
    }, {
        mcpServers?: Record<string, {
            url: string;
            type?: "sse" | "http" | undefined;
            headers?: Record<string, string> | undefined;
        } | {
            command: string;
            type?: "stdio" | undefined;
            env?: Record<string, string> | undefined;
            args?: string[] | undefined;
            envFile?: string | undefined;
        }> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    projects: Record<string, {
        mcpServers?: Record<string, {
            url: string;
            type?: "sse" | "http" | undefined;
            headers?: Record<string, string> | undefined;
        } | {
            command: string;
            type?: "stdio" | undefined;
            env?: Record<string, string> | undefined;
            args?: string[] | undefined;
            envFile?: string | undefined;
        }> | undefined;
    }>;
    mcpServers?: Record<string, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    } | {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }> | undefined;
}, {
    projects: Record<string, {
        mcpServers?: Record<string, {
            url: string;
            type?: "sse" | "http" | undefined;
            headers?: Record<string, string> | undefined;
        } | {
            command: string;
            type?: "stdio" | undefined;
            env?: Record<string, string> | undefined;
            args?: string[] | undefined;
            envFile?: string | undefined;
        }> | undefined;
    }>;
    mcpServers?: Record<string, {
        url: string;
        type?: "sse" | "http" | undefined;
        headers?: Record<string, string> | undefined;
    } | {
        command: string;
        type?: "stdio" | undefined;
        env?: Record<string, string> | undefined;
        args?: string[] | undefined;
        envFile?: string | undefined;
    }> | undefined;
}>;
export type claudeCodeLikeConfigFileSchema = z.infer<typeof claudeCodeLikeConfigFileSchema>;
export {};
