/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// use configured library path
const Library = globalThis.config?.paths?.$library;
// parallel loader
const load = async paths => (await Promise.all(paths.map(p => import(`${Library}/${p}.js`)))).reduce((e, m) =>({...e, ...m}),{});
// get stuff from the Library
export const {
  injections,
  industrialize,
  emit,
  ...core
} = await load([
  // standard core
  'CoreXenon/Reactor/atomic',
  // choose Atom industry features
  'CoreXenon/Reactor/injections',
  'CoreXenon/Reactor/Industries/dynamic-industry'
]);
// be mutable
const xenon = {...core};
// set up for global Atom context
const isolationScope = globalThis;
// instructions to prepare Atom industry
xenon.industrialize = async atoms => {
  await industrialize(atoms);
  Object.assign(isolationScope, injections);
};
// Atom production line (once industrialized)
xenon.emitter = async (name, spec) => emit(xenon.Host, name, spec.type);
// thunks
xenon.setPaths = () => {};
const connectXenon = async () => {
  await xenon.industrialize();
  return xenon;
};
// export xenon connector
export {connectXenon};
