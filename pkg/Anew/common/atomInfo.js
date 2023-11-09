/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const manifests = [
  'Data',
  'Design',
  'Graph',
  'Layout',
  'Spectrum'
];

// use configured library path
const library = globalThis.config?.paths?.$anewLibrary;
// parallel loader
const load = async paths => (await Promise.all(paths.map(p => import(`${library}/${p}.js`)))).reduce((e, m) =>({...e, ...m}),{});
// load manifests
const manifestData = await load(manifests.map(m => `${m}/atom-manifest`));
// flatten
export const atomInfo = Object.assign({}, ...Object.values(manifestData));
console.log(atomInfo);

// export const atomInfo = {
//   SpectrumButton: {
//     inputs: {
//       label: 'String',
//     }
//   },
//   SpectrumCard: {
//     inputs: {
//       asset: 'AssetEnum', 
//       heading: 'String',
//       subheading: 'String', 
//       horizontal: 'Boolean'
//     },
//     types: {
//       AssetEnum: ['file', 'folder']
//     }
//   }
// };