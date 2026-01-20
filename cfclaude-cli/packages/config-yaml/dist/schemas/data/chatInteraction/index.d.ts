import { z } from "zod";
export declare const chatInteractionEventAllSchema: z.ZodObject<{
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
