export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  state.evaluate = data => service({kind: 'JSONataService', msg: 'evaluate', data})
},

// shouldUpdate({json, expression}) {
//   //log(json);
//   return Boolean(json && expression);
// },

async update({json, expression}, {evaluate}) {
  const object = this.maybeParseJson(json);
  const {result} = await evaluate({json: object, expression});
  return {
    // return `null` instead of `undefined`
    result: result??null
  }
},

maybeParseJson(json) {
  let object = json;
  if (typeof json === 'string') {
    try {
      object = JSON.parse(json);
    } catch(x0) {
      const m = x0.message;
      try {
        object = JSON.parse(`"${json}"`)
      } catch(x) {
        log(m);
      }
    }
  }
  return object;
}
});
