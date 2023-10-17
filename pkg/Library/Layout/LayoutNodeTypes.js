/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Layout';

export const LayoutNodeTypes = {
  Panel: {
    category,
    description: 'Renders a simple panel that can contain elements',
    types: {
      panel$layout: 'String',
      panel$layoutValues: ['column','row'],
      panel$center: 'Boolean',
      panel$style: 'CSSStyle'
    },
    type: `$library/Layout/Nodes/PanelNode`,
    ligature: 'select_all'
  },
  SplitPanel: {
    category,
    description: 'Renders a split panel with two sections',
    types: {
      splitPanel$endflex: 'Boolean',
      splitPanel$divider: 'Number',
      splitPanel$layout: 'String',
      splitPanel$layoutValues: ['vertical', 'horizontal']
    },
    type: `$library/Layout/Nodes/SplitPanelNode`,
    ligature: 'bottom_sheets'
  },
  CollapsePanel: {
    description: 'Renders a collapsing panel',
    category,
    types: {
      panel$size: 'String',
      //style: 'String',
      panel$side: 'LayoutSide',
      panel$sideValues: ['right', 'bottom'],
      panel$collapsed: 'Boolean'
    },  
    type: `$library/Layout/Nodes/CollapsePanelNode`,
    ligature: 'side_navigation'
  },
  FlyOut: {
    category,
    description: 'Renders a fly-out panel',
    types: {
      flyOut$show: 'Boolean',
      flyOut$side: 'FlyOutSide',
      flyOut$sideValues: ['','top','right','bottom','left'],
    },
    type: `$library/Layout/Nodes/FlyOutNode`,
    ligature: 'dialogs'
  },
  DesignerPanel: {
    category,
    description: 'Renders a designer panel that supports complex layout editing',
    types: {
      designer$disabled: 'Boolean',
      panel$canvasLayout: 'DesignerNodeCanvasLayoutString', 
      panel$canvasLayoutValues: ['column','row'],
    },
    type: '$library/Layout/Nodes/DesignerNode',
    ligature: 'resize'
  },
  FlipCard: {
    category,
    description: 'Renders a flip card with two sides',
    type: '$library/Layout/Nodes/FlipCardNode',
    ligature: 'flip'
  },
  GridLayout: {
    category,
    description: 'A grid-layout container',
    type: '$library/Layout/Nodes/TemplatedGridNode',
    types: {
      grid$template: "MultilineText",
      grid$style: "MultilineText"
    },
    ligature: 'grid_view'
  },
  TemplateLayout: {
    category,
    description: 'A container that renders items using a template',
    type: '$library/Layout/Nodes/TemplatedNode',
    types: {
      Templated$template: "MultilineText:HTML",
      Templated$styleRules: "MultilineText:CSSRules"
    },
    ligature: 'grid_guides'
  },
  // DesignGrid: {
  //   category,
  //   description: 'Renders a stack grid design layout',
  //   type: '$library/Layout/Nodes/DesignGridNode'
  // },
  TabPages: {
    category,
    description: 'Set of pages with Tabs for navigation',
    type: '$library/Layout/Nodes/TabPagesNode',
    ligature: 'tabs'
  },
  Accordion: {
    category,
    description: 'Set of panels in an accordion',
    types: {
      panels$sections: '[String]'
    },
    type: '$library/Layout/Nodes/AccordionNode',
    ligature: 'unfold_less'
  }
};
