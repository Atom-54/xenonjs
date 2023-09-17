/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*
* update the fields of `obj` with the fields of `data`,
* perturbing `obj` as little as possible (since it might be a magic proxy thing
* like an Automerge document)
*/
export const shallowUpdate = (obj, data) => {
  let result = data;
  if (!data) {
    //
  }
  else if (Array.isArray(data)) {
    if (!Array.isArray(obj)) {
      // TODO(sjmiles): eek, very perturbing to obj
      obj = [];
    }
    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      if (obj[i] !== value) {
        obj[i] = value;
      }
    }
    const overage = obj.length - data.length;
    if (overage > 0) {
      obj.splice(data.length, overage);
    }
  }
  else if (typeof data === 'object') {
    result = (obj && typeof obj === 'object') ? obj : Object.create(null);
    const seen = {};
    // for each key in input data ...
    Object.keys(data).forEach(key => {
      // copy that data into output
      result[key] = data[key];
      // remember the key
      seen[key] = true;
    });
    // for each key in the output data...
    Object.keys(result).forEach(key => {
      // if this key was not in the input, remove it
      if (!seen[key]) {
        delete result[key];
      }
    });
  }
  return result;
};

export const shallowMerge = (obj, data) => {
  if (data == null) {
    return null;
  }
  if (typeof data === 'object') {
    const result = (obj && typeof obj === 'object') ? obj : Object.create(null);
    Object.keys(data).forEach(key => result[key] = data[key]);
    return result;
  }
  return data;
};

export const deepMerge = (obj, data) => {
  if (data !== null) {
    if (typeof data === 'object' && !Array.isArray(data)) {
      const result = (obj && typeof obj === 'object') ? obj : Object.create(null);
      Object.keys(data).forEach(key => result[key] = deepMerge(result[key], data[key]));
      return result;
    }
    return data
  }
  return obj;
};

export function deepCopy(datum) {
  if (!datum) {
    return datum;
  }
  else if (Array.isArray(datum)) {
    // This is trivially type safe but tsc needs help
    return datum.map(element => deepCopy(element));
  }
  else if (typeof datum === 'object') {
    // downstream code may expect Object.prototype
    const clone = {}; //Object.create(null);
    Object.entries(datum).forEach(([key, value]) => {
      clone[key] = deepCopy(value);
    });
    return clone;
  }
  else {
    return datum;
  }
}

export const deepEqual = (a, b) => {
  const type = typeof a;
  // must be same type to be equal
  if (type !== typeof b) {
    return false;
  }
  // we are `deep` because we recursively study object types
  if (type === 'object' && a && b) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    // equal if same # of props, and no prop is not deepEqual
    return (aProps.length == bProps.length) && !aProps.some(name => !deepEqual(a[name], b[name]));
  }
  // finally, perform simple comparison
  return (a === b);
};

export const deepUndefinedToNull = (obj) => {
  if (obj === undefined) {
    return null;
  }
  if (obj && (typeof obj === 'object')) {
    // we are `deep` because we recursively study object types
    const props = Object.getOwnPropertyNames(obj);
    props.forEach(name => {
      const prop = obj[name];
      if (prop === undefined) {
        delete obj[name];
        //obj[name] = null;
      }
      else {
        deepUndefinedToNull(prop);
      }
    });
  }
  return obj;
};
