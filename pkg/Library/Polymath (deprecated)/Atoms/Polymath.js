export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async shouldUpdate({endpoints, vector}, state) {
  return vector && endpoints?.length;
},

async update({endpoints, vector}, state) {
  if (typeof endpoints === 'string') {
    endpoints = [endpoints];
  }
  let response;
  const bits = [];
  for (const endpoint of endpoints) {
    try {
      const r = await this.fetchEmbedding(endpoint, vector);
      log(endpoint, 'said:', r);
      if (r) {
        if (r?.bits) {
          bits.push(...r.bits);
        }
        response = r;
      }
    } catch(x) {
      log.error(endpoint, 'said:', x);
    }
  }
  response.bits = bits.slice(0, 10);
  log('response is', response);
  return response;
},

async fetchEmbedding(endpoint, vector) {
  log('encoding vector...');
  const embedding = this.encode(vector);
  log('sending query...');
  const response = await fetch(endpoint, this.composeQuery(embedding));
  try {
    const data = await response?.json();
    return data;
  } catch(x) {
    return {error: x.toString()};
  }
},

composeQuery(query_embedding) {
  const args = {
    version: '1',
    query_embedding_model: 'openai.com:text-embedding-ada-002',
    sort: 'similarity',
    access_token: ''
  };
  //
  const body = new FormData();
  body.append('version', args.version);
  body.append('access_token', args.access_token);
  body.append('sort', args.sort);
  body.append('query_embedding_model', args.query_embedding_model);
  body.append('query_embedding', query_embedding);
  //
  //const body = {
  //  ...args,
  //  query_embedding
  //};
  //
  return {
    method: 'POST',
    body
  };
},

encode(vector) {
  return btoa(String.fromCharCode(...new Uint8Array(new Float32Array(vector).buffer)));
}
});
