export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({form, text}, state, {service}) {
  service('FormService', 'RegisterField', {form});
  return this.textChange(text, state);
},
onTextChange({eventlet: {value}}, state) {
  return this.textChange(value, state);
},
textChange(value, state) {
  state.text = value;
  return {text: value, value};
},
render({label}, {text}) {
  if (text && !(typeof text === 'string')) {
    text = JSON.stringify(text, null, '  ');
  }
  return {
    label,
    showLabel: String(Boolean(label?.length > 0)),
    text: text??''
  };
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
    font-size: inherit;
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
