export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({data}, state, {output}) {
  if (data?.key !== state.oldData?.key) {
    state.checkedConns = {};
  }
  state.oldData = data;
  await this.refreshRendering(state, output);
  state.data = data;
  return {data};
},
async refreshRendering(state, output) {
  // clear out rendered flyweight data
  state.shouldClear = true;
  // render on output
  await output({});
  // next time render normally
  state.shouldClear = false;
},
render({data, customInspectors}, state) {
  if (state.shouldClear) {
    return {title: '', props: []};
  }
  let title = data?.title || 'Nothing to inspect.';
  const readonly = Boolean(data?.readonly);
  state.renderedProps = this.renderProps(data, customInspectors, state);
  return {
    title,
    showNothingToInspect: String(data == null),
    disableRename: readonly,
    showToolbar: String(!readonly && Boolean(data !== null)),
    props: state.renderedProps
  };
},
renderProps(data, customInspectors, state) {
  return !Array.isArray(data?.props) ? null :
    data.props
      .filter(prop => prop.visible)
      .map(prop => this.renderProp(prop, undefined, customInspectors, state))
    ;
},
renderProp(prop, parent, customInspectors, state) {
  const key = `${parent ? `${parent}:` : ''}${prop.name}`;
  const $template = this.chooseTemplate(prop, state.editedKey === key, customInspectors);
  const model = this.constructPropModel(key, prop, parent, $template, state);
  return {
    prop: {
      $template,
      models: [model]
    }
  };
},
chooseTemplate({store: {type, values, range}, value}, isEditing, customInspectors) {
  let template = {
    Boolean: 'checkbox_t',
    Nonce: 'nonce_t',
    String: 'text_t',
    Number: 'text_t',
    Image: 'imageupload_t',
   '[Image]': 'batchimageupload_t',
    number: 'text_t',
    string: 'text_t',
    boolean: 'checkbox_t',
    Select: 'select_t',
    MultilineText: 'textarea_t',
    TypeWithConnection: 'prop_with_conn_t'
  }[type] ?? 'unimpl_t';
  if (customInspectors?.[type]) {
    template = 'custom_t';
  } else if (type === 'Number' && ['min', 'max', 'step'].every(key => keys(range || {}).some(k => k === key))) {
    template = 'range_t';
  } else if (['unimpl_t', 'text_t'].includes(template) && Array.isArray(values)) {
    template = 'select_t';
  } else if (template === 'unimpl_t') {
    template = 'edit_object_as_json_t';
  }
  return template;
},
constructPropModel(key, prop, parent, template, state) {
  const {name, propId, store: {type, values, range, multiple}, value, disabled, displayName} = prop;
  let model = {
    name,
    key,
    displayName: displayName || name,
    type: type,
    disabled,
    value
  };
  switch (template) {
    case 'prop_with_conn_t': {
      model = this.renderProp({...prop, value: prop.value.property, store: prop.store.store}, parent, {}, state);
      delete model.prop?.models?.[0]?.displayName;
      assign(model, this.formatConnectionSelect(prop, state));
      break;
    }
    case 'imageupload_t': {
      // model.value ||= 'assets/icon.png';
      model.value = model.value?.url ?? '';
      model.hidden = Boolean(!model.value);
      break;
    }
    case 'select_t': {
      const selected = model.value;
      model.value = this.formatSelectValues(values, selected);
      model.disabled ||= model.value?.length === 1;
      model.multiple = multiple;
      break;
    }
    case 'range_t': {
      const {min, max, step} = range;
      model = {...model, min, max, step, value: model.value || min};
      break;
    }
    case 'edit_object_as_json_t': {
      state.editedKey = model.key;
      model.value = JSON.stringify(model.value, null, '  ');
      model.rows = this.calculateTextRows(model, state);
      break;
    }
    case 'object_t': {
      model.displayName = `${parent ? `${parent}:` : ''}${model.displayName}`;
      if (Array.isArray(model.value)) {
        model.props = [{
          prop: {
            $template: 'list_t',
            models: [{
              key: model.key,
              props: entries(model.value).map(
                ([index, value]) => ({
                  ...this.renderSubProp(model.displayName, {name: index, value}, state),
                  listKey: model.key,
                  itemKey: `${model.key}:${index}`
                })
              )
            }]
          }
        }];
      } else {
        model.props = entries(model.value).map(
          ([name, value]) => this.renderSubProp(model.displayName, {name, value}, state)
        );
      }
      break;
    }
    case 'custom_t': {
      model.container = `${propId}InspectorContainer`;
      break;
    }
    case 'textarea_t':
    case 'text_t': {
      model.value = model.value ?? '';
      model.rows = this.calculateTextRows(model, state);
      break;
    }
    case 'checkbox_t': {
      model.value = Boolean(model.value);
      break;
    }
  }
  return model;
},
formatSelectValues(values, selected) {
  const formatted = values.map(v => {
    if (typeof v !== 'object') {
      v = {key: v, name: v};
    }
    return {
      ...v,
      selected: Array.isArray(selected) ? selected?.includes(v.key) : selected === v.key
    };
  });
  formatted.splice(0, 0, {key: '', name: '', selected: !formatted.some(v => v.selected)});
  return formatted;
},
calculateTextRows({key, value}, state) {
  let rows = String(value??'').split('\n').length??1;
  if (state.data.props[state.data.props.length - 1].name === key) {
    rows = Math.max(rows, 10);
  } else {
    rows = Math.min(rows, 30);
  }
  return rows;
},
initCheckedConn(prop, checked) {
  if (checked === undefined) {
    const noValue = ((prop.value.property === null) || (prop.value.property === undefined));
    const hasConnection = (prop.value.connection.value?.length > 0);
    const nonConcreteType = !['String', 'Number', 'Boolean', 'Nonce'].includes(prop.store.store.type);
    return {
      checked: (noValue && nonConcreteType) || hasConnection,
      multi: Array.isArray(prop.value.connection.value) && prop.value.connection.value.length > 1
    };
  }
  return checked;
},
formatConnectionSelect(prop, {checkedConns}) {
  const key = `${prop.name}-connection`;
  const displayName = prop.displayName || prop.name;
  const {values, value} = prop.value.connection ?? {};
  checkedConns[key] = this.initCheckedConn(prop, checkedConns[key]);
  const checkedConn = Boolean(checkedConns[key].checked);
  const checkedMulti = Boolean(checkedConns[key].multi);
  const hideMulti = !checkedConn || (prop.value.connection.value?.length > 1);
  return  {
    connection: {
      $template: 'select_t',
      models: [{
        key,
        name: key,
        value: values && this.formatSelectValues(values, value),
        multiple: checkedMulti,
        size: checkedMulti ? 6 : undefined
      }],
    },
    key,
    displayName,
    checkedConn,
    checkedMulti,
    hideMulti,
    showConn: String(checkedConn),
    showProp: String(!checkedConn)
  };
},
renderSubProp(parent, {name, value}, state) {
  const type = typeof value;
  return this.renderProp({name, store: {type: type}, value}, parent, {}, state);
},
onPropChange({eventlet: {key, value}, data}, state, {service}) {
  const propNames = key.split(':');
  const formatter = (propValue, propStore) => this.formatPropValueByType(propValue, propStore || {}, value);
  return this.updatePropValue(data, propNames, formatter, service);
},
onNonceClick({eventlet: {key}, data}, state, tools) {
  const eventlet = {key, value: Math.random()};
  return this.onPropChange({eventlet, data}, state, tools);
},
onImageUrl({eventlet: {key, value}, data}, state, tools) {
  const image = {url: value};
  const eventlet = {key, value: image};
  return this.onPropChange({eventlet, data}, state, tools);
},
onConnChecked({eventlet, data}, state, tools) {
  const conn = state.checkedConns[eventlet.key];
  eventlet.value = conn.checked = !conn.checked;
  if (!conn.checked) {
    return this.onPropChange({eventlet, data}, state, tools);
  }
},
onMultiChecked({eventlet: {key}, data}, state) {
  const conn = state.checkedConns[key];
  conn.multi = !conn.multi;
},
onPubChecked({eventlet: {key}, data}, state) {
  const conn = state.checkedConns[key];
  conn.pub = !conn.pub;
},
onAddItem({eventlet: {key, value}, data}, state, {service}) {
  const propNames = key.split(':');
  const formatter = (propValue, {type: propType}) => [...propValue, this.makeNewItem(value, propType)];
  return this.updatePropValue(data, propNames, formatter, service);
},
makeNewItem(value, propType) {
  if (propType === '[Image]') {
    return {src: value || ''};
  } else if (propType === '[String]') {
    return '';
  } else if (propType === '[JSON]') {
    return {};
  }
},

