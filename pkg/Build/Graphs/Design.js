/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Design = {
  Layout: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    state: {
      graphId: 'BuildLayout'
    }
  },
  Selected: {
    type: '$anewLibrary/Data/Atoms/Data',
    connections: {
      json: [
        'Designer$selected',
        'EditorsGraph$AtomGraph$selected'
      ]
    }
  },
  Designer: {
    type: '$anewLibrary/Design/Atoms/DesignTarget',
    container: 'Layout$Document#Container',
    connections: {
      selected: ['Selected$value']
    }
  },
  Graph: {
    type: '$anewLibrary/Graph/Atoms/Graph', 
    container: 'Designer#Container'
  },
  ToolsTabs: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$ToolsBody#Container',
    state: {
      tabs: ['Parts', 'Tree', 'Modify']
    }
  },
  ModifyPanel: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 2
      },
      divider: 120
    }
  },
  InspectorGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container',
    state: {
      graphId: 'Inspector',
    },
    connections: {
      PropertyInspector$selected: ['Selected$value']
    }
  },
  StateGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container2',
    state: {
      graphId: 'State'
    },
    connections: {
      State$selected: ['Selected$value']
    }
  },
  AtomTree: {
    type: '$anewLibrary/Design/Atoms/AtomTree',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 1
      }
    },
    connections: {
      selected: ['Selected$value']
    }
  },
  PartsGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 0
      },
      graphId: 'Parts'
    }
  },
  EditorsGraph: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'Layout$DocumentEditors#Container',
    state: {
      graphId: 'Editors'
    },
    connections: {
      AtomGraph$selected: ['Selected$value']
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