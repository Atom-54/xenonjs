// import fs from "fs";
// import { globbySync } from "globby";
import { PolymathHost } from "./host.js";
import { decodeEmbedding, cosineSimilarity } from "./utils.js";
// --------------------------------------------------------------------------
// Query a local library of bits
// --------------------------------------------------------------------------
class PolymathFile extends PolymathHost {
  _libraryBits;
  constructor(libraries) {
    super();
    //const expandedLibraries = this.expandLibraries(libraries);
    //this._libraryBits = this.loadLibraryBits(expandedLibraries);
    this._libraryBits = this.loadLibraryBits(libraries);
  }
  // Expand any directories or globs in the list of libraries
  // E.g. if you pass in ["./mybits/*.json", "./mybits2"], this will return
  // ["./mybits/1.json", "./mybits/2.json", "./mybits2/1.json", "./mybits2/2.json"]
  expandLibraries(libraries) {
    const expandedLibraries = [];
    // for (const filepattern of libraries) {
      // const files = globbySync([filepattern, "!*.SECRET.*"], {
      //     expandDirectories: {
      //         extensions: ["json"],
      //     },
      // });
      // expandedLibraries.push(...files);
      // console.log("In: ", libraries);
      // console.log("Out: ", expandedLibraries);
    //}
    return expandedLibraries;
  }
  // Load up all of the library bits from the given library JSON files
  async loadLibraryBits(libraries) {
    const libraryBits = [];
    for (const path of libraries) {
      const response = await fetch(path);
      const json = await response.json();
      const bits = json.bits.map((bit) => {
        return {
          ...bit,
          embedding: decodeEmbedding(bit.embedding || ""),
          //embedding: bit.embedding || []
        };
      });
      libraryBits.push(...bits);
    }
    // for (const filename of libraries) {
    //     try {
    //         const data = fs.readFileSync(filename, "utf8");
    //         const json = JSON.parse(data);
    //         const bits = json.bits.map((bit) => {
    //             return {
    //                 ...bit,
    //                 embedding: decodeEmbedding(bit.embedding || ""),
    //             };
    //         });
    //         libraryBits.push(...bits);
    //         // libraryBits = [...libraryBits, ...bits];
    //     }
    //     catch (e) {
    //         console.error(`Error reading or parsing library file "${filename}": ${e}`);
    //     }
    // }
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
      .sort((a, b) => b.similarity - a.similarity));
  }
  async query(args) {
    const queryEmbedding = args.query_embedding;
    if (!queryEmbedding) {
      throw new Error("Ask options are missing query_embedding");
    }
    const bits = await this.similarBits(queryEmbedding);
    //return new Promise((resolve) => {
      // TODO: Do something better here. Hard-coding "version" and
      // "embedding_model" is just a workaround. Ideally, these come down
      // from the libraries themselves.
      return {
        version: 1,
        embedding_model: "openai.com:text-embedding-ada-002",
        bits
      };
      //resolve(result);
    //});
  }
}
export { PolymathFile };
