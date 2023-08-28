/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const DesignerNode = {
  designer: {
    type: '$library/Layout/Atoms/DesignerPanel', 
    inputs: ['layout', 'selected', 'disabled'],
    outputs: ['layout', 'selected']
  },
  panel: {
    type: '$library/Layout/Atoms/Panel',
    inputs: ['canvasLayout'],
    bindings: {layout: 'panel$canvasLayout'},
    container: 'designer#Container'
  },
  state: {
    designer$disabled: true,
    designer$style: 'width: auto; height: auto;',
    panel$canvasLayout: 'column'
  }
};