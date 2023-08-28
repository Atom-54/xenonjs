export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// has two jobs: 
//   - assemble `bits` into `context` (join(\n))
//   - interpolate `context` and `query` into `template` to produce `prompt`

async shouldUpdate({template, bits, query}, state) {
  return template && bits && query;
},

// TODO(sjmiles): I don't know what template is a template of (remember this sensation).
// Ok, is the 'template' for the 'Prompt', seems obvious in retrospect but was not.
async update({template, bits, query}, state) {
  // joining bits of text to form a context
  const context = bits.map(bit => bit.text).join('\n');
  // prompt is interpolated against context/query 
  const prompt = this.expandTemplate(template, {context, query});
  // here ya go
  return {prompt};
},

expandTemplate(template, map, fallback) {
  // get object.<path>, where path is a string that has multiple '.'
  const get = (path, obj, fb = `$\{${path}}`) => {
    return path.split('.').reduce((res, key) => res[key] || fb, obj);
  };
  // simple template literal parser
  // aka: like `${foo}` except minus the 'literal' part
  return template.replace(/\$\{.+?}/g, match => {
    const path = match.substr(2, match.length - 3).trim();
    return get(path, map, fallback);
  });
}

});
