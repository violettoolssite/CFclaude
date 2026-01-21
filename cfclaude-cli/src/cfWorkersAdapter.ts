/**
 * CF Coder LLM Adapters
 * Supports multiple providers: Cloudflare Workers AI, OpenAI, Anthropic
 * Uses apiFormat to determine which API format to use for each provider
 */

import { BaseLlmApi, constructLlmApi } from "@continuedev/openai-adapters";
import {
  loadCFConfig,
  ProviderType,
  ApiFormatType,
  getProviderDisplayName,
} from "./cfConfigLoader.js";

export interface ModelInfo {
  provider: ProviderType;
  model: string;
  name: string;
}

/**
 * Create an LLM adapter for the current provider
 * Uses apiFormat from config to determine which API format to use
 */
export function createCFWorkersLlmApi(): BaseLlmApi | null {
  const config = loadCFConfig();
  return createLlmApiForProvider(config.currentProvider, config.currentModel, config.apiFormat);
}

/**
 * Create an LLM adapter for a specific provider and model
 * Returns null if provider credentials are not configured
 * @param apiFormat - Override the API format (openai or anthropic)
 */
export function createLlmApiForProvider(
  provider: ProviderType,
  model: string,
  apiFormat?: ApiFormatType
): BaseLlmApi | null {
  const config = loadCFConfig();
  const format = apiFormat || config.apiFormat || "openai";

  try {
    // Cloudflare Workers always uses anthropic format (worker implements it)
    if (provider === "cloudflare-workers") {
      return createCloudflareWorkersApi(config);
    }
    
    // Use the specified API format to create the adapter
    if (format === "anthropic") {
      return createAnthropicFormatApi(config, model);
    } else {
      return createOpenAIFormatApi(config, model);
    }
  } catch (error) {
    console.error(`Failed to create LLM adapter for ${provider}:`, error);
    return null;
  }
}

/**
 * Create Cloudflare Workers AI adapter
 */
function createCloudflareWorkersApi(config: ReturnType<typeof loadCFConfig>): BaseLlmApi | null {
  if (!config.cloudflareWorkers.workerUrl) {
    throw new Error(
      "Cloudflare Worker URL not configured. Please configure your Worker URL in ~/.cfcoderrc"
    );
  }

  // User's worker.js implements Anthropic API format
  const llmApi = constructLlmApi({
    provider: "anthropic",
    apiKey: "dummy-key", // Worker doesn't need a real API key
    apiBase: config.cloudflareWorkers.workerUrl,
    requestOptions: {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: config.timeout || 120000,
    },
  });

  return llmApi || null;
}

/**
 * Create OpenAI format API adapter
 * Used for providers that use OpenAI-compatible API (qwen, nvidia, modelscope)
 */
function createOpenAIFormatApi(
  config: ReturnType<typeof loadCFConfig>,
  model: string
): BaseLlmApi | null {
  // Get API key from OpenAI config
  const apiKey = config.openai.apiKey;
  if (!apiKey) {
    throw new Error(
      "API key not configured. Please set OPENAI_API_KEY environment variable."
    );
  }

  const llmApi = constructLlmApi({
    provider: "openai",
    apiKey: apiKey,
    apiBase: config.openai.apiBase,
    model: model,
    requestOptions: {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: config.timeout || 120000,
    },
  });

  return llmApi || null;
}

/**
 * Create Anthropic format API adapter
 * Used for providers that use Anthropic-compatible API (deepseek, kimi, doubao, zhipu)
 */
function createAnthropicFormatApi(
  config: ReturnType<typeof loadCFConfig>,
  model: string
): BaseLlmApi | null {
  // Get API key from Anthropic config
  const apiKey = config.anthropic.apiKey;
  if (!apiKey) {
    throw new Error(
      "API key not configured. Please set ANTHROPIC_API_KEY environment variable."
    );
  }

  const llmApi = constructLlmApi({
    provider: "anthropic",
    apiKey: apiKey,
    apiBase: config.anthropic.apiBase,
    model: model,
    requestOptions: {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: config.timeout || 120000,
    },
  });

  return llmApi || null;
}

/**
 * Get current model info
 */
export function getCurrentModelInfo(): ModelInfo {
  const config = loadCFConfig();
  return {
    provider: config.currentProvider,
    model: config.currentModel,
    name: getModelDisplayName(config.currentProvider, config.currentModel),
  };
}

/**
 * Get display name for a model
 */
export function getModelDisplayName(provider: ProviderType, model: string): string {
  if (provider === "cloudflare-workers") {
    return "Cloudflare Workers AI";
  }
  return model;
}

/**
 * Check if a provider is available (configured with necessary credentials)
 */
export function isProviderAvailable(provider: ProviderType): boolean {
  const config = loadCFConfig();

  switch (provider) {
    case "cloudflare-workers":
      return config.cloudflareWorkers.enabled && !!config.cloudflareWorkers.workerUrl;
    case "openai":
      return config.openai.enabled && !!config.openai.apiKey;
    case "anthropic":
      return config.anthropic.enabled && !!config.anthropic.apiKey;
    default:
      return false;
  }
}
