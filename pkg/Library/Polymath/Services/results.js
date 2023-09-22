/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {encode} from "../../../third-party/gptoken/Encoder.js";
//import {omit, trim} from "../host/index.js";
import {DEFAULT_MAX_TOKENS_FOR_MODEL} from "./utils.js";

export {encode};

export const makeResponse = bits => {
  sortBitsBySimilarity(bits);
  //bits = trimBits(bits, count);
  return {
    version: 
        //this._askOptions && this._askOptions.version ? this._askOptions.version : 
        1,
    embedding_model: //this._askOptions && this._askOptions.query_embedding_model ? this._askOptions.query_embedding_model
        "openai.com:text-embedding-ada-002",
    bits
  };
};

export const context = (bits, maxTokensWorth) => {
  return limitBits(bits, maxTokensWorth)
    .map((bit) => bit.text)
    .join('\n')
    ;
};

export const filterBits = (bits, quality) => {
  return bits.filter(b => b.similarity >= quality)
};

export const sortBits = bits => {
  return bits.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
};

// Return deduplicated info objects
export const deduplicateInfo = bits => {
  const uniqueInfos = [];
  return bits
    .filter((bit) => {
        const info = bit.info || { url: "" };
        if (!uniqueInfos.some((ui) => ui.url === info.url)) {
            uniqueInfos.push(info);
            return true;
        }
        return false;
    })
    .map((bit) => bit.info || { url: "" })
    ;
};

const trimBits = (bits, count) => {
  return bits.slice(0, count || 3);
};

const trimTokens = (bits, count) => {
   return filterByTokenCount(bits, count || 3);
};

const filterByTokenCount = (bits, maxTokens) => {
  let totalTokens = 0;
  const includedBits = [];
  for (let i = 0; i < bits.length; i++) {
      const bit = bits[i];
      if (!bit.token_count)
          throw new Error("Unexpectedly missing `token_count`");
      const bitTokenCount = bit.token_count;
      if (totalTokens + bitTokenCount > maxTokens) {
          return includedBits;
      }
      totalTokens += bitTokenCount;
      includedBits.push(bit);
  }
  return includedBits;
};

const limitBits = (bits, maxTokensWorth) => {
  return maxTokensWorth > 0 ? maxBits(bits, maxTokensWorth) : bits;
};

const maxBits = (bits, maxTokens = DEFAULT_MAX_TOKENS_FOR_MODEL) => {
  let totalTokens = 0;
  const includedBits = [];
  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i];
    const bitTokenCount = bit.token_count || encode(bit.text || "").length; // TODO: no token_count huh?
    if (totalTokens + bitTokenCount > maxTokens) {
      return includedBits;
    }
    totalTokens += bitTokenCount;
    includedBits.push(bit);
  }
  return includedBits;
};

