/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const categories = ['Layout'];

export const Layout = {
  Panel: {
    categories,
    description: 'A simple container',
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
    categories,
    description: 'A panel divided into two resizable sections',
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
  },
  FlyOut: {
    categories,
    description: 'A modal panel',
    ligature: 'dialogs',
    type: '$anewLibrary/Layout/Atoms/FlyOut',
    inputs: {
      show: 'Nonce',
      side: 'FlyOutSide'
    },
    types: {
      FlyOutSide: ['','top','right','bottom','left'],
    }
  }
};