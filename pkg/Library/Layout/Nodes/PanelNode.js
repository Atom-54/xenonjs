/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PanelNode = {
  panel: {
    type: '$library/Layout/Atoms/Panel',
    inputs: ['layout', 'center', 'style']
  },
  state: {
    panel$layout: 'column'
  }
};
