export declare const chatInteractionEventSchema_0_2_0: import("zod").ZodObject<Pick<{
    eventName: import("zod").ZodString;
    schema: import("zod").ZodString;
    timestamp: import("zod").ZodString;
    userId: import("zod").ZodString;
    userAgent: import("zod").ZodString;
    selectedProfileId: import("zod").ZodString;
} & {
    modelProvider: import("zod").ZodString;
    modelName: import("zod").ZodString;
    modelTitle: import("zod").ZodString;
    prompt: import("zod").ZodString;
    completion: import("zod").ZodString;
    sessionId: import("zod").ZodString;
    tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    rules: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodString;
        slug: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        id: string;
        slug?: string | undefined;
    }, {
        id: string;
        slug?: string | undefined;
    }>, "many">>;
}, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "modelTitle" | "sessionId" | "tools" | "rules">, "strip", import("zod").ZodTypeAny, {
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
export declare const chatInteractionEventSchema_0_2_0_noCode: import("zod").ZodObject<Omit<Pick<{
    eventName: import("zod").ZodString;
    schema: import("zod").ZodString;
    timestamp: import("zod").ZodString;
    userId: import("zod").ZodString;
    userAgent: import("zod").ZodString;
    selectedProfileId: import("zod").ZodString;
} & {
    modelProvider: import("zod").ZodString;
    modelName: import("zod").ZodString;
    modelTitle: import("zod").ZodString;
    prompt: import("zod").ZodString;
    completion: import("zod").ZodString;
    sessionId: import("zod").ZodString;
    tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
    rules: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
        id: import("zod").ZodString;
        slug: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        id: string;
        slug?: string | undefined;
    }, {
        id: string;
        slug?: string | undefined;
    }>, "many">>;
}, "eventName" | "schema" | "timestamp" | "userId" | "userAgent" | "selectedProfileId" | "prompt" | "completion" | "modelProvider" | "modelName" | "modelTitle" | "sessionId" | "tools" | "rules">, "prompt" | "completion">, "strip", import("zod").ZodTypeAny, {
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
