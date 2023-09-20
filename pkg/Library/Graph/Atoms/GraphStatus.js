export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({graph}) {
  let status;
  if (graph?.meta?.readonly) {
    status = this.makeWarning('This graph is readonly. Clone it, if you want to modify it (or your changes won\'t be saved).');
  } else if (!graph) {
    status = this.makeWarning('No graph is selected. Click the logo icon to create or select a graph.');
  } else if (keys(graph.nodes).length <= 1) {
    status = this.makeMessage('Click + icon to add Nodes to the Graph.');
  }
  return {
    ...status,
    show: String(Boolean(keys(status).length))
  }
},
makeWarning(text) {
  return {text, icon: 'warning', isWarning: true};
},

makeMessage(text) {
  return {text, icon: 'info', isWarning: false};
},

template: html`
<style>
  div {
    padding: 10px;
  }
  icon {
    font-size: 1.5em
  }
  [warning] {
    background-color: var(--xcolor-brand);
    color: white;
  }
  span {
    font-size: 0.8em;
    overflow: hidden;
    padding-left: 10px;
    text-wrap: wrap;
  }
</style>
<div bar show$="{{show}}" warning$="{{isWarning}}">
  <icon>{{icon}}</icon>
  <span>{{text}}</span>
</div>
`
});
