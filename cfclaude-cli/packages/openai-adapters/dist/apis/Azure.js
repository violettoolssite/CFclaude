import { OpenAI } from "openai/index";
import { customFetch } from "../util.js";
import { OpenAIApi } from "./OpenAI.js";
export class AzureApi extends OpenAIApi {
    azureConfig;
    constructor(azureConfig) {
        super({
            ...azureConfig,
            provider: "openai",
        });
        this.azureConfig = azureConfig;
        const { baseURL, defaultQuery } = this._getAzureBaseURL(azureConfig);
        this.openai = new OpenAI({
            apiKey: azureConfig.apiKey,
            baseURL,
            fetch: customFetch(azureConfig.requestOptions),
            defaultQuery,
        });
    }
    /**
     * Default is `azure-openai`, but previously was `azure`
     * @param apiType
     * @returns
     */
    _isAzureOpenAI(apiType) {
        return apiType === "azure-openai" || apiType === "azure";
    }
    _getAzureBaseURL(config) {
        const url = new URL(this.apiBase);
        // Copy search params to separate object for OpenAI
        const queryParams = {};
        for (const [key, value] of url.searchParams.entries()) {
            queryParams[key] = value;
        }
        url.pathname = url.pathname.replace(/\/$/, ""); // Remove trailing slash if present
        url.search = ""; // Clear original search params
        // Default is `azure-openai` in docs, but previously was `azure`
        if (this._isAzureOpenAI(config.env?.apiType)) {
            if (!config.env?.deployment) {
                throw new Error("`env.deployment` is a required configuration property for Azure OpenAI");
            }
            if (!config.env?.apiVersion) {
                throw new Error("`env.apiVersion` is a required configuration property for Azure OpenAI");
            }
            const basePathname = `openai/deployments/${config.env.deployment}`;
            url.pathname =
                url.pathname === "/" ? basePathname : `${url.pathname}/${basePathname}`;
            queryParams["api-version"] = config.env.apiVersion;
        }
        return {
            baseURL: url.toString(),
            defaultQuery: queryParams,
        };
    }
    /**
     * Filters out empty text content parts from messages.
     *
     * Azure models may not support empty content parts, which can cause issues.
     * This function removes any text content parts that are empty or contain only whitespace.
     */
    _filterEmptyContentParts(body) {
        const result = { ...body };
        result.messages = result.messages.map((message) => {
            if (Array.isArray(message.content)) {
                const filteredContent = message.content.filter((part) => {
                    return !(part.type === "text" &&
                        (!part.text || part.text.trim() === ""));
                });
                return {
                    ...message,
                    content: filteredContent.length > 0 ? filteredContent : message.content,
                };
            }
            return message;
        });
        return result;
    }
    modifyChatBody(body) {
        let modifiedBody = super.modifyChatBody(body);
        modifiedBody = this._filterEmptyContentParts(modifiedBody);
        return modifiedBody;
    }
    async *chatCompletionStream(body, signal) {
        const response = await this.openai.chat.completions.create(this.modifyChatBody(body), { signal });
        for await (const result of response) {
            // Skip chunks with no choices (common with Azure content filtering)
            if (result.choices && result.choices.length > 0) {
                yield result;
            }
        }
    }
}
//# sourceMappingURL=Azure.js.map