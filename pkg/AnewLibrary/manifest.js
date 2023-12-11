/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const manifests = [
  'Calendar',
  'CodeMirror',
  'Data',
  'Design',
  'DevTools',
  'Documents',
  'Graph',
  'Fields',
  'HuggingFace',
  'Json',
  'Layout',
  'LocalStorage',
  'Locale',
  'Media',
  'MediaPipe',
  'OpenAI',
  'Pixabay',
  'PixiJs',
  'Polymath',
  'Shader',
  'Spectrum',
  'TensorFlow',
  'UX',
  'Weightless'
];

// use configured library path
const library = globalThis.config?.paths?.$anewLibrary;
// parallel loader
const load = async paths => (await Promise.all(paths.map(p => import(`${library}/${p}.js`)))).reduce((e, m) =>({...e, ...m}),{});
// load manifests
const manifestData = await load(manifests.map(m => `${m}/atom-manifest`));
// flatten
export const atomInfo = Object.assign({}, ...Object.values(manifestData));
