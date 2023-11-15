/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {debounce} from '../../CoreXenon/Reactor/Atomic/js/unused/task.js';
// import * as Id from '../../CoreXenon/Framework/Id.js';
// import * as App from '../../CoreXenon/Framework/App.js';
// import * as Flan from '../../CoreXenon/Framework/Flan.js';

const log = logf('Services:Form', 'lightblue', 'black');

const requireForm = (atom, formId) => {
  const {controller} = atom.layer;
  return (controller.forms ??= {})[formId] ??= {formId, atom, fields: []};
};

const addField = (form, atom) => {
  const fields = new Set(form.fields);
  fields.add(atom);
  form.fields = [...fields];
};

const notifyForm = ({layer, atom, formId: form}) => {
  const action = () => {
    const event = {handler: 'onFormFields', data: {form}};
    App.handleAtomEvent(layer, atom, event);
  };
  debounce(form, action, 50);
};

export const FormService = {
  GetSchema(atom, {form: formId}) {
    const form = requireForm(atom, formId);
    const schema = form.fields.map(({name}) => {
      //const {type} = layer.system[name];
      return {name, type};
    });
    return schema;
  },
  GetValues(atom, {form: formId}) {
    const form = requireForm(atom, formId);
    const values = form.fields.map(({name}) => {
      //const {type} = layer.system[name];
      //const stateId = Id.qualifyId(name, 'value');
      //const value = layer.flan.state[stateId];
      return {name, type, value};
    });
    return values;
  },
  SetValues(atom, {form: formId, values}) {
    const form = requireForm(atom, formId);
    const state = {};
    form.fields.forEach(({name}) => {
      //const stateId = Id.qualifyId(name, 'value');
      //const field = Id.sliceId(name, 1, -1);
      //const value = values[field];
      //state[stateId] = value;
    });
    //Flan.setData(layer, state);
  },
  RegisterForm(atom, {form: formId}) {
    const form = requireForm(atom, formId);
    form.atom = atom;
    notifyForm(form);
  },
  RegisterField(atom, {form: formId}) {
    // removeField(formId, atom)
    if (formId) {
      const form = requireForm(atom, formId);
      addField(form, atom);
      notifyForm(form);
    }
  }
};