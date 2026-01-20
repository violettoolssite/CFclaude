import { z } from "zod";
export declare const nextEditEventAllSchema: z.ZodObject<{
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
