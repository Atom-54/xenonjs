/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {deepCopy} from '../utils/object.js';

const {values, entries} = Object;
const opaqueData = {};
const log = logf('Decorator', 'plum');

export const Decorator = {
  setOpaqueData(name, data) {
    opaqueData[name] = data; //deepCopy(data);
    return name;
  },
  getOpaqueData(name) {
    return opaqueData[name];
  },
  maybeDecorateModel(model, atom) {
    if (model && !Array.isArray(model)) {
      // for each item in model, regardless of key
      values(model).forEach((item) => {
        // is an object?
        if (item && (typeof item === 'object')) {
          // are there sub-models
          if (item['models']) {
            // the decorate this item
            log('applying decorator(s) to list:', item);
            this.maybeDecorateItem(item, atom);
          }
          else {
            // otherwise, check if there are sub-items to decorate
            if (model?.filter || model?.decorator || model?.collateBy) {
              log('scanning for lists in sub-model:', item);
              this.maybeDecorateModel(item, atom);
            }
          }
        }
      });
    }
    // possibly decorated model
    return model;
  },
  maybeDecorateItem(item, atom) {
    let models = (typeof item.models === 'string') ? this.getOpaqueData(item.models) : item.models;
    if (models) {
      // do a decorator
      models = maybeDecorate(models, item.decorator, atom);
      // do a filter
      models = maybeFilter(models, item.filter, atom.impl);
      // do a collator
      models = maybeCollateBy(models, item);
      // mutate items
      item.models = models;
      //console.log(JSON.stringify(models, null, '  '));
    }
  },
};
const maybeDecorate = (models, decorator, atom) => {
  decorator = atom.impl[decorator] ?? decorator;
  const { inputs, state } = atom.internal;
  if (decorator) {
    // TODO(cromwellian): Could be expensive to do everything, store responsibility?
    const immutableInputs = Object.freeze(deepCopy(inputs));
    // we don't want the decorator to have access to mutable globals
    const immutableState = Object.freeze(deepCopy(state));
    // models become decorous
    models = models.map(model => {
      // use previously mutated data or initialize
      // TODO(cromwellian): I'd like to do Object.freeze() here, also somehow not mutate the models inplace
      // Possibly have setOpaqueData wrap the data so the privateData lives on the wrapper + internal immutable data
      model.privateData = model.privateData || {};
      // TODO(cromwellian): also could be done once during setOpaqueData() if we can track privateData differently
      const immutableModel = Object.freeze(deepCopy(model));
      const decorated = decorator(immutableModel, immutableInputs, immutableState);
      // set new privateData from returned
      model.privateData = decorated.privateData;
      return { ...decorated, ...model, };
    });
    // sort (possible that all values undefined)
    models.sort(sortByLc('sortKey'));
    log('decoration was performed');
  }
  //models.forEach(model => delete model.privateData);
  return models;
};
const maybeFilter = (models, filter, impl) => {
  filter = impl[filter] ?? filter;
  if (filter && models) {
    // models become filtrated
    models = models.filter(filter);
  }
  return models;
};
const maybeCollateBy = (models, item) => {
  // construct requested sub-lists
  entries(item).forEach(([name, collator]) => {
    // generate named collations for items of the form `[name]: {collateBy}`
    if (collator?.['collateBy']) {
      // group the models into buckets based on the model-field named by `collateBy`
      const collation = collate(models, collator['collateBy']);
      models = collationToRenderModels(collation, name, collator['$template']);
    }
  });
  return models;
};
const sortByLc = key => (a, b) => sort(String(a[key]).toLowerCase(), String(b[key]).toLowerCase());
//const sortBy = key => (a, b) => sort(a[key], b[key]);
const sort = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const collate = (models, collateBy) => {
  const collation = {};
  models.forEach(model => {
    const keyValue = model[collateBy];
    if (keyValue) {
      const category = collation[keyValue] || (collation[keyValue] = []);
      category.push(model);
    }
  });
  return collation;
};
const collationToRenderModels = (collation, name, $template) => {
  return entries(collation).map(([key, models]) => ({
    key,
    [name]: { models, $template },
    single: !(models['length'] !== 1),
    ...models?.[0]
  }));
};
