/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Build = {
  DevTools: {
    type: '$anewLibrary/DevTools/Atoms/DevTools',
  },
  Layout: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    state: {
      graphId: 'BuildLayout'
    }
  },
  ToolsTabs: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyLeft#Container',
    state: {
      tabs: ['Files', 'Modify', 'Tree', 'Parts']
    }
  },
  FilesGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 0
      },
      graphId: 'FileExplorer'
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
  PartsGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 3
      },
      graphId: 'Parts'
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
  },
  CloseService: {
    type: '$anewLibrary/Data/Atoms/ServiceAccess',
    state: {
      service: 'DocumentService',
      task: 'Close'
    },
    connections: {
      data: 'DocumentTabs$closed'
    }
  }
};