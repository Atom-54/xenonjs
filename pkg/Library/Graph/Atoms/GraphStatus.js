export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({graph}) {
  let warning = null;
  if (graph?.meta?.readonly) {
    warning = 'This graph is readonly. Clone it, if you want to modify it (or your changes won\'t be saved).';
  } else if (!graph) {
    warning = 'Please, select a graph';
  }
  return {
    warning,
    hideWarning: String(Boolean(!warning))
  }
},

template: html`
<style>
div {
  padding: 10px;
}
icon {
  font-size: 1.5em
}
span {
  font-size: 0.8em;
  overflow: hidden;
  padding-left: 10px;
  text-wrap: wrap;
}

</style>

<div bar hide$="{{hideWarning}}">
  <icon>warning</icon>
  <span>{{warning}}</span>
</div>
`
});

