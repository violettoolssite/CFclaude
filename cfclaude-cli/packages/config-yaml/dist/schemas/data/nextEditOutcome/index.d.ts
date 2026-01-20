import { z } from "zod";
export declare const nextEditOutcomeEventAllSchema: z.ZodObject<{
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
