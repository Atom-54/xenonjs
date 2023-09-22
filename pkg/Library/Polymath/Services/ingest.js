/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ingest = async function* ({importer}) {
  const ingester = (importer instanceof Ingester) ? importer : await createIngester(importer);
  // const polymath = new Polymath({ apiKey, debug });
  for await (const chunk of ingester.generateChunks(source)) {
      log(`Importing chunk ${chunk.info?.url}`);
      if (chunk.text == null) {
          continue;
      }
      const id = generateId(source.trim() + "\n" + chunk.text.trim());
      log(`Id: ${id}`);
      const tokenCount = polymath.getPromptTokenCount(chunk.text);
      chunk.id = id;
      chunk.token_count = tokenCount;
      chunk.embedding = encodeEmbedding(await polymath.generateEmbedding(chunk.text));
      log(`Token count: ${tokenCount}`);
      yield chunk;
  }
  log("\nDone importing\n\n");
};
