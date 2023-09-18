import { PolymathHost } from "./host.js";
import { decodeEmbedding, cosineSimilarity } from "./utils.js";

export const PolymathFirebase = class extends PolymathHost {
  _libraryBits;
  constructor(library) {
    super();
    this._libraryBits = this.loadLibrary(library);
  }
  // Load up all of the library entries from the given node
  async loadLibrary(path) {
    const response = await fetch(path);
    const library = await response.json();
    return this.loadLibraryBits(library);
  }
  async loadLibraryBits(library) {
    const libraryBits = [];
    Object.entries(library).forEach(([title, topic]) => {
      console.log('loading topic', title);
      const bits = topic.bits.map((bit) => ({
        ...bit,
        embedding: decodeEmbedding(bit.embedding || "")
      }));
      libraryBits.push(...bits);
    });
    return libraryBits;
  }
  // TODO(sjmiles): why here?
  // Given an embedding, find the bits with the most similar embeddings
  async similarBits(embedding) {
    const libraryBits = await this._libraryBits;
    return (libraryBits
      .map((bit) => {
        if (!bit.embedding)
          throw new Error("Bit was missing embedding");
        return {
          ...bit,
          similarity: cosineSimilarity(embedding, bit.embedding),
        };
      })
      // sort by similarity descending
      .sort((a, b) => b.similarity - a.similarity)
    );
  }
  async query(args) {
    const queryEmbedding = args.query_embedding;
    if (!queryEmbedding) {
      throw new Error("Ask options are missing query_embedding");
    }
    const bits = await this.similarBits(queryEmbedding);
    // TODO: Do something better here. Hard-coding "version" and
    // "embedding_model" is just a workaround. Ideally, these come down
    // from the libraries themselves.
    return {
      version: 1,
      embedding_model: "openai.com:text-embedding-ada-002",
      bits
    };
  }
};
