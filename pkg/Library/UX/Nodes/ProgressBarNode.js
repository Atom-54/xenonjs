/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// written by GPT4; then manually fixed :)
export const ProgressBarNode = {
  bar: {
    type: '$library/UX/Atoms/ProgressBar',
    inputs: ['percentage', 'total', 'count', 'height', 'inProgress', 'interval'],
  },
  state: {
    // bar$percentage: 10
    bar$height: 30
  }
};
