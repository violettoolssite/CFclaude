import { AssistantUnrolled, ModelConfig } from "@continuedev/config-yaml";
import { Box, Text } from "ink";
import React, { useMemo } from "react";

import { getDisplayableAsciiArt } from "../asciiArt.js";
import { MCPService } from "../services/MCPService.js";

import { CF_COLORS } from "./styles.js";
import { TipsDisplay, shouldShowTip } from "./TipsDisplay.js";

interface IntroMessageProps {
  config?: AssistantUnrolled;
  model?: ModelConfig;
  mcpService?: MCPService;
  organizationName?: string;
}

// Helper function to extract rule names
const extractRuleNames = (rules: any[] = []): string[] => {
  return rules.map((rule: any) =>
    typeof rule === "string" ? rule : rule?.name || "Unknown",
  );
};

const IntroMessage: React.FC<IntroMessageProps> = ({
  config,
  model,
  mcpService,
  organizationName,
}) => {
  // Get MCP prompts directly (not memoized since they can change after first render)
  const mcpPrompts = mcpService?.getState().prompts ?? [];

  // Determine if we should show a tip (1 in 5 chance) - computed once on mount
  const showTip = useMemo(() => shouldShowTip(), []);

  // Memoize expensive operations to avoid running on every resize
  const allRules = useMemo(() => {
    return extractRuleNames(config?.rules);
  }, [config?.rules]);

  // Render helper components
  const renderMcpPrompts = () =>
    mcpPrompts.length > 0 ? (
      <>
        {mcpPrompts.map((prompt, index) => (
          <Text key={`mcp-${index}`}>
            - <Text color="white">/{prompt.name}</Text>:{" "}
            <Text color="dim">{prompt.description}</Text>
          </Text>
        ))}
        <Text> </Text>
      </>
    ) : null;

  const renderRules = () =>
    allRules.length > 0 ? (
      <>
        <Text bold color={CF_COLORS.orange}>
          Rules:
        </Text>
        {allRules.map((rule, index) => (
          <Text key={index}>
            - <Text color="white">{rule}</Text>
          </Text>
        ))}
        <Text> </Text>
      </>
    ) : null;

  const renderMcpServers = () =>
    (config?.mcpServers?.length ?? 0) > 0 ? (
      <>
        <Text bold color={CF_COLORS.orange}>
          MCP Servers:
        </Text>
        {config?.mcpServers?.map((server: any, index: number) => (
          <Text key={index}>
            - <Text color="white">{server?.name}</Text>
          </Text>
        ))}
        <Text> </Text>
      </>
    ) : null;

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      {/* ASCII Art */}
      <Text>{getDisplayableAsciiArt()}</Text>
      <Text> </Text>

      {/* Tips Display - shown randomly 1 in 5 times */}
      {showTip && <TipsDisplay />}

      {/* Organization name */}
      {organizationName && (
        <Text color={CF_COLORS.orange}>
          <Text bold>Org:</Text> <Text color="white">{organizationName}</Text>
        </Text>
      )}

      {/* Agent name */}
      {config && (
        <Text color={CF_COLORS.orange}>
          <Text bold>Config:</Text> <Text color="white">{config.name}</Text>
        </Text>
      )}

      {/* Model */}
      {model ? (
        <Text color={CF_COLORS.orange}>
          <Text bold>Model:</Text>{" "}
          <Text color="white">{model.name.split("/").pop()}</Text>
        </Text>
      ) : (
        <Text color={CF_COLORS.orange}>
          <Text bold>Model:</Text> <Text color="dim">Loading...</Text>
        </Text>
      )}

      <Text> </Text>

      {renderMcpPrompts()}
      {renderRules()}
      {renderMcpServers()}
    </Box>
  );
};

export { IntroMessage };
