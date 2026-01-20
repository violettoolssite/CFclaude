/**
 * CF Coder LLM Adapters
 * Supports multiple providers: Cloudflare Workers AI, OpenAI, Anthropic
 */

import { BaseLlmApi, constructLlmApi } from "@continuedev/openai-adapters";
import {
  loadCFConfig,
  ProviderType,
  getProviderDisplayName,
} from "./cfConfigLoader.js";

export interface ModelInfo {
  provider: ProviderType;
  model: string;
  name: string;
}

/**
 * Create an LLM adapter for the current provider
 */
export function createCFWorkersLlmApi(): BaseLlmApi | null {
  const config = loadCFConfig();
  return createLlmApiForProvider(config.currentProvider, config.currentModel);
}

/**
 * Create an LLM adapter for a specific provider and model
 * Returns null if provider credentials are not configured
 */
export function createLlmApiForProvider(
  provider: ProviderType,
  model: string
): BaseLlmApi | null {
  const config = loadCFConfig();

  try {
    switch (provider) {
      case "cloudflare-workers":
        return createCloudflareWorkersApi(config);
      case "openai":
        return createOpenAIApi(config, model);
      case "anthropic":
        return createAnthropicApi(config, model);
      default:
        console.error(`Unknown provider: ${provider}`);
        return null;
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
 * Create OpenAI API adapter
 */
function createOpenAIApi(
  config: ReturnType<typeof loadCFConfig>,
  model: string
): BaseLlmApi | null {
  if (!config.openai.apiKey) {
    throw new Error(
      "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable or configure in ~/.cfcoderrc"
    );
  }

  const llmApi = constructLlmApi({
    provider: "openai",
    apiKey: config.openai.apiKey,
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
 * Create Anthropic API adapter
 */
function createAnthropicApi(
  config: ReturnType<typeof loadCFConfig>,
  model: string
): BaseLlmApi | null {
  if (!config.anthropic.apiKey) {
    throw new Error(
      "Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable or configure in ~/.cfcoderrc"
    );
  }

  const llmApi = constructLlmApi({
    provider: "anthropic",
    apiKey: config.anthropic.apiKey,
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
