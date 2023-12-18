/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Build = {
  Layout: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    state: {
      graphId: 'BuildDocLayout'
    }
  },
  ToolsTabs: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyLeft#Container',
    state: {
      tabs: ['Modify', 'Tree', 'Parts']
    }
  },
  ModifyPanel: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 1
      },
      divider: 120
    }
  },
  InspectorGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container',
    state: {
      graphId: 'Inspector'
    }
  },
  StateGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container2',
    state: {
      graphId: 'State'
    }
  },
  AtomTree: {
    type: '$anewLibrary/Design/Atoms/AtomTree',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 2
      }
    }
  },
  GraphGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 3
      }
    }
  },
  DocumentTabs: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container',
    state: {
      closeable: true
    }
  },
  EditorsGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'Layout$BodyMiddle#Container2',
    state: {
      graphId: 'Editors'
    }
  }
};