import {Polymath} from '../../../third-party/polymath/src/client/main.js';
import {Ingest} from '../../../third-party/polymath/src/ingest/main.js';
import {apiKey} from '../../../../other/agents/cloudflare/src/key.js';
import {Resources} from '../../Media/Resources.js';

export const PolymathService = {
  async Ask(layer, atom, {query}) {
    return await queryLibrary(query);
  },
  async IngestWikiQuery(layer, atom, {query}) {
    return ingestWikiQuery(query);
  }
};

const polymathStore = `https://xenon-js-default-rtdb.firebaseio.com/polymath`;

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

let wikiPolymath;

const queryLibrary = async query => {
  wikiPolymath ??= new Polymath({
    apiKey,
    firebase: `${polymathStore}.json`
  });
  const response = await wikiPolymath.completion(query);
  return response;
};

const ingestWikiQuery = async query => {
  const {title, html} = await fetchWikiPage(query);
  if (title) {
    const titles = await fetchLibraryTitles(polymathStore);
    if (titles[title]) {
      console.log('title', title, 'already exists');
    } else {
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
    }
  }
};