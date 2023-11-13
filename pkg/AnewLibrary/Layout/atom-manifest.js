/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Media';

export const Layout = {
  Panel: {
    category,
    description: 'Renders a simple panel that can contain elements',
    ligature: 'select_all',
    type: '$anewLibrary/Layout/Atoms/Panel',
    inputs: {
      layout: 'LayoutValues|String',
      center: 'Boolean',
      style: 'CSSStyle'
    },
    types: {
      LayoutValues: ['column','row'],
    },
    state: {
      layout: 'column'
    }
  },
  SplitPanel: {
    category,
    description: 'Renders a split panel with two sections',
    ligature: 'bottom_sheets',
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    inputs: {
      endflex: 'Boolean',
      divider: 'Number',
      layout: 'SplitLayoutValues|String'
    },
    outputs: {
      divider: 'Number'
    },
    types: {
      SplitLayoutValues: ['vertical', 'horizontal']
    }
  }
};