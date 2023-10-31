/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const JSONataService = {
  async evaluate(app, atom, data) {
    const jsonata = await requireJsonata();
    return evaluate(jsonata, data) || null;
  }
};

const requireJsonata = async () => {
  await import("../../third-party/JSONata/jsonata.min.js");
  return globalThis.jsonata;
};

const evaluate = (jsonata, {json, expression}) => {
  try {
    const result = jsonata(expression).evaluate(json);
    return {result};
  } catch(x) {
    //log.warn(x);
    return {result: "couldn't evaluate JSON"};
  }
};
