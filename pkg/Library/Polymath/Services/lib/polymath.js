/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as OpenAI from "../../../OpenAI/Services/OpenAIService.js";
import * as Results from "./results.js";
import * as Utils from "./utils.js";

const log = logf('Polymath', 'silver', 'gray');
logf.flags.Polymath = true;

const firebases = {};

export const haveFirebaseLibrary = firebase => {
  return Boolean(firebases[firebase]);
};

export const loadFirebaseLibrary = async (firebase) => {
  let library = firebases[firebase];
  if (!library) {
    library = await loadJsonLibrary(firebase);
    if (!library) {
      library = await createJsonLibrary(firebase);
    }
  }
  return firebases[firebase] ??= library;
};

export const askLibrary = async(library, queryEmbedding) => {
  log('askLibrary', library);
  const results = await query(library, queryEmbedding);
  const packed = packResults(results);
  log('askLibrary results: ', packed);
  return packed;
};

const loadJsonLibrary = async path => {
  const response = await fetch(`${path}.json`);
  const library = await response.json();
  if (library) {
    const bits = await loadLibraryBits(library);
    return formLibrary(path, bits);
  }
};

const loadLibraryBits = async library => {
  const libraryBits = [];
  log('loading topics', keys(library));
  entries(library).forEach(([title, topic]) => {
    const bits = topic.bits?.map((bit) => ({
      ...bit,
      embedding: Utils.decodeEmbedding(bit.embedding || "")
    }))??[];
    libraryBits.push(...bits);
  });
  return libraryBits;
};

const formLibrary = (path, bits) => {
  bits.path = path;
  return bits;
}

const createJsonLibrary = async path => {
  const bits = [];
  const result = await fetch(`${path}.json`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bits)
  });
  if (result.ok) {
    return formLibrary(path, bits);
  }
};

const query = async (bits, queryEmbedding) => {
  const similar = await similarBits(bits, queryEmbedding);
  return {
    version: 1,
    embedding_model: "openai.com:text-embedding-ada-002",
    bits: similar
  };
};

 // Given an embedding, find the bits with the most similar embeddings
 const similarBits = (bits, embedding)=> {
  return bits
    .map((bit) => {
      if (!bit.embedding)
        throw new Error("Bit was missing embedding");
      return {
        ...bit,
        similarity: Utils.cosineSimilarity(embedding, bit.embedding),
      };
    })
    // sort by similarity descending
    .sort((a, b) => b.similarity - a.similarity)
    ;
};

const packBit = bit => ({
  ...bit,
  embedding: Utils.encodeEmbedding(bit.embedding || [])
});

const packResults = results => {
  const packedBits = results.bits.map(packBit);
  const packed = {...results, bits: packedBits};
  return packed;
};

export const generateCompletion = async (query, bits) => {
  const goodBits = Results.sortBits(Results.filterBits(bits, 0.1));
  const response = {
    bits: goodBits,
    infos: Results.deduplicateInfo(goodBits)
  };
  //const model = completionOptions?.model || "gpt-3.5-turbo" //"text-davinci-003";
  const model = "gpt-3.5-turbo";
  // How much room do we have for the content?
  // 4000 - 1024 - tokens for the prompt with the query without the context
  const contextTokenCount = 
    Utils.getMaxTokensForModel(model) -
    Utils.DEFAULT_MAX_TOKENS_COMPLETION -
    getPromptTokenCount(query)
    ;
  const context = Results.context(goodBits, contextTokenCount);
  const prompt = makePrompt(query, context);
  try {
    const messages = [];
    // messages.push({
    //     role: "system",
    //     content: completionOptions.system,
    // });
    messages.push({
      role: "user",
      content: prompt
    });
    const data = await OpenAI.chatCompletion(messages, Utils.DEFAULT_MAX_TOKENS_COMPLETION);
    const responseText = data.choices[0].message?.content;
    // returning the first option for now
    return {
      ...response,
      completion: responseText?.trim(),
    };
  } catch (error) {
    console.log("Error: ", error);
    //this.debug(`Completion Error: ${JSON.stringify(error)}`);
    //throw error;
  }
};

// The default is the classic from: https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb
const promptTemplate = `
Answer ##Question as truthfully as possible using the provided ##Context, and if the answer is not contained within the text below, say "I don't know".

##Context:{context}

##Question: {query}

Answer:`;

const makePrompt = (query, context) => {
  return promptTemplate
    .replace("{context}", context)
    .replace("{query}", query)
    ;
};

// given the query, add the prompt template and return the encoded total
export const getPromptTokenCount = query => {
  return Results.encode(query + promptTemplate).length;
};
