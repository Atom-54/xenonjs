import { validateChatCompletionRequest, validateCompletionRequest, validateEmbeddingRequest } from "./validate.js";
export class CompletionStreamer {
    writable;
    readable;
    controller = null;
    constructor() {
        this.writable = new WritableStream({
            write: (chunk) => this.write(chunk),
        });
        this.readable = new ReadableStream({
            start: (controller) => {
                this.controller = controller;
            },
        });
    }
    write(chunk) {
        const decoder = new TextDecoder();
        const s = decoder.decode(chunk);
        s.split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
            .forEach((line) => {
            const pos = line.indexOf(":");
            const name = line.substring(0, pos);
            if (name !== "data")
                return;
            const content = line.substring(pos + 1).trim();
            if (content.length == 0)
                return;
            if (content === "[DONE]") {
                this.controller?.close();
                return;
            }
            const parsed = JSON.parse(content);
            this.controller?.enqueue(parsed);
        });
    }
}
export class OpenAIRequest extends Request {
    #params;
    constructor(url, init, params) {
        init.body = JSON.stringify(params);
        super(url, init);
        this.#params = params;
    }
    prompt(prompt) {
        return new OpenAIRequest(this.url, { headers: this.headers, method: this.method }, { ...this.#params, prompt });
    }
}
class OpenAI {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    scaffold(url, params) {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
        };
        return new OpenAIRequest(url, { headers, method: "POST" }, params);
    }
    completion(params) {
        const url = "https://api.openai.com/v1/completions";
        const completionRequest = validateCompletionRequest(params);
        return this.scaffold(url, completionRequest);
    }
    chatCompletion(params) {
        const url = "https://api.openai.com/v1/chat/completions";
        const chatCompletionRequest = validateChatCompletionRequest(params);
        return this.scaffold(url, chatCompletionRequest);
    }
    embedding(params) {
        const url = "https://api.openai.com/v1/embeddings";
        const embeddingRequest = validateEmbeddingRequest(params);
        return this.scaffold(url, embeddingRequest);
    }
}
/**
 * Entry point for the OpenAI API. Call this function to start creating valid a
 *  valid `Request` object that could be used by directly by `fetch`.
 *
 * Typical usage:
 *
 * ```js
 * const response = await fetch(openai(key).completion({
 *   model: "text-davinci-003"
 *}));
 * ```
 *
 * @param apiKey Your OpenAI API key
 * @returns The `OpenAI` API object that allows choosing a kind of
 * request to make.
 */
export const openai = (apiKey) => {
    if (!apiKey) {
        throw new Error("OpenAI API key is required");
    }
    return new OpenAI(apiKey);
};
