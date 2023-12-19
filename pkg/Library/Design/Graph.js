/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
const log = logf('Graph', '#9456ad', 'white');

export const getAtomState = host => {
  // host's layer and graph
  const {layer} = host;
  let {graph} = layer;
  // deepest state
  const hostState = graph[host.name]?.state || {};
  const state = {...hostState};
  // ascend layers
  while (graph) {
    graph = null;
    const parentHost = layer.host;
    const parentLayer = parentHost.layer;
    const parentParts = parentHost.id.split('$');
    // TODO(sjmiles): .... explain
    if (parentParts.length > 2) {
      const nameInParent = parentParts.pop();
      const graphState = parentLayer.graph[nameInParent]?.state || {};
      for (let [name, value] of Object.entries(graphState)) {
        const nameParts = name.split('$');
        const propName = nameParts.pop();
        const hostName = nameParts.join('$');
        if (hostName === host.name) {
          state[propName] = value;
        }
      }
      graph = parentParts.length > 3 ? parentLayer.graph : null;
      graph && log.debug(graph);
    }
  }
  return state;
};

export const updateProperty = (controller, designHostId, propId, value) => {
  // normalize format
  const atomPropId = propId.split('.').join('$');
  // find host
  const host = controller.atoms[designHostId];
  if (host) {
    const atomName = designHostId.split('$').pop();
    // update graph state
    const atom = host.layer.graph[atomName];
    if (atom) {
      atom.state[atomPropId] = value;
      log.debug(atom);
    }
  }
};