export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({id, schema, candidates}, state) {
  state.inspectors = map(schema, 
    (label, info) => ({
      label, 
      ...info,
      choices: this.stratifyTypes(id, label, info, candidates)
    }));
},
stratifyTypes(hostId, propName, propInfo, candidates) {
  //const propName = propLabel.split('$').pop();
  const choices = map(candidates, (name, info) => {
    if (`${hostId}$${propName}` !== name) {
      const simpleName = name.split('$').pop();
      const matchLevel = this.getTypeMatch({name: simpleName, type: info.type}, {name: propName, type: propInfo.type});
      return !matchLevel ? null : {
        value: name,
        name,
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
  [repeat] {
    flex: 1;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  label {
    display: flex;
    flex-direction: column;
    padding: 0.3em 0;
    padding-right: 0.5em;
    /* 
    border: 1px solid silver;
    margin: 0.25em; 
    align-items: center; 
    */
  }
  span {
    width: 10em;
    font-size: 0.75em;
    margin-bottom: 0.1em;
    /* 
    margin-right: 1em;
    text-align: left; 
    */
  }
  input {
    width: 15em;
    border: 1px solid gray;
    border-radius: 4px;
    margin-right: 0.5em;
  }
  select {
    width: 1.3em;
  }
</style>
<div repeat="input_t">{{inspectors}}</div>
<template input_t>
  <label>
    <span>{{label}}</span>
    <div row>
      <input list$="{{label}}">
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
    