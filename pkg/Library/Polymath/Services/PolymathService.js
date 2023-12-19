/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Resources} from '../../Resources/Resources.js';
import * as OpenAI from '../../OpenAI/Services/OpenAIService.js';
import * as Polymath from './lib/polymath.js';
import {ingest} from './lib/ingest.js';

export const PolymathService = {
  async RegisterLibrary(host, {name}) {
    return registerLibrary(name);
  },
  async Ask(host, {library, query}) {
    return askLibrary(Resources.get(library), query);
  },
  async Learn(host, {library, type, source, content}) {
    return learn(library, type, source, content);
  },
  async QueryWikipedia(host, {query}) {
    return fetchWikiPage(query);
  }
};

const polymathStore = 'https://xenon-js-default-rtdb.firebaseio.com/polymath';

const registerLibrary = async (name) => {
  if (!Polymath.haveFirebaseLibrary(name)) {
    const library = await Polymath.loadFirebaseLibrary(`${polymathStore}/${name}`);
    const id = Resources.allocate(library);
    return {id};
  }
};

const askLibrary = async (library, query) => {
  const queryEmbedding = await OpenAI.textEmbed(query);
  const packedResults = await Polymath.askLibrary(library, queryEmbedding);
  return Polymath.generateCompletion(query, packedResults.bits);
};

const learn = async (library, type, source, content) => {
  const volume = await ingester('html' /*type*/, source, content);
  const response = await storeBits(Resources.get(library).path, source, volume);
  return {ok: response.ok};
};

const fetchWiki = async endpoint => {
  const response = await fetch(
    endpoint,
    {'Api-User-Agent': 'XenonJS.com Service/0.7'}
  );
  return response.json();
};

const wikiREST = 'https://en.wikipedia.org/w/rest.php/v1';

const fetchWikiSource = async title => {
  return fetchWiki(`${wikiREST}/page/${title}`);
};

const fetchWikiHtml = async title => {
  return fetchWiki(`${wikiREST}/page/${title}/with_html`);
};

const fetchWikiQuery = async query => {
  return fetchWiki(`${wikiREST}/search/page?q=${query}&limit=1`);
};

const fetchWikiPage = async query => {
  const answer = await fetchWikiQuery(query);
  const info = answer?.pages?.[0];
  const title = info.title || info.matched_title;
  if (title) {
    const page = await fetchWikiHtml(title);
    console.log(page);
    return {title, html: page?.html};
  }
};

const storeBits = async (library, name, bits) => {
  const sanitize = name => name?.replace(/[^a-zA-Z0-9\s]/g, '');
  return fetch(`${library}/${sanitize(name)}.json`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bits)
  });
};

const fetchLibraryTitles = async store => {
  const response = await fetch(`${store}.json?shallow=true`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  });
  return response.json();
};

// const ingestWikiQuery = async (library, query) => {
//   const {title, html} = await fetchWikiPage(query);
//   if (title) {
//     const shelf = await ingester('html', title, html);
//     console.log(library.path, shelf);
//     storeBits(library.path, title, shelf);
//   }
// };

const ingester = async (importerName, source, content) => {
  const library = {
    version: 1,
    embedding_model: 'openai.com:text-embedding-ada-002',
    bits: [],
  };
  const generator = ingest(importerName, source, content);
  for await (const bit of generator) {
    library.bits.push(bit);
  }
  return library;
};

