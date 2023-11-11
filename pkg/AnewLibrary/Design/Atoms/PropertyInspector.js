export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({id, schema, candidates}, state) {
  state.props = map(schema, 
    (label, info) => {
      const $template = this.templateForType(info.type);
      if ($template) {
        let {value} = info;
        if (value && typeof value === 'object') {
          value = JSON.stringify(value, null, '  ');
        }
        const model = {
          ...info,
          label, 
          value
        };
        return {
          prop: {
            $template,
            models: [model]
          }
        };
      }
    }
  ).filter(i => i);
},
templateForType(type) {
 //log.debug(type);
  switch (true) {
    case type.includes('Boolean'):
      return 'boolean_t';
    case type.includes('String'):
      return 'string_t';
    default:
      return 'textarea_t';
  };
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
    padding: 0.5em 0.3em;
  }
  [prop] {
    padding: 0.3em;
  }
  [label] {
    width: 10em;
    font-size: 0.75em;
    margin-bottom: 0.3em;
  }
  input {
    border: 1px solid gray;
    border-radius: 4px;
  }
  [column][left] {
    align-items: start;
  }
</style>

<div props repeat="prop_t">{{props}}</div>

<template prop_t>
  <div prop>{{prop}}</div>
</template>

<template string_t>
  <label column>
    <span label>{{label}}</span>
    <input flex list$="{{label}}">
  </label>
</template>

<template textarea_t>
  <label column>
    <span label>{{label}}</span>
    <textarea rows="{{rows}}" key="{{key}}" value="{{value}}" on-change="onPropChange"></textarea>
  </label>
</template>

<template boolean_t>
  <label column left>
    <span label>{{label}}</span>
    <input type="checkbox" key="{{key}}" checked="{{value}}" on-change="onPropChange">
  </label>
</template>

`
});
    