export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({id, schema, candidates}, state) {
  state.inspectors = map(schema, 
    (label, info) => ({
      label, 
      ...info,
      choices: this.stratifyTypes(id, label, info, candidates)
    }))
    .filter(({label}) => !['name'].includes(label))
    ;
},
stratifyTypes(hostId, propName, propInfo, candidates) {
  //const propName = propLabel.split('$').pop();
  const choices = map(candidates, (propId, info) => {
    if (`${hostId}$${propName}` !== propId) {
      const name = propId.split('.').pop();
      const matchLevel = this.getTypeMatch({name, type: info.type}, {name: propName, type: propInfo.type});
      return !matchLevel ? null : {
        value: propId,
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
  const basicTypes = ['String', 'Text', 'Number', 'Nonce', 'Boolean'];
  let match = 0;
  if (propA.type === propB.type) {
    match += 3;
  } else if (basicTypes.includes(propA.type) && basicTypes.includes(propB.type)) {
    match += 2;
  } else if (objectTypes.includes(propA.type) || objectTypes.includes(propB.type)) {
    match += 2;
  }
  if (match) {
    if (propA.name === propB.name) {
      match += 2;
    }
  }
  return match;
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
  input {
    border: 1px solid gray;
    border-radius: 4px;
    margin-right: 0.5em;
  }
  select {
    flex: 0 0 auto;
    width: 1.3em;
  }
</style>

<div props repeat="input_t">{{inspectors}}</div>

<template input_t>
  <label>
    <span label>{{label}}</span>
    <div row>
      <input flex list$="{{label}}">
      <!-- <datalist id="{{label}}" repeat="dl_options_t">{{choices}}</datalist> -->
      <select repeat="s_options_t">{{choices}}</select>
    </div>
  </label>
</template>

<template dl_options_t>
  <option name="{{value}}" value="{{value}}"></option>
</template>

<template s_options_t>
  <option value="{{value}}">{{value}}</option>
</template>
`
});
    