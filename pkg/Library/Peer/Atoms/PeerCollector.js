export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({peers, peer}, state, {isDirty}) {
  if (peer != null && isDirty("peer")) {
    peers ??= [];
    peers.push(peer);
  }
  return {peers};
}
});
