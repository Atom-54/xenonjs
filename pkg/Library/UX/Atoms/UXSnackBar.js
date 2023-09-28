export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({open}, state, {isDirty, invalidate}) {
  if (isDirty('open')) {
    state.open = open;
  }
  if (state.open) {
    timeout(() => {
      state.open = false;
      invalidate();
    }, 3000);
  }
},
onDidHide(inputs, state) {
  state.open = false;
},
template: html`
<style>
  :host {
    width: 0 !important;
    height: 0 !important;
  }
</style>
<wl-snackbar fixed open$="{{open}}" on-didhide="onDidHide">
  <span slot="icon"><wl-icon>{{icon}}</wl-icon></span>
  <span slot="action">{{message}}</span>
  <span slot="action">&nbsp;&nbsp;&nbsp;</span>
</wl-snackbar>
`
});
  