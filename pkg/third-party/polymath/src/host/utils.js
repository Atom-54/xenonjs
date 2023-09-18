import { schemas } from "../types/index.js";
// TODO: Deduplicate this constant.
export const EMBEDDING_VECTOR_LENGTH = 1536;
function dotProduct(vecA, vecB) {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}
function magnitude(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}
// Cosine similarity is the dot products of the two vectors divided by the product of their magnitude
// https://en.wikipedia.org/wiki/Cosine_similarity
//
// We use this to compare two embedding vectors
export function cosineSimilarity(vecA, vecB) {
    return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}
export function decodeEmbedding(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i<binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(new Float32Array(bytes.buffer));
    //return Array.from(new Float64Array(new Uint8Array(Buffer.from(data, "base64")).buffer));
}
export function encodeEmbedding(data) {
    const binaryString = btoa(data);
    return binaryString;
}
export const fromObject = (data) => {
    if (data.query_embedding)
        data.query_embedding = decodeEmbedding(data.query_embedding);
    if (data.version)
        data.version = parseInt(data.version);
    if (data.count)
        data.count = parseInt(data.count);
    // Important: Using `endpointArgs` fills in good defaults.
    return schemas.endpointArgs.parse(data);
};
export const fromFormData = (formData) => {
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    return fromObject(data);
};
