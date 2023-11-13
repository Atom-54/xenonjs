export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({schema}, state, {output}) {
  state.props = [];
  await output();
  state.props = map(schema, 
    (label, info) => {
      const $template = this.templateForType(info.type);
      if ($template) {
        let {value} = info;
        const isObject = value && typeof value === 'object';
        if (isObject) {
          value = JSON.stringify(value, null, '  ');
        }
        const rows = value?.split?.('\n').length || 3;
        const model = {
          ...info,
          label, 
          value,
          key: label,
          rows,
          isObject
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
async onPropChange({eventlet, id}, state, {service}) {
  const {prop} = state.props.find(({prop}) => prop.models[0].key === eventlet.key);
  const model = prop.models[0];
  if (model.isObject) {
    const result = await service('JsonRepairService', 'Repair', {value: eventlet.value});
    if (!result) {
      log.warn('Doh!');
      return;
    }
    try {
      eventlet.value = JSON.parse(result.json);
    } catch(x) {
      eventlet.value = {};
    }
  }
  model.value = eventlet.value;
  service('DesignService', 'PropertyChange', {...eventlet, id});
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
    padding: .5em .3em;
  }
  [prop] {
    padding: .3em;
  }
  [label] {
    width: 10em;
    font-size: .75em;
    margin-bottom: .3em;
  }
  input {
    border: 1px solid gray;
    border-radius: 4px;
    padding: .4em;
  }
  textarea {
    padding: .4em .2em;
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
    <input flex key="{{key}}" list$="{{label}}" value="{{value}}" on-change="onPropChange">
  </label>
</template>

<template textarea_t>
  <label column>
    <span label>{{label}}</span>
    <textarea rows$="{{rows}}" key="{{key}}" value="{{value}}" on-change="onPropChange"></textarea>
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
    