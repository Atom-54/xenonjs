export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(_, state, {service}) {
  state.id = Math.floor((Math.random()*9+1)*1e5);
  service('FormService', 'registerForm', state.id);
  return {form: state.id};
},
async update({}, {id}, {isDirty, service}) {
  if (isDirty('submitTrigger')) {
    const data = await service('FormService', 'getValues', {form: id});
    log(JSON.stringify(data, null, '  '));
    return {
      colums: this.getColumns(data), 
      row: this.getRow(data)
    };
  }
},
getColumns(data) {
  return data.map(({name})=> name.split('$')[1]);
},
getRow(data) {
  const row = {};
  data.forEach(({name, type, value})=> {
    const key = name.split('$')[1];
    row[key] = value;
  });
  return row;
}
});
  