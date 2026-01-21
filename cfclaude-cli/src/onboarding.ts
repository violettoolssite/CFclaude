import * as fs from "fs";
import * as path from "path";

import chalk from "chalk";
import { setConfigFilePermissions } from "core/util/paths.js";

import { AuthConfig, login } from "./auth/workos.js";
import {
  hasWorkerUrl,
  isValidWorkerUrl,
  loadCFConfig,
  saveCFConfig,
} from "./cfConfigLoader.js";
import { getApiClient } from "./config.js";
import { loadConfiguration } from "./configLoader.js";
import { env } from "./env.js";
import {
  getApiKeyValidationError,
  isValidAnthropicApiKey,
} from "./util/apiKeyValidation.js";
import { question, questionWithChoices } from "./util/prompt.js";
import { updateAnthropicModelInYaml } from "./util/yamlConfigUpdater.js";

const CONFIG_PATH = path.join(env.continueHome, "config.yaml");

export async function checkHasAcceptableModel(
  configPath: string,
): Promise<boolean> {
  try {
    if (!fs.existsSync(configPath)) {
      return false;
    }

    const content = fs.readFileSync(configPath, "utf8");
    return content.includes("claude");
  } catch {
    return false;
  }
}

export async function createOrUpdateConfig(apiKey: string): Promise<void> {
  const configDir = path.dirname(CONFIG_PATH);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const existingContent = fs.existsSync(CONFIG_PATH)
    ? fs.readFileSync(CONFIG_PATH, "utf8")
    : "";

  const updatedContent = updateAnthropicModelInYaml(existingContent, apiKey);
  fs.writeFileSync(CONFIG_PATH, updatedContent);
  setConfigFilePermissions(CONFIG_PATH);
}

export async function runOnboardingFlow(
  configPath: string | undefined,
): Promise<boolean> {
  // Step 1: Check if --config flag is provided
  if (configPath !== undefined) {
    return false;
  }

  // Step 2: Check if CF Coder provider is configured via environment variables
  const config = loadCFConfig();
  const envProvider = process.env.CF_CODER_PROVIDER;
  
  // Check if we have valid provider configuration from environment
  if (envProvider) {
    const provider = config.currentProvider;
    if (provider === "openai" && config.openai.enabled && config.openai.apiKey) {
      console.log(
        chalk.hex("#F6821F")(`✓ Using OpenAI-compatible provider: ${envProvider}`),
      );
      console.log(
        chalk.gray(`  Model: ${config.currentModel}`),
      );
      return true;
    }
    if (provider === "anthropic" && config.anthropic.enabled && config.anthropic.apiKey) {
      console.log(
        chalk.hex("#F6821F")(`✓ Using Anthropic provider`),
      );
      console.log(
        chalk.gray(`  Model: ${config.currentModel}`),
      );
      return true;
    }
  }

  // Step 3: Check if Workers URL is already configured
  if (hasWorkerUrl()) {
    console.log(
      chalk.hex("#F6821F")(`✓ Using Cloudflare Workers AI at: ${config.workerUrl}`),
    );
    return true;
  }

  // Step 3: Check if we're in a test/CI environment
  const isTestEnv =
    process.env.NODE_ENV === "test" ||
    process.env.CI === "true" ||
    process.env.VITEST === "true" ||
    process.env.GITHUB_ACTIONS === "true" ||
    !process.stdin.isTTY;

  if (isTestEnv) {
    // In test environment, allow default config
    return false;
  }

  // Step 4: CF Coder specific onboarding - prompt for Workers URL
  console.log(
    chalk.hex("#F6821F")("\n╭─────────────────────────────────────────────────╮"),
  );
  console.log(
    chalk.hex("#F6821F")("│") +
      chalk.bold.hex("#F6821F")("  Welcome to CF Coder! ") +
      "                     " +
      chalk.hex("#F6821F")("│"),
  );
  console.log(
    chalk.hex("#F6821F")("│") +
      chalk.gray("  Cloudflare-powered AI coding assistant     ") +
      chalk.hex("#F6821F")("│"),
  );
  console.log(
    chalk.hex("#F6821F")("╰─────────────────────────────────────────────────╯\n"),
  );

  console.log(chalk.hex("#F6821F")("CF Coder requires a Cloudflare Worker URL."));
  console.log(
    chalk.gray(
      "This Worker connects CF Coder to Cloudflare Workers AI.\n",
    ),
  );
  console.log(chalk.white("📚 For setup instructions, see:"));
  console.log(
    chalk.hex("#F6821F")("   ./cf-coder/WORKERS-AI-CONFIG.md\n"),
  );

  const workerUrl = await question(
    chalk.white("Enter your Cloudflare Worker URL: "),
  );

  if (!isValidWorkerUrl(workerUrl)) {
    throw new Error(
      `Invalid Worker URL. Please provide a valid URL like https://cf-coder-ai.your-account.workers.dev`,
    );
  }

  // Save the Workers URL
  saveCFConfig({ workerUrl });

  console.log(
    chalk.hex("#F6821F")(`\n✓ Configuration saved successfully!`),
  );
  console.log(
    chalk.gray(`  Worker URL: ${workerUrl}`),
  );
  console.log(
    chalk.gray(`  Config file: ~/.cfcoderrc\n`),
  );

  return true;
}

export async function isFirstTime(): Promise<boolean> {
  return !fs.existsSync(path.join(env.continueHome, ".onboarding_complete"));
}

export async function markOnboardingComplete(): Promise<void> {
  const flagPath = path.join(env.continueHome, ".onboarding_complete");
  const flagDir = path.dirname(flagPath);

  if (!fs.existsSync(flagDir)) {
    fs.mkdirSync(flagDir, { recursive: true });
  }

  fs.writeFileSync(flagPath, new Date().toISOString());
}

export async function initializeWithOnboarding(
  authConfig: AuthConfig,
  configPath: string | undefined,
) {
  const firstTime = await isFirstTime();

  if (configPath !== undefined) {
    // throw an early error is configPath is invalid or has errors
    try {
      await loadConfiguration(
        authConfig,
        configPath,
        getApiClient(authConfig?.accessToken),
        [],
        false,
      );
    } catch (errorMessage) {
      throw new Error(
        `Failed to load config from "${configPath}": ${errorMessage}`,
      );
    }
  }

  if (!firstTime) return;

  const wasOnboarded = await runOnboardingFlow(configPath);
  if (wasOnboarded) {
    await markOnboardingComplete();
  }
}
