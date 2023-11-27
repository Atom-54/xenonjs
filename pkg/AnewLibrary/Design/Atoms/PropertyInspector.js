export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({schema}, state, {output}) {
  state.props = [];
  await output();
  state.props = map(schema, (label, info) => {
    if (info?.type?.includes) {
      const $template = this.templateForType(info.type);
      const propId = label.split('.');
      const propDepth = propId.length;
      const propName = propId.pop();
      const typeOk = propDepth < 2 || !['style', 'form', 'layout', 'center', 'action', 'value', 'options', 'storeValue', 'inputData', 'submittedRecord'].includes(propName);
      if ($template && typeOk) {
        let {value} = info;
        const isObject = (value && (typeof value === 'object')) || info.type.includes('Pojo') || info.type.includes('Json');
        if (isObject) {
          value = JSON.stringify(value, null, '  ');
          if (value === 'null') {
            value = '';
          }
        }
        const isNumber = info.type.includes('Number');
        const rows = value?.split?.('\n').length || 3;
        const model = {
          ...info,
          label, 
          value,
          key: label,
          rows,
          isObject,
          isNumber
        };
        return {
          prop: {
            $template,
            models: [model]
          }
        };
      }
    }
  })
  .filter(i => i)
  ;
},
templateForType(type) {
  switch (true) {
    case type.includes('Nonce'):
      return 'nonce_t';
    case type.includes('Boolean'):
      return 'boolean_t';
    case type.includes('String'):
      return 'string_t';
    default:
      return 'textarea_t';
  };
},
async onPropChange({eventlet: {key, value, nopersist}, id}, state, {service}) {
  const {prop} = state.props.find(({prop}) => prop.models[0].key === key);
  const model = prop.models[0];
  if (model.isObject) {
    const result = await service('JsonRepairService', 'Repair', {value});
    if (!result) {
      log.warn('Doh!');
      return;
    }
    try {
      value = JSON.parse(result.json);
    } catch(x) {
      value = {};
    }
    model.value = JSON.stringify(value, null, '  ');
  } else {
    model.value = value;
  }
  if (model.isNumber) {
    value = Number(value) || 0;
  }
  service('DesignService', 'PropertyChange', {key, value, nopersist, id});
},
onNonceClick({eventlet: {key}, id}, state, tools) {
  return this.onPropChange({eventlet: {key, value: Math.random(), nopersist: true}, id}, state, tools);
},
onNonceOffClick({eventlet: {key}, id}, state, tools) {
  return this.onPropChange({eventlet: {key, value: null}, id}, state, tools);
},
template: html`
<style>
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

<template nonce_t>
  <div prop-container vertical>
    <div label control>{{displayName}}</div>
    <wl-button key="{{key}}" on-click="onNonceClick">{{label}}</wl-button>
    <wl-button key="{{key}}" on-click="onNonceOffClick">(Off)</wl-button>
  </div>
</template>
`
});
    