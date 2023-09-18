import { encodeEmbedding } from "./utils.js";
import { filterResults } from "./results.js";

export class PolymathHost {
    async queryPacked(args) {
        const results = await this.query(args);
        const packed = {
            version: results.version,
            embedding_model: results.embedding_model,
            bits: filterResults(args, results.bits.map((bit) => ({
                ...bit,
                //embedding: bit.embedding || []
                embedding: encodeEmbedding(bit.embedding || []),
            }))),
        };
        return packed;
    }
}
