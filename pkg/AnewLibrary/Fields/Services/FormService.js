/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {debounce} from '../..//CoreXenon/Reactor/Atomic/js/task.js';
import * as Controller from '../../Framework/Controller.js';

const log = logf('Services:Form', 'lightblue', 'black');

const requireForm = (atom, formId) => {
  const {controller} = atom.layer;
  return (controller.forms ??= {})[formId] ??= {formId, atom, fields: []};
};

const addField = (form, atom) => {
  form.fields = [...new Set(form.fields).add(atom)];
};

const removeField = (form, field) => {
  const i = indexOfField(form, field);
  if (i >= 0) {
    form.fields.splice(i, 1);
  }
};

const indexOfField = (form, field) => {
  return form.fields.indexOf(field);
};

const notifyForm = ({layer, atom, formId: form}) => {
  const {controller} = atom.layer;
  const action = () => {
    const eventlet = {handler: 'onFormFields', data: {form}};
    controller.onevent(atom.id, eventlet);
  };
  debounce(form, action, 50);
};

export const FormService = {
  RegisterForm(atom, {form: formId}) {
    const form = requireForm(atom, formId);
    form.atom = atom;
    notifyForm(form);
  },
  RegisterField(atom, {form: formId}) {
    if (formId) {
      const form = requireForm(atom, formId);
      if (indexOfField(form, atom) < 0) {
        addField(form, atom);
        notifyForm(form);
      }
    }
  },
  // GetSchema(host, {form: formId}) {
  //   const form = requireForm(host, formId);
  //   const schema = form.fields.map(({name}) => {
  //     //const {type} = layer.system[name];
  //     return {name, type};
  //   });
  //   return schema;
  // },
  GetValues(atom, {form: formId}) {
    const {controller} = atom.layer;
    const form = requireForm(atom, formId);
    const fieldValues = form.fields.map(({name, id}) => {
      const value = controller.state[id + '$value'];
      return {name, value};
    });
    return fieldValues;
  },
  SetValues(atom, {form: formId, values}) {
    const {controller} = atom.layer;
    const form = requireForm(atom, formId);
    form.fields.forEach(({name, id}) => {
      if (name in values) {
        Controller.writeValue(controller, id, 'value', values[name]);
      }
    });
  }
};