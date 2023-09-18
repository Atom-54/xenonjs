export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({text}) {
  return {text};
},
onTextChange({eventlet: {value}}) {
  return {text: value};
},
render({label, text, style}) {
  if (text && !(typeof text === 'string')) {
    text = JSON.stringify(text, null, '  ');
  }
  return {
    label,
    showLabel: String(Boolean(label?.length > 0)),
    text: text??'',
    style
  };
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column; 
    width: 100%;
  }
  textarea {
    width: 100%;
    height: 100%; 
    border: none;
    padding: 12px;
    white-space: pre;
    resize: none;
    margin: 0;
    font-size: inherit;
    text-wrap: wrap;
  }
  [label] {
    padding: 8px;
  }
</style>
<div flex column>
  <div label display$="{{showLabel}}">{{label}}</div>
  <div flex><textarea xen:style="{{style}}" on-change="onTextChange" on-click="noop" value="{{text}}"></textarea></div>
</div>
`
});
