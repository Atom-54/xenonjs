export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({inProgress, interval}, state, {invalidate}) {
  if (inProgress) {
    state.progress ??= 0;
    state.progress = (state.progress + 1) % 100;
    timeout(invalidate, interval??1000);
  }
},
render(inputs, state) {
  return {
    progressStyle: `
      width: ${this.renderPercentage(inputs, state)}%;
      height: ${this.renderHeight(inputs)}
    `,
  }
},
renderPercentage({percentage, total, count, inProgress}, state) {
  if (state.progress) {
    if (!inProgress) {
      state.progress = 0;
    }
    return state.progress;
  }
  if (percentage !== undefined) {
    return percentage;
  }
  if (count !== undefined && total > 0) {
    return Math.round((count * 100) / total);
  }
  return 0;
},
renderHeight({height}) {
  return `${height??30}px`
},
template: html`
<style>
  * {
    box-sizing: border-box;
  }
  :host {
    display: block !important;
    white-space: nowrap;
  }
  [full] {
    width: 100%;
    /* background: var(--xcolor-two); */
  }
  [progress] {
    background: var(--xcolor-brand);
  }
</style>

<div full>
  <div progress xen:style="{{progressStyle}}"></div>
</div>
`
});
