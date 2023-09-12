export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state) {
  state.events = [];
  state.defaults = {
    name: '(no name)',
    ligature: '',
    disabled: false
  };
},
async update({event, actions, controls}, state, tools) {
  if (actions?.length > 0) { 
    await this.updateStateValues({actions, controls}, state, tools);
  }
  // dispatch events one at a time
  if (state.key && event?.key === state.key && event?.complete) {
    state.key = null;
    return this.getNextEvent(state);
  }
},
async updateStateValues({actions, controls}, state, {service}) {
  // replace with batch getter
  const getValue = stateKey => service({kind: 'StateService', msg: 'GetStateValue', data: {stateKey}});
  const localActions = this.getLocalActions(actions, controls);
  state.values = {};
  for (let {stateKey} of localActions) {
    if (stateKey) {
      state.values[stateKey] = await getValue(stateKey);
    }
  };
},
getLocalActions(actions, controls) {
  return !controls ? actions : controls.map(control => actions?.find(a => a.name === control));
},
onActionClick({eventlet: {key}, actions}, state) {
  const action = actions[key];
  if (action.stateKey) {
    state.values[action.stateKey] = action.value;
  }
  state.events.push({type: 'click', action});
  if (!state.key) {
    return this.getNextEvent(state);
  }
},
getNextEvent(state) {
  const fresh = state.events.shift();
  if (fresh) {
    state.key = Math.random();
    return {event: {...fresh, key: state.key}};
  }
},
shouldRender({actions}) {
  return Boolean(actions);
},
render({actions, controls}, state) {
  const localActions = this.getLocalActions(actions, controls);
  return {
    actions: this.renderActions(localActions, state)
  };
},
renderActions(actions, state) {
  return actions?.map?.((action, key) => {
    const model = this.renderAction(key, action, state);
    return {
      action: {
        $template: this.chooseTemplate(action),
        models: [model]
      },
      actionStyle: model.actionStyle,
      selected: this.renderSelected(action, state),
    };
  });
},
renderAction(key, action, {defaults, values}) {
  const formatStyle = action => action.style ?? (action.flex ? `flex: ${action.flex};` : '');
  return {
    ...defaults, 
    ...action,
    image: action.image && resolve(action.image), 
    ligature: this.renderLigature(action, values),
    hideIcon: !action.ligature,
    hideImage: !action.image,
    hideLabel: !action.label,
    hideSlot: !action.slot,
    actionStyle: formatStyle(action),
    key
  };
},
chooseTemplate({ligature, image, slot, label, action, actions}) {
  if (ligature) {
    return 'icon_t';
  }
  if (image) {
    return 'image_t';
  }
  if (slot) {
    return 'slot_t';
  }
  if (label) {
    return (action || actions?.length > 0) ? 'button_t' : 'label_t';
  }
},
renderLigature({ligature, stateKey}, values) {
  if (ligature) {
    if (typeof ligature === 'string') {
      return ligature;
    }
    if (stateKey) {
      return ligature[values?.[stateKey]];
    }
  }
},
renderSelected({action, stateKey, value}, {values}) {
  return (action === 'set' && values?.[stateKey] === value);
    // || (action === 'toggle' && values[stateKey]);
},
template: html`
<style>
  * {
    box-sizing: border-box;
  }
  :host {
    display: block !important;
    /* flex: none !important; */
    /* background: var(--xcolor-two); */
    white-space: nowrap;
  }
  [row] > * {
    margin-right: 0.3em;
  }
  [row] > *:last-child {
    margin-right: 0;
  }
  img {
    border-radius: 50%;
    padding: 0.2em;
  }
  icon {
    box-sizing: border-box;
    border-radius: 50%;
    text-align: center;
    opacity: 0.7;
    padding: 0.1em;
    cursor: pointer;
  }
  icon:hover {
    opacity: 0.8;
    background: var(--xcolor-one);
  }
  [disabled] {
    opacity: 0.3 !important;
  }
  spacer {
    display: inline-block;
    width: 16px;
    height: 16px;
  }
  [selected] {
    background-color: var(--xcolor-one);
    border-radius: 25px;
    opacity: 1.0;
  }
  /* 
  button {
    border: 1px solid var(--xcolor-three);
    border-radius: 5%;
    color: var(--xcolor-four);
    cursor: pointer;
    font-family: sans-serif;
    padding: 7px 10px;
    opacity: 90%;
  }
  button:hover {
    opacity: 1;
    background-color: var(--xcolor-two);
  }
  */
</style>

<div flex center row repeat="action_t">{{actions}}</div>

<template action_t>
  <div center row xen:style="{{actionStyle}}" selected$="{{selected}}">{{action}}</div>
</template>

<template label_t>
  <span title="{{name}}">{{label}}</span>
</template>

<template icon_t>
  <icon key="{{key}}" xen:style="{{actionStyle}}" title="{{name}}" disabled$="{{disabled}}" on-click="onActionClick">{{ligature}}</icon>
</template>

<template image_t>
  <img hidden$="{{hideImage}}" xen:style="{{actionStyle}}" key="{{key}}" title="{{name}}" src="{{image}}" on-click="onActionClick">
</template>

<template button_t>
  <wl-button inverted$="{{key}}" on-click="onActionClick" key="{{key}}">{{label}}</wl-button>
</template>

<template slot_t>
  <slot name="{{slot}}"></slot>
</template>

`
});
