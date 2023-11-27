export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(_, state) {
  state.index = 1;
},
async update({index, records, submittedRecord}, state, {isDirty}) {
  const indexDirty = isDirty('index') && Number(index) >= 0; 
  if (indexDirty) {
    state.index = Number(index);
  }
  state.index = this.validateIndex(state.index, state.records?.length);
  const dirtyRecords = isDirty('records') && !deepEqual(state.records, records);
  if (records && dirtyRecords) {
    log.debug('consume records');
    if (records && !records.length) {
      records = [{}];
    }
    state.records = records;
  } else if (submittedRecord) {
    state.records ??= [];
    if (!deepEqual(submittedRecord, state.records[state.index - 1])) {
      state.records[state.index - 1] = deepCopy(submittedRecord);
      log.debug('record submitted, record & records outputte', submittedRecord);
      return {
        record: submittedRecord,
        records:[...state.records]
      };
    }
  }
  if (state.records && (dirtyRecords || indexDirty)) {
    log.debug('output record & records');
    return {
      ...this.returnRecord(state.index, state.records),
      records: state.records
    };
  }
},
render({}, state) {
  const count = state.records?.length || 1;
  const index = state.index = this.validateIndex(state.index, count);
  return {count, index};
},
onPrev({}, state) {
  state.index--;
  return this.returnRecord(state.index, state.records);
},
onNext({}, state) {
  state.index++;
  return this.returnRecord(state.index, state.records);
},
onNew({}, state) {
  state.records = [...(state.records ?? [{}]), {}];
  state.index = state.records.length;
  return {records: state.records, ...this.returnRecord(state.index, state.records)};
},
onInputChange({eventlet: {value}}) {
  log('on-inputchange:', value);
},
validateIndex(index, count) {
  index = Number(index) > 0 ? index : 1;
  index = Math.max(1, Math.min(index, count || 1));
  return index;
},
returnRecord(index, records) {
  const record = records?.[this.validateIndex(index, records?.length) - 1] || {};
  return {record, index};
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
  