import { Harness, check } from "./harness.js";
// TODO: Deduplicate this constant.
const EMBEDDING_VECTOR_LENGTH = 1536;
export class Validator {
    endpoint;
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
    async run() {
        const countTokens = (bits) => bits.reduce((acc, bit) => acc + (bit.token_count || 0), 0);
        const harness = new Harness(this.endpoint);
        let count_type = "token";
        let count = 1500;
        // prepare a random embedding to send to the server
        const query_embedding = new Array(EMBEDDING_VECTOR_LENGTH)
            .fill(0)
            .map(() => Math.random());
        let bits = [];
        await harness.validate({ query_embedding, count, count_type }, check("Result contains bits", (c) => !!c.response.bits), check("Collect stuff", (c) => {
            bits = c.response.bits;
            return true;
        }));
        const fewerBits = bits.slice(0, -1);
        count = countTokens(fewerBits);
        await harness.validate({ query_embedding, count, count_type }, check("Endpoint accurately responds to a `count` argument for tokens", (c) => countTokens(c.response.bits) == count), check("Endpoint consistently returns the same bits", (c) => {
            const newBits = c.response.bits;
            return (newBits.length == fewerBits.length &&
                newBits.every((bit, i) => bit.id == fewerBits[i].id));
        }));
        count_type = "bit";
        count = 2;
        await harness.validate({ query_embedding, count, count_type }, check("Endpoint accurately responds to a `count` argument for bits", (c) => c.response.bits.length == count));
        const details = harness.log.results;
        const valid = details.every((entry) => entry.success);
        return { valid, details };
    }
}
