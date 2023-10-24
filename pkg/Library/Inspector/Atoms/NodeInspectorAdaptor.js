export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({layerId, graph}) {
  return layerId || graph;
},
async update({layerId, graph, selected}, state, {service, isDirty}) {
  if (layerId) {
    graph = await service('GraphService', 'GetLayerGraph', {layerId});
  }
  if (!selected) {
    return {data: null, info: null};
  }
  //if (isDirty('graph') || isDirty('selected')) {
    return this.updateData({layerId, graph, selected}, service);
  //}
},
async updateData({layerId, graph, selected}, service) {
  if (selected.includes('$')) {
    log.error('"selected" contains "$"', selected);
    return;
  }
  //const ids = selected?.split('$');
  // log.debug(ids);
  // TODO(sjmiles): sometimes has 'atomName' on end, sometimes does not
  // if (ids?.length > 1) {
  //   ids.pop();
  // }
  //const objectId = ids?.join('$');
  const objectId = selected;
  // fetch node spec
  const object = graph.nodes[objectId]; 
  // implicit simple-type name at end of path (?)
  const typeName = object?.type.split('/').pop();
  // if (!info) {
  //   return {data: null, info: null};
  // }
  //const layerIO = await service('GraphService', 'GetLayerIO', {layerId})
  const nodeInfo = await service('GraphService', 'GetNodeInfo', {layerId, objectId});
  return {
    // whatever we want to display
    // TODO(sjmiles): s/info/displayInfo
    info: typeName,
    data: this.constructInspectorData(graph, objectId, nodeInfo)
  };      
},
// getObject(graph, objectId) {
//   return graph.nodes[objectId];
//   //return graph.nodes[objectId === 'DesignMain' ? 'Main' : objectId];
// },
constructInspectorData(graph, objectId, nodeInfo) {
  // generate props objects from bindings
  let props = [
    ...this.enpropenate(graph, objectId, nodeInfo.atoms),
    //...this.enpropenateSubgraph(graph, objectId, nodeInfo)
  ];
  // generate styling props if the object has a template
  if (nodeInfo.objectInfo.hasTemplate) {
    this.constructLayoutProperties(graph, objectId, graph, props);
  }
  // special handling for designer itself
  const isDesigner = objectId === graph.meta.designerId;
  if (isDesigner) {
    const externs = {CssStyle:1, canvasLayout:1};
    props = props.filter(({name}) => externs[name]);
  }
  // here's the property data in Inspector format
  const data = {
    title: objectId,
    key: objectId,
    readonly: isDesigner,
    props
  };
  //log(data);
  return data;
},
enpropenate({state, connections}, objectId, atoms) {
  const createProps = (atomId, atom, inputs) => 
    inputs?.map(name => this.newProp(objectId, connections, atomId, atom, name, state))
    ;
  const perInfoEntry = ([atomId, atom]) => createProps(atomId, atom, atom.inputs);
  const props = entries(atoms)
    .map(perInfoEntry)
    .flat()
    .filter(i=>i)
    ;
  return props;
},
newProp(objectId, connections, atomId, atom, name, state) {
  // create prop structure
  const prop = this.makeProp(atomId, name, atom.types, state);
  const propConnection = connections?.[prop.propId];
  // sort, lift, and separate
  const candidateList = this.formatCandidateList(atom.candidates, objectId, prop, propConnection);
  if (candidateList?.length > 0) {
    // remake the prop into a connection prop
    return this.makeConnectionProp(prop, candidateList, connections);
  }
  // return different prop structure
  return prop;
},
makeProp(atomId, propName, types, state) {
  const propId = `${atomId}$${propName}`;
  const atomPropId = propId.split('$').slice(1).join('$');
  return {
    name: propName, 
    propId,
    store: {
      type: types?.[atomPropId] || 'Pojo',
      values: types?.[`${atomPropId}Values`]
    },
    value: state?.[propId],
    visible: true
  };
},
formatCandidateList(candidates, objectId, prop, propConns) {
  const type = prop.store.type;
  const typedCandidates = [...new Set([...(candidates[type] ?? []), ...candidates.String, ...candidates.Pojo])];
  // candidate = {key, type, name}
  const sorter = (c1, c2) => this.sortCandidates(propConns, prop.name, type, c1, c2);
  typedCandidates.sort(sorter);
  // insert separator(s)
  let separators = {};
  const isSeparator = (type, kind) => {
    if (!separators[kind]) {
      if (type === kind) {
        return (separators[kind] = true);
      }
    }
  };
  // build select list
  const selected = [];
  typedCandidates.forEach(candidate => {
    const [objectId, atomName, propName] = candidate.split('$');
    if (!propName) {
      log.debug('candidate weirdness:', candidate);
    } else {
      if (isSeparator(type, 'Pojo') && (selected?.length > 0)) {
        selected.push({separator: true});
      }
      if (candidate.objectId !== objectId) {
        selected.push({
          key: candidate,
          name: `${objectId}-${propName}`,
        });
      }
    }
  });
  return selected;
},
sortCandidates(propConns, name, type, n1, n2) { //{key: p1, type: t1, name: n1}, {key: p2, type: t2, name: n2}) {
  // Sorting order:
  // - selected candidates come first,
  // - properties with exact type match come next,
  // - properties with the exact same name follow,
  // - properties with type `Pojo` come last
  // - and finally properties are sorted alphabetically by propId
  return this.compareCandidateProp(name, n1, n2)
    //this.compareConnectedProps(propConns, p1, p2)
    //?? this.compareCandidateProp(type, t1, t2)
    //?? this.compareCandidateProp(name, n1, n2)
    //?? this.compareCandidateProp('Pojo', t2, t1)
    ?? n1.localeCompare(n2)
    ;
},
compareConnectedProps(propConns, p1, p2) {
  const hasP1 = propConns?.includes(p1);
  const hasP2 = propConns?.includes(p2);
  if (hasP1 && !hasP2) {
    return -1; // 'p1' comes first
  }
  if (!hasP1 && hasP2) {
    return 1; // 'p2' comes first
  }
},
compareCandidateProp(value, v1, v2) {
  if (v1 === value && v2 !== value) {
    return -1; // 'v1' comes first
  } else if (v1 !== value && v2 === value) {
    return 1; // 'v2' comes first
  }
},
makeConnectionProp(prop, candidates, connections) {
  const connection = connections?.[prop.propId];
  const value = this.makeConnectionValue(connection);
  return {
    name: prop.name,
    propId: prop.propId,
    store: {
      type: 'TypeWithConnection',
      store: prop.store
    },
    value: {
      property: prop.value,
      connection: {
        values: candidates,
        value
      }
    },
    visible: true
  };
},
makeConnectionValue(value) {
  if (value) {
    return Array.isArray(value) ? value : [value];
  }
  return [];
},
// enpropenateSubgraph(graph, objectId, nodeInfo) {
//   let props = [];
//   const io = nodeInfo.objectInfo.io;
//   if (io) {
//     const [atomId, atom] = entries(nodeInfo.atoms)[0];
//     for (let input of io.i) {
//       const bits = input.split('$').slice(1);
//       const name = bits.join('::');
//       const prop = this.newProp(objectId, graph.connections, atomId, atom, name, graph.state);
//       props.push(prop);
//     }
//   }
//   return props;
// },
constructLayoutProperties(graph, objectId, object, props) {
  // this property comes from the layout store, but 
  // we want to inspect it along with objectId
  const layoutKey = `${graph.meta.designerId}$designer$layout`;
  const {l, t, w, h, ...styleValue} = graph.state?.[layoutKey]?.[objectId] ?? {};
  props.push({
    name: 'CssStyle',
    // custom-type matches type in CustomInspector map
    store: {type: 'OpenStyle'}, 
    // container prefix expected by CustomInspector
    // <prefix>InspectorContainer is created by ObjectInspector
    propId: 'OpenStyle',
    value: styleValue,
    visible: true
  });
  // virtual container property
  const {container} = object;
  props.push({
    name: 'Container',
    propId: `${objectId}$Container`,
    store: {type: 'String'},
    value: container,
    visible: true
  });
}
});
