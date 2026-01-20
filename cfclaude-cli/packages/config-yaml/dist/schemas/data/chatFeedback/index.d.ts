import { z } from "zod";
export declare const chatFeedbackEventAllSchema: z.ZodObject<{
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
