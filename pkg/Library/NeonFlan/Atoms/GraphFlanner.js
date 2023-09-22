export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

initialize(inputs, state, {service}) {
  // TODO(sjmiles): shouldn't be hardcoded, um, obvs
  const server = `https://openai.iamthearchitect.workers.dev/`;
  const post = (url, body) => fetch(url, {method: 'POST', body: JSON.stringify(body)});
  state.ai = (context, prompt) => post(server, `${context ?? ''}${prompt}`);
},

shouldUpdate({graphs}) {
  return graphs?.length;
},

async update({query, graphs}, state, {isDirty}) {
  state.graphs ??= this.initGraphs(graphs);
  if (query && isDirty('query')) {
    state.query = query;
    let graph = await this.findGraphForQuery(query, state.graphs, state);
    if (graph) {
      return {graph: graph.id, graphJson: null};
    }
    graph = this.defaultGraph();
    return {graph: graph.meta.id, graphJson: graph};
  }
},

initGraphs(graphs) {
  return graphs
    .filter(graph => graph.description)
    .sort(this.sortGraphs)
    .map(({id, description}) => ({id, description}));
},

sortGraphs(g1, g2) {
  const neon1 = g1.owner.toLowerCase().includes('neonflan');
  const neon2 = g2.owner.toLowerCase().includes('neonflan');
  if (neon1 && !neon2) return -1;
  else if (neon2) return 1;
  else return 0;
},

defaultGraph() {
  return {
    meta: {id: 'Sorry', designerId: 'Main'},
    nodes: {
      Main: {
        type: '$library/Layout/Nodes/DesignerNode',
        container: 'root$panel#Container'
      },
      Echo: {
        type: '$library/EchoNode',
        'container': 'Main$panel#Container'
      }
    },
    state:{
      Main$designer$disabled:true,
      Main$designer$style: 'width: auto; height: auto;',
      Main$panel$canvasLayout: 'column',
      Main$designer$layout: {
        Echo: {l:32, t:32, w:132, h:132, height: 'auto', width: 'auto', padding: 'var(--size-5)', fontSize: 'var(--font-size-4)', backgroundColor: 'var(--xcolor-one)', alignItems: 'center'}
      },
      Echo$echo$html:"Sorry, I'm still learning, and I couldn't find a suitable experience.\nYou can try creating your own in the <a target=\'_blank\' href=\'https://xenon-js.web.app/0.7/Build/\' style=\'color:inherit\' >XenonJs Build IDE</a>."
    },
    connections: {}
  }
},

render({label}, {graphs, query}) {
  return {
    label,
    value: query??'',
    options: graphs?.map(({id, description}) => ({
      id: id.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2'),
      description
    }))
  }
},

makeContext(graphs, query) {
  return `Here is a list of known solutions: ${JSON.stringify(graphs)}.
  Data for each solution includes its 'id' and 'description'.
  Given a text query, please, choose the best suitable solution and return its 'id'. Reply with just the id.
  If none of the solutions seem suitable enough, reply with 'n/a'.


  Query: ${query}
  `;
},

async findGraphForQuery(query, graphs, {ai}) {
  if (graphs?.length > 0) {
    // Compare query to graphs' `id` and `description`.
    const graph = graphs.find(({id, description}) => id === query.replace(/\s+/g, '') || description === query);
    if (graph) {
      return graph;
    }
    // Ask OpenAI to find the best suitable graph.
    const response = await ai('', this.makeContext(graphs, query));
    const text = await response.text();
    const graphId = text.trim();
    return graphs.find(({id}) => id === graphId);
  }
},

onFieldChange({eventlet: {value}}, state) {
  state.query = value;
  return {query: state.query};
},

template: html`
<style>
  :host {
    padding: 0 6px;
    height: 2em;
  }
  [label] {
    background: inherit;
    font-weight: bold;
    font-size: 75%;
    border: none;
    text-align: right;
    min-width: var(--field-label-width);
  }
  [field] {
    padding: 6px 9px;
    border-radius: 4px;
    border: 1px solid var(--xcolor-two);
  }
  [delim] {
    padding: 6px;
  }
</style>

<div flex bar>
  <div label>{{label}}</div>
  <span delim></span>
  <input flex field value='{{value}}' on-change='onFieldChange' list='options'>
  <datalist id='options' repeat='option_t'>{{options}}</datalist>
</div>

<template option_t>
  <option value='{{id}}'>{{description}}</option>
</template>
`
});
