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
    type: `$library/Layout/Nodes/PanelNode`
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
    type: `$library/Layout/Nodes/SplitPanelNode`
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
    type: `$library/Layout/Nodes/CollapsePanelNode`
  },
  FlyOut: {
    category,
    description: 'Renders a fly-out panel',
    types: {
      flyOut$show: 'Boolean',
      flyOut$side: 'FlyOutSide',
      flyOut$sideValues: ['','top','right','bottom','left'],
    },
    type: `$library/Layout/Nodes/FlyOutNode`
  },
  DesignerPanel: {
    category,
    description: 'Renders a designer panel that supports complex layout editing',
    types: {
      designer$disabled: 'Boolean',
      panel$canvasLayout: 'DesignerNodeCanvasLayoutString', 
      panel$canvasLayoutValues: ['column','row'],
    },
    type: '$library/Layout/Nodes/DesignerNode'
  },
  FlipCard: {
    category,
    description: 'Renders a flip card with two sides',
    type: '$library/Layout/Nodes/FlipCardNode'
  },
  DesignGrid: {
    category,
    description: 'Renders a stack grid design layout',
    type: '$library/Layout/Nodes/DesignGridNode'
  }
};
