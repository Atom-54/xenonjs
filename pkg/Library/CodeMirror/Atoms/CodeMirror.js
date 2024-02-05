export const atom = log => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({text, altSource}, state, {isDirty}) {
  if (altSource && isDirty('altSource')) {
    text = altSource;
  }
  if (text && isDirty('text')) {
    text = this.stringify(text);
  }
  if (text && text !== state.text) {
    state.text = this.stringify(text);
    return {text: state.text}; 
  }
},
onCodeChanges({eventlet: {value}, text}, state, {output}) {
  state.text = this.parseString(value, text);
  this.debounce(state, 2000, () => {
    output({text: state.text});
  });
  // if (text) {
  //   state.text = text;
  //   return {text};
  // }
},
debounce(state, delay, action, key='code') {
  const timer = (state.keys ??= {})[key];
  if (timer >= 0) {
    clearTimeout(timer);
  }
  if (action && delay) {
    state.keys[key] = setTimeout(() => {
      delete state.keys[key];
      action();
    }, delay);
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