onRemoveItem({eventlet: {key}, data}, state, {service}) {
  assign(state, {editedKey: null});
  const propNames = key.split(':');
  // TODO(mariakleiner): currently list add/remove is only support for top level props.
  const index = propNames.splice(1, 1)[0];
  const formatter = (propValue) => propValue.filter((_, i) => i !== Number(index));
  return this.updatePropValue(data, propNames, formatter, service);
},

async onEditObject({eventlet: {key}}, state, {output}) {
  assign(state, {editedKey: key});
  return this.refreshRendering(state, output);
},

async onEditObjectChange({eventlet: {key, value}, data}, state, {output, service}) {
  assign(state, {editedKey: null});
  await this.refreshRendering(state, output);
  const propNames = key.split(':');
  const formatter = (propValue, propStore) => this.formatPropValueByType(propValue, propStore, value);
  return this.updatePropValue(data, propNames, formatter, service);
},

async onJsonEditObjectChange({eventlet: {key, value}, data}, state, {output, service}) {
  try {
    const {json} = await service('jsonrepairService', 'repair', {value});
    value = json;
  } catch(x) {
  }
  return this.onEditObjectChange({eventlet: {key, value}, data}, state, {output, service});
},

async updatePropValue(data, propNames, formatter, service) {
  const propName = propNames.shift();
  let prop;
  if (propName.endsWith('-connection')) {
    const nonConnPropName = propName.substring(0, propName.length - '-connection'.length);
    prop = data.props.find(p => p.name === nonConnPropName);
    const nonConnNewValue = formatter();
    prop.value.connection.value = nonConnNewValue;
  } else {
    const index = data.props.findIndex(p => p.name === propName);
    prop = data.props[index];
    prop.value = this.formatNewValue(prop.value, prop.store, propNames, formatter);
  }
  await service('DesignService', 'UpdateProp', prop);
  return {data, prop};
  //return {action: {name: 'object-prop-update', prop}};
},

