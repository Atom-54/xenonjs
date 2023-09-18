// import fs from "fs";
// import { globbySync } from "globby";
import { PolymathHost } from "./host.js";
import { decodeEmbedding, cosineSimilarity } from "./utils.js";
// --------------------------------------------------------------------------
// Query a local library of bits
// --------------------------------------------------------------------------
export class PolymathFile extends PolymathHost {
  _libraryBits;
  constructor(libraries) {
    super();
    this._libraryBits = this.loadLibraryBits(libraries);
  }
  // Load up all of the library bits from the given library JSON files
  async loadLibraryBits(libraries) {
    const libraryBits = [];
    for (const path of libraries) {
      // fetch a library
      const response = await fetch(path);
      // decoding
      const json = await response.json();
      const bits = json.bits.map((bit) => {
        return {
          ...bit,
          embedding: decodeEmbedding(bit.embedding || "")
        };
      });
      // aggregate bits from all libraries
      libraryBits.push(...bits);
    }
    return libraryBits;
  }
  // TODO(sjmiles): host back-ends may have query functionality, this one does not
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
      .sort((a, b) => b.similarity - a.similarity));
  }
  async query(args) {
    const queryEmbedding = args.query_embedding;
    if (!queryEmbedding) {
      throw new Error("Ask options are missing query_embedding");
    }
    const bits = await this.similarBits(queryEmbedding);
    return {
      version: 1,
      embedding_model: "openai.com:text-embedding-ada-002",
      bits
    };
  }
}
