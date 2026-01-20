import { customFetch, rerank } from "../util.js";
export class JinaApi {
    config;
    apiBase = "https://api.jina.ai/v1/";
    constructor(config) {
        this.config = config;
        this.apiBase = config.apiBase ?? this.apiBase;
    }
    async chatCompletionNonStream(body) {
        throw new Error("Method not implemented.");
    }
    async *chatCompletionStream(body) {
        throw new Error("Method not implemented.");
    }
    async completionNonStream(body) {
        throw new Error("Method not implemented.");
    }
    async *completionStream(body) {
        throw new Error("Method not implemented.");
    }
    async *fimStream(body) {
        throw new Error("Method not implemented.");
    }
    async embed(body) {
        throw new Error("Method not implemented.");
    }
    async rerank(body) {
        const endpoint = new URL("rerank", this.apiBase);
        const response = await customFetch(this.config.requestOptions)(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-api-key": this.config.apiKey ?? "",
                Authorization: `Bearer ${this.config.apiKey}`,
            },
        });
        const data = (await response.json());
        return rerank({
            model: body.model,
            usage: {
                total_tokens: 0,
            },
            data: data.results.map((result) => result.relevance_score),
        });
    }
    list() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=Jina.js.map