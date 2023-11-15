export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(_, state, {service}) {
  state.id = Math.floor((Math.random()*9+1)*1e5);
  service('FormService', 'RegisterForm', {form: state.id});
  return {form: state.id};
},
async update({inputData}, {id}, {isDirty, service}) {
  let submit = isDirty('submitTrigger');
  if (inputData && isDirty('inputData')) {
    await service('FormService', 'SetValues', {form: id, values: inputData});
    log('inputData:', inputData);
  }
  const data = await service('FormService', 'GetValues', {form: id});
  const columns = this.getColumns(data); 
  const row = this.getRow(data);
  const result = {
    columns,
    preview: row
  };
  if (submit) {
    log('submitting', data);
    result.row = row;
  }
  return result;
},
getColumns(data) {
  return data.map(({name}) => ({name: name.split('$')[1]}));
},
getRow(data) {
  const row = {};
  data.forEach(({name, type, value})=> {
    const key = name.split('$')[1];
    row[key] = value;
  });
  return row;
},
// onFormFields(inputs, state, {service}) {
//   state.schema = service('FormService', 'getSchema', {form: id});
//   return {schema};
// }
});
