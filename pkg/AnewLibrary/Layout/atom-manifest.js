/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Layout';

export const Layout = {
  Panel: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    inputs: ['layout', 'center', 'style'],
    inputs: {
      layout: 'LayoutValues|String',
      center: 'Boolean',
      style: 'CSSStyle'
    },
    layoutValues: ['column','row'],
    state: {
      panel$layout: 'column'
    },
    category,
    description: 'Renders a simple panel that can contain elements',
    ligature: 'select_all'
  },
  SplitPanel: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    inputs: ['endflex', 'layout', 'collapsed', 'divider'],
    outputs: ['divider'],
    category,
    description: 'Renders a split panel with two sections',
    types: {
      splitPanel$endflex: 'Boolean',
      splitPanel$divider: 'Number',
      splitPanel$layout: 'String',
      splitPanel$layoutValues: ['vertical', 'horizontal']
    },
    ligature: 'bottom_sheets'
  }
};