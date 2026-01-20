/**
 * CF Coder Configuration Loader
 * Supports multiple providers: Cloudflare Workers AI, OpenAI-compatible, Anthropic
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as yaml from "yaml";

export type ProviderType = "cloudflare-workers" | "openai" | "anthropic";

/**
 * Normalize provider name from various formats to ProviderType
 * Maps OpenAI-compatible providers (nvidia, deepseek, kimi, etc.) to "openai"
 * Maps Anthropic-compatible providers to "anthropic"
 * Maps Cloudflare to "cloudflare-workers"
 */
function normalizeProvider(provider: string): ProviderType {
  const normalized = provider.toLowerCase().trim();
  switch (normalized) {
    // Cloudflare Workers AI
    case "cloudflare":
    case "cloudflare-workers":
    case "cloudflare_workers":
      return "cloudflare-workers";

    // Anthropic and Anthropic-compatible
    case "anthropic":
      return "anthropic";

    // OpenAI and OpenAI-compatible providers
    case "openai":
    case "nvidia":
    case "deepseek":
    case "kimi":
    case "doubao":
    case "qwen":
    case "zhipu":
    case "modelscope":
    case "recommended":
      return "openai";

    default:
      // For unknown providers, default to openai (most common)
      return "openai";
  }
}

export interface ProviderConfig {
  enabled: boolean;
  apiKey?: string;
  apiBase?: string;
  models: string[];
}

export interface CFCoderConfig {
  // Current provider selection
  currentProvider: ProviderType;
  currentModel: string;

  // Cloudflare Workers AI config
  cloudflareWorkers: {
    enabled: boolean;
    workerUrl: string;
    model: string;
  };

  // OpenAI config
  openai: {
    enabled: boolean;
    apiKey: string;
    apiBase?: string;
    models: string[];
  };

  // Anthropic config
  anthropic: {
    enabled: boolean;
    apiKey: string;
    apiBase?: string;
    models: string[];
  };

  // General settings
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  timeout?: number;
  debug?: boolean;

  // Legacy support
  workerUrl?: string;
}

// Default OpenAI models
const DEFAULT_OPENAI_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-4",
  "gpt-3.5-turbo",
  "o1",
  "o1-mini",
  "o1-preview",
  "o3-mini",
];

// Default Anthropic models
const DEFAULT_ANTHROPIC_MODELS = [
  "claude-sonnet-4-20250514",
  "claude-opus-4-20250514",
  "claude-3-7-sonnet-20250219",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-haiku-20241022",
  "claude-3-opus-20240229",
  "claude-3-sonnet-20240229",
  "claude-3-haiku-20240307",
];

const DEFAULT_CONFIG: CFCoderConfig = {
  currentProvider: "cloudflare-workers",
  currentModel: "@cf/meta/llama-3.1-8b-instruct",

  cloudflareWorkers: {
    enabled: true,
    workerUrl: "",
    model: "@cf/meta/llama-3.1-8b-instruct",
  },

  openai: {
    enabled: false,
    apiKey: "",
    models: DEFAULT_OPENAI_MODELS,
  },

  anthropic: {
    enabled: false,
    apiKey: "",
    models: DEFAULT_ANTHROPIC_MODELS,
  },

  temperature: 0.7,
  max_tokens: 4096,
  stream: true,
  timeout: 120000,
  debug: false,
};

/**
 * Get possible config file paths in order of precedence
 */
function getConfigPaths(): string[] {
  const homeDir = os.homedir();
  return [
    path.join(homeDir, ".cfcoderrc"),
    path.join(homeDir, ".cf-coder", "config.yaml"),
    path.join(process.cwd(), ".cfcoderrc"),
    path.join(process.cwd(), ".cf-coder", "config.yaml"),
  ];
}

/**
 * Load CF Coder configuration from file or environment
 */
