import type { MCPServer } from "./index.js";
import type { McpJsonConfig, McpServersJsonConfigFile } from "./json.js";
/**
 * Convert environment variable references from JSON format (${VAR}) to YAML format (${{ secrets.VAR }})
 */
export declare function convertJsonEnvToYamlEnv(env: Record<string, string> | undefined): Record<string, string> | undefined;
/**
 * Convert environment variable references from YAML format (${{ secrets.VAR }} or ${{ inputs.VAR }}) to JSON format (${VAR})
 */
export declare function convertYamlEnvToJsonEnv(env: Record<string, string> | undefined): Record<string, string> | undefined;
/**
 * Convert from JSON schema (used in Claude Desktop) to YAML schema (used in Continue)
 */
export declare function convertJsonMcpConfigToYamlMcpConfig(name: string, jsonConfig: McpJsonConfig): {
    yamlConfig: MCPServer;
    warnings: string[];
};
/**
 * Convert from YAML schema (used in Continue) to JSON schema (e.g. used in Claude Desktop)
 */
export declare function convertYamlMcpConfigToJsonMcpConfig(yamlConfig: MCPServer): {
    name: string;
    jsonConfig: McpJsonConfig;
    MCP_TIMEOUT?: string;
    warnings: string[];
};
export declare function converMcpServersJsonConfigFileToYamlBlocks(jsonFile: McpServersJsonConfigFile): {
    yamlConfigs: MCPServer[];
    warnings: string[];
};
