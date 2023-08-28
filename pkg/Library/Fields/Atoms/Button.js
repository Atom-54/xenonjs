export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({value}, state) {
  if (state.value !== value) {
    state.value = value;
    return {value};
  }
},
onClick({action}, state) {
  return this.handleAction(action, state);
},

handleAction(action, state) {
  switch(action?.action ?? action) {
    case 'toggle': {
      const newValue = !state.value;
      state.value = newValue;
      return {value: newValue};
    }
    case 'set':
      return {value: action.args?.value};
    // TODO: to be continued.
  }
},
template: html`
<style>
  button {
    padding: 5px;
  }
</style>
<div>
  <button on-click="onClick">{{label}}</button>
</div>
`

});
