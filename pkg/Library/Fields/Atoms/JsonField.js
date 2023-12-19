export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({form, value}, state, {service}) {
  service('FormService', 'RegisterField', {form});
  if (typeof value === 'object') {
    value = JSON.stringify(value, null, '  ');
  }
  return this.updateText(value, state);
},
async onTextChange({eventlet: {value}}, state, {service}) {
  const clean = await service('JsonRepairService', 'Repair', {value});
  return this.updateText(clean?.json, state);
},
render({label}, {text}) {
  return {
    label,
    showLabel: String(Boolean(label?.length > 0)),
    text: text??''
  };
},
updateText(text, state) {
  let value;
  try {
    value = JSON.parse(text);
    text = JSON.stringify(value, null, '  ');
  } catch(x) {
  }
  state.text = text;
  state.value = value;
  return {text, value};
},
template: html`
<style>
  :host {
    padding: 0 6px;
    overflow: visible !important;
  }
  textarea {
    width: 100%;
    height: 100%; 
    min-height: 2em;
    border: none;
    padding: 12px;
    white-space: pre;
    resize: none;
    margin: 0;
    font-family: Courier, "Roboto Mono", Inconsolata, "Source Code Pro", monospace;
    font-size: .8em;
    text-wrap: wrap;
  }
  [label] {
    font-size: .75em;
    margin-bottom: .3em;
  }
</style>
<div flex column>
  <div label display$="{{showLabel}}">{{label}}</div>
  <div flex>
    <textarea on-change="onTextChange" on-click="noop" value="{{text}}"></textarea>
  </div>
</div>
`
});
