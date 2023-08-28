export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize(inputs, state, {service}) {
  // use service to allocate a canvas handle
  state.target = await service({kind: 'MediaService', msg: 'allocateCanvas', data: {width: 640, height: 480}});
  // create a function that invokes HolisticService
  state.classify = data => service({kind: 'HolisticService', msg: 'classify', data});
},
async update({image}, {classify, target}, {service}) {
  return classify({image, target}); // {results, mask: Image}
}
});
  