import { encode } from "../gptoken/Encoder.js";
import { omit, trim } from "../host/index.js";
import { DEFAULT_MAX_TOKENS_FOR_MODEL } from "./utils.js";
// --------------------------------------------------------------------------
// A container for the resulting bits
//
// let p = new Polymath({..})
// let pr = await p.ask("How long is a piece of string?");
// pr.context(DEFAULT_MAX_TOKENS_COMPLETION) // return the string of context limited to 1025 tokens
// --------------------------------------------------------------------------
class PolymathResults {
    _bits;
    _askOptions;
    constructor(bits, askOptions) {
        this._bits = bits;
        this._askOptions = askOptions;
    }
    bits(maxTokensWorth = 0) {
        const bits = maxTokensWorth > 0 ? this.maxBits(maxTokensWorth) : this._bits;
        return bits;
    }
    context(maxTokensWorth = 0) {
        return this.bits(maxTokensWorth)
            .map((bit) => bit.text)
            .join("\n");
    }
    // Return as many bits as can fit the number of tokens
    // This is currently duplicated in `core/host/src/results.ts`
    // as `filterByTokenCount`
    // TODO: Deduplicate.
    maxBits(maxTokens = DEFAULT_MAX_TOKENS_FOR_MODEL) {
        let totalTokens = 0;
        const includedBits = [];
        for (let i = 0; i < this._bits.length; i++) {
            const bit = this._bits[i];
            const bitTokenCount = bit.token_count || encode(bit.text || "").length; // TODO: no token_count huh?
            if (totalTokens + bitTokenCount > maxTokens) {
                return includedBits;
            }
            totalTokens += bitTokenCount;
            includedBits.push(bit);
        }
        return includedBits;
    }
    // Add the new bits, resort, and re-max
    mergeBits(bits) {
        this._bits.push(...bits);
    }
    sortBitsBySimilarity() {
        this._bits = this._bits.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
    }
    // Return info objects ordered by the most similarity, no duplicates
    infoSortedBySimilarity() {
        const uniqueInfos = [];
        return this._bits
            .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
            .filter((bit) => {
            const info = bit.info || { url: "" };
            if (!uniqueInfos.some((ui) => ui.url === info.url)) {
                uniqueInfos.push(info);
                return true;
            }
            return false;
        })
            .map((bit) => bit.info || { url: "" });
    }
    // Return a JSON response appropriate for sending back to a client
    response() {
        const response = {
            version: this._askOptions && this._askOptions.version
                ? this._askOptions.version
                : 1,
            embedding_model: this._askOptions && this._askOptions.query_embedding_model
                ? this._askOptions.query_embedding_model
                : "openai.com:text-embedding-ada-002",
            bits: this._bits,
        };
        if (this._askOptions?.omit) {
            omit(this._askOptions, this._bits);
            response.omit = this._askOptions.omit;
        }
        if (this._askOptions?.count_type) {
            response.count_type = this._askOptions.count_type || "bit";
        }
        // default to sorting
        if (this._askOptions?.sort == "similarity" || !this._askOptions?.sort) {
            this.sortBitsBySimilarity();
        }
        if (this._askOptions?.count) {
            this._bits = trim(this._askOptions, this._bits);
        }
        return response;
    }
}
export { PolymathResults };
