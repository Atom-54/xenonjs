import { uint8ArrayToBase64, base64ToUint8Array } from './base64/core.js';
export function cleanFilePath(path) {
    return path.replace(/[.\/\:\?]/g, "-");
}
/*
  Removes urls and emojis from a string

  Equivalent to python's clean-text pip package.
*/
export function cleanText(input) {
    return input
        .replace(/(https?:\/\/[^\s]+)/g, ""); // Remove urls
    //.replace(/[^\u{1F600}-\u{1F6FF}\s]/ug, ""); // Remove emojis (https://stackoverflow.com/questions/24672834/how-do-i-remove-emoji-from-string)
}
export function encodeEmbedding(data) {
    const raw = new Float64Array(data).buffer;
    return uint8ArrayToBase64(new Uint8Array(raw), 'base64', false, null).result;
}
export function decodeEmbedding(data) {
    const embeddingUint8 = base64ToUint8Array(data, 'base64', false, null).result.buffer;
    return Array.from(new Float64Array(embeddingUint8));
}
