import z from "zod";
declare const agentFileFrontmatterSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodString>;
    rules: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    model?: string | undefined;
    tools?: string | undefined;
    rules?: string | undefined;
    description?: string | undefined;
}, {
    name: string;
    model?: string | undefined;
    tools?: string | undefined;
    rules?: string | undefined;
    description?: string | undefined;
}>;
export type AgentFileFrontmatter = z.infer<typeof agentFileFrontmatterSchema>;
declare const agentFileSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    tools: z.ZodOptional<z.ZodString>;
    rules: z.ZodOptional<z.ZodString>;
} & {
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    prompt: string;
    model?: string | undefined;
    tools?: string | undefined;
    rules?: string | undefined;
    description?: string | undefined;
}, {
    name: string;
    prompt: string;
    model?: string | undefined;
    tools?: string | undefined;
    rules?: string | undefined;
    description?: string | undefined;
}>;
export type AgentFile = z.infer<typeof agentFileSchema>;
/**
 * Parsed agent tool reference
 */
export interface AgentToolReference {
    /** MCP server slug (owner/package) or URL (https://...) if this is an MCP tool */
    mcpServer?: string;
    /** Specific tool name - either MCP tool name or built-in tool name */
    toolName?: string;
}
/**
 * Parsed agent tools configuration
 */
export interface ParsedAgentTools {
    /** All tool references */
    tools: AgentToolReference[];
    /** Unique MCP server slugs that need to be added to config */
    mcpServers: string[];
    /** Whether all built-in tools are allowed */
    allBuiltIn: boolean;
}
/**
 * Parses and validates an agent file from markdown content
 * Agent files must have frontmatter with at least a name
 */
export declare function parseAgentFile(content: string): AgentFile;
/**
 * Serializes an Agent file back to markdown with YAML frontmatter
 */
export declare function serializeAgentFile(agentFile: AgentFile): string;
/**
 * Parse agent tools string into structured format
 *
 * Supports formats:
 * - owner/package - all tools from MCP server
 * - owner/package:tool_name - specific tool from MCP server
 * - https://mcp.url.com or http://mcp.url.com - all tools from URL-based MCP server
 * - https://mcp.url.com:tool_name - specific tool from URL-based MCP server
 * - ToolName or tool_name - built-in tool
 * - built_in - all built-in tools
 *
 * @param toolsString Comma-separated tools string
 * @returns Parsed tools configuration
 */
export declare function parseAgentFileTools(toolsString?: string): ParsedAgentTools;
export declare function parseAgentFileRules(rules: string): string[];
export {};
