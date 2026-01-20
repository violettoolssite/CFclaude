import { AssistantUnrolled, ModelConfig } from "@continuedev/config-yaml";
import {
  BaseLlmApi,
  constructLlmApi,
  LLMConfig,
} from "@continuedev/openai-adapters";
import {
  Configuration,
  DefaultApi,
} from "@continuedev/sdk/dist/api/dist/index.js";

import {
  AuthConfig,
  getAccessToken,
  getOrganizationId,
} from "./auth/workos.js";
import { createCFWorkersLlmApi } from "./cfWorkersAdapter.js";
import { env } from "./env.js";
import { posthogService } from "./telemetry/posthogService.js";
import { getVersion } from "./version.js";

/**
 * Creates user-agent header value for CLI requests
 */
function getUserAgent(): string {
  const version = getVersion();
  return `CF-Coder/${version}`;
}

/**
 * Merges user-agent header into request options
 */
function mergeUserAgentIntoRequestOptions(
  requestOptions: ModelConfig["requestOptions"],
): ModelConfig["requestOptions"] {
  return {
    ...requestOptions,
    headers: {
      ...requestOptions?.headers,
      "user-agent": getUserAgent(),
      "x-continue-unique-id": posthogService.uniqueId,
    },
  };
}

/**
 * CF Coder: Creates an LLM API instance using Cloudflare Workers AI
 * Simplified version that only uses Workers URL (no API keys needed)
 */
export function createLlmApi(
  model: ModelConfig,
  authConfig: AuthConfig | null,
): BaseLlmApi | null {
  // CF Coder: Always use Cloudflare Workers AI adapter
  return createCFWorkersLlmApi();
}

export function getLlmApi(
  assistant: AssistantUnrolled,
  authConfig: AuthConfig,
): [BaseLlmApi, ModelConfig] {
  // CF Coder: Simplified - always use Workers AI
  const llmApi = createCFWorkersLlmApi();

  if (!llmApi) {
    throw new Error(
      "Failed to initialize Cloudflare Workers AI. Please check your Workers URL configuration.",
    );
  }

  // Create a dummy model config for compatibility
  const dummyModel: ModelConfig = {
    provider: "cloudflare-workers",
    model: "workers-ai",
  } as any;

  return [llmApi, dummyModel];
}

export function getApiClient(
  accessToken: string | undefined | null,
): DefaultApi {
  return new DefaultApi(
    new Configuration({
      basePath: env.apiBase.replace(/\/$/, ""),
      accessToken: accessToken ?? undefined,
    }),
  );
}
