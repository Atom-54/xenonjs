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
  let value;
  switch(action?.action ?? action) {
    case 'toggle': {
      const value = !state.value;
      state.value = value;
    }
    case 'set': {
      value = action.args?.value;
    }
    default: {
      value = Math.random();
    }
  }
  return {value};
},
template: html`
<wl-button inverted="{{inverted}}" on-click="onClick">{{label}}</wl-button>
`

});
