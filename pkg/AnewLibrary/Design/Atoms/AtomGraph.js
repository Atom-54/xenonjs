export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({layerId, selected}, state, {service}) {
  state.selected = selected;
  state.info = await service('DesignService', 'GetLayerInfo', {layerId});
},
render({layerId}, {info, selected}) {
  const atomFilter = atom => {
    const prefixId = atom.id.split('$').slice(2).join('$');
    const prefix = (prefixId + '$').replace(/\$/g, '.');
    return ([id]) => id.startsWith(prefix);
  };
  const getIOProps = (io, idFilter) => 
    entries(io)
    .filter(idFilter)
    .map(([id, value]) => ({name: id.split('.').slice(1).join('.'), ...value}))
    .filter(({name}) => !['name'].includes(name.split('.').pop()))
    ;
  const nodables = info.atoms
    .filter(atom => atom.id.split('$').length < 4 && !atom.id.includes('$Panel'))
    ;
  const [w, h] = [260, 140];
  const atoms = nodables
    .map((atom, i) => {
      const stride = 3;
      const idFilter = atomFilter(atom);
      return {
        id: atom.id, 
        atomId: atom.id.replace(/\$/g, '-'),
        type: atom.type,
        selected: atom.id === selected,
        displayName: atom.id.slice(layerId.length + 1),
        style: {
          left: 64 + w*(i%stride) + (Math.floor(i/stride)%2)*w/4 + 'px', top: 32 + h*Math.floor(i/stride) + ((i%stride)%2)*h/4 + 'px', width: '200px'
        },
        inputs: getIOProps(info.schema.inputs, idFilter),
        outputs: getIOProps(info.schema.output, idFilter)
      };
    })
    ;
  const {inputs} = info.connections;
  const edges = [];
  nodables.forEach((atom, i) => {
    for (let [id, binding] of Object.entries(inputs)) {
      if (id.startsWith(atom.id + '$')) {
        //log.debug(id, binding)
        edges.push({id, binding});
      }
    }
  });
  return {
    atoms,
    edges
  };
},

// renderGraph(graph, selectedId, graphInfo) {
//   const graphEdges = this.renderGraphEdges(graph);
//   return {
//     name: graph?.meta?.id,
//     graphAtoms: this.renderGraphAtoms(graph, selectedId, graphInfo, graphEdges),
//     graphEdges
//   };
// },

// renderGraphAtoms(graph, selectedId, graphInfo, graphEdges) {
//   const renderAtom = id => {
//     return {
//       key: id,
//       name: id,
//       displayName: id,
//       selected: selectedId === id,
//       ...this.renderIO(id, graphInfo, graphEdges)
//     }
//   };
//   return keys(graph?.atoms).filter(i=>i!='Main').map(id => renderAtom(id));
// },

// renderGraphEdges(graph) {
//   const mapEdges = (to, from) => {
//     const toTokens = to.split('$');
//     const toConn = {
//       id: toTokens.shift(),
//       storeName: toTokens.pop()
//     };
//     if (typeof from === 'string') {
//       from = [from];
//     }
//     return from?.map(from => {
//       const fromTokens = from.split('$');
//       return {
//         from: {
//           id: fromTokens.shift(),
//           storeName: fromTokens.pop()
//         },
//         to: toConn
//       };
//     });
//   };
//   return map(graph?.connections, mapEdges).flat();
// },

// renderIO(id, graphInfo, graphEdges) {
//   const atoms = this.getAtomsByPrefix(id, graphInfo);
//   return {
//     inputs: atoms.flatMap(atom => this.renderDataChannel(atom, atom.inputs??[], graphEdges)),
//     outputs: atoms.flatMap(atom => this.renderDataChannel(atom, atom.outputs??[]))
//   };
// },

// renderDataChannel(atom, channel, graphEdges) {
//   //const n = atom.id.replace('_', '-');
//   return channel
//     .filter(i => !graphEdges || graphEdges.some(({to: {id, storeName}}) => i === storeName))
//     .map(i => ({
//       //name: `${n}-${i}`, 
//       name: i,
//       type: atom.types?.[`${atom.id}$${i}`] ?? 'Pojo'
//     }))
//   ;
// },

// getAtomsByPrefix(id, graphInfo) {
//   // $NameOfObject$[<nameOfAtom$>nameOfAtom]
//   // -----idl-----^ == slicing length to remove $id$
//   const idl = id.length + 2;
//   return entries(graphInfo?.system)
//     .filter(([atomId]) => atomId.startsWith(`$${id}$`))
//     .map(([id, atom]) => ({...atom, id: id.slice(idl)}))
//     ;
// },

onAtomSelect({eventlet: {key}}, state, {service}) {
  service('DesignService', 'Select', {atomId: key});
},

onKeyDown({eventlet}, state, {service}) {
  if (['Delete', 'Backspace'].includes(eventlet.key) && state.selected) {
    service('DesignService', 'Delete', {atomId: state.selected});
  }
},

// onAtomMoved({eventlet: {key, value}}, {graph}, {service}) {
//   const graphRects = graph.meta.graphRects ??= {};
//   keys(value).forEach(key => value[key] = Math.round(value[key]));
//   if (JSON.stringify(graphRects[key]) !== JSON.stringify(value)) {
//     graphRects[key] = value;
//     const meta = {...graph.meta, graphRects};
//     service('DesignService', 'SetGraphMeta', meta);
//     return {
//       graph: {...graph, meta}
//     }
//   }
// },

// async onAtomTypeDropped({eventlet: {value}}, state, {service}) {
//   await service('DesignService', 'AddObject', {key: value});
// },

template: html`
<style>
  :host {
    display: flex;
    flex: 1 !important;
    /* height: 100%; */
    /* position: relative; */
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