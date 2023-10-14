/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const TemplatedGridNode = {
  grid: {
    type: '$library/Layout/Atoms/TemplatedGrid',
    inputs: ['items', 'template', 'style'],
    outputs: ['events'],
  }
};
