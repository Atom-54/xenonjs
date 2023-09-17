import { cleanText } from "./utils.js";
// NOTE: Dependant on the model we are using with OpenAI, we need to chunk the data in to optimal sizes. In some cases we might only have one bit for an entire document.
const MIN_CHUNK_SIZE = 500;
const MAX_CHUNK_SIZE = 1500; // We need to check which model we are using with OpenAI because they all have different limits.
const GOLDIELOCKS = {
    min: MAX_CHUNK_SIZE - MIN_CHUNK_SIZE,
    max: MAX_CHUNK_SIZE + MIN_CHUNK_SIZE,
};
function getLastPunctuation(input) {
    const lastPeriod = input.lastIndexOf(".");
    const lastExclamation = input.lastIndexOf("!");
    const lastQuestion = input.lastIndexOf("?");
    return Math.max(lastPeriod, lastExclamation, lastQuestion);
}
export class Ingester {
    options;
    constructor(options) {
        this.options = options;
    }
    static async load(path) {
        const importer = await import(`./${path}`);
        return importer.default;
    }
    /*
    Gets the full source text for a given input path.
  
    This method must implemented in all inherited classes
    
    An inherited class might want to do a glob on a path name so it can be
    expanded to multiple files. This method should return a generator that yields
    the full text of each source.
  
    Returns partial bits.
    */
    // eslint-disable-next-line require-yield
    async *getStringsFromSource(_source) {
        // e.g yield { url: source, fullText: "" };
        throw new Error("getStringsFromSource not implemented");
    }
    /*
      This method should return a generator that yields chunks of data to the embedding encoder. The chunks of data will be optimally sized for the embedding encoder.
  
      This is overridable by an importer if so desired.
  
      Yields a partial Bit.
    */
    async *generateChunks(source) {
        console.log("[LOG] Generating Chunks");
        // Accumulate the buffer.
        let buffer = "";
        const stringSources = this.getStringsFromSource(source);
        for await (const source of stringSources) {
            console.log(`[LOG] Processing source: ${source.info?.url}`);
            const stringToEncode = source.text || "";
            const cleanedText = cleanText(stringToEncode);
            if (cleanText.length == 0) {
                continue;
            }
            // Add to the buffer because if it's too large we will break it up anyway.
            buffer += cleanedText;
            if (buffer.length >= GOLDIELOCKS.min &&
                buffer.length <= GOLDIELOCKS.max) {
                yield {
                    text: "\n" + buffer,
                    info: source.info,
                };
                buffer = "";
                continue;
            }
            // Buffer is too big, we need to break this up.
            // find the end of the sentence in the buffer.
            let trimmedBuffer = buffer.substring(0, GOLDIELOCKS.max);
            let remainingBuffer = buffer.substring(GOLDIELOCKS.max);
            do {
                // Find the last sentence in the buffer.
                const sentenceEnd = getLastPunctuation(trimmedBuffer); // What do we do if there is no sentence end?...
                if (sentenceEnd == -1) {
                    // We couldn't find a sentence end, so just yield and hope let the error percolate down.
                    console.warn("[WARN] Couldn't find sentence end. Emitting entire buffer.");
                    break;
                }
                const fullSentence = trimmedBuffer.substring(0, sentenceEnd + 1);
                const remainingSentence = trimmedBuffer.substring(sentenceEnd + 1);
                yield {
                    text: fullSentence,
                    info: source.info,
                };
                remainingBuffer = remainingSentence + remainingBuffer;
                // Add the scraps of the sentence to the remaining buffer.
                // In an ideal world this would split on a word/sentence boundary.
                trimmedBuffer = remainingBuffer.substring(0, GOLDIELOCKS.max);
                remainingBuffer = remainingBuffer.substring(GOLDIELOCKS.max);
            } while (remainingBuffer.length > GOLDIELOCKS.max);
            // Yield the last chunk
            if (remainingBuffer.length > 0) {
                yield {
                    text: "\n" + remainingBuffer,
                    info: source.info,
                };
            }
            buffer = "";
        }
        return;
    }
}
