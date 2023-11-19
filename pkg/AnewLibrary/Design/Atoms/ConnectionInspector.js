export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({id, schema, candidates}) {
  return id && schema && candidates;
},
update({id, schema, candidates}, state) {
  const skipProperties = ['name'];
  const prefixId = id.split('$').slice(2).join('$');
  state.inspectors = map(schema, 
    (label, {type, connection}) => ({
      label, 
      key: label,
      choices: this.stratifyTypes(prefixId, label, type, candidates, connection)
    }))
    .filter(({label}) => !skipProperties.includes(label.split('.').pop()))
    ;
},
stratifyTypes(prefixId, propName, type, candidates, connection) {
  connection = connection?.replace(/\$/g, '.');
  const target = `${prefixId}$${propName}`.replace(/\$/g, '.');
  const choices = map(candidates, (propId, info) => {
    if (target !== propId) {
      const name = propId.split('.').pop();
      const targetName = propName.split('.').pop();
      const matchLevel = this.getTypeMatch({name, type: info.type}, {name: targetName, type: type});
      return !matchLevel ? null : {
        key: propId,
        name: propId,
        selected: connection === propId,
        matchLevel
      };
    }
  })
  .filter(i=>i)
  .sort((a, b) => b.matchLevel - a.matchLevel)
  ;
  //return choices;
  return [{}, ...choices];
},
getTypeMatch(propA, propB) {
  let match = 0;
  const intersect = (a, b) => {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
  };
  const objectTypes = ['Pojo', 'Json'];
  const basicTypes = ['String', 'Text', 'Number'];
  const booleanTypes = ['Nonce', 'Boolean'];
  const [A, B] = [propA.type, propB.type];
  if (A === B || (intersect(A.split('|'), B.split('|')))) {
    match += 3;
  } else if (basicTypes.includes(A) && basicTypes.includes(B)) {
    match += 2;
  } else if (objectTypes.includes(A) || objectTypes.includes(B)) {
    match += 2;
  } else if (booleanTypes.includes(A) && booleanTypes.includes(B)) {
    match += 2;
  }
  if (match) {
    if (propA.name === propB.name) {
      match += 2;
    }
  }
  return match;
},
onPropChange({eventlet, id}, state, {service}) {
  const value = eventlet.value?.replace(/\./g, '$');
  service('DesignService', 'ConnectionChange', {...eventlet, id, value});
},
template: html`
<style>
  [props] {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: start;
    padding: 0.5em 0.3em;
  }
  label {
    display: flex;
    flex-direction: column;
    padding: 0.3em;
    padding-right: 0.5em;
  }
  [label] {
    width: 10em;
    font-size: 0.75em;
    margin-bottom: 0.3em;
  }
  [select] {
    margin-right: 0.5em;
  }
</style>

<div props repeat="input_t">{{inspectors}}</div>

<template input_t>
  <label>
    <span label>{{label}}</span>
    <div row>
      <multi-select flex select key="{{key}}" options="{{choices}}" on-change="onPropChange"></multi-select>
    </div>
  </label>
</template>
`
});
    