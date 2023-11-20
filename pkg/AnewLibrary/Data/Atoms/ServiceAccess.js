export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({service, task, data}) {
  return Boolean(service && task && data);
},
async update({service: serviceName, task, data, interval}, state, {service, invalidate}) {
  if (interval) {
    timeout(invalidate, interval);
  }
  return {result: await service(serviceName, task, data)};
}
});
  