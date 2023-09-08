export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(_, state) {
  state.index = 1;
},
async update({index, count}, state, {isDirty}) {
  if (isDirty('index')) {
    state.index = Number(index) > 0 ? index : 1;
  }
},
render({count}, state) {
  count = 10;
  count = Number(count) > 0 ? count : 0;
  state.index = Number(state.index) > 0 ? state.index : 1;
  state.index = Math.max(1, Math.min(state.index, count));
  return {
    index: state.index,
    count
  };
},
onPrev({count}, state) {
  state.index--;
},
onNext({count}, state) {
  state.index++;
},
onInputChange({eventlet: {value}}) {
  log('on-inputchange:', value);
},
template: html`
<style>
</style>
<div flex toolbar>
  <span flex x3></span>
  <button>&lt;&lt;</button>
  <button on-click="onPrev">&lt;</button>
  <span flex></span>
  <div row>
    <input Xtype="number" value="{{index}}" style="width: 3em;" on-change="onInputChange"><span>&nbsp;of&nbsp;</span><span>{{count}}</span>
  </div>
  <span flex></span>
  <button on-click="onNext">&gt;</button>
  <button>&gt;&gt;</button>
  <span flex x3></span>
</div>
`
});
  