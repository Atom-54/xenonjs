/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Utils from './utils.js';
import * as OpenAI from '../../../OpenAI/OpenAIService.js';
import * as Polymath from './polymath.js';

// NOTE: Dependent on the model we are using with OpenAI, we need to chunk the data in to optimal sizes. 
// In some cases we might only have one bit for an entire document.
const MIN_CHUNK_SIZE = 500;
// We need to check which model we are using with OpenAI because they all have different limits.
const MAX_CHUNK_SIZE = 1500;
const GOLDIELOCKS = {
  min: MAX_CHUNK_SIZE - MIN_CHUNK_SIZE,
  max: MAX_CHUNK_SIZE + MIN_CHUNK_SIZE,
};

export const ingest = async function* (importerName, source, content) {
  const importer = await loadImporter(importerName);
  const sourceStrings = importer.getStringsFromSource(source, content);
  const chunker = importer.generateChunks || generateChunks;
  //const ingester = (importer instanceof Ingester) ? importer : await createIngester(importer);
  // const polymath = new Polymath({ apiKey, debug });
  for await (const chunk of chunker(sourceStrings)) {
    log(`Importing chunk ${chunk.info?.url}`);
    if (chunk.text == null) {
        continue;
    }
    const id = generateId(source.trim() + "\n" + chunk.text.trim());
    log(`Id: ${id}`);
    const tokenCount = Polymath.getPromptTokenCount(chunk.text);
    chunk.id = id;
    chunk.token_count = tokenCount;
    const embedding = await OpenAI.textEmbed(chunk.text);
    chunk.embedding = Utils.encodeEmbedding(embedding);
    log(`Token count: ${tokenCount}`);
    yield chunk;
  }
  log("\nDone importing\n\n");
};

const generateId = input => Math.random(); //createHash("md5").update(input).digest("hex");

export const loadImporter = async name => {
  return import(`./importers/${name}.js`);
};

async function *generateChunks(stringSources) {
  console.log("[LOG] Generating Chunks");
  // Accumulate the buffer.
  let buffer = "";
  for await (const source of stringSources) {
    console.log(`[LOG] Processing source: ${source.info?.url}`);
    const stringToEncode = source.text || "";
    const cleanedText = stringToEncode; //cleanText(stringToEncode);
    if (cleanedText.length == 0) {
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
};

function getLastPunctuation(input) {
  const lastPeriod = input.lastIndexOf(".");
  const lastExclamation = input.lastIndexOf("!");
  const lastQuestion = input.lastIndexOf("?");
  return Math.max(lastPeriod, lastExclamation, lastQuestion);
}
