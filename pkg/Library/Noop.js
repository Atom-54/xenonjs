/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const atom = (log, resolve) => ({

  shouldUpdate({msg}) {
    return msg;
  },
  update({msg}) {
    log(msg);
  }
});
