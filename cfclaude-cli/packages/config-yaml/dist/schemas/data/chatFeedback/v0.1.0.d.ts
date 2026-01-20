export declare const chatFeedbackEventSchema_0_1_0: import("zod").ZodObject<Pick<{
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
    completionOptions: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    prompt: import("zod").ZodString;
    completion: import("zod").ZodString;
    feedback: import("zod").ZodOptional<import("zod").ZodBoolean>;
    sessionId: import("zod").ZodString;
}, "prompt" | "completion" | "modelName" | "completionOptions" | "feedback" | "sessionId">, "strip", import("zod").ZodTypeAny, {
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
export declare const chatFeedbackEventSchema_0_1_0_noCode: import("zod").ZodObject<Omit<Pick<{
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
    completionOptions: import("zod").ZodObject<{}, "strip", import("zod").ZodTypeAny, {}, {}>;
    prompt: import("zod").ZodString;
    completion: import("zod").ZodString;
    feedback: import("zod").ZodOptional<import("zod").ZodBoolean>;
    sessionId: import("zod").ZodString;
}, "prompt" | "completion" | "modelName" | "completionOptions" | "feedback" | "sessionId">, "prompt" | "completion">, "strip", import("zod").ZodTypeAny, {
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
