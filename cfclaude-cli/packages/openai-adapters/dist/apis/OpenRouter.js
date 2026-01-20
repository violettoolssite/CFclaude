import { OpenAIApi } from "./OpenAI.js";
import { applyAnthropicCachingToOpenRouterBody } from "./OpenRouterCaching.js";
export class OpenRouterApi extends OpenAIApi {
    constructor(config) {
        super({
            ...config,
            apiBase: config.apiBase ?? "https://openrouter.ai/api/v1/",
        });
    }
    isAnthropicModel(model) {
        if (!model) {
            return false;
        }
        const modelLower = model.toLowerCase();
        return modelLower.includes("claude");
    }
    modifyChatBody(body) {
        const modifiedBody = super.modifyChatBody(body);
        if (!this.isAnthropicModel(modifiedBody.model)) {
            return modifiedBody;
        }
        applyAnthropicCachingToOpenRouterBody(modifiedBody, this.config.cachingStrategy ?? "systemAndTools");
        return modifiedBody;
    }
}
export default OpenRouterApi;
//# sourceMappingURL=OpenRouter.js.map