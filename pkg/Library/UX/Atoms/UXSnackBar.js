export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({open, duration}, state, {isDirty, invalidate}) {
  if (isDirty('open')) {
    state.open = open;
  }
  duration ??= 3000;
  if (state.open && duration >= 0) {
    timeout(() => {
      state.open = false;
      invalidate();
    }, duration ?? 3000);
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
  wl-icon {
    padding-top: 3px;
  }
</style>
<wl-snackbar fixed open$="{{open}}" on-didhide="onDidHide">
  <span slot="icon"><wl-icon>{{icon}}</wl-icon></span>
  <span slot="action">{{message}}</span>
  <span slot="action">&nbsp;&nbsp;&nbsp;</span>
</wl-snackbar>
`
});
  