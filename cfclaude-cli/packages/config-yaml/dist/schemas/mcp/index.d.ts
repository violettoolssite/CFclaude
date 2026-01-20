import z from "zod";
declare const stdioMcpServerSchema: z.ZodObject<{
    name: z.ZodString;
    serverName: z.ZodOptional<z.ZodString>;
    faviconUrl: z.ZodOptional<z.ZodString>;
    sourceFile: z.ZodOptional<z.ZodString>;
    sourceSlug: z.ZodOptional<z.ZodString>;
    connectionTimeout: z.ZodOptional<z.ZodNumber>;
} & {
    command: z.ZodString;
    type: z.ZodOptional<z.ZodLiteral<"stdio">>;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
    args?: string[] | undefined;
    cwd?: string | undefined;
}, {
    name: string;
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
    args?: string[] | undefined;
    cwd?: string | undefined;
}>;
export type StdioMcpServer = z.infer<typeof stdioMcpServerSchema>;
declare const sseOrHttpMcpServerSchema: z.ZodObject<{
    name: z.ZodString;
    serverName: z.ZodOptional<z.ZodString>;
    faviconUrl: z.ZodOptional<z.ZodString>;
    sourceFile: z.ZodOptional<z.ZodString>;
    sourceSlug: z.ZodOptional<z.ZodString>;
    connectionTimeout: z.ZodOptional<z.ZodNumber>;
} & {
    url: z.ZodString;
    type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
    apiKey: z.ZodOptional<z.ZodString>;
    requestOptions: z.ZodOptional<z.ZodObject<{
        timeout: z.ZodOptional<z.ZodNumber>;
        verifySsl: z.ZodOptional<z.ZodBoolean>;
        caBundlePath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        proxy: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        extraBodyProperties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        noProxy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        clientCertificate: z.ZodOptional<z.ZodObject<{
            cert: z.ZodString;
            key: z.ZodString;
            passphrase: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        }, {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    }, {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    name: string;
    type?: "sse" | "streamable-http" | undefined;
    apiKey?: string | undefined;
    requestOptions?: {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    } | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
}, {
    url: string;
    name: string;
    type?: "sse" | "streamable-http" | undefined;
    apiKey?: string | undefined;
    requestOptions?: {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    } | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
}>;
export type SseMcpServer = z.infer<typeof sseOrHttpMcpServerSchema>;
export type HttpMcpServer = z.infer<typeof sseOrHttpMcpServerSchema>;
export declare const mcpServerSchema: z.ZodUnion<[z.ZodObject<{
    name: z.ZodString;
    serverName: z.ZodOptional<z.ZodString>;
    faviconUrl: z.ZodOptional<z.ZodString>;
    sourceFile: z.ZodOptional<z.ZodString>;
    sourceSlug: z.ZodOptional<z.ZodString>;
    connectionTimeout: z.ZodOptional<z.ZodNumber>;
} & {
    command: z.ZodString;
    type: z.ZodOptional<z.ZodLiteral<"stdio">>;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    cwd: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
    args?: string[] | undefined;
    cwd?: string | undefined;
}, {
    name: string;
    command: string;
    type?: "stdio" | undefined;
    env?: Record<string, string> | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
    args?: string[] | undefined;
    cwd?: string | undefined;
}>, z.ZodObject<{
    name: z.ZodString;
    serverName: z.ZodOptional<z.ZodString>;
    faviconUrl: z.ZodOptional<z.ZodString>;
    sourceFile: z.ZodOptional<z.ZodString>;
    sourceSlug: z.ZodOptional<z.ZodString>;
    connectionTimeout: z.ZodOptional<z.ZodNumber>;
} & {
    url: z.ZodString;
    type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>;
    apiKey: z.ZodOptional<z.ZodString>;
    requestOptions: z.ZodOptional<z.ZodObject<{
        timeout: z.ZodOptional<z.ZodNumber>;
        verifySsl: z.ZodOptional<z.ZodBoolean>;
        caBundlePath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        proxy: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        extraBodyProperties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        noProxy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        clientCertificate: z.ZodOptional<z.ZodObject<{
            cert: z.ZodString;
            key: z.ZodString;
            passphrase: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        }, {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    }, {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    name: string;
    type?: "sse" | "streamable-http" | undefined;
    apiKey?: string | undefined;
    requestOptions?: {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    } | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
}, {
    url: string;
    name: string;
    type?: "sse" | "streamable-http" | undefined;
    apiKey?: string | undefined;
    requestOptions?: {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    } | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
}>]>;
export type MCPServer = z.infer<typeof mcpServerSchema>;
export declare const partialMcpServerSchema: z.ZodUnion<[z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    serverName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    faviconUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sourceFile: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sourceSlug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    connectionTimeout: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    command: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodOptional<z.ZodLiteral<"stdio">>>;
    args: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    env: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
    cwd: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type?: "stdio" | undefined;
    name?: string | undefined;
    env?: Record<string, string> | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
    command?: string | undefined;
    args?: string[] | undefined;
    cwd?: string | undefined;
}, {
    type?: "stdio" | undefined;
    name?: string | undefined;
    env?: Record<string, string> | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
    command?: string | undefined;
    args?: string[] | undefined;
    cwd?: string | undefined;
}>, z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    serverName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    faviconUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sourceFile: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sourceSlug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    connectionTimeout: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    url: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"sse">, z.ZodLiteral<"streamable-http">]>>>;
    apiKey: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    requestOptions: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        timeout: z.ZodOptional<z.ZodNumber>;
        verifySsl: z.ZodOptional<z.ZodBoolean>;
        caBundlePath: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
        proxy: z.ZodOptional<z.ZodString>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        extraBodyProperties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        noProxy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        clientCertificate: z.ZodOptional<z.ZodObject<{
            cert: z.ZodString;
            key: z.ZodString;
            passphrase: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        }, {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    }, {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    type?: "sse" | "streamable-http" | undefined;
    url?: string | undefined;
    name?: string | undefined;
    apiKey?: string | undefined;
    requestOptions?: {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    } | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
}, {
    type?: "sse" | "streamable-http" | undefined;
    url?: string | undefined;
    name?: string | undefined;
    apiKey?: string | undefined;
    requestOptions?: {
        timeout?: number | undefined;
        verifySsl?: boolean | undefined;
        caBundlePath?: string | string[] | undefined;
        proxy?: string | undefined;
        headers?: Record<string, string> | undefined;
        extraBodyProperties?: Record<string, any> | undefined;
        noProxy?: string[] | undefined;
        clientCertificate?: {
            cert: string;
            key: string;
            passphrase?: string | undefined;
        } | undefined;
    } | undefined;
    sourceFile?: string | undefined;
    serverName?: string | undefined;
    faviconUrl?: string | undefined;
    sourceSlug?: string | undefined;
    connectionTimeout?: number | undefined;
}>]>;
export type PartialMCPServer = z.infer<typeof partialMcpServerSchema>;
export {};
