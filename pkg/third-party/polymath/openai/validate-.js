import { chatCompletionRequest, completionRequest, embeddingRequest, } from "./schemas.js";
const getDescription = (validator, path) => {
    let cursor = validator.shape;
    path.forEach((key) => (cursor = cursor[key]));
    return cursor.description;
};
export class ValidationError extends Error {
    issues;
    constructor(data) {
        super(`Validation error in ${data.name}`);
        this.name = "ValidationError";
        this.issues = data.error.issues.map((issue) => ({
            message: `"${issue.path.join("/")}" ${issue.message}`,
            description: getDescription(data.validator, issue.path),
        }));
    }
    toString() {
        return `${this.message}:\n${this.issues
            .map((issue) => `  - ${issue.message}\n      ${issue.description}\n`)
            .join("\n")}`;
    }
}
const formatZodError = (data) => {
    return new ValidationError(data);
};
export const validateCompletionRequest = (request) => {
    const validation = completionRequest.safeParse(request);
    if (validation.success)
        return validation.data;
    throw formatZodError({
        name: "CompletionRequest",
        validator: completionRequest,
        error: validation.error,
    });
};
export const validateChatCompletionRequest = (request) => {
    const validation = chatCompletionRequest.safeParse(request);
    if (validation.success)
        return validation.data;
    throw formatZodError({
        name: "ChatCompletionRequest",
        validator: chatCompletionRequest,
        error: validation.error,
    });
};
export const validateEmbeddingRequest = (request) => {
    const validation = embeddingRequest.safeParse(request);
    if (validation.success)
        return validation.data;
    throw formatZodError({
        name: "EmbeddingRequest",
        validator: embeddingRequest,
        error: validation.error,
    });
};
