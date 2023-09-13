export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  state.evaluate = data => service({kind: 'JSONataService', msg: 'evaluate', data})
},

async update({json, expression}, {evaluate}) {
  if (!json || !expression) {
    return {result: null};
  }

  const object = this.maybeParseJson(json);
  if (object != null) {
    const {result} = await evaluate({json: object, expression});
    if (result === "couldn't evaluate JSON") {
      log.warn('JSONata expression is invalid: ', expression);
      return null;
    }
    return {
      // return `null` instead of `undefined`
      result: result??null
    }
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
        log.warn(m);
        return null;
      }
    }
  }
  return object;
}
});
