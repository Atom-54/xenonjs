/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as OpenAI from "../../OpenAI/OpenAIService.js";
import * as Polymath from './lib/Polymath.js';
//import {Ingest} from '../../../third-party/polymath/src/ingest/main.js';
import {Resources} from '../../Media/Resources.js';

export const PolymathService = {
  async RegisterLibrary(layer, atom, {name}) {
    return registerLibrary(name);
  },
  async Ask(layer, atom, {library, query}) {
    return askLibrary(Resources.get(library), query);
  },
  async Learn(layer, atom, {library, query}) {
    return ingestWikiQuery(Resources.get(library), source);
  }
};

const polymathStore = `https://xenon-js-default-rtdb.firebaseio.com/polymath`;

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

const Ingest = null;

const ingester = async args => {
  const library = {
    version: 1,
    embedding_model: "openai.com:text-embedding-ada-002",
    bits: [],
  };
  (args.options ??= {}).apiKey = apiKey;
  const ingest = new Ingest();
  for await (const bit of ingest.run(args)) {
    library.bits.push(bit);
  }
  return library;
};

const fetchWiki = async endpoint => {
  const response = await fetch(
    endpoint,
    {'Api-User-Agent': 'XenonJS.com Service/0.7'}
  );
  return response.json();
};

const wikiREST = `https://en.wikipedia.org/w/rest.php/v1`;

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

const storeLibrary = async (library, name) => {
  return fetch(`${polymathStore}/${name}.json`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(library)
  });
};

const fetchLibraryTitles = async store => {
  const response = await fetch(`${store}.json?shallow=true`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  });
  return response.json();
};

//let wikiPolymath;

// const queryLibrary = async query => {
//   wikiPolymath ??= new Polymath({
//     apiKey,
//     firebase: `${polymathStore}.json`
//   });
//   const response = await wikiPolymath.completion(query);
//   return response;
// };

const ingestWikiQuery = async query => {
  const {title, html} = await fetchWikiPage(query);
  if (title) {
    // const titles = await fetchLibraryTitles(polymathStore);
    // if (titles[title]) {
    //   console.log('title', title, 'already exists');
    // } else {
      const args = {
        importer: 'html',
        source: title,
        options: {
          html
        }
      };
      const library = await ingester(args);
      console.log(library);
      storeLibrary(library, title);
      const id = Resources.allocate(library);
      return {id};
    //}
  }
};