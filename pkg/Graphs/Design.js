/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Design = {
  Layout: {
    type: '$library/Graph/Atoms/Graph',
    state: {
      graphId: 'BuildLayout'
    }
  },
  Selected: {
    type: '$library/Data/Atoms/Data',
    connections: {
      json: [
        'Designer$selected',
        'EditorsGraph$AtomGraph$selected'
      ]
    }
  },
  Designer: {
    type: '$library/Design/Atoms/DesignTarget',
    container: 'Layout$Document#Container',
    connections: {
      selected: ['Selected$value']
    }
  },
  Graph: {
    type: '$library/Graph/Atoms/Graph', 
    container: 'Designer#Container'
  },
  ToolsTabs: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$ToolsBody#Container',
    state: {
      tabs: ['Inspect', 'Tree', 'Parts']
    }
  },
  ModifyPanel: {
    type: '$library/Layout/Atoms/SplitPanel',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 0
      },
      divider: 120
    }
  },
  InspectorGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container',
    state: {
      graphId: 'Inspector',
    },
    connections: {
      PropertyInspector$selected: ['Selected$value'],
      ConnectionInspector$selected: ['Selected$value']
    }
  },
  StateGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ModifyPanel#Container2',
    state: {
      graphId: 'State'
    },
    connections: {
      State$selected: ['Selected$value']
    }
  },
  AtomTree: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      graphId: 'Tree',
      style: {
        order: 1
      }
    },
    connections: {
      Atoms$data: ['Selected$value']
    }
  },
  PartsGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'ToolsTabs#Container',
    state: {
      style: {
        order: 2
      },
      graphId: 'Parts'
    }
  },
  EditorsGraph: {
    type: '$library/Graph/Atoms/Graph',
    container: 'Layout$DocumentEditors#Container',
    state: {
      graphId: 'Editors'
    },
    connections: {
      AtomGraph$selected: ['Selected$value']
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