formatNewValue(currentValue, propStore, propNames, formatter) {
  let cursor = currentValue;
  propNames.forEach(prop => cursor = cursor?.[prop]);
  const newValue = formatter(cursor, propNames.length > 0 ? {} : propStore);
  return propNames?.length ? this.setNestedValue(currentValue, propNames, newValue) : newValue;
},

setNestedValue(value, propNames, propValue) {
  const newValue = this.cloneValue(value);
  let cursor = newValue;
  const lastProp = propNames.pop();
  propNames.forEach(prop => {
    if (cursor[prop]) {
      cursor[prop] = {...cursor[[prop]]};
    } else {
      cursor[prop] = {};
    }
    cursor = cursor[prop];
  });
  cursor[lastProp] = propValue;
  return newValue;
},

cloneValue(value) {
  return Array.isArray(value) ? [...value] : {...value};
},

formatPropValueByType(currentValue, {type: currentType, store}, newValue) {
  if (currentType === 'TypeWithConnection') {
    return {
      ...currentValue,      
      // better way to determine actual property type?
      property: this.formatPropValueByType(currentValue.property, store, newValue),
    }
  }
  if (currentType === 'Boolean') {
    return Boolean(!currentValue);
  } else if (currentType === 'Number') {
    return isNaN(newValue) ? currentValue : Number(newValue);
  }
  const isStringType = ['String', 'MultilineText'].includes(currentType);
  if (!isStringType) { 
    if (!newValue) {
      return undefined;
    } else if (typeof newValue === 'string') {
      if ('[{`"\''.includes(newValue.trim()[0])) {
        try {
          return JSON.parse(newValue);
        } catch(x) {
          log.warn(newValue, 'failed to parse as JSON');
          // punt
          return currentValue;
        }
      }
    }
  }
  return newValue;
},
onRename({eventlet: {value}}, state, {service}) {
  return service('DesignService', 'RenameObject', {name: value});
},

