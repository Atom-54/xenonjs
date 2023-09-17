export const validateCompletionRequest = (request) => {
    return request;
    // const validation = completionRequest.safeParse(request);
    // if (validation.success)
    //     return validation.data;
    // throw formatZodError({
    //     name: "CompletionRequest",
    //     validator: completionRequest,
    //     error: validation.error,
    // });
};

export const validateChatCompletionRequest = (request) => {
    return request;
    // const validation = chatCompletionRequest.safeParse(request);
    // if (validation.success)
    //     return validation.data;
    // throw formatZodError({
    //     name: "ChatCompletionRequest",
    //     validator: chatCompletionRequest,
    //     error: validation.error,
    // });
};

export const validateEmbeddingRequest = (request) => {
    return request;
    // const validation = embeddingRequest.safeParse(request);
    // if (validation.success)
    //     return validation.data;
    // throw formatZodError({
    //     name: "EmbeddingRequest",
    //     validator: embeddingRequest,
    //     error: validation.error,
    // });
};
