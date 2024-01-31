/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Build = {
  DevTools: {
    type: '$library/DevTools/Atoms/DevTools',
  },
  Layout: {
    type: '$library/Graph/Atoms/Graph',
    state: {
      graphId: 'BuildLayout'
    }
  },
  ToolsTabs: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyLeft#Container',
    state: {
      tabs: ['Files', 'Modify', 'Tree', 'Parts']
    }
  },
  FilesGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 0
      },
      graphId: 'FileExplorer'
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
  AtomTreeGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      graphId: 'Tree',
      style: {
        order: 2
      }
    }
  },
  PartsGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 3
      },
      graphId: 'Parts'
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
  },
  CloseService: {
    type: '$library/Data/Atoms/ServiceAccess',
    state: {
      service: 'DocumentService',
      task: 'Close'
    },
    connections: {
      data: 'DocumentTabs$closed'
    }
  }
};