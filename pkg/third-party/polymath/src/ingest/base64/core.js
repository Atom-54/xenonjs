// Converted to TS from https://github.com/tc39/proposal-arraybuffer-base64/blob/main/playground/polyfill-core.mjs
const base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64UrlCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const stringTag = Symbol.toStringTag;
const descriptor = Object.getPrototypeOf(Uint8Array.prototype);
const tag = Object.getOwnPropertyDescriptor(descriptor, stringTag)?.get;
export function checkUint8Array(arg) {
    let kind;
    try {
        kind = tag?.call(arg);
    }
    catch {
        throw new TypeError('not a Uint8Array');
    }
    if (kind !== 'Uint8Array') {
        throw new TypeError('not a Uint8Array');
    }
}
function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assert failed: ${message}`);
    }
}
function alphabetFromIdentifier(alphabet) {
    if (alphabet === 'base64') {
        return base64Characters;
    }
    else if (alphabet === 'base64url') {
        return base64UrlCharacters;
    }
    else {
        throw new TypeError('expected alphabet to be either "base64" or "base64url"');
    }
}
export function uint8ArrayToBase64(arr, alphabetIdentifier = 'base64', more = false, origExtra = null) {
    checkUint8Array(arr);
    const alphabet = alphabetFromIdentifier(alphabetIdentifier);
    more = !!more;
    if (origExtra != null) {
        checkUint8Array(origExtra);
        // a more efficient algorithm would avoid copying
        // but writing that out is unclear / a pain
        // the difference is not observable
        const copy = new Uint8Array(arr.length + origExtra.length);
        copy.set(origExtra);
        copy.set(arr, origExtra.length);
        arr = copy;
    }
    let result = '';
    let i = 0;
    for (; i + 2 < arr.length; i += 3) {
        const triplet = (arr[i] << 16) + (arr[i + 1] << 8) + arr[i + 2];
        result +=
            alphabet[(triplet >> 18) & 63] +
                alphabet[(triplet >> 12) & 63] +
                alphabet[(triplet >> 6) & 63] +
                alphabet[triplet & 63];
    }
    if (more) {
        const extra = arr.slice(i); // TODO should this be a view, or a copy?
        return { result, extra };
    }
    else {
        if (i + 2 === arr.length) {
            const triplet = (arr[i] << 16) + (arr[i + 1] << 8);
            result +=
                alphabet[(triplet >> 18) & 63] +
                    alphabet[(triplet >> 12) & 63] +
                    alphabet[(triplet >> 6) & 63] +
                    '=';
        }
        else if (i + 1 === arr.length) {
            const triplet = arr[i] << 16;
            result +=
                alphabet[(triplet >> 18) & 63] +
                    alphabet[(triplet >> 12) & 63] +
                    '==';
        }
        return { result, extra: null };
    }
}
export function base64ToUint8Array(str, alphabetIdentifier = 'base64', more = false, origExtra = null) {
    if (typeof str !== 'string') {
        throw new TypeError('expected str to be a string');
    }
    const alphabet = alphabetFromIdentifier(alphabetIdentifier);
    more = !!more;
    if (origExtra != null) {
        if (typeof origExtra !== 'string') {
            throw new TypeError('expected extra to be a string');
        }
        str = origExtra + str;
    }
    const map = new Map(alphabet.split('').map((c, i) => [c, i]));
    let extra;
    if (more) {
        const padding = str.length % 4;
        if (padding === 0) {
            extra = '';
        }
        else {
            extra = str.slice(-padding);
            str = str.slice(0, -padding);
        }
    }
    else {
        // todo opt-in optional padding
        if (str.length % 4 !== 0) {
            throw new Error('not correctly padded');
        }
        extra = null;
    }
    assert(str.length % 4 === 0, 'str.length % 4 === 0');
    if (str.endsWith('==')) {
        str = str.slice(0, -2);
    }
    else if (str.endsWith('=')) {
        str = str.slice(0, -1);
    }
    const result = [];
    let i = 0;
    for (; i + 3 < str.length; i += 4) {
        const c1 = str[i];
        const c2 = str[i + 1];
        const c3 = str[i + 2];
        const c4 = str[i + 3];
        if ([c1, c2, c3, c4].some(c => !map.has(c))) {
            throw new Error('bad character');
        }
        // this is never null, ignore error
        // @ts-ignore TS2532: Object is possibly 'undefined'.
        const triplet = (map.get(c1) << 18) + (map.get(c2) << 12) + (map.get(c3) << 6) + (map.get(c4) << 0);
        result.push((triplet >> 16) & 255, (triplet >> 8) & 255, triplet & 255);
    }
    // TODO if we want to be _really_ pedantic, following the RFC, we should enforce the extra 2-4 bits are 0
    if (i + 2 === str.length) {
        // the `==` case
        const c1 = str[i];
        const c2 = str[i + 1];
        if ([c1, c2].some(c => !map.has(c))) {
            throw new Error('bad character');
        }
        // @ts-ignore TS2532: Object is possibly 'undefined'.
        const triplet = (map.get(c1) << 18) + (map.get(c2) << 12);
        result.push((triplet >> 16) & 255);
    }
    else if (i + 3 === str.length) {
        // the `=` case
        const c1 = str[i];
        const c2 = str[i + 1];
        const c3 = str[i + 2];
        if ([c1, c2, c3].some(c => !map.has(c))) {
            throw new Error('bad character');
        }
        // @ts-ignore TS2532: Object is possibly 'undefined'.
        const triplet = (map.get(c1) << 18) + (map.get(c2) << 12) + (map.get(c3) << 6);
        result.push((triplet >> 16) & 255, (triplet >> 8) & 255);
    }
    else {
        assert(i === str.length, "i === str.length");
    }
    return {
        result: new Uint8Array(result),
        extra,
    };
}
export function uint8ArrayToHex(arr) {
    checkUint8Array(arr);
    let out = '';
    for (let i = 0; i < arr.length; ++i) {
        out += arr[i].toString(16).padStart(2, '0');
    }
    return out;
}
export function hexToUint8Array(str) {
    if (typeof str !== 'string') {
        throw new TypeError('expected str to be a string');
    }
    if (str.length % 2 !== 0) {
        throw new SyntaxError('str should be an even number of characters');
    }
    if (/[^0-9a-zA-Z]/.test(str)) {
        throw new SyntaxError('str should only contain hex characters');
    }
    const out = new Uint8Array(str.length / 2);
    for (let i = 0; i < out.length; ++i) {
        out[i] = parseInt(str.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}
