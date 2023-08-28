export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({image}, state, {service}) {
  const results = await service({kind: 'FaceMeshService', msg: 'classify', data: {image}});
  return {data: results};
}
});
