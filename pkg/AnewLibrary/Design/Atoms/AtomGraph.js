export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({layerId, selected}) {
  return Boolean(layerId);
},
async update({layerId, selected}, state, {service}) {
  state.selected = selected;
  state.info = await service('DesignService', 'GetLayerInfo', {layerId});
},
shouldRender({layerId},{info}) {
  return Boolean(layerId && info);
},
render({layerId}, {info, selected}) {
  const nodables = info.atoms
    .filter(atom => atom.id.split('$').length < 4 && !atom.id.includes('$Panel'))
    ;
  const [w, h] = [260, 140];
  const {inputs} = info.connections;
  let edges = [];
  nodables.forEach((atom, i) => {
    for (let [id, binding] of Object.entries(inputs)) {
      if (id.startsWith(atom.id + '$')) {
        edges.push({id, binding});
      }
    }
  });
  const edgeClipper = id => id.split('$').slice(0, 3).join('-'); 
  const cleanEdges = edges.filter(edge => {
    const sourceId = edgeClipper(edge.id);
    const cleanBinding = edge.binding.filter(bound => {
      const targetId = edgeClipper(bound);
      return sourceId !== targetId;
    });
    if (cleanBinding.length) {
      edge.binding = [...new Set(cleanBinding)];
      return true;
    }
  });
  edges = cleanEdges;
  //
  const atoms = nodables.map((atom, i) => {
    const stride = 3;
    const inputs = cleanEdges
      .flatMap(({id, binding}) => binding
        .filter(id => id.startsWith(atom.id + '$'))
        .map(id=>({name: id.split('$').slice(3).join('$')}))
      )
      ;
    const outputs = cleanEdges
      .filter(({id}) => id.startsWith(atom.id + '$'))
      .map(({id})=>({name: id.split('$').slice(3).join('$')}))
      ;
    return {
      id: atom.id, 
      atomId: atom.id.replace(/\$/g, '-'),
      type: atom.type,
      selected: atom.id === selected,
      displayName: atom.id.slice(layerId.length + 1),
      style: {
        left: 64 + w*(i%stride) + 'px', top: 32 + h*Math.floor(i/stride) + h/2*(Math.sin((i%stride)*Math.PI*.8/2)) + 'px', width: '200px'
      },
      inputs,
      outputs
    };
  })
  ;
  return {
    atoms,
    edges
  };
},
onAtomSelect({eventlet: {key}}, state, {service}) {
  service('DesignService', 'Select', {atomId: key});
},
onKeyDown({eventlet}, state, {service}) {
  if (['Delete', 'Backspace'].includes(eventlet.key) && state.selected) {
    service('DesignService', 'Delete', {atomId: state.selected});
  }
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
  <atom-graph flex atoms="{{atoms}}" edges="{{edges}}" selected="{{selected}}" on-atom-moved="onAtomMoved" on-atom-selected="onAtomSelect"></atom-graph>
</drop-target>

<!-- last, therefore on top -->
<!-- <div floating><slot name="toolbar"></slot></div> -->
`
});