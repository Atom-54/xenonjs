//import { z } from "zod";
/**
 * From https://github.com/openai/openai-node/blob/master/api.ts,
 */
// export const requestSharedBits = z.object({
//     // TODO: Reconcile with `completionModel`
//     /**
//      * ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.
//      */
//     model: z
//         .string()
//         .describe("ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them."),
//     /**
//      * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)
//      */
//     user: z
//         .string()
//         .optional()
//         .describe("A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)"),
// });
// /**
//  * From https://github.com/openai/openai-node/blob/master/api.ts,
//  * amalgamation of types
//  * `CreateCompletionRequest` and `CreateChatCompletionRequest`
//  */
// const completionRequestSharedBits = requestSharedBits.extend({
//     /**
//      * The maximum number of [tokens](https://platform.openai.com/tokenizer) to generate in the completion.  The token count of your prompt plus `max_tokens` cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
//      */
//     max_tokens: z
//         .number()
//         .int()
//         .max(4096)
//         .optional()
//         .default(1024) // Actual default is 16, but that's nonsense.
//         .describe("The maximum number of [tokens](https://platform.openai.com/tokenizer) to generate in the completion.  The token count of your prompt plus `max_tokens` cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096)."),
//     /**
//      * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.  We generally recommend altering this or `top_p` but not both.
//      */
//     temperature: z
//         .number()
//         .min(0.0)
//         .max(2.0)
//         .optional()
//         .default(1)
//         .describe("What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.  We generally recommend altering this or `top_p` but not both."),
//     /**
//      * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  We generally recommend altering this or `temperature` but not both.
//      */
//     top_p: z
//         .number()
//         .min(0.0)
//         .max(1.0)
//         .optional()
//         .default(1)
//         .describe("An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  We generally recommend altering this or `temperature` but not both."),
//     /**
//      * How many completions to generate for each prompt.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
//      */
//     n: z
//         .number()
//         .int()
//         .optional()
//         .default(1)
//         .describe("How many completions to generate for each prompt.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`."),
//     /**
//      * Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message.
//      */
//     stream: z
//         .boolean()
//         .optional()
//         .default(false)
//         .describe("Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message."),
//     /**
//      * Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
//      */
//     stop: z
//         .union([z.string(), z.array(z.string()).min(1).max(4)])
//         .optional()
//         .nullable()
//         .default(null)
//         .describe("Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence."),
//     /**
//      * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.  [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)
//      */
//     presence_penalty: z
//         .number()
//         .min(-2.0)
//         .max(2.0)
//         .optional()
//         .default(0)
//         .describe("Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.  [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)"),
//     /**
//      * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.  [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)
//      */
//     frequency_penalty: z
//         .number()
//         .min(-2.0)
//         .max(2.0)
//         .optional()
//         .default(0)
//         .describe("Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.  [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)"),
//     /**
//      * Modify the likelihood of specified tokens appearing in the completion.  Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this [tokenizer tool](/tokenizer?view=bpe) (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.  As an example, you can pass `{"50256": -100}` to prevent the <|endoftext|> token from being generated.
//      */
//     logit_bias: z
//         .record(z.number())
//         .optional()
//         .describe('Modify the likelihood of specified tokens appearing in the completion.  Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this [tokenizer tool](/tokenizer?view=bpe) (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.  As an example, you can pass `{"50256": -100}` to prevent the <|endoftext|> token from being generated.'),
// });
// /**
//  * Creates a completion for the provided prompt and parameters.
//  * @see https://platform.openai.com/docs/api-reference/completions/create
//  */
// export const completionRequest = completionRequestSharedBits.extend({
//     /**
//      * The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.  Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.
//      */
//     prompt: z
//         .union([z.string(), z.array(z.string())])
//         .optional()
//         .nullable()
//         .default("<|endoftext|>")
//         .describe("The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.  Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document."),
//     /**
//      * The suffix that comes after a completion of inserted text.
//      */
//     suffix: z
//         .string()
//         .optional()
//         .nullable()
//         .default(null)
//         .describe("The suffix that comes after a completion of inserted text."),
//     /**
//      * Echo back the prompt in addition to the completion.
//      */
//     echo: z
//         .boolean()
//         .optional()
//         .default(false)
//         .describe("Echo back the prompt in addition to the completion."),
//     /**
//      * Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.  The maximum value for `logprobs` is 5. If you need more than this, please contact us through our [Help center](https://help.openai.com) and describe your use case."
//      */
//     logprobs: z
//         .number()
//         .int()
//         .max(5)
//         .optional()
//         .nullable()
//         .default(null)
//         .describe("Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.  The maximum value for `logprobs` is 5. If you need more than this, please contact us through our [Help center](https://help.openai.com) and describe your use case."),
//     /**
//      * Generates `best_of` completions server-side and returns the "best" (the one with the highest log probability per token). Results cannot be streamed.  When used with `n`, `best_of` controls the number of candidate completions and `n` specifies how many to return - `best_of` must be greater than `n`.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.
//      */
//     best_of: z
//         .number()
//         .int()
//         .optional()
//         .default(1)
//         .describe('Generates `best_of` completions server-side and returns the "best" (the one with the highest log probability per token). Results cannot be streamed.  When used with `n`, `best_of` controls the number of candidate completions and `n` specifies how many to return - `best_of` must be greater than `n`.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.'),
// });
// /**
//  * Creates a model response for the given chat conversation.
//  * @see https://platform.openai.com/docs/api-reference/chat/create
//  */
// export const chatCompletionRequest = completionRequestSharedBits.extend({
//     /**
//      * A list of messages describing the conversation so far.
//      */
//     messages: z
//         .array(z.object({
//         /**
//          * The role of the author of this message. One of: `system`, `user`, `assistant`.
//          */
//         role: z
//             .enum(["system", "user", "assistant"])
//             .describe("The role of the author of this message."),
//         /**
//          * The contents of the message.
//          */
//         content: z.string().describe("The contents of the message."),
//         /**
//          * The name of the author of this message. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters.
//          */
//         name: z
//             .string()
//             .max(64)
//             .regex(/^[a-zA-Z0-9_]+$/)
//             .optional()
//             .describe("The name of the author of this message. May contain a-z, A-Z, 0-9, and underscores, with a maximum length of 64 characters."),
//     }))
//         .describe("A list of messages describing the conversation so far."),
// });
// /**
//  * From https://github.com/openai/openai-node/blob/master/api.ts, type
//  * `CreateEmbeddingRequest`.
//  */
// export const embeddingRequest = requestSharedBits.extend({
//     input: z
//         .union([
//         z.string(),
//         z.array(z.string()),
//         z.array(z.number()),
//         z.array(z.array(z.number())),
//     ])
//         .describe("Input text to get embeddings for, encoded as a string or array of tokens. To get embeddings for multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed 8192 tokens in length."),
// });
// /**
//  * From the OpenAI API docs:
//  *
//  * ```json
//  * {
//  * "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
//  * "object": "text_completion",
//  * "created": 1589478378,
//  * "model": "text-davinci-003",
//  * "choices": [
//  *   {
//  *     "text": "\n\nThis is indeed a test",
//  *     "index": 0,
//  *     "logprobs": null,
//  *     "finish_reason": "length"
//  *   }
//  * ],
//  * "usage": {
//  *   "prompt_tokens": 5,
//  *   "completion_tokens": 7,
//  *   "total_tokens": 12
//  * }
//  *}
//  *```
//  */
// export const completionResponse = z.object({
//     id: z.string(),
//     object: z.literal("text_completion"),
//     created: z.number(),
//     model: z.string(),
//     choices: z.array(z.object({
//         text: z.string().optional(),
//         index: z.number().optional(),
//         logprobs: z.any().optional(),
//         finish_reason: z.string().optional(),
//     })),
//     usage: z
//         .object({
//         prompt_tokens: z.number(),
//         completion_tokens: z.number(),
//         total_tokens: z.number(),
//     })
//         .optional(),
// });
