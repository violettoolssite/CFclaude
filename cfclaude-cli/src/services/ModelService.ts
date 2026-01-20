import { AssistantUnrolled, ModelConfig } from "@continuedev/config-yaml";

import { AuthConfig, getModelName } from "../auth/workos.js";
import { createLlmApi, getLlmApi } from "../config.js";
import {
  createCFWorkersLlmApi,
  createLlmApiForProvider,
  getModelDisplayName,
} from "../cfWorkersAdapter.js";
import {
  loadCFConfig,
  saveCFConfig,
  getEnabledProviders,
  getModelsForProvider,
  getProviderDisplayName,
  ProviderType,
} from "../cfConfigLoader.js";
import { logger } from "../util/logger.js";

import { BaseService, ServiceWithDependencies } from "./BaseService.js";
import { AgentFileServiceState, ModelServiceState } from "./types.js";

export interface AvailableModel {
  provider: ProviderType;
  model: string;
  name: string;
  index: number;
}

/**
 * Service for managing LLM and model state
 * Supports multiple providers: Cloudflare Workers AI, OpenAI, Anthropic
 */
export class ModelService
  extends BaseService<ModelServiceState>
  implements ServiceWithDependencies
{
  private availableModels: AvailableModel[] = [];
  private assistant: AssistantUnrolled | null = null;
  private authConfig: AuthConfig | null = null;

  constructor() {
    super("ModelService", {
      llmApi: null,
      model: null,
      assistant: null,
      authConfig: null,
    });
  }

  /**
   * Declare dependencies on other services
   */
  getDependencies(): string[] {
    return ["auth", "config", "agentFile"];
  }

  /**
   * Initialize the model service
   * CF Coder: Supports multiple providers
   */
  async doInitialize(
    assistant: AssistantUnrolled,
    authConfig: AuthConfig,
    agentFileServiceState: AgentFileServiceState | undefined,
  ): Promise<ModelServiceState> {
    const config = loadCFConfig();

    logger.debug("ModelService.doInitialize called - CF Coder multi-provider mode", {
      hasAssistant: !!assistant,
      hasAuthConfig: !!authConfig,
      currentProvider: config.currentProvider,
      currentModel: config.currentModel,
      cloudflareEnabled: config.cloudflareWorkers.enabled,
      cloudflareWorkerUrl: config.cloudflareWorkers.workerUrl ? "set" : "not set",
      openaiEnabled: config.openai.enabled,
      openaiApiKey: config.openai.apiKey ? "set" : "not set",
      anthropicEnabled: config.anthropic.enabled,
      anthropicApiKey: config.anthropic.apiKey ? "set" : "not set",
    });

    // Build available models list
    this.buildAvailableModelsList();

    logger.debug("ModelService available models", {
      currentProvider: config.currentProvider,
      currentModel: config.currentModel,
      availableModelsCount: this.availableModels.length,
      enabledProviders: getEnabledProviders(),
    });

    // Create LLM API for current provider
    const llmApi = createCFWorkersLlmApi();

    if (!llmApi) {
      const errorMsg = this.getProviderConfigError(config.currentProvider, config);
      logger.error("Failed to initialize LLM adapter", {
        provider: config.currentProvider,
        error: errorMsg,
      });
      throw new Error(errorMsg);
    }

    // Create model config for current selection
    const currentModel: ModelConfig = {
      provider: config.currentProvider,
      model: config.currentModel,
      name: getModelDisplayName(config.currentProvider, config.currentModel),
      title: getModelDisplayName(config.currentProvider, config.currentModel),
      apiKey: "configured",
      contextLength: 4096,
    } as any;

    this.assistant = assistant;
    this.authConfig = authConfig;

    logger.debug("ModelService initialized successfully", {
      provider: config.currentProvider,
      model: config.currentModel,
    });

    return {
      llmApi,
      model: currentModel,
      assistant,
      authConfig,
    };
  }

  /**
   * Get a helpful error message for provider configuration issues
   */
  private getProviderConfigError(provider: ProviderType, config: ReturnType<typeof loadCFConfig>): string {
    switch (provider) {
      case "cloudflare-workers":
        if (!config.cloudflareWorkers.workerUrl) {
          return "Cloudflare Worker URL not configured. Please set CF_CODER_WORKER_URL environment variable.";
        }
        return "Failed to create Cloudflare Workers AI adapter.";
      case "openai":
        if (!config.openai.apiKey) {
          return "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.";
        }
        return "Failed to create OpenAI adapter.";
      case "anthropic":
        if (!config.anthropic.apiKey) {
          return "Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable.";
        }
        return "Failed to create Anthropic adapter.";
      default:
        return `Unknown provider: ${provider}`;
    }
  }

  /**
   * Build the list of available models from all enabled providers
   */
  private buildAvailableModelsList(): void {
    this.availableModels = [];
    let index = 0;

    const enabledProviders = getEnabledProviders();

    // If no providers enabled, try to use Cloudflare Workers AI if configured
    if (enabledProviders.length === 0) {
      const config = loadCFConfig();
      if (config.cloudflareWorkers.workerUrl) {
        this.availableModels.push({
          provider: "cloudflare-workers",
          model: config.cloudflareWorkers.model,
          name: "Cloudflare Workers AI",
          index: 0,
        });
      }
      return;
    }

    for (const provider of enabledProviders) {
      const models = getModelsForProvider(provider);

      for (const model of models) {
        this.availableModels.push({
          provider,
          model,
          name:
            provider === "cloudflare-workers"
              ? "Cloudflare Workers AI"
              : model,
          index: index++,
        });
      }
    }
  }

  /**
   * Override isReady to check for required state
   */
  override isReady(): boolean {
    return (
      super.isReady() &&
      this.currentState.llmApi !== null &&
      this.currentState.model !== null
    );
  }

  /**
   * Get model information for display
   */
  getModelInfo(): { provider: string; name: string } | null {
    if (!this.currentState.model) {
      return null;
    }

    return {
      provider: this.currentState.model.provider,
      name: (this.currentState.model as any).name || "unnamed",
    };
  }

  /**
   * Get list of available chat models grouped by provider
   */
  getAvailableChatModels(): AvailableModel[] {
    // Rebuild list to ensure it's current
    this.buildAvailableModelsList();
    return this.availableModels;
  }

  /**
   * Get available models grouped by provider for UI display
   */
  getModelsGroupedByProvider(): Map<ProviderType, AvailableModel[]> {
    this.buildAvailableModelsList();
    const grouped = new Map<ProviderType, AvailableModel[]>();

    for (const model of this.availableModels) {
      const existing = grouped.get(model.provider) || [];
      existing.push(model);
      grouped.set(model.provider, existing);
    }

    return grouped;
  }

  /**
   * Switch to a different chat model by index
   */
  async switchModel(modelIndex: number): Promise<ModelServiceState> {
    this.buildAvailableModelsList();

    if (modelIndex < 0 || modelIndex >= this.availableModels.length) {
      throw new Error(`Invalid model index: ${modelIndex}`);
    }

    const selectedModel = this.availableModels[modelIndex];

    logger.debug("Switching model", {
      index: modelIndex,
      provider: selectedModel.provider,
      model: selectedModel.model,
    });

    // Create new LLM API for selected provider/model
    const llmApi = createLlmApiForProvider(
      selectedModel.provider,
      selectedModel.model
    );

    if (!llmApi) {
      throw new Error(
        `Failed to create LLM adapter for ${selectedModel.provider}`
      );
    }

    // Save the selection to config
    saveCFConfig({
      currentProvider: selectedModel.provider,
      currentModel: selectedModel.model,
    });

    // Update model config
    const modelConfig: ModelConfig = {
      provider: selectedModel.provider,
      model: selectedModel.model,
      name: selectedModel.name,
      title: selectedModel.name,
      apiKey: "configured",
      contextLength: 4096,
    } as any;

    // Update state
    this.currentState = {
      ...this.currentState,
      llmApi,
      model: modelConfig,
    };

    return this.currentState;
  }

  /**
   * Switch to a specific provider and model by name
   */
  async switchToModel(
    provider: ProviderType,
    model: string
  ): Promise<ModelServiceState> {
    this.buildAvailableModelsList();

    const modelInfo = this.availableModels.find(
      (m) => m.provider === provider && m.model === model
    );

    if (!modelInfo) {
      throw new Error(`Model not found: ${provider}/${model}`);
    }

    return this.switchModel(modelInfo.index);
  }

  /**
   * Get current model index
   */
  getCurrentModelIndex(): number {
    const config = loadCFConfig();
    this.buildAvailableModelsList();

    return this.availableModels.findIndex(
      (m) =>
        m.provider === config.currentProvider &&
        m.model === config.currentModel
    );
  }

  /**
   * Get model index by name and provider
   */
  getModelIndexByName(modelName: string, provider?: string): number {
    this.buildAvailableModelsList();

    return this.availableModels.findIndex((model) => {
      if (provider) {
        return model.name === modelName && model.provider === provider;
      }
      return model.name === modelName || model.model === modelName;
    });
  }

  static getSubagentModels(modelState: ModelServiceState) {
    if (!modelState.assistant) {
      return [];
    }
    const subagentModels = modelState.assistant.models
      ?.filter((model) => !!model)
      .filter((model) => !!model.name)
      .filter((model) => model.roles?.includes("subagent"))
      .filter((model) => !!model.chatOptions?.baseSystemMessage);

    if (!subagentModels) {
      return [];
    }
    return subagentModels?.map((model) => ({
      llmApi: createLlmApi(model, modelState.authConfig),
      model,
      assistant: modelState.assistant,
      authConfig: modelState.authConfig,
    }));
  }
}
