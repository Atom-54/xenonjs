/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Build = {
  Layout: {
    type: '$library/Graph/Atoms/Graph',
    state: {
      graphId: 'BuildDocLayout'
    }
  },
  ToolsTabs: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyLeft#Container',
    state: {
      tabs: ['Modify', 'Tree', 'Parts']
    }
  },
  ModifyPanel: {
    type: '$library/Layout/Atoms/SplitPanel',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 1
      },
      divider: 120
    }
  },
  InspectorGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container',
    state: {
      graphId: 'Inspector'
    }
  },
  StateGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container2',
    state: {
      graphId: 'State'
    }
  },
  AtomTree: {
    type: '$library/Design/Atoms/AtomTree',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 2
      }
    }
  },
  GraphGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 3
      }
    }
  },
  DocumentTabs: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container',
    state: {
      closeable: true
    }
  },
  EditorsGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'Layout$BodyMiddle#Container2',
    state: {
      graphId: 'Editors'
    }
  }
};