export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({index}, state, {service}) {
  service('DesignService', 'SetDesignLayerIndex', {index});
}
});
  