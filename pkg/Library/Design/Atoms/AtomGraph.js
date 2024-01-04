export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({layerId, selected}, state, {service}) {
  state.info = null;
  state.selected = selected;
  state.offsets = await service('DesignService', 'GetAtomGraphInfo', {layerId});
  state.info = await service('DesignService', 'GetLayerInfo', {layerId});
  //log('done with update ...');
},
shouldRender({layerId},{info}) {
  return Boolean(/*layerId &&*/ info);
},
render({layerId}, {info, selected, offsets}) {
  //log('... rendering atom graph');
  let edges = [];
  // render bindings (controller connections) as edges
  const bindings = info.connections.inputs;
  // get list of atoms suitable for rendering
  const nodables = this.getNodableAtoms(info.atoms);
  if (bindings) {
    // search bindings for our nodable keys, these are our edges
    nodables.forEach(atom => this.getEdges(bindings, edges, atom));
  };
  // atom render models
  const atoms = nodables.map((atom, i) => this.renderAtom(atom, edges, selected, layerId, i));
  return {
    atoms,
    edges,
    offsets
  };
},
getNodableAtoms(atoms) {
  const getDepth = id => id.split('$').length;
  const isNodableType = atom => !['Panel', 'SplitPanel'].includes(atom.id);
  return atoms
    .filter(atom => getDepth(atom.id) < 5)
    .filter(atom => isNodableType(atom))
    ;
},
getEdges(bindings, edges, atom) {
  const atomPrefix = atom.id + '$';
  const filterInternalEdges = bound => bound.filter(binding => !binding.startsWith(atomPrefix));
  const atomEdges = Object.entries(bindings)
    .filter(([id]) => id.startsWith(atomPrefix))
    .map(([id, binding]) => ({id, binding}))
    .filter(bound => {
      bound.binding = filterInternalEdges(bound.binding);
      return (bound.binding.length);
    })
    ;
  edges.push(...atomEdges);
},
renderAtom(atom, edges, selected, layerId, i) {
  const nameFromId = id => id.split('$').slice(4).join('.');
  const modelify = id => ({name: nameFromId(id)});
  const hasPrefix = prefix => id => id.startsWith(prefix + '$');
  //
  const prefixFilter = hasPrefix(atom.id);
  const inputs = edges
    .flatMap(({id, binding}) => binding
      .filter(prefixFilter)
      .map(modelify)
    )
    ;
  const outputs = edges
    .filter(({id}) => prefixFilter(id))
    .map(({id}) => modelify(id))
    ;
  //
  const [w, h, stride] = [260, 140, 4];
  return {
    id: atom.id, 
    atomId: atom.id.replace(/\$/g, '-'),
    type: atom.type,
    selected: atom.id === selected,
    displayName: atom.id.split('$').slice(3).join('.'),
    style: {
      ...this.getAtomRect(w, h, stride, i)
    },
    inputs,
    outputs
  };
},
getAtomRect(w, h, stride, i) {
  const clampus = v => Math.floor(v/8)*8;
  const rect = {l: 0, t: 0};
  let [ox, oy] = [64 + rect.l, 32 + rect.t];
  return {
    left: clampus(ox + w*(i%stride)) + 'px', 
    top: clampus(oy + h*Math.floor(i/stride) + h/3*(Math.sin((i%stride)*Math.PI*.8/2))) + 'px', 
    width: '200px'
  };
},
onAtomSelect({eventlet: {key}}, state, {service}) {
  return {selected: key};
},
onKeyDown({eventlet}, state, {service}) {
  if (['Delete', 'Backspace'].includes(eventlet.key) && state.selected) {
    service('DesignService', 'Delete', {atomId: state.selected});
  }
},
async onAtomMoved({layerId, eventlet}, state, {service}) {
  return service('DesignService', 'SetAtomGraphInfo', {layerId, info: eventlet.value});
},
template: html`
<style>
  :host {
    display: flex;
    flex: 1 !important;
    font-size: 12px;
    color: black;
    background-color: var(--theme-color-bg-1);
    border: var(--AtomEditor-border);
    --edge-border: 1px solid #555;
    --mdc-icon-size: 18px;
    --mdc-icon-button-size: 26px;
  }
  mwc-icon-button {
    color: #555;
  }
  [floating] {
    position: absolute;
    top: 0;
    left: 0;
  }
  drop-target {
    height: auto !important;
  }
  atom-graph {
    display: block;
    overflow: visible;
  }
</style>

<drop-target flex scrolling row tabindex="-1" on-target-drop="onAtomTypeDropped" on-keydown="onKeyDown">
  <atom-graph flex atoms="{{atoms}}" edges="{{edges}}" selected="{{selected}}" offsets="{{offsets}}" on-offset-change="onAtomMoved" on-atom-selected="onAtomSelect"></atom-graph>
</drop-target>

<!-- last, therefore on top -->
<!-- <div floating><slot name="toolbar"></slot></div> -->
`
});