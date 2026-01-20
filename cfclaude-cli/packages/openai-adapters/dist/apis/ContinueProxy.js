import { OpenAIApi } from "./OpenAI.js";
export class ContinueProxyApi extends OpenAIApi {
    // The apiKey and apiBase are set to the values for the proxy,
    // but we need to keep track of the actual values that the proxy will use
    // to call whatever LLM API is chosen
    actualApiBase;
    // Contains extra properties that we pass along to the proxy. Originally from `env` property on LLMOptions
    configEnv;
    // Store the continue proxy config separately
    continueProxyConfig;
    constructor(config) {
        // Convert ContinueProxyConfigSchema to OpenAIConfigSchema format
        const openaiConfig = {
            provider: "openai",
            apiKey: config.apiKey,
            apiBase: config.env?.proxyUrl
                ? new URL("model-proxy/v1/", config.env?.proxyUrl).toString()
                : "https://api.continue.dev/model-proxy/v1/",
            requestOptions: config.requestOptions,
        };
        super(openaiConfig);
        this.continueProxyConfig = config;
        this.configEnv = config.env;
        this.actualApiBase = config.apiBase;
    }
    extraBodyProperties() {
        const continueProperties = {
            apiKeyLocation: this.continueProxyConfig.env?.apiKeyLocation,
            envSecretLocations: this.continueProxyConfig.env?.envSecretLocations,
            apiBase: this.actualApiBase,
            orgScopeId: this.continueProxyConfig.env?.orgScopeId ?? null,
            env: this.configEnv,
        };
        return {
            continueProperties,
        };
    }
    modifyBodyWithContinueProperties(body) {
        return {
            ...body,
            ...this.extraBodyProperties(),
        };
    }
    modifyChatBody(body) {
        // First apply OpenAI-specific modifications
        const modifiedBody = super.modifyChatBody(body);
        // Then add Continue properties
        return this.modifyBodyWithContinueProperties(modifiedBody);
    }
    modifyCompletionBody(body) {
        return this.modifyBodyWithContinueProperties(body);
    }
    modifyFimBody(body) {
        const modifiedBody = super.modifyFimBody(body);
        return this.modifyBodyWithContinueProperties(modifiedBody);
    }
    getHeaders() {
        return {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-key": this.continueProxyConfig.apiKey ?? "",
            Authorization: `Bearer ${this.continueProxyConfig.apiKey}`,
        };
    }
    modifyEmbedBody(body) {
        return this.modifyBodyWithContinueProperties(body);
    }
    modifyRerankBody(body) {
        return {
            ...body,
            ...this.extraBodyProperties(),
        };
    }
}
//# sourceMappingURL=ContinueProxy.js.map