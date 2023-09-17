export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({columns, data}, state) {
  // if (columns?.find && !state.columnid) {
  //   state.columnid = columns.find(({isId}) => isId)?.name ?? 'uid';
  // }
},
shouldRender({columns, options}) {
  return columns?.length; // && options;
},
render({columns, options, data}, {columnid}) {
  return {
    columns,
    //options,
    data: Array.isArray(data) ? data : null,
    columnid
  }
},
// onCheck({eventlet: {value}}) {
//   return {
//     event: {kind: 'check', checked: keys(value)}
//   };
// },
// onSelect({eventlet: {key}, data}, state) {
//   const record = data?.find(({[state.columnid]:uid}) => uid === key);
//   return {
//     event: {kind: 'select', record}
//   };
// },
template: html`
<toast-grid flex
  columns="{{columns}}"
  data="{{data}}"
  Xoptions="{{options}}"
  Xcolumnid="{{columnid}}"
  Xon-selected="onSelect"
  Xon-checked-changed="onCheck"
  ></toast-grid>
`
});