template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    overflow-y: auto !important;
    /**/
    border: var(--ObjectInspector-border);
    /**/
    background-color: var(--xcolor-one);
    color: var(--xcolor-four);
  }
  [info-container] {
    border-bottom: 1px solid var(--xcolor-two);
    /* padding: 4px 16px 16px; */
    padding: 6px 12px;
  }
  [titler-container] {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  [prop-container] {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 16px;
  }
  [prop-container][vertical] {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  [prop-container][object] {
    padding-bottom: 2px;
  }
  [controls] {
    font-size: 0.75em;
    padding: 16px;
  }
  [controls] img {
    border: 1px dotted var(--xcolor-three);
    margin-right: 8px;
    width: 3em;
    height: 3em;
    object-fit: contain;
  }
  sl-range {
    padding: 0 6px;
    --thumb-size: 10px;
    --track-height: 2px;
  }
  sl-range::part(input) {
    height: 17px;
  }
  input[type="text"] {
    width: 100%;
    height: 24px;
    border: 1px solid var(--xcolor-four);
    border-radius: 4px;
  }
  input[type="checkbox"] {
    margin-left: 0;
    margin-right: 6px;
  }
  [buttons] {
    padding: 12px;
  }
  [select] {
    color: #555;
    width: 100%;
  }
  [subprop] {
    border-top: 1px dotted var(--theme-color-bg-5);
    padding: 8px 0 0 16px;
  }
  [subprop] [subprop]:first-child {
    border-top: none;
  }
  [label] {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    color: var(--theme-color-fg-2);
    text-transform: capitalize;
    align-self: center;
  }
  [label][control] {
    margin-bottom: 4px;
  }
  [bar] > *:first-child {
    width: 72px;
    text-align: right;
    font-size: 0.7em;
    padding-right: 8px;
    margin-right: 6px;
    color: var(--theme-color-fg-0);
  }
  textarea {
    width: 100%;
    font-size: 1em;
    font-family: "Google Sans", monospace;
  }
  [noSelectionMsg] {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--xcolor-three);
    background-color: var(--xcolor-one);
  }
  icon {
    font-size: 150%;
  }
  /* icon {
    cursor: pointer;
    border-radius: 50%; 
    padding: 0.5em;  
    text-align: center;
    font-size: 120%;
  }
  icon:hover {
    background: var(--xcolor-two);
  }
  */
  [name="ToolbarContainer"]::slotted(*) {
    background-color: var(--xcolor-one);
  }
  [prop-container] > slot::slotted(*) {
    display: block !important;
  }
</style>

<div info-container>
  <div titler-container>
    <fancy-input flex titler value="{{title}}" on-change="onRename" key="Rename Object" disabled="{{disableRename}}"></fancy-input>
    <div>
      <slot name="ToolbarContainer" display$="{{showToolbar}}"></slot>
    </div>
  </div>
  <div slot-container><slot name="infoContainer"></slot></div>
</div>

<!-- <div titler properties>Properties</div> -->
<div flex scrolling style="position: relative;">
  <div controls repeat="prop_t">{{props}}</div>
  <div noSelectionMsg display$="{{showNothingToInspect}}">Nothing to inspect</div>
</div>

<template prop_t>
  <div prop>{{prop}}</div>
</template>

<template prop_with_conn_t>
  <div>
    <span centering flex row>
      <span label flex>{{displayName}}</span>
      <label style="padding-right: 4px;" hide$="{{hideMulti}}" centering row>
        <input style="margin-right: 0;" type="checkbox" checked="{{checkedMulti}}" on-change="onMultiChecked" key="{{key}}">
        <icon title="multi-connect">arrow_split</icon>
        &nbsp;&nbsp;
      </label>
      <label centering row>
        <input style="margin-right: 4px;" type="checkbox" checked="{{checkedConn}}" on-change="onConnChecked" key="{{key}}">
        <icon title="connected">link</icon>
        &nbsp;
      </label>
      <!-- <label centering row>
        <input type="checkbox" checked="{{checkedPub}}}" on-change="onPubChecked" key="{{key}}">
        <icon title="public">public</icon>
        &nbsp;
      </label> -->
    </span>
    <div prop display$="{{showProp}}">{{prop}}</div>
    <div prop display$="{{showConn}}">{{connection}}</div>
  </div>
</template>

<template unimpl_t>
  <div hidden bar>
    <span label flex>{{displayName}}</span>
    <input type="text" disabled key="{{key}}" value="not yet implemented">
  </div>
</template>

<template object_t>
  <div>
    <div prop-container object>
      <span label>{{displayName}}</span>
      <mwc-icon-button on-click="onEditObject" key="{{key}}" icon="edit"></mwc-icon-button>
    </div>
    <div subprop repeat="prop_t">{{props}}</div>
  </div>
</template>

<template edit_object_as_json_t>
  <div prop-container vertical>
    <div label><span>{{displayName}}</span> (json)</div>
    <!-- <div label control>Enter plain JSON:</div> -->
    <textarea rows="{{rows}}" key="{{key}}" on-blur="onJsonEditObjectChange" on-click="noop">{{value}}</textarea>
  </div>
</template>

<template list_t>
  <div>
    <div subprop repeat="list_prop_t">{{props}}</div>
    <mwc-button key="{{key}}" on-click="onAddItem">Add</mwc-button>
  </div>
</template>

<template list_prop_t>
  <div bar>
    <div flex prop>{{prop}}</div>
    <icon on-click="onRemoveItem" key="{{itemKey}}">delete</icon>
  </div>
</template>

<template batchimageupload_t>
  <div>
    <div bar>
      <image-upload on-image="onAddItem" key="{{key}}" multiple="true">
        <mwc-button>Upload</mwc-button>
      </image-upload>
      <mwc-button key="{{key}}" on-click="onAddItem">Add</mwc-button>
    </div>
    <div repeat="imagepreview_t">{{value}}</div>
  </div>
</template>

<template imagepreview_t>
  <div bar>
    <img src="{{src}}">
    <input type="text" value="{{src}}" on-blur="onPropChange" key="{{itemKey}}">
    <mwc-icon-button on-click="onRemoveItem" key="{{itemKey}}" icon="delete"></mwc-icon-button>
  </div>
</template>

<template imageupload_t>
  <div>
    <div label>{{displayName}}</div>
    <div prop-container>
      <span label control style="width: 40px">url</span>
      <input type="text" key="{{key}}" value="{{value}}" disabled="{{disabled}}" on-change="onImageUrl">
    </div>
  </div>

  <!-- <div bar>
    <img hidden="{{hidden}}" src="{{value}}">
    <image-upload xon-image="onPropChange" on-image="onImageUrl" key="{{key}}">
      <wl-button>Upload</wl-button>
    </image-upload>
    <div flex></div>
  </div> -->
</template>

<!-- <template range_t>
  <div>
    <sl-range
      label="{{displayName}}"
      min="{{min}}"
      max="{{max}}"
      step="{{step}}"
      value="{{value}}"
      key="{{key}}"
      on-sl-change="onPropChange">
    </sl-range>
  </div>
</template> -->

<template range_t>
  <div>
    <div label flex>{{displayName}}</div>
    <div bar>
      <output style="width:auto;">{{min}}</output>
      <!-- <input type="range" flex key="{{key}}" value="{{value}}" min="{{min}}" max="{{max}}" step="{{step}}" on-input="onPropChange"> -->
      <!-- TODO: wl-slider doesn't pass the 'key" to the event handler--> 
      <wl-slider flex style="overflow:visible" key$="{{key}}" thumblabel value="{{value}}" min="{{min}}" max="{{max}}" step="{{step}}" on-input="onPropChange"></wl-slider>
      <output style="margin-left: 10px;">{{max}}</output>
    </div>
  </div>
</template>

<template checkbox_t>
  <div prop-container>
    <!-- <icon>exclamation</icon> -->
    <input type="checkbox" checked="{{value}}" key="{{key}}" on-change="onPropChange">
    <span label>{{displayName}}</span>
  </div>
</template>

<template text_t>
  <div prop-container vertical>
    <span label control>{{displayName}}</span>
    <input type="text" key="{{key}}" value="{{value}}" disabled="{{disabled}}" on-change="onPropChange" on-click="noop">
  </div>
</template>

<template textarea_t>
  <div prop-container vertical>
    <span label control>{{displayName}}</span>
    <textarea rows="{{rows}}" key="{{key}}" value="{{value}}" on-change="onPropChange" on-click="noop"></textarea>
  </div>
</template>

<template select_t>
  <div prop-container vertical>
    <div label control>{{displayName}}</div>
    <multi-select select key="{{key}}" disabled="{{disabled}}" on-change="onPropChange" multiple="{{multiple}}" size="{{size}}" options="{{value}}" on-click="noop"></multi-select>
  </div>
</template>

<template nonce_t>
  <div prop-container vertical>
    <div label control>{{displayName}}</div>
    <wl-button key="{{key}}" on-click="onNonceClick" >{{name}}</wl-button>
  </div>
</template>

<template custom_t>
  <div flex prop-container vertical>
    <slot name="{{container}}"></slot>
  </div>
</template>
`
});
