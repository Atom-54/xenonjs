/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

({
async update({image}, state, {service}) {
  const data = await service({kind: 'CocoSsdService', msg: 'classify', data: {image}});
  return {data};
}
});
