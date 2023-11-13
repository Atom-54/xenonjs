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
  const prefixId = id.split('$').slice(2).join('$');
  state.inspectors = map(schema, 
    (label, info) => ({
      label, 
      key: label,
      ...info,
      choices: this.stratifyTypes(prefixId, label, info, candidates)
    }))
    .filter(({label}) => !['name'].includes(label))
    ;
},
stratifyTypes(prefixId, propName, propInfo, candidates) {
  //const propName = propLabel.split('$').pop();
  const choices = map(candidates, (propId, info) => {
    if (`${prefixId}$${propName}`.replace(/\$/g, '.') !== propId) {
      const name = propId.split('.').pop();
      const matchLevel = this.getTypeMatch({name, type: info.type}, {name: propName, type: propInfo.type});
      return !matchLevel ? null : {
        key: propId,
        name: propId,
        matchLevel
      };
    }
  })
  .filter(i=>i)
  .sort((a, b) => b.matchLevel - a.matchLevel)
  ;
  return choices;
},
getTypeMatch(propA, propB) {
  const objectTypes = ['Pojo', 'Json'];
  const basicTypes = ['String', 'Text', 'Number'];
  const booleanTypes = ['Nonce', 'Boolean'];
  let match = 0;
  if (propA.type === propB.type) {
    match += 3;
  } else if (basicTypes.includes(propA.type) && basicTypes.includes(propB.type)) {
    match += 2;
  } else if (objectTypes.includes(propA.type) || objectTypes.includes(propB.type)) {
    match += 2;
  } else if (booleanTypes.includes(propA.type) && booleanTypes.includes(propB.type)) {
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
  const value = eventlet.value.replace(/\./g, '$');
  service('DesignService', 'ConnectionChange', {...eventlet, id, value});
},
template: html`
<style>
  :host {
    display: flex !important;
  }
  [props] {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: start;
    /*
    justify-content: space-evenly;
    flex-wrap: wrap;
    */
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
  /* input {
    border: 1px solid gray;
    border-radius: 4px;
    margin-right: 0.5em;
  } */
  [select] {
    /* flex: 0 0 auto; */
    margin-right: 0.5em;
    /* width: 1.3em; */
  }
</style>

<div props repeat="input_t">{{inspectors}}</div>

<template input_t>
  <label>
    <span label>{{label}}</span>
    <div row>
      <multi-select flex select key="{{key}}" options="{{choices}}" on-change="onPropChange"></multi-select>
      <!-- <input flex list$="{{label}}"> -->
      <!-- <datalist id="{{label}}" repeat="dl_options_t">{{choices}}</datalist> -->
      <!-- <select repeat="s_options_t">{{choices}}</select> -->
      <!-- <multi-select select on-change="onPropChange" options="{{choices}}"></multi-select> -->
    </div>
  </label>
</template>

<!-- <template dl_options_t>
  <option name="{{value}}" value="{{value}}"></option>
</template>

<template s_options_t>
  <option value="{{value}}">{{value}}</option>
</template> -->
`
});
    