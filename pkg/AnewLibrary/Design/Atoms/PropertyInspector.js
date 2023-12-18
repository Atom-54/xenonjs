export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({schema, selected}, state, {output, service}) {
  // clear dom cache
  state.props = [];
  // force output (render) cycle
  await output();
  // maybe convert schema entries into property models
  state.props = await this.propsFromSchema(selected, service);
},
async propsFromSchema(selected, service) {
  const {schema} = await service('DesignService', 'GetHostSchema', {key: selected});
  const propFromSchema = (label, info) => this.propFromSchema(label, info);
  return map(schema, propFromSchema).filter(i => i);
},
propFromSchema(label, info) {
  // info must have a type with `includes` method
  if (info?.type?.includes) {
    // determine a template
    const $template = this.templateForType(info.type);
    // only inspectable labels are inspectable
    const typeOk = this.inspectablePropertyLabel(label);
    if ($template && typeOk) {
      // if we have all the pieces, assemble the voltron
      return this.composeModel(label, info, $template);
    }
  }
},
composeModel(label, info, $template) {
  // render-model for property template
  const model = {
    label,
    key: label,
    ...this.renderPropertyInfo(info)
  };
  // wrapper so each record can select a template
  return {
    prop: {
      $template,
      models: [model]
    }
  };
},
// a selection of editors
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
// filter out many sublayer properties
inspectablePropertyLabel(label) {
  const propId = label.split('.');
  const propDepth = propId.length;
  const propName = propId.pop();
  const hiddenSubPropTypes = ['style', 'form', 'layout', 'center', 'action', 'value', 'options', 'storeValue', 'inputData', 'submittedRecord'];
  const typeOk = (propDepth < 2) || !hiddenSubPropTypes.includes(propName);
  return typeOk;
},
// generate render model from property `info`
renderPropertyInfo(info) {
  let {value, type} = info;
  // flags, formatting, and calculated values
  const isObject = this.isObject(value, type);
  if (isObject) {
    value = this.JSONify(value);
  }
  const isNumber = type.includes('Number');
  const rows = value?.split?.('\n').length || 3;
  // render model
  return {
    ...info,
    value,
    rows,
    isObject,
    isNumber
  };
},
isObject(value, type) {
  return (value && (typeof value === 'object')) || type.includes('Pojo') || type.includes('Json');
},
JSONify(value) {
  let json = JSON.stringify(value, null, '  ');
  if (json === 'null') {
    json = '';
  }
  return json;
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
    padding: .1em;
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

<template object_t>
  <label column>
    <span label>{{label}}</span>
    <div props repeat="prop_t">{{props}}</div>
  </label>
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
    