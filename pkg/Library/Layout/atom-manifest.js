/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Layout';

export const Layout = {
  Panel: {
    categories: [category, 'Common'],
    description: 'A simple container',
    ligature: 'select_all',
    type: '$library/Layout/Atoms/Panel',
    containers: ['Container'],
    inputs: {
      layout: 'LayoutValues:String',
      center: 'Boolean',
      style: 'CSSStyle'
    },
    types: {
      LayoutValues: ['column','row'],
    },
    state: {
      layout: 'column',
      style: {
        overflow: 'auto'
      }
    }
  },
  SplitPanel: {
    categories: [category],
    description: 'A panel divided into two resizable sections',
    ligature: 'bottom_sheets',
    type: '$library/Layout/Atoms/SplitPanel',
    containers: ['Container', 'Container2'],
    inputs: {
      endflex: 'Boolean',
      divider: 'Number',
      layout: 'SplitLayoutValues:String'
    },
    outputs: {
      divider: 'Number'
    },
    types: {
      SplitLayoutValues: ['vertical', 'horizontal']
    }
  },
  TemplateLayout: {
    categories: [category],
    displayName: 'Template Layout',
    description: 'A container that renders items using a template',
    type: '$library/Layout/Atoms/TemplateLayout',
    inputs: {
      items: 'Array|Pojo',
      template: 'HTML|Text',
      styleRules: 'CSSRules|Text'
    },
    outputs: {
      context: 'Pojo',
      target: 'Pojo',
      selected: 'Pojo',
      activated: 'Pojo',
      opened: 'Pojo',
      renamed: 'Pojo',
      delete: 'Pojo',
      trigger: 'Nonce'
    },
    ligature: 'grid_guides'
  },
  FlyOut: {
    categories: [category],
    description: 'A modal panel',
    ligature: 'dialogs',
    type: '$library/Layout/Atoms/FlyOut',
    container: ['Container'],
    inputs: {
      show: 'Nonce',
      hide: 'Nonce',
      side: 'FlyOutSide',
      design: 'Boolean'
    },
    types: {
      FlyOutSide: ['','top','right','bottom','left'],
    }
  },
  PopOver: {
    categories: [category],
    description: 'A flying panel',
    ligature: 'dialogs',
    type: '$library/Layout/Atoms/PopOver',
    container: ['Container'],
    inputs: {
      show: 'Nonce'
    }
  },
  TabPages: {
    categories: [category],
    displayName: 'Tag Pages',
    description: 'Set of pages with Tabs for navigation',
    type: '$library/Layout/Atoms/TabPages',
    ligature: 'tabs',
    inputs: {
      tabs: '[Pojo]'
    }
  }
};