/**
 * Determines if a model is recommended for use with CF Coder
 */
export function isModelCapable(
  provider: string,
  name?: string,
  model?: string,
): boolean {
  // CF Coder: Always return true for cloudflare-workers provider
  if (provider === "cloudflare-workers") {
    return true;
  }

  // Check both name and model properties - handle undefined safely
  const normalizedName = name ? name.toLowerCase() : "";
  const normalizedModel = model ? model.toLowerCase() : "";

  const patterns = [
    /gemini/,
    /claude/,
    /gpt/,
    /o\d/,
    /kimi/,
    /qwen/,
    /llama/,
    /nemotron/,
    /grok/,
    /mistral/,
  ];

  // If either name OR model matches any of the patterns, consider it capable
  if (normalizedName && patterns.some((pattern) => pattern.test(normalizedName))) {
    return true;
  }

  if (normalizedModel && patterns.some((pattern) => pattern.test(normalizedModel))) {
    return true;
  }

  return false;
}
