import { PolymathHost } from "./host.js";
import { VectorStore } from "../db/index.js";
import { EMBEDDING_VECTOR_LENGTH } from "./utils.js";
const MAX_RESULTS = 10;
export class PolymathDb extends PolymathHost {
    store;
    constructor(path) {
        super();
        this.store = new VectorStore(path, EMBEDDING_VECTOR_LENGTH);
    }
    async query(args) {
        const vector = args.query_embedding;
        const reader = await this.store.createReader();
        const bits = await reader.search(vector, MAX_RESULTS);
        const libraryData = {
            version: 1,
            embedding_model: "openai.com:text-embedding-ada-002",
            bits,
        };
        return libraryData;
    }
}
