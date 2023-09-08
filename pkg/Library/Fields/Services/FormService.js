/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {debounce} from '../../CoreReactor/Atomic/js/unused/task.js';
import * as App from '../../CoreFramework/App.js';
import * as Id from '../../CoreFramework/Id.js';

const log = logf('Services:Form', 'lightblue', 'black');

const forms = {};

const requireForm = (layer, atom, formId) => {
  return forms[formId] ??= {formId, layer, atom, fields: []};
};

const addField = (form, atom) => {
  const fields = new Set(form.fields);
  fields.add(atom);
  form.fields = [...fields];
};

const notifyForm = ({layer, atom, formId: form}) => {
  const action = () => {
    const event = {handler: 'onFormFields', data: {form}};
    App.onComposerEvent(layer, atom, event);
  };
  debounce(form, action, 50);
};

export const FormService = {
  getSchema(layer, atom, {form: formId}) {
    const form = requireForm(layer, atom, formId);
    const schema = form.fields.map(({name}) => {
      const {type} = layer.system[name];
      return {name, type};
    });
    return schema;
  },
  getValues(layer, atom, {form: formId}) {
    const form = requireForm(layer, atom, formId);
    const values = form.fields.map(({name}) => {
      const {type} = layer.system[name];
      const stateId = Id.qualifyId(name, 'value');
      const value = layer.state[stateId];
      return {name, type, value};
    });
    return values;
  },
  setValues(layer, atom, {form: formId, values}) {
    const form = requireForm(layer, atom, formId);
    const state = {};
    form.fields.forEach(({name}) => {
      const stateId = Id.qualifyId(name, 'value');
      const field = Id.sliceId(name, 1, -1);
      const value = values[field];
      state[stateId] = value;
    });
    App.setData(layer, state);
  },
  registerForm(layer, atom, {form: formId}) {
    const form = {
      ...requireForm(layer, atom, formId),
      layer, 
      atom
    };
    notifyForm(form);
  },
  registerField(layer, atom, {form: formId}) {
    // removeField(formId, atom)
    if (formId) {
      const form = requireForm(layer, atom, formId);
      addField(form, atom);
      notifyForm(form);
    }
  }
};