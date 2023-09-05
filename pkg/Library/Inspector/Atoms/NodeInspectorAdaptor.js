export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({graph}) {
  return graph;
},
async update({graph, selected}, state, {service, isDirty}) {
  if (isDirty('graph') || isDirty('selected')) {
    return this.updateData({graph, selected}, service);
  }
},
async updateData({graph, selected}, service) {
  const ids = selected?.split('$');
  // TODO(sjmiles): sometimes has 'atomName' on end, sometimes does not
  if (ids?.length > 1) {
    ids.pop();
  }
  const objectId = ids?.join('$');
  // put graph-object type info into inspector info
  const object = this.getObject(graph, objectId);
  const info = object?.type.split('/').pop();
  if (!info) {
    //log('inspect: could not get info for id', objectId);
    return {data: null, info: null};
  }
  const graphInfo = await service('GraphService', 'GetNodeInfo', {objectId});
  return {
    data: this.constructData(objectId, graph, graphInfo),
    info
  };      
},
getObject(graph, objectId) {
  return graph.nodes[objectId];
  //return graph.nodes[objectId === 'DesignMain' ? 'Main' : objectId];
},
constructData(objectId, graph, {atoms, objectInfo}) {
  // gather props from bindings
  let props = this.enpropenate(graph, objectId, atoms);
  if (objectInfo[objectId]?.hasTemplate) {
    // this property comes from the layout store, but 
    // we want to inspect it along with objectId
    const layoutKey = `${graph.meta.designerId}$designer$layout`;
    const {l, t, w, h, ...styleValue} = graph.state?.[layoutKey]?.[objectId] ?? {};
    props.push({
      name: 'CssStyle',
      // custom-type matches type in CustomInspector map
      store: {$type: 'OpenStyle'}, 
      // container prefix expected by CustomInspector
      // <prefix>InspectorContainer is created by ObjectInspector
      propId: 'OpenStyle',
      value: styleValue,
      visible: true
    });
    // virtual property
    const {container} = this.getObject(graph, objectId);
    props.push({
      name: 'Container',
      propId: `${objectId}$Container`,
      store: {$type: 'String'},
      value: container,
      visible: true
    });
  }
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
  const props = [];
  // TODO(sjmiles): warning bug prone because of the closure (bad scoping)
  const rename = ({key, name, objectId, separator}) => ({
    key,
    // name: `${objectId} (${system[atomId].type.split('/').pop()})-${name}`
    name: `${objectId}-${name}`,
    separator
  });
  const newProp = (atomId, atom, name) => {
    const prop = this.makeProp(atomId, name, atom.types, state);
    const candidates = this.formCandidates(atom.candidates, objectId, prop, connections?.[prop.propId]);
    if (candidates?.length > 0) {
      return this.makeConnectionProp(prop, candidates.map(rename), connections);
    }
    return prop;
  };
  const addProps = (atomId, atom, inputs) => {
    inputs?.forEach(name => props.push(newProp(atomId, atom, name)));
  };
  const perInfoEntry = ([atomId, atom]) => {
    addProps(atomId, atom, atom.inputs);
    addProps(atomId, atom, atom.props);
  };
  const byId = ([atomid])=>atomid.startsWith(`${objectId}$`);
  entries(atoms).filter(byId).forEach(perInfoEntry);
  return props;
},
formCandidates(candidates, objectId, prop, propConns) {
  const selected = [];
  let separator = false;
  const type = prop.store.$type;
  const typedCandidates = candidates[type]?.sort((candidate1, candidate2) => this.sortCandidates(propConns, prop.name, type, candidate1, candidate2)) ?? [];
  typedCandidates.forEach(candidate => {
    if (!separator && (candidate.type === 'Pojo')) {
      if (selected?.length > 0) {
        selected.push({separator: true});
      }
      separator = true;
    }
    if (candidate.objectId !== objectId) {
      selected.push(candidate);
    }
  });
  return selected;
},

sortCandidates(propConns, name, type, {key: p1, type: t1, name: n1}, {key: p2, type: t2, name: n2}) {
  // Sorting order:
  // - selected candidates come first,
  // - properties with exact type match come next,
  // - properties with the exact same name follow,
  // - properties with type `Pojo` come last
  // - and finally properties are sorted alphabetically by propId
  return this.compareConnectedProps(propConns, p1, p2)
    ?? this.compareCandidateProp(type, t1, t2)
    ?? this.compareCandidateProp(name, n1, n2)
    ?? this.compareCandidateProp('Pojo', t2, t1)
    ?? p1.localeCompare(p2);
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

makeProp(atomId, propName, types, state) {
  const propId = `${atomId}$${propName}`;
  const atomPropId = propId.split('$').slice(1).join('$');
  return {
    name: propName, 
    propId,
    store: {
      $type: types?.[atomPropId] || 'Pojo',
      values: types?.[`${atomPropId}Values`]
    },
    value: state?.[propId],
    visible: true
  };
},
makeConnectionProp(prop, candidates, connections) {
  const value = this.makeConnectionValue(connections?.[prop.propId]);
  return {
    name: prop.name,
    propId: prop.propId,
    store: {
      $type: 'TypeWithConnection',
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
}
});
