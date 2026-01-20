import { z } from "zod";
declare const dataLevel: z.ZodUnion<[z.ZodLiteral<"all">, z.ZodLiteral<"noCode">]>;
export declare const dataSchema: z.ZodObject<{
    name: z.ZodString;
    destination: z.ZodString;
    schema: z.ZodString;
    level: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<"all">, z.ZodLiteral<"noCode">]>>;
    events: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
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
    apiKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    schema: string;
    destination: string;
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
    level?: "all" | "noCode" | undefined;
    events?: string[] | undefined;
}, {
    name: string;
    schema: string;
    destination: string;
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
    level?: "all" | "noCode" | undefined;
    events?: string[] | undefined;
}>;
export type DataDestination = z.infer<typeof dataSchema>;
export type DataLogLevel = z.infer<typeof dataLevel>;
declare const devEventAllVersionDataSchemas: z.ZodObject<{
    autocomplete: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        disable: z.ZodBoolean;
        useFileSuffix: z.ZodBoolean;
        maxPromptTokens: z.ZodNumber;
        debounceDelay: z.ZodNumber;
        maxSuffixPercentage: z.ZodNumber;
        prefixPercentage: z.ZodNumber;
        transform: z.ZodOptional<z.ZodBoolean>;
        template: z.ZodOptional<z.ZodString>;
        multilineCompletions: z.ZodEnum<["always", "never", "auto"]>;
        slidingWindowPrefixPercentage: z.ZodNumber;
        slidingWindowSize: z.ZodNumber;
        useCache: z.ZodBoolean;
        onlyMyCode: z.ZodBoolean;
        useRecentlyEdited: z.ZodBoolean;
        useImports: z.ZodOptional<z.ZodBoolean>;
        accepted: z.ZodOptional<z.ZodBoolean>;
        time: z.ZodNumber;
        prefix: z.ZodString;
        suffix: z.ZodString;
        prompt: z.ZodString;
        completion: z.ZodString;
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        cacheHit: z.ZodBoolean;
        filepath: z.ZodString;
        gitRepo: z.ZodOptional<z.ZodString>;
        completionId: z.ZodString;
        uniqueId: z.ZodString;
        timestamp: z.ZodString;
        enabledStaticContextualization: z.ZodOptional<z.ZodBoolean>;
        completionOptions: z.ZodOptional<z.ZodObject<{
            contextLength: z.ZodOptional<z.ZodNumber>;
            maxTokens: z.ZodOptional<z.ZodNumber>;
            temperature: z.ZodOptional<z.ZodNumber>;
            topP: z.ZodOptional<z.ZodNumber>;
            topK: z.ZodOptional<z.ZodNumber>;
            minP: z.ZodOptional<z.ZodNumber>;
            presencePenalty: z.ZodOptional<z.ZodNumber>;
            frequencyPenalty: z.ZodOptional<z.ZodNumber>;
            stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            n: z.ZodOptional<z.ZodNumber>;
            reasoning: z.ZodOptional<z.ZodBoolean>;
            reasoningBudgetTokens: z.ZodOptional<z.ZodNumber>;
            promptCaching: z.ZodOptional<z.ZodBoolean>;
            stream: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            contextLength?: number | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
            topP?: number | undefined;
            topK?: number | undefined;
            minP?: number | undefined;
            presencePenalty?: number | undefined;
            frequencyPenalty?: number | undefined;
            stop?: string[] | undefined;
            n?: number | undefined;
            reasoning?: boolean | undefined;
            reasoningBudgetTokens?: number | undefined;
            promptCaching?: boolean | undefined;
            stream?: boolean | undefined;
        }, {
            contextLength?: number | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
            topP?: number | undefined;
            topK?: number | undefined;
            minP?: number | undefined;
            presencePenalty?: number | undefined;
            frequencyPenalty?: number | undefined;
            stop?: string[] | undefined;
            n?: number | undefined;
            reasoning?: boolean | undefined;
            reasoningBudgetTokens?: number | undefined;
            promptCaching?: boolean | undefined;
            stream?: boolean | undefined;
        }>>;
        disableInFiles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        time: number;
        disable: boolean;
        maxPromptTokens: number;
        debounceDelay: number;
        maxSuffixPercentage: number;
        prefixPercentage: number;
        onlyMyCode: boolean;
        useCache: boolean;
        useRecentlyEdited: boolean;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        useFileSuffix: boolean;
        multilineCompletions: "never" | "always" | "auto";
        slidingWindowPrefixPercentage: number;
        slidingWindowSize: number;
        prefix: string;
        suffix: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        cacheHit: boolean;
        filepath: string;
        completionId: string;
        uniqueId: string;
        transform?: boolean | undefined;
        template?: string | undefined;
        useImports?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        enabledStaticContextualization?: boolean | undefined;
        completionOptions?: {
            contextLength?: number | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
            topP?: number | undefined;
            topK?: number | undefined;
            minP?: number | undefined;
            presencePenalty?: number | undefined;
            frequencyPenalty?: number | undefined;
            stop?: string[] | undefined;
            n?: number | undefined;
            reasoning?: boolean | undefined;
            reasoningBudgetTokens?: number | undefined;
            promptCaching?: boolean | undefined;
            stream?: boolean | undefined;
        } | undefined;
        disableInFiles?: string[] | undefined;
    }, {
        time: number;
        disable: boolean;
        maxPromptTokens: number;
        debounceDelay: number;
        maxSuffixPercentage: number;
        prefixPercentage: number;
        onlyMyCode: boolean;
        useCache: boolean;
        useRecentlyEdited: boolean;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        useFileSuffix: boolean;
        multilineCompletions: "never" | "always" | "auto";
        slidingWindowPrefixPercentage: number;
        slidingWindowSize: number;
        prefix: string;
        suffix: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        cacheHit: boolean;
        filepath: string;
        completionId: string;
        uniqueId: string;
        transform?: boolean | undefined;
        template?: string | undefined;
        useImports?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        enabledStaticContextualization?: boolean | undefined;
        completionOptions?: {
            contextLength?: number | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
            topP?: number | undefined;
            topK?: number | undefined;
            minP?: number | undefined;
            presencePenalty?: number | undefined;
            frequencyPenalty?: number | undefined;
            stop?: string[] | undefined;
            n?: number | undefined;
            reasoning?: boolean | undefined;
            reasoningBudgetTokens?: number | undefined;
            promptCaching?: boolean | undefined;
            stream?: boolean | undefined;
        } | undefined;
        disableInFiles?: string[] | undefined;
    }>;
    quickEdit: z.ZodObject<{
        prompt: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        label: z.ZodString;
        diffs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["new", "old", "same"]>;
            line: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "new" | "old" | "same";
            line: string;
        }, {
            type: "new" | "old" | "same";
            line: string;
        }>, "many">>;
        model: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        prompt: string;
        label: string;
        path?: string | undefined;
        model?: string | undefined;
        diffs?: {
            type: "new" | "old" | "same";
            line: string;
        }[] | undefined;
    }, {
        prompt: string;
        label: string;
        path?: string | undefined;
        model?: string | undefined;
        diffs?: {
            type: "new" | "old" | "same";
            line: string;
        }[] | undefined;
    }>;
    chatFeedback: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        modelTitle: z.ZodString;
        completionOptions: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        prompt: z.ZodString;
        completion: z.ZodString;
        feedback: z.ZodOptional<z.ZodBoolean>;
        sessionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionOptions: {};
        modelTitle: string;
        sessionId: string;
        feedback?: boolean | undefined;
    }, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionOptions: {};
        modelTitle: string;
        sessionId: string;
        feedback?: boolean | undefined;
    }>;
    tokensGenerated: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        model: z.ZodString;
        provider: z.ZodString;
        promptTokens: z.ZodNumber;
        generatedTokens: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        model: string;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        promptTokens: number;
        generatedTokens: number;
    }, {
        provider: string;
        model: string;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        promptTokens: number;
        generatedTokens: number;
    }>;
    chatInteraction: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        modelTitle: z.ZodString;
        prompt: z.ZodString;
        completion: z.ZodString;
        sessionId: z.ZodString;
        tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            slug: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            slug?: string | undefined;
        }, {
            id: string;
            slug?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        sessionId: string;
        tools?: string[] | undefined;
        rules?: {
            id: string;
            slug?: string | undefined;
        }[] | undefined;
    }, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        sessionId: string;
        tools?: string[] | undefined;
        rules?: {
            id: string;
            slug?: string | undefined;
        }[] | undefined;
    }>;
    editInteraction: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        modelTitle: z.ZodString;
        prompt: z.ZodString;
        completion: z.ZodString;
        filepath: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
    }, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
    }>;
    editOutcome: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        modelTitle: z.ZodString;
        prompt: z.ZodString;
        completion: z.ZodString;
        previousCode: z.ZodString;
        newCode: z.ZodString;
        previousCodeLines: z.ZodNumber;
        newCodeLines: z.ZodNumber;
        lineChange: z.ZodNumber;
        accepted: z.ZodBoolean;
        filepath: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
        previousCode: string;
        newCode: string;
        previousCodeLines: number;
        newCodeLines: number;
        lineChange: number;
    }, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
        previousCode: string;
        newCode: string;
        previousCodeLines: number;
        newCodeLines: number;
        lineChange: number;
    }>;
    nextEditOutcome: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        elapsed: z.ZodNumber;
        completionOptions: z.ZodAny;
        completionId: z.ZodString;
        requestId: z.ZodOptional<z.ZodString>;
        gitRepo: z.ZodOptional<z.ZodString>;
        uniqueId: z.ZodString;
        timestamp: z.ZodNumber;
        fileUri: z.ZodString;
        workspaceDirUri: z.ZodString;
        prompt: z.ZodString;
        userEdits: z.ZodString;
        userExcerpts: z.ZodString;
        originalEditableRange: z.ZodString;
        completion: z.ZodString;
        cursorPosition: z.ZodObject<{
            line: z.ZodNumber;
            character: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            line: number;
            character: number;
        }, {
            line: number;
            character: number;
        }>;
        accepted: z.ZodOptional<z.ZodBoolean>;
        aborted: z.ZodOptional<z.ZodBoolean>;
        modelProvider: z.ZodString;
        modelName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        eventName: string;
        schema: string;
        timestamp: number;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionId: string;
        uniqueId: string;
        elapsed: number;
        fileUri: string;
        workspaceDirUri: string;
        userEdits: string;
        userExcerpts: string;
        originalEditableRange: string;
        cursorPosition: {
            line: number;
            character: number;
        };
        aborted?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        completionOptions?: any;
        requestId?: string | undefined;
    }, {
        eventName: string;
        schema: string;
        timestamp: number;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionId: string;
        uniqueId: string;
        elapsed: number;
        fileUri: string;
        workspaceDirUri: string;
        userEdits: string;
        userExcerpts: string;
        originalEditableRange: string;
        cursorPosition: {
            line: number;
            character: number;
        };
        aborted?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        completionOptions?: any;
        requestId?: string | undefined;
    }>;
    nextEditWithHistory: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        previousEdits: z.ZodArray<z.ZodObject<{
            filename: z.ZodString;
            diff: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            filename: string;
            diff: string;
        }, {
            filename: string;
            diff: string;
        }>, "many">;
        fileURI: z.ZodString;
        workspaceDirURI: z.ZodString;
        beforeContent: z.ZodString;
        afterContent: z.ZodString;
        beforeCursorPos: z.ZodObject<{
            line: z.ZodNumber;
            character: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            line: number;
            character: number;
        }, {
            line: number;
            character: number;
        }>;
        afterCursorPos: z.ZodObject<{
            line: z.ZodNumber;
            character: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            line: number;
            character: number;
        }, {
            line: number;
            character: number;
        }>;
        context: z.ZodString;
        modelProvider: z.ZodString;
        modelName: z.ZodString;
        modelTitle: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        previousEdits: {
            filename: string;
            diff: string;
        }[];
        fileURI: string;
        workspaceDirURI: string;
        beforeContent: string;
        afterContent: string;
        beforeCursorPos: {
            line: number;
            character: number;
        };
        afterCursorPos: {
            line: number;
            character: number;
        };
        context: string;
    }, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        previousEdits: {
            filename: string;
            diff: string;
        }[];
        fileURI: string;
        workspaceDirURI: string;
        beforeContent: string;
        afterContent: string;
        beforeCursorPos: {
            line: number;
            character: number;
        };
        afterCursorPos: {
            line: number;
            character: number;
        };
        context: string;
    }>;
    toolUsage: z.ZodObject<{
        eventName: z.ZodString;
        schema: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
        userAgent: z.ZodString;
        selectedProfileId: z.ZodString;
    } & {
        toolCallId: z.ZodString;
        functionName: z.ZodString;
        functionParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        toolCallArgs: z.ZodString;
        accepted: z.ZodBoolean;
        succeeded: z.ZodBoolean;
        output: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        toolCallId: string;
        functionName: string;
        toolCallArgs: string;
        succeeded: boolean;
        functionParams?: Record<string, any> | undefined;
        output?: any[] | undefined;
    }, {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        toolCallId: string;
        functionName: string;
        toolCallArgs: string;
        succeeded: boolean;
        functionParams?: Record<string, any> | undefined;
        output?: any[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    autocomplete: {
        time: number;
        disable: boolean;
        maxPromptTokens: number;
        debounceDelay: number;
        maxSuffixPercentage: number;
        prefixPercentage: number;
        onlyMyCode: boolean;
        useCache: boolean;
        useRecentlyEdited: boolean;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        useFileSuffix: boolean;
        multilineCompletions: "never" | "always" | "auto";
        slidingWindowPrefixPercentage: number;
        slidingWindowSize: number;
        prefix: string;
        suffix: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        cacheHit: boolean;
        filepath: string;
        completionId: string;
        uniqueId: string;
        transform?: boolean | undefined;
        template?: string | undefined;
        useImports?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        enabledStaticContextualization?: boolean | undefined;
        completionOptions?: {
            contextLength?: number | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
            topP?: number | undefined;
            topK?: number | undefined;
            minP?: number | undefined;
            presencePenalty?: number | undefined;
            frequencyPenalty?: number | undefined;
            stop?: string[] | undefined;
            n?: number | undefined;
            reasoning?: boolean | undefined;
            reasoningBudgetTokens?: number | undefined;
            promptCaching?: boolean | undefined;
            stream?: boolean | undefined;
        } | undefined;
        disableInFiles?: string[] | undefined;
    };
    quickEdit: {
        prompt: string;
        label: string;
        path?: string | undefined;
        model?: string | undefined;
        diffs?: {
            type: "new" | "old" | "same";
            line: string;
        }[] | undefined;
    };
    chatFeedback: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionOptions: {};
        modelTitle: string;
        sessionId: string;
        feedback?: boolean | undefined;
    };
    tokensGenerated: {
        provider: string;
        model: string;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        promptTokens: number;
        generatedTokens: number;
    };
    chatInteraction: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        sessionId: string;
        tools?: string[] | undefined;
        rules?: {
            id: string;
            slug?: string | undefined;
        }[] | undefined;
    };
    editInteraction: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
    };
    editOutcome: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
        previousCode: string;
        newCode: string;
        previousCodeLines: number;
        newCodeLines: number;
        lineChange: number;
    };
    nextEditOutcome: {
        eventName: string;
        schema: string;
        timestamp: number;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionId: string;
        uniqueId: string;
        elapsed: number;
        fileUri: string;
        workspaceDirUri: string;
        userEdits: string;
        userExcerpts: string;
        originalEditableRange: string;
        cursorPosition: {
            line: number;
            character: number;
        };
        aborted?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        completionOptions?: any;
        requestId?: string | undefined;
    };
    nextEditWithHistory: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        previousEdits: {
            filename: string;
            diff: string;
        }[];
        fileURI: string;
        workspaceDirURI: string;
        beforeContent: string;
        afterContent: string;
        beforeCursorPos: {
            line: number;
            character: number;
        };
        afterCursorPos: {
            line: number;
            character: number;
        };
        context: string;
    };
    toolUsage: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        toolCallId: string;
        functionName: string;
        toolCallArgs: string;
        succeeded: boolean;
        functionParams?: Record<string, any> | undefined;
        output?: any[] | undefined;
    };
}, {
    autocomplete: {
        time: number;
        disable: boolean;
        maxPromptTokens: number;
        debounceDelay: number;
        maxSuffixPercentage: number;
        prefixPercentage: number;
        onlyMyCode: boolean;
        useCache: boolean;
        useRecentlyEdited: boolean;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        useFileSuffix: boolean;
        multilineCompletions: "never" | "always" | "auto";
        slidingWindowPrefixPercentage: number;
        slidingWindowSize: number;
        prefix: string;
        suffix: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        cacheHit: boolean;
        filepath: string;
        completionId: string;
        uniqueId: string;
        transform?: boolean | undefined;
        template?: string | undefined;
        useImports?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        enabledStaticContextualization?: boolean | undefined;
        completionOptions?: {
            contextLength?: number | undefined;
            maxTokens?: number | undefined;
            temperature?: number | undefined;
            topP?: number | undefined;
            topK?: number | undefined;
            minP?: number | undefined;
            presencePenalty?: number | undefined;
            frequencyPenalty?: number | undefined;
            stop?: string[] | undefined;
            n?: number | undefined;
            reasoning?: boolean | undefined;
            reasoningBudgetTokens?: number | undefined;
            promptCaching?: boolean | undefined;
            stream?: boolean | undefined;
        } | undefined;
        disableInFiles?: string[] | undefined;
    };
    quickEdit: {
        prompt: string;
        label: string;
        path?: string | undefined;
        model?: string | undefined;
        diffs?: {
            type: "new" | "old" | "same";
            line: string;
        }[] | undefined;
    };
    chatFeedback: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionOptions: {};
        modelTitle: string;
        sessionId: string;
        feedback?: boolean | undefined;
    };
    tokensGenerated: {
        provider: string;
        model: string;
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        promptTokens: number;
        generatedTokens: number;
    };
    chatInteraction: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        sessionId: string;
        tools?: string[] | undefined;
        rules?: {
            id: string;
            slug?: string | undefined;
        }[] | undefined;
    };
    editInteraction: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
    };
    editOutcome: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        filepath: string;
        modelTitle: string;
        previousCode: string;
        newCode: string;
        previousCodeLines: number;
        newCodeLines: number;
        lineChange: number;
    };
    nextEditOutcome: {
        eventName: string;
        schema: string;
        timestamp: number;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        prompt: string;
        completion: string;
        modelProvider: string;
        modelName: string;
        completionId: string;
        uniqueId: string;
        elapsed: number;
        fileUri: string;
        workspaceDirUri: string;
        userEdits: string;
        userExcerpts: string;
        originalEditableRange: string;
        cursorPosition: {
            line: number;
            character: number;
        };
        aborted?: boolean | undefined;
        accepted?: boolean | undefined;
        gitRepo?: string | undefined;
        completionOptions?: any;
        requestId?: string | undefined;
    };
    nextEditWithHistory: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        modelProvider: string;
        modelName: string;
        modelTitle: string;
        previousEdits: {
            filename: string;
            diff: string;
        }[];
        fileURI: string;
        workspaceDirURI: string;
        beforeContent: string;
        afterContent: string;
        beforeCursorPos: {
            line: number;
            character: number;
        };
        afterCursorPos: {
            line: number;
            character: number;
        };
        context: string;
    };
    toolUsage: {
        eventName: string;
        schema: string;
        timestamp: string;
        userId: string;
        userAgent: string;
        selectedProfileId: string;
        accepted: boolean;
        toolCallId: string;
        functionName: string;
        toolCallArgs: string;
        succeeded: boolean;
        functionParams?: Record<string, any> | undefined;
        output?: any[] | undefined;
    };
}>;
export declare const devDataVersionedSchemas: {
    [x: string]: {
        all: {
            autocomplete: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                disable: z.ZodBoolean;
                useFileSuffix: z.ZodBoolean;
                maxPromptTokens: z.ZodNumber;
                debounceDelay: z.ZodNumber;
                maxSuffixPercentage: z.ZodNumber;
                prefixPercentage: z.ZodNumber;
                transform: z.ZodOptional<z.ZodBoolean>;
                template: z.ZodOptional<z.ZodString>;
                multilineCompletions: z.ZodEnum<["always", "never", "auto"]>;
                slidingWindowPrefixPercentage: z.ZodNumber;
                slidingWindowSize: z.ZodNumber;
                useCache: z.ZodBoolean;
                onlyMyCode: z.ZodBoolean;
                useRecentlyEdited: z.ZodBoolean;
                useImports: z.ZodOptional<z.ZodBoolean>;
                accepted: z.ZodOptional<z.ZodBoolean>;
                time: z.ZodNumber;
                prefix: z.ZodString;
                suffix: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                cacheHit: z.ZodBoolean;
                filepath: z.ZodString;
                gitRepo: z.ZodOptional<z.ZodString>;
                completionId: z.ZodString;
                uniqueId: z.ZodString;
                timestamp: z.ZodString;
                enabledStaticContextualization: z.ZodOptional<z.ZodBoolean>;
                completionOptions: z.ZodOptional<z.ZodObject<{
                    contextLength: z.ZodOptional<z.ZodNumber>;
                    maxTokens: z.ZodOptional<z.ZodNumber>;
                    temperature: z.ZodOptional<z.ZodNumber>;
                    topP: z.ZodOptional<z.ZodNumber>;
                    topK: z.ZodOptional<z.ZodNumber>;
                    minP: z.ZodOptional<z.ZodNumber>;
                    presencePenalty: z.ZodOptional<z.ZodNumber>;
                    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
                    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    n: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodBoolean>;
                    reasoningBudgetTokens: z.ZodOptional<z.ZodNumber>;
                    promptCaching: z.ZodOptional<z.ZodBoolean>;
                    stream: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }>>;
                disableInFiles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "time" | "disable" | "maxPromptTokens" | "debounceDelay" | "maxSuffixPercentage" | "prefixPercentage" | "transform" | "template" | "onlyMyCode" | "useCache" | "useImports" | "useRecentlyEdited" | "timestamp" | "useFileSuffix" | "multilineCompletions" | "slidingWindowPrefixPercentage" | "slidingWindowSize" | "accepted" | "prefix" | "suffix" | "prompt" | "completion" | "modelProvider" | "modelName" | "cacheHit" | "filepath" | "gitRepo" | "completionId" | "uniqueId" | "completionOptions" | "disableInFiles">, "strip", z.ZodTypeAny, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                timestamp: string;
                useFileSuffix: boolean;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                prefix: string;
                suffix: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                } | undefined;
                disableInFiles?: string[] | undefined;
            }, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                timestamp: string;
                useFileSuffix: boolean;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                prefix: string;
                suffix: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                } | undefined;
                disableInFiles?: string[] | undefined;
            }>;
            quickEdit: z.ZodObject<Pick<{
                prompt: z.ZodString;
                path: z.ZodOptional<z.ZodString>;
                label: z.ZodString;
                diffs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    type: z.ZodEnum<["new", "old", "same"]>;
                    line: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "new" | "old" | "same";
                    line: string;
                }, {
                    type: "new" | "old" | "same";
                    line: string;
                }>, "many">>;
                model: z.ZodOptional<z.ZodString>;
            }, "path" | "model" | "prompt" | "label" | "diffs">, "strip", z.ZodTypeAny, {
                prompt: string;
                label: string;
                path?: string | undefined;
                model?: string | undefined;
                diffs?: {
                    type: "new" | "old" | "same";
                    line: string;
                }[] | undefined;
            }, {
                prompt: string;
                label: string;
                path?: string | undefined;
                model?: string | undefined;
                diffs?: {
                    type: "new" | "old" | "same";
                    line: string;
                }[] | undefined;
            }>;
            chatFeedback: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                completionOptions: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
                prompt: z.ZodString;
                completion: z.ZodString;
                feedback: z.ZodOptional<z.ZodBoolean>;
                sessionId: z.ZodString;
            }, "prompt" | "completion" | "modelName" | "completionOptions" | "feedback" | "sessionId">, "strip", z.ZodTypeAny, {
                prompt: string;
                completion: string;
                modelName: string;
                completionOptions: {};
                sessionId: string;
                feedback?: boolean | undefined;
            }, {
                prompt: string;
                completion: string;
                modelName: string;
                completionOptions: {};
                sessionId: string;
                feedback?: boolean | undefined;
            }>;
            tokensGenerated: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                model: z.ZodString;
                provider: z.ZodString;
                promptTokens: z.ZodNumber;
                generatedTokens: z.ZodNumber;
            }, "provider" | "model" | "promptTokens" | "generatedTokens">, "strip", z.ZodTypeAny, {
                provider: string;
                model: string;
                promptTokens: number;
                generatedTokens: number;
            }, {
                provider: string;
                model: string;
                promptTokens: number;
                generatedTokens: number;
            }>;
            chatInteraction?: undefined;
            editInteraction?: undefined;
            editOutcome?: undefined;
            nextEditOutcome?: undefined;
            nextEditWithHistory?: undefined;
            toolUsage?: undefined;
        };
        noCode: {
            autocomplete: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                disable: z.ZodBoolean;
                useFileSuffix: z.ZodBoolean;
                maxPromptTokens: z.ZodNumber;
                debounceDelay: z.ZodNumber;
                maxSuffixPercentage: z.ZodNumber;
                prefixPercentage: z.ZodNumber;
                transform: z.ZodOptional<z.ZodBoolean>;
                template: z.ZodOptional<z.ZodString>;
                multilineCompletions: z.ZodEnum<["always", "never", "auto"]>;
                slidingWindowPrefixPercentage: z.ZodNumber;
                slidingWindowSize: z.ZodNumber;
                useCache: z.ZodBoolean;
                onlyMyCode: z.ZodBoolean;
                useRecentlyEdited: z.ZodBoolean;
                useImports: z.ZodOptional<z.ZodBoolean>;
                accepted: z.ZodOptional<z.ZodBoolean>;
                time: z.ZodNumber;
                prefix: z.ZodString;
                suffix: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                cacheHit: z.ZodBoolean;
                filepath: z.ZodString;
                gitRepo: z.ZodOptional<z.ZodString>;
                completionId: z.ZodString;
                uniqueId: z.ZodString;
                timestamp: z.ZodString;
                enabledStaticContextualization: z.ZodOptional<z.ZodBoolean>;
                completionOptions: z.ZodOptional<z.ZodObject<{
                    contextLength: z.ZodOptional<z.ZodNumber>;
                    maxTokens: z.ZodOptional<z.ZodNumber>;
                    temperature: z.ZodOptional<z.ZodNumber>;
                    topP: z.ZodOptional<z.ZodNumber>;
                    topK: z.ZodOptional<z.ZodNumber>;
                    minP: z.ZodOptional<z.ZodNumber>;
                    presencePenalty: z.ZodOptional<z.ZodNumber>;
                    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
                    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    n: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodBoolean>;
                    reasoningBudgetTokens: z.ZodOptional<z.ZodNumber>;
                    promptCaching: z.ZodOptional<z.ZodBoolean>;
                    stream: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }>>;
                disableInFiles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "time" | "disable" | "maxPromptTokens" | "debounceDelay" | "maxSuffixPercentage" | "prefixPercentage" | "transform" | "template" | "onlyMyCode" | "useCache" | "useImports" | "useRecentlyEdited" | "timestamp" | "useFileSuffix" | "multilineCompletions" | "slidingWindowPrefixPercentage" | "slidingWindowSize" | "accepted" | "prefix" | "suffix" | "prompt" | "completion" | "modelProvider" | "modelName" | "cacheHit" | "filepath" | "gitRepo" | "completionId" | "uniqueId" | "completionOptions" | "disableInFiles">, "prefix" | "suffix" | "prompt" | "completion">, "strip", z.ZodTypeAny, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                timestamp: string;
                useFileSuffix: boolean;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                } | undefined;
                disableInFiles?: string[] | undefined;
            }, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                timestamp: string;
                useFileSuffix: boolean;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                } | undefined;
                disableInFiles?: string[] | undefined;
            }>;
            quickEdit: z.ZodObject<Omit<Pick<{
                prompt: z.ZodString;
                path: z.ZodOptional<z.ZodString>;
                label: z.ZodString;
                diffs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    type: z.ZodEnum<["new", "old", "same"]>;
                    line: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "new" | "old" | "same";
                    line: string;
                }, {
                    type: "new" | "old" | "same";
                    line: string;
                }>, "many">>;
                model: z.ZodOptional<z.ZodString>;
            }, "path" | "model" | "prompt" | "label" | "diffs">, "path" | "prompt" | "diffs">, "strip", z.ZodTypeAny, {
                label: string;
                model?: string | undefined;
            }, {
                label: string;
                model?: string | undefined;
            }>;
            chatFeedback: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                completionOptions: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
                prompt: z.ZodString;
                completion: z.ZodString;
                feedback: z.ZodOptional<z.ZodBoolean>;
                sessionId: z.ZodString;
            }, "prompt" | "completion" | "modelName" | "completionOptions" | "feedback" | "sessionId">, "prompt" | "completion">, "strip", z.ZodTypeAny, {
                modelName: string;
                completionOptions: {};
                sessionId: string;
                feedback?: boolean | undefined;
            }, {
                modelName: string;
                completionOptions: {};
                sessionId: string;
                feedback?: boolean | undefined;
            }>;
            tokensGenerated: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                model: z.ZodString;
                provider: z.ZodString;
                promptTokens: z.ZodNumber;
                generatedTokens: z.ZodNumber;
            }, "provider" | "model" | "promptTokens" | "generatedTokens">, "strip", z.ZodTypeAny, {
                provider: string;
                model: string;
                promptTokens: number;
                generatedTokens: number;
            }, {
                provider: string;
                model: string;
                promptTokens: number;
                generatedTokens: number;
            }>;
            chatInteraction?: undefined;
            editInteraction?: undefined;
            editOutcome?: undefined;
            nextEditOutcome?: undefined;
            nextEditWithHistory?: undefined;
            toolUsage?: undefined;
        };
    } | {
        all: {
            autocomplete: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                disable: z.ZodBoolean;
                useFileSuffix: z.ZodBoolean;
                maxPromptTokens: z.ZodNumber;
                debounceDelay: z.ZodNumber;
                maxSuffixPercentage: z.ZodNumber;
                prefixPercentage: z.ZodNumber;
                transform: z.ZodOptional<z.ZodBoolean>;
                template: z.ZodOptional<z.ZodString>;
                multilineCompletions: z.ZodEnum<["always", "never", "auto"]>;
                slidingWindowPrefixPercentage: z.ZodNumber;
                slidingWindowSize: z.ZodNumber;
                useCache: z.ZodBoolean;
                onlyMyCode: z.ZodBoolean;
                useRecentlyEdited: z.ZodBoolean;
                useImports: z.ZodOptional<z.ZodBoolean>;
                accepted: z.ZodOptional<z.ZodBoolean>;
                time: z.ZodNumber;
                prefix: z.ZodString;
                suffix: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                cacheHit: z.ZodBoolean;
                filepath: z.ZodString;
                gitRepo: z.ZodOptional<z.ZodString>;
                completionId: z.ZodString;
                uniqueId: z.ZodString;
                timestamp: z.ZodString;
                enabledStaticContextualization: z.ZodOptional<z.ZodBoolean>;
                completionOptions: z.ZodOptional<z.ZodObject<{
                    contextLength: z.ZodOptional<z.ZodNumber>;
                    maxTokens: z.ZodOptional<z.ZodNumber>;
                    temperature: z.ZodOptional<z.ZodNumber>;
                    topP: z.ZodOptional<z.ZodNumber>;
                    topK: z.ZodOptional<z.ZodNumber>;
                    minP: z.ZodOptional<z.ZodNumber>;
                    presencePenalty: z.ZodOptional<z.ZodNumber>;
                    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
                    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    n: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodBoolean>;
                    reasoningBudgetTokens: z.ZodOptional<z.ZodNumber>;
                    promptCaching: z.ZodOptional<z.ZodBoolean>;
                    stream: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }>>;
                disableInFiles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "time" | "disable" | "maxPromptTokens" | "debounceDelay" | "maxSuffixPercentage" | "prefixPercentage" | "transform" | "template" | "onlyMyCode" | "useCache" | "useImports" | "useRecentlyEdited" | "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "multilineCompletions" | "slidingWindowPrefixPercentage" | "slidingWindowSize" | "accepted" | "prefix" | "suffix" | "prompt" | "completion" | "modelProvider" | "modelName" | "cacheHit" | "filepath" | "gitRepo" | "completionId" | "uniqueId" | "enabledStaticContextualization">, "strip", z.ZodTypeAny, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                prefix: string;
                suffix: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                enabledStaticContextualization?: boolean | undefined;
            }, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                prefix: string;
                suffix: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                enabledStaticContextualization?: boolean | undefined;
            }>;
            chatFeedback: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                completionOptions: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
                prompt: z.ZodString;
                completion: z.ZodString;
                feedback: z.ZodOptional<z.ZodBoolean>;
                sessionId: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "modelTitle" | "feedback" | "sessionId">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                feedback?: boolean | undefined;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                feedback?: boolean | undefined;
            }>;
            tokensGenerated: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                model: z.ZodString;
                provider: z.ZodString;
                promptTokens: z.ZodNumber;
                generatedTokens: z.ZodNumber;
            }, "provider" | "model" | "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "promptTokens" | "generatedTokens">, "strip", z.ZodTypeAny, {
                provider: string;
                model: string;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                promptTokens: number;
                generatedTokens: number;
            }, {
                provider: string;
                model: string;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                promptTokens: number;
                generatedTokens: number;
            }>;
            chatInteraction: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                sessionId: z.ZodString;
                tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    slug: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    slug?: string | undefined;
                }, {
                    id: string;
                    slug?: string | undefined;
                }>, "many">>;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "modelTitle" | "sessionId" | "tools" | "rules">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                tools?: string[] | undefined;
                rules?: {
                    id: string;
                    slug?: string | undefined;
                }[] | undefined;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                tools?: string[] | undefined;
                rules?: {
                    id: string;
                    slug?: string | undefined;
                }[] | undefined;
            }>;
            editInteraction: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                filepath: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "filepath" | "modelTitle">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
            }>;
            editOutcome: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                previousCode: z.ZodString;
                newCode: z.ZodString;
                previousCodeLines: z.ZodNumber;
                newCodeLines: z.ZodNumber;
                lineChange: z.ZodNumber;
                accepted: z.ZodBoolean;
                filepath: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "accepted" | "prompt" | "completion" | "modelProvider" | "modelName" | "filepath" | "modelTitle" | "previousCode" | "newCode" | "previousCodeLines" | "newCodeLines" | "lineChange">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
                previousCode: string;
                newCode: string;
                previousCodeLines: number;
                newCodeLines: number;
                lineChange: number;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
                previousCode: string;
                newCode: string;
                previousCodeLines: number;
                newCodeLines: number;
                lineChange: number;
            }>;
            nextEditOutcome: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                elapsed: z.ZodNumber;
                completionOptions: z.ZodAny;
                completionId: z.ZodString;
                requestId: z.ZodOptional<z.ZodString>;
                gitRepo: z.ZodOptional<z.ZodString>;
                uniqueId: z.ZodString;
                timestamp: z.ZodNumber;
                fileUri: z.ZodString;
                workspaceDirUri: z.ZodString;
                prompt: z.ZodString;
                userEdits: z.ZodString;
                userExcerpts: z.ZodString;
                originalEditableRange: z.ZodString;
                completion: z.ZodString;
                cursorPosition: z.ZodObject<{
                    line: z.ZodNumber;
                    character: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    line: number;
                    character: number;
                }, {
                    line: number;
                    character: number;
                }>;
                accepted: z.ZodOptional<z.ZodBoolean>;
                aborted: z.ZodOptional<z.ZodBoolean>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
            }, "aborted" | "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "accepted" | "prompt" | "completion" | "modelProvider" | "modelName" | "gitRepo" | "completionId" | "uniqueId" | "completionOptions" | "elapsed" | "requestId" | "fileUri" | "workspaceDirUri" | "userEdits" | "userExcerpts" | "originalEditableRange" | "cursorPosition">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: number;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                completionId: string;
                uniqueId: string;
                elapsed: number;
                fileUri: string;
                workspaceDirUri: string;
                userEdits: string;
                userExcerpts: string;
                originalEditableRange: string;
                cursorPosition: {
                    line: number;
                    character: number;
                };
                aborted?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: any;
                requestId?: string | undefined;
            }, {
                eventName: string;
                schema: string;
                timestamp: number;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                prompt: string;
                completion: string;
                modelProvider: string;
                modelName: string;
                completionId: string;
                uniqueId: string;
                elapsed: number;
                fileUri: string;
                workspaceDirUri: string;
                userEdits: string;
                userExcerpts: string;
                originalEditableRange: string;
                cursorPosition: {
                    line: number;
                    character: number;
                };
                aborted?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: any;
                requestId?: string | undefined;
            }>;
            nextEditWithHistory: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                previousEdits: z.ZodArray<z.ZodObject<{
                    filename: z.ZodString;
                    diff: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    filename: string;
                    diff: string;
                }, {
                    filename: string;
                    diff: string;
                }>, "many">;
                fileURI: z.ZodString;
                workspaceDirURI: z.ZodString;
                beforeContent: z.ZodString;
                afterContent: z.ZodString;
                beforeCursorPos: z.ZodObject<{
                    line: z.ZodNumber;
                    character: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    line: number;
                    character: number;
                }, {
                    line: number;
                    character: number;
                }>;
                afterCursorPos: z.ZodObject<{
                    line: z.ZodNumber;
                    character: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    line: number;
                    character: number;
                }, {
                    line: number;
                    character: number;
                }>;
                context: z.ZodString;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "modelProvider" | "modelName" | "modelTitle" | "previousEdits" | "fileURI" | "workspaceDirURI" | "beforeContent" | "afterContent" | "beforeCursorPos" | "afterCursorPos" | "context">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                previousEdits: {
                    filename: string;
                    diff: string;
                }[];
                fileURI: string;
                workspaceDirURI: string;
                beforeContent: string;
                afterContent: string;
                beforeCursorPos: {
                    line: number;
                    character: number;
                };
                afterCursorPos: {
                    line: number;
                    character: number;
                };
                context: string;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                previousEdits: {
                    filename: string;
                    diff: string;
                }[];
                fileURI: string;
                workspaceDirURI: string;
                beforeContent: string;
                afterContent: string;
                beforeCursorPos: {
                    line: number;
                    character: number;
                };
                afterCursorPos: {
                    line: number;
                    character: number;
                };
                context: string;
            }>;
            toolUsage: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                toolCallId: z.ZodString;
                functionName: z.ZodString;
                functionParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                toolCallArgs: z.ZodString;
                accepted: z.ZodBoolean;
                succeeded: z.ZodBoolean;
                output: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "accepted" | "toolCallId" | "functionName" | "functionParams" | "toolCallArgs" | "succeeded" | "output">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                toolCallId: string;
                functionName: string;
                toolCallArgs: string;
                succeeded: boolean;
                functionParams?: Record<string, any> | undefined;
                output?: any[] | undefined;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                toolCallId: string;
                functionName: string;
                toolCallArgs: string;
                succeeded: boolean;
                functionParams?: Record<string, any> | undefined;
                output?: any[] | undefined;
            }>;
            quickEdit?: undefined;
        };
        noCode: {
            autocomplete: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                disable: z.ZodBoolean;
                useFileSuffix: z.ZodBoolean;
                maxPromptTokens: z.ZodNumber;
                debounceDelay: z.ZodNumber;
                maxSuffixPercentage: z.ZodNumber;
                prefixPercentage: z.ZodNumber;
                transform: z.ZodOptional<z.ZodBoolean>;
                template: z.ZodOptional<z.ZodString>;
                multilineCompletions: z.ZodEnum<["always", "never", "auto"]>;
                slidingWindowPrefixPercentage: z.ZodNumber;
                slidingWindowSize: z.ZodNumber;
                useCache: z.ZodBoolean;
                onlyMyCode: z.ZodBoolean;
                useRecentlyEdited: z.ZodBoolean;
                useImports: z.ZodOptional<z.ZodBoolean>;
                accepted: z.ZodOptional<z.ZodBoolean>;
                time: z.ZodNumber;
                prefix: z.ZodString;
                suffix: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                cacheHit: z.ZodBoolean;
                filepath: z.ZodString;
                gitRepo: z.ZodOptional<z.ZodString>;
                completionId: z.ZodString;
                uniqueId: z.ZodString;
                timestamp: z.ZodString;
                enabledStaticContextualization: z.ZodOptional<z.ZodBoolean>;
                completionOptions: z.ZodOptional<z.ZodObject<{
                    contextLength: z.ZodOptional<z.ZodNumber>;
                    maxTokens: z.ZodOptional<z.ZodNumber>;
                    temperature: z.ZodOptional<z.ZodNumber>;
                    topP: z.ZodOptional<z.ZodNumber>;
                    topK: z.ZodOptional<z.ZodNumber>;
                    minP: z.ZodOptional<z.ZodNumber>;
                    presencePenalty: z.ZodOptional<z.ZodNumber>;
                    frequencyPenalty: z.ZodOptional<z.ZodNumber>;
                    stop: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                    n: z.ZodOptional<z.ZodNumber>;
                    reasoning: z.ZodOptional<z.ZodBoolean>;
                    reasoningBudgetTokens: z.ZodOptional<z.ZodNumber>;
                    promptCaching: z.ZodOptional<z.ZodBoolean>;
                    stream: z.ZodOptional<z.ZodBoolean>;
                }, "strip", z.ZodTypeAny, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }, {
                    contextLength?: number | undefined;
                    maxTokens?: number | undefined;
                    temperature?: number | undefined;
                    topP?: number | undefined;
                    topK?: number | undefined;
                    minP?: number | undefined;
                    presencePenalty?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    stop?: string[] | undefined;
                    n?: number | undefined;
                    reasoning?: boolean | undefined;
                    reasoningBudgetTokens?: number | undefined;
                    promptCaching?: boolean | undefined;
                    stream?: boolean | undefined;
                }>>;
                disableInFiles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "time" | "disable" | "maxPromptTokens" | "debounceDelay" | "maxSuffixPercentage" | "prefixPercentage" | "transform" | "template" | "onlyMyCode" | "useCache" | "useImports" | "useRecentlyEdited" | "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "multilineCompletions" | "slidingWindowPrefixPercentage" | "slidingWindowSize" | "accepted" | "prefix" | "suffix" | "prompt" | "completion" | "modelProvider" | "modelName" | "cacheHit" | "filepath" | "gitRepo" | "completionId" | "uniqueId" | "enabledStaticContextualization">, "prefix" | "suffix" | "prompt" | "completion">, "strip", z.ZodTypeAny, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                enabledStaticContextualization?: boolean | undefined;
            }, {
                time: number;
                disable: boolean;
                maxPromptTokens: number;
                debounceDelay: number;
                maxSuffixPercentage: number;
                prefixPercentage: number;
                onlyMyCode: boolean;
                useCache: boolean;
                useRecentlyEdited: boolean;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                multilineCompletions: "never" | "always" | "auto";
                slidingWindowPrefixPercentage: number;
                slidingWindowSize: number;
                modelProvider: string;
                modelName: string;
                cacheHit: boolean;
                filepath: string;
                completionId: string;
                uniqueId: string;
                transform?: boolean | undefined;
                template?: string | undefined;
                useImports?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                enabledStaticContextualization?: boolean | undefined;
            }>;
            chatFeedback: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                completionOptions: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
                prompt: z.ZodString;
                completion: z.ZodString;
                feedback: z.ZodOptional<z.ZodBoolean>;
                sessionId: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "modelTitle" | "feedback" | "sessionId">, "prompt" | "completion">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                feedback?: boolean | undefined;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                feedback?: boolean | undefined;
            }>;
            tokensGenerated: z.ZodObject<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                model: z.ZodString;
                provider: z.ZodString;
                promptTokens: z.ZodNumber;
                generatedTokens: z.ZodNumber;
            }, "provider" | "model" | "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "promptTokens" | "generatedTokens">, "strip", z.ZodTypeAny, {
                provider: string;
                model: string;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                promptTokens: number;
                generatedTokens: number;
            }, {
                provider: string;
                model: string;
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                promptTokens: number;
                generatedTokens: number;
            }>;
            chatInteraction: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                sessionId: z.ZodString;
                tools: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    slug: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    slug?: string | undefined;
                }, {
                    id: string;
                    slug?: string | undefined;
                }>, "many">>;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "modelTitle" | "sessionId" | "tools" | "rules">, "prompt" | "completion">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                tools?: string[] | undefined;
                rules?: {
                    id: string;
                    slug?: string | undefined;
                }[] | undefined;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                sessionId: string;
                tools?: string[] | undefined;
                rules?: {
                    id: string;
                    slug?: string | undefined;
                }[] | undefined;
            }>;
            editInteraction: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                filepath: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "filepath" | "modelTitle">, "prompt" | "completion">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
            }>;
            editOutcome: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
                prompt: z.ZodString;
                completion: z.ZodString;
                previousCode: z.ZodString;
                newCode: z.ZodString;
                previousCodeLines: z.ZodNumber;
                newCodeLines: z.ZodNumber;
                lineChange: z.ZodNumber;
                accepted: z.ZodBoolean;
                filepath: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "accepted" | "prompt" | "completion" | "modelProvider" | "modelName" | "filepath" | "modelTitle" | "previousCode" | "newCode" | "previousCodeLines" | "newCodeLines" | "lineChange">, "prompt" | "completion" | "previousCode" | "newCode">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
                previousCodeLines: number;
                newCodeLines: number;
                lineChange: number;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                modelProvider: string;
                modelName: string;
                filepath: string;
                modelTitle: string;
                previousCodeLines: number;
                newCodeLines: number;
                lineChange: number;
            }>;
            nextEditOutcome: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                elapsed: z.ZodNumber;
                completionOptions: z.ZodAny;
                completionId: z.ZodString;
                requestId: z.ZodOptional<z.ZodString>;
                gitRepo: z.ZodOptional<z.ZodString>;
                uniqueId: z.ZodString;
                timestamp: z.ZodNumber;
                fileUri: z.ZodString;
                workspaceDirUri: z.ZodString;
                prompt: z.ZodString;
                userEdits: z.ZodString;
                userExcerpts: z.ZodString;
                originalEditableRange: z.ZodString;
                completion: z.ZodString;
                cursorPosition: z.ZodObject<{
                    line: z.ZodNumber;
                    character: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    line: number;
                    character: number;
                }, {
                    line: number;
                    character: number;
                }>;
                accepted: z.ZodOptional<z.ZodBoolean>;
                aborted: z.ZodOptional<z.ZodBoolean>;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
            }, "aborted" | "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "accepted" | "prompt" | "completion" | "modelProvider" | "modelName" | "gitRepo" | "completionId" | "uniqueId" | "completionOptions" | "elapsed" | "requestId" | "fileUri" | "workspaceDirUri" | "userEdits" | "userExcerpts" | "originalEditableRange" | "cursorPosition">, "prompt" | "completion" | "fileUri" | "workspaceDirUri" | "userEdits" | "userExcerpts" | "originalEditableRange">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: number;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                completionId: string;
                uniqueId: string;
                elapsed: number;
                cursorPosition: {
                    line: number;
                    character: number;
                };
                aborted?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: any;
                requestId?: string | undefined;
            }, {
                eventName: string;
                schema: string;
                timestamp: number;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                completionId: string;
                uniqueId: string;
                elapsed: number;
                cursorPosition: {
                    line: number;
                    character: number;
                };
                aborted?: boolean | undefined;
                accepted?: boolean | undefined;
                gitRepo?: string | undefined;
                completionOptions?: any;
                requestId?: string | undefined;
            }>;
            nextEditWithHistory: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                previousEdits: z.ZodArray<z.ZodObject<{
                    filename: z.ZodString;
                    diff: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    filename: string;
                    diff: string;
                }, {
                    filename: string;
                    diff: string;
                }>, "many">;
                fileURI: z.ZodString;
                workspaceDirURI: z.ZodString;
                beforeContent: z.ZodString;
                afterContent: z.ZodString;
                beforeCursorPos: z.ZodObject<{
                    line: z.ZodNumber;
                    character: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    line: number;
                    character: number;
                }, {
                    line: number;
                    character: number;
                }>;
                afterCursorPos: z.ZodObject<{
                    line: z.ZodNumber;
                    character: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    line: number;
                    character: number;
                }, {
                    line: number;
                    character: number;
                }>;
                context: z.ZodString;
                modelProvider: z.ZodString;
                modelName: z.ZodString;
                modelTitle: z.ZodString;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "modelProvider" | "modelName" | "modelTitle" | "previousEdits" | "fileURI" | "workspaceDirURI" | "beforeContent" | "afterContent" | "beforeCursorPos" | "afterCursorPos" | "context">, "previousEdits" | "fileURI" | "workspaceDirURI" | "beforeContent" | "afterContent" | "context">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                beforeCursorPos: {
                    line: number;
                    character: number;
                };
                afterCursorPos: {
                    line: number;
                    character: number;
                };
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                modelProvider: string;
                modelName: string;
                modelTitle: string;
                beforeCursorPos: {
                    line: number;
                    character: number;
                };
                afterCursorPos: {
                    line: number;
                    character: number;
                };
            }>;
            toolUsage: z.ZodObject<Omit<Pick<{
                eventName: z.ZodString;
                schema: z.ZodString;
                timestamp: z.ZodString;
                userId: z.ZodString;
                userAgent: z.ZodString;
                selectedProfileId: z.ZodString;
            } & {
                toolCallId: z.ZodString;
                functionName: z.ZodString;
                functionParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
                toolCallArgs: z.ZodString;
                accepted: z.ZodBoolean;
                succeeded: z.ZodBoolean;
                output: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
            }, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "accepted" | "toolCallId" | "functionName" | "functionParams" | "toolCallArgs" | "succeeded" | "output">, "functionParams" | "toolCallArgs" | "output">, "strip", z.ZodTypeAny, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                toolCallId: string;
                functionName: string;
                succeeded: boolean;
            }, {
                eventName: string;
                schema: string;
                timestamp: string;
                userId: string;
                userAgent: string;
                selectedProfileId: string;
                accepted: boolean;
                toolCallId: string;
                functionName: string;
                succeeded: boolean;
            }>;
            quickEdit?: undefined;
        };
    };
};
type DevEventDataSchemas = z.infer<typeof devEventAllVersionDataSchemas>;
export type DevEventName = keyof DevEventDataSchemas;
type DevEventAllVersionsSchema<T extends DevEventName> = DevEventDataSchemas[T];
export type DevDataLogEvent = {
    [K in DevEventName]: {
        name: K;
        data: Omit<DevEventAllVersionsSchema<K>, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId">;
    };
}[DevEventName];
export declare const allDevEventNames: DevEventName[];
export {};
