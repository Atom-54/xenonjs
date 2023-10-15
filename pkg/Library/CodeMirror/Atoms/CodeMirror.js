export const atom = log => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({text}, state) {
  state.text = this.stringify(text);
  return {text: state.text};
},
onCodeChanges({eventlet: {value}, text}) {
  text = this.parseString(value, text);
  if (text) {
    return {text};
  }
},
stringify(text) {
  return text === undefined 
    ? ''
    : (typeof text === 'object' 
      ? JSON.stringify(text, null, 2) 
      : String(text))
    ;
},
parseString(value, originalValue) {
  try {
    return typeof originalValue === 'object' ? JSON.parse(value) : value;
    // return text;
  } catch (e) {
    log(`invalid JSON ${value}`);
  }
},
shouldRender(inputs, state) {
  const dirty = state.text !== state.currentText;
  state.currentText = state.text;
  return dirty;
},
template: html`
<style>
  :host {
    display: flex;
  }
</style>
<code-mirror flex options="{{options}}" text="{{text}}" readonly="{{readonly}}" on-changes="onCodeChanges"></code-mirror>
`
});
