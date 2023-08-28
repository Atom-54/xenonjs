export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({records}, state) {
  state.checked ??= {};
  let checkedChanged = false;
  keys(state.checked).forEach(uid => {
    if (!records.some(record => record.uid === uid)) {
      delete state.checked[uid];
      checkedChanged = true;
    }
  });
  if (checkedChanged) {
    return {selected: keys(state.checked)};
  }
},
render({data, records}, state) {
  return {
    title: data?.title ?? 'record',
    records: this.renderRecords(records, state),
    noRecords: !(records?.length > 0),
    length: records?.length ?? 'no',
    showCheckAll: String(Boolean(records?.length)),
    checkedAll: this.isAllChecked(records, state)
  }
},
renderRecords(records, {checked}) {
  return records?.map((record, index) => ({
    props: keys(record)?.filter(key => key !== 'uid')?.map(key => ({value: record[key], key: record.uid})),
    index,
    checked: checked[record.uid]
  }));
},

async onSelect({eventlet: {key}}, state, {output}) {
  if (state.key === key) {
    // This is needed in case when another record was selected through different UX,
    // and this atom's output is the same, but still needs to be processed.
    await output({event: null});
  }
  state.key = key;
  return {
    event: {kind: 'select', record: key}
  };
},
onDelete({eventlet: {key: index}, records}) {
  return {
    event: {kind: 'delete', record: records[index].uid}
  }
},
onCheck({eventlet: {key: index}, records}, state) {
  const uid = records[index].uid;
  if (state.checked[uid]) {
    delete state.checked[uid];
  } else {
    state.checked[uid] = true;
  }
  return {selected: keys(state.checked)};
},

isAllChecked(records, {checked}) {
  return records?.length && keys(checked).length === records.length;
},

onCheckAll({records}, state) {
  if (this.isAllChecked(records, state)) {
    state.checked = {};
  } else {
    records.forEach(({uid}) => state.checked[uid] = true);
  }
  return {selected: keys(state.checked)};
},

template: html`
<style>
:host {
  overflow: auto !important;
}
[message] {
  padding: 10px;
  text-align: center;
}
[records] {
  border: 1px solid grey;
  font-size: 0.8em;
}
[record] {
  padding: 10px;
}
[record]:hover {
  background-color: var(--xcolor-one);
}
[value] {
  cursor: pointer;
}
[value]:hover {
  color: var(--xcolor-brand);
}
[control] {
  cursor: pointer;
  padding: 0 10px;
}
</style>
<div bar>
  <div display$="{{showCheckAll}}" control><input type="checkbox" on-click="onCheckAll" checked="{{checkedAll}}"></div>
  <div message flex>There are <span>{{length}}</span> <span>{{title}}</span>(s).</div>
  <slot name="actionsContainer"></slot>
</div>

<div records repeat="record_t" rows hide$="{{noRecords}}">{{records}}</div>

<template record_t>
  <div columns record>
    <div control><input type="checkbox" on-click="onCheck" key="{{index}}" checked="{{checked}}"></div>
    <div flex columns repeat="prop_t">{{props}}</div>
    <div control><icon on-click="onDelete" key="{{index}}">delete</icon></div>
  <div>
</template>

<template prop_t>
  <div value flex key="{{key}}" on-click="onSelect">{{value}}</div>
</template>
`

});
