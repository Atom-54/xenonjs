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
  // return columns?.length && options;
},
render({columns, options, data}, {columnid}) {
  return {
    // columns,
    // options,
    // data: Array.isArray(data) ? data : null,
    // columnid
  }
},
template: html`
<toast-calendar flex></toast-calendar>
`
});
