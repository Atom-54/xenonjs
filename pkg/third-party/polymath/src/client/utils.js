// --------------------------------------------------------------------------
//  Helpers for tokens, models, and math to be used elsewhere
// --------------------------------------------------------------------------
const DEFAULT_MAX_TOKENS_COMPLETION = 1024; // tokens reserved for the answer
const DEFAULT_MAX_TOKENS_FOR_MODEL = 4000; // max tokens for text-davinci-003
const MAX_TOKENS_FOR_MODEL = {
    "text-davinci-003": 4000,
    "openai.com:text-embedding-ada-002": 8191,
    "gpt-3.5-turbo": 4096,
    "gpt-4": 4096,
};
const EMBEDDING_VECTOR_LENGTH = 1536;
function getMaxTokensForModel(model) {
    return MAX_TOKENS_FOR_MODEL[model] || DEFAULT_MAX_TOKENS_FOR_MODEL;
}
export { getMaxTokensForModel, DEFAULT_MAX_TOKENS_COMPLETION, DEFAULT_MAX_TOKENS_FOR_MODEL, EMBEDDING_VECTOR_LENGTH, };
