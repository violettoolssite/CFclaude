import { Box, Text, useInput } from "ink";
import React, { useEffect, useState } from "react";

import { services } from "../services/index.js";
import { ProviderType, getProviderDisplayName } from "../cfConfigLoader.js";
import { CF_COLORS } from "./styles.js";

interface ModelOption {
  id: string;
  name: string;
  index: number;
  provider: ProviderType;
}

interface ProviderGroup {
  provider: ProviderType;
  displayName: string;
  models: ModelOption[];
}

interface ModelSelectorProps {
  onSelect: (model: ModelOption) => void;
  onCancel: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  onSelect,
  onCancel,
}) => {
  const [groups, setGroups] = useState<ProviderGroup[]>([]);
  const [flatModels, setFlatModels] = useState<ModelOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentModelIndex, setCurrentModelIndex] = useState<number>(-1);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const availableModels = services.model.getAvailableChatModels();
        const currentIndex = services.model.getCurrentModelIndex();

        if (availableModels.length === 0) {
          setError(
            "No models available. Please configure at least one provider in ~/.cfcoderrc"
          );
          setLoading(false);
          return;
        }

        // Convert to ModelOption format
        const modelOptions: ModelOption[] = availableModels.map((model) => ({
          id: `${model.provider}-${model.model}-${model.index}`,
          name: model.name,
          index: model.index,
          provider: model.provider as ProviderType,
        }));

        // Group by provider
        const groupedMap = new Map<ProviderType, ModelOption[]>();
        for (const model of modelOptions) {
          const existing = groupedMap.get(model.provider) || [];
          existing.push(model);
          groupedMap.set(model.provider, existing);
        }

        // Convert to array with display names
        const providerGroups: ProviderGroup[] = [];
        const providerOrder: ProviderType[] = [
          "cloudflare-workers",
          "openai",
          "anthropic",
        ];

        for (const provider of providerOrder) {
          const models = groupedMap.get(provider);
          if (models && models.length > 0) {
            providerGroups.push({
              provider,
              displayName: getProviderDisplayName(provider),
              models,
            });
          }
        }

        setGroups(providerGroups);
        setFlatModels(modelOptions);
        setCurrentModelIndex(currentIndex);
        setSelectedIndex(Math.max(0, currentIndex));
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load models");
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (key.return) {
      if (flatModels[selectedIndex]) {
        onSelect(flatModels[selectedIndex]);
      }
      return;
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(flatModels.length - 1, prev + 1));
    }
  });

  if (loading) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={CF_COLORS.orange}
        paddingX={1}
      >
        <Text color={CF_COLORS.orange}>Loading available models...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="red"
        paddingX={1}
      >
        <Text color="red">{error}</Text>
        <Text color="gray">Press Esc to close</Text>
      </Box>
    );
  }

  // Render models grouped by provider
  let globalIndex = 0;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={CF_COLORS.orange}
      paddingX={1}
    >
      <Box marginBottom={1}>
        <Text color={CF_COLORS.orange} bold>
          Select Model
        </Text>
        <Text color="gray"> (↑/↓ navigate, Enter select, Esc cancel)</Text>
      </Box>

      {groups.map((group) => (
        <Box key={group.provider} flexDirection="column" marginBottom={1}>
          {/* Provider header */}
          <Box>
            <Text color={CF_COLORS.lightOrange} bold>
              ── {group.displayName} ──
            </Text>
            {group.provider === "cloudflare-workers" && (
              <Text color="gray"> (单一模型)</Text>
            )}
          </Box>

          {/* Models in this provider */}
          {group.models.map((model) => {
            const currentGlobalIndex = globalIndex++;
            const isSelected = currentGlobalIndex === selectedIndex;
            const isCurrent = currentGlobalIndex === currentModelIndex;

            return (
              <Box key={model.id} paddingLeft={2}>
                <Text
                  color={
                    isSelected
                      ? CF_COLORS.orange
                      : isCurrent
                        ? CF_COLORS.lightOrange
                        : "white"
                  }
                  bold={isSelected}
                >
                  {isSelected ? "▸ " : "  "}
                  {model.name}
                  {isCurrent && (
                    <Text color="gray"> (current)</Text>
                  )}
                </Text>
              </Box>
            );
          })}
        </Box>
      ))}

      <Box marginTop={1} borderStyle="single" borderColor="gray" paddingX={1}>
        <Text color="gray" dimColor>
          Configure providers in ~/.cfcoderrc or via environment variables
        </Text>
      </Box>
    </Box>
  );
};

export { ModelSelector };
export type { ModelOption };
