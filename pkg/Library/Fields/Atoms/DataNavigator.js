export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(_, state) {
  state.index = 1;
},
async update({index, count, records, submittedRecord}, state, {isDirty}) {
  const indexDirty = isDirty('index'); 
  if (indexDirty && Number(index) >=0) {
    state.index = this.validateIndex(index, this.validateCount(count, records));
  }
  if (submittedRecord && isDirty('submittedRecord')) {
    records ??= [];
    records[state.index - 1] = submittedRecord;
    return {
      record: submittedRecord,
      records
    };
  }
  if (records && (isDirty('records') || indexDirty)) {
    return {
      ...this.returnRecord(state.index, records),
      records
    };
  }
},
validateCount(count, records) {
  count = (Number(count) > 0 ? count : 1);
  count = Math.max(records?.length || count, 1);
  return count;
},
validateIndex(index, count) {
  index = Number(index) > 0 ? index : 1;
  index = Math.max(1, Math.min(index, count));
  return index;
},
returnRecord(index, records) {
  const record = records?.[this.validateIndex(index, records?.length) - 1];
  if (record) {
    return {record};
  }
},
render({count, records}, {index}) {
  count = this.validateCount(count, records);
  return {
    index: this.validateIndex(index, count),
    count
  };
},
onPrev({records}, state) {
  state.index--;
  return this.returnRecord(state.index, records);
},
onNext({records}, state) {
  state.index++;
  return this.returnRecord(state.index, records);
},
onNew({records}, state) {
  records = [...(records ?? []), {}];
  state.index = records.length;
  return {records};
},
onInputChange({eventlet: {value}}) {
  log('on-inputchange:', value);
},
template: html`
<style>
</style>
<div flex toolbar>
  <span flex x3></span>
  <wl-button inverted>&lt;&lt;</wl-button>
  <wl-button inverted on-click="onPrev">&lt;</wl-button>
  <span flex></span>
  <div row>
    <input value="{{index}}" style="width: 3em;" on-change="onInputChange"><span>&nbsp;of&nbsp;</span><span>{{count}}</span>
  </div>
  <span>&nbsp;</span>
  <wl-button inverted on-click="onNew">New</wl-button>
  <span flex></span>
  <wl-button inverted on-click="onNext">&gt;</wl-button>
  <wl-button inverted>&gt;&gt;</wl-button>
  <span flex x3></span>
</div>
`
});
  