export function loadCFConfig(): CFCoderConfig {
  // Check environment variables first
  const envWorkerUrl = process.env.CF_CODER_WORKER_URL;
  const envOpenAIKey = process.env.CF_CODER_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const envOpenAIBase = process.env.OPENAI_BASE_URL;
  const envAnthropicKey = process.env.CF_CODER_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const envAnthropicBase = process.env.ANTHROPIC_BASE_URL;
  const envProvider = process.env.CF_CODER_PROVIDER as ProviderType | undefined;
  const envModel = process.env.CF_CODER_MODEL;
  const envDebug = process.env.CF_CODER_DEBUG === "true";

  // Try to load from config files
  let fileConfig: Partial<CFCoderConfig> = {};
  for (const configPath of getConfigPaths()) {
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, "utf8");
        const parsed = yaml.parse(content) as Partial<CFCoderConfig>;
        fileConfig = { ...fileConfig, ...parsed };
        break; // Use first found config
      } catch (error) {
        console.warn(`Warning: Failed to parse config at ${configPath}:`, error);
      }
    }
  }

  // Handle legacy workerUrl field
  if (fileConfig.workerUrl && !fileConfig.cloudflareWorkers?.workerUrl) {
    fileConfig.cloudflareWorkers = {
      ...DEFAULT_CONFIG.cloudflareWorkers,
      ...fileConfig.cloudflareWorkers,
      workerUrl: fileConfig.workerUrl,
      enabled: true,
    };
  }

  // Merge configs: environment > file > defaults
  const config: CFCoderConfig = {
    ...DEFAULT_CONFIG,
    ...fileConfig,
    cloudflareWorkers: {
      ...DEFAULT_CONFIG.cloudflareWorkers,
      ...fileConfig.cloudflareWorkers,
    },
    openai: {
      ...DEFAULT_CONFIG.openai,
      ...fileConfig.openai,
    },
    anthropic: {
      ...DEFAULT_CONFIG.anthropic,
      ...fileConfig.anthropic,
    },
  };

  // Environment variables take highest priority
  // Only set if non-empty string (avoid empty string overrides)
  if (envWorkerUrl && envWorkerUrl.trim()) {
    config.cloudflareWorkers.workerUrl = envWorkerUrl.trim();
    config.cloudflareWorkers.enabled = true;
    // Legacy support
    config.workerUrl = envWorkerUrl.trim();
  }

  if (envOpenAIKey && envOpenAIKey.trim()) {
    config.openai.apiKey = envOpenAIKey.trim();
    config.openai.enabled = true;
  }

  if (envOpenAIBase && envOpenAIBase.trim()) {
    config.openai.apiBase = envOpenAIBase.trim();
  }

  if (envAnthropicKey && envAnthropicKey.trim()) {
    config.anthropic.apiKey = envAnthropicKey.trim();
    config.anthropic.enabled = true;
  }

  if (envAnthropicBase && envAnthropicBase.trim()) {
    config.anthropic.apiBase = envAnthropicBase.trim();
  }

  if (envProvider && envProvider.trim()) {
    config.currentProvider = normalizeProvider(envProvider);
  }

  if (envModel && envModel.trim()) {
    config.currentModel = envModel.trim();
  }

  if (envDebug) {
    config.debug = envDebug;
  }

  // Legacy workerUrl support
  if (!config.workerUrl && config.cloudflareWorkers.workerUrl) {
    config.workerUrl = config.cloudflareWorkers.workerUrl;
  }

  return config;
}

/**
 * Save CF Coder configuration to file
 */
export function saveCFConfig(config: Partial<CFCoderConfig>): void {
  const homeDir = os.homedir();
  const configPath = path.join(homeDir, ".cfcoderrc");
  const configDir = path.dirname(configPath);

  // Ensure directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Load existing config if any
  let existing: Partial<CFCoderConfig> = {};
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf8");
      existing = yaml.parse(content) as Partial<CFCoderConfig>;
    } catch (error) {
      console.warn("Warning: Could not read existing config, creating new one");
    }
  }

  // Merge and save
  const merged = { ...existing, ...config };
  const yamlContent = yaml.stringify(merged);

  fs.writeFileSync(configPath, yamlContent, "utf8");

  // Set proper permissions (read/write for owner only)
  try {
    fs.chmodSync(configPath, 0o600);
  } catch (error) {
    // Ignore permission errors on Windows
  }
}

/**
 * Check if Workers URL is configured
 */
export function hasWorkerUrl(): boolean {
  const config = loadCFConfig();
  return !!config.cloudflareWorkers.workerUrl && config.cloudflareWorkers.workerUrl !== "";
}

/**
 * Get configured Workers URL
 */
export function getWorkerUrl(): string | null {
  const config = loadCFConfig();
  return config.cloudflareWorkers.workerUrl || config.workerUrl || null;
}

/**
 * Validate Workers URL format
 */
export function isValidWorkerUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      parsed.hostname.length > 0
    );
  } catch {
    return false;
  }
}

/**
 * Get list of enabled providers
 */
export function getEnabledProviders(): ProviderType[] {
  const config = loadCFConfig();
  const providers: ProviderType[] = [];

  if (config.cloudflareWorkers.enabled && config.cloudflareWorkers.workerUrl) {
    providers.push("cloudflare-workers");
  }

  if (config.openai.enabled && config.openai.apiKey) {
    providers.push("openai");
  }

  if (config.anthropic.enabled && config.anthropic.apiKey) {
    providers.push("anthropic");
  }

  return providers;
}

/**
 * Get models for a specific provider
 */
export function getModelsForProvider(provider: ProviderType): string[] {
  const config = loadCFConfig();

  switch (provider) {
    case "cloudflare-workers":
      return [config.cloudflareWorkers.model];
    case "openai":
      return config.openai.models || DEFAULT_OPENAI_MODELS;
    case "anthropic":
      return config.anthropic.models || DEFAULT_ANTHROPIC_MODELS;
    default:
      return [];
  }
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: ProviderType): string {
  switch (provider) {
    case "cloudflare-workers":
      return "Cloudflare Workers AI";
    case "openai":
      return "OpenAI";
    case "anthropic":
      return "Anthropic";
    default:
      return provider;
  }
}
