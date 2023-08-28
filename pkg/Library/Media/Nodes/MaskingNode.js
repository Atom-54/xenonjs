/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const MaskingNode = {
  maskDesigner: {
    type: '$library/Layout/Atoms/DesignerPanel'
  },
  maskingPanel: {
    type: '$library/Layout/Atoms/Panel',
    container: 'maskDesigner#Container'
  },
  maskObject: {
    type: '$library/Layout/Atoms/Panel',
    container: 'maskingPanel#Container',
  },
  state: {
    'maskingPanel$layout': 'absolute',
    'maskingPanel$style': 'border: 3px solid orange;'
  }
};
