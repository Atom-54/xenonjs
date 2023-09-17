//import { base64Embedding, completionModelName, embeddingModelName, embeddingVector, modelName, bitInfo, bit, packedBit, libraryData, countType, packedLibraryData, askOptions, endpointArgs, hostConfig, } from "./schemas.js";

export const OmitKeys = {
    text: true,
    info: true,
    embedding: true,
    similarity: true,
    token_count: true,
};
export class TypedObject {
    //Based on https://stackoverflow.com/a/59459000
    static keys(t) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.keys(t);
    }
    //Based on https://stackoverflow.com/a/62055863
    static entries(t) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.entries(t);
    }
}
// Convenient export of all schemas
export const schemas = {
    // embeddingVector,
    // base64Embedding,
    // embeddingModelName,
    // completionModelName,
    // modelName,
    // bitInfo,
    // bit,
    // packedBit,
    // libraryData,
    // countType,
    // packedLibraryData,
    // askOptions,
    // endpointArgs,
    // hostConfig,
};
