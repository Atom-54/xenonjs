/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Inspector = {
  InspectorEcho: {
    type: '$anewLibrary/Echo',
    state: {
      style: {
        order: 0,
        flex: '0 0 auto',
        backgroundColor: '#e4e4e4'
      }
    }
  },
  InspectorPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    state: {
      tabs: ['Properties', 'Connections'],
      style: {
        overflow: 'hidden auto',
        order: 2
      }
    }
  },
  PropertiesPanel: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'InspectorPanels#Container',
    state: {
      style: {
        order: 0
      }
    }
  },
  PropertyInspector: {
    type: '$anewLibrary/Design/Atoms/PropertyInspector',
    container: 'PropertiesPanel#Container',
    state: {
      style: {
        overflowY: 'visible'
      }
    }
  },
  ConnectionInspector: {
    type: '$anewLibrary/Design/Atoms/ConnectionInspector',
    container: 'InspectorPanels#Container',
    state: {
      style: {
        overflowY: 'visible'
      }
    }
  },
  StyleToolbar: {
    type: '$anewLibrary/UX/Atoms/UXToolbar',
    container: 'PropertiesPanel#Container',
    connections: {
      event: 'UXActionExecutor$event'
    },
    state: {
      style: {
        flex: '0 0 auto',
        fontSize: '1.0rem',
        order: 1,
        padding: '10px 4px 0 0'
      },
      actions: [
        {
          "name": "Flex",
          "ligature": "handyman",
          "action": "service",
          "args": {
            "kind": "StyleService",
            "msg": "ToggleFlex"
          }
        },
        {
          "name": "Scrolling",
          "ligature": "swap_vert",
          "action": "service",
          "args": {
            "kind": "StyleService",
            "msg": "ToggleScrolling"
          }
        },
        {
          "name": "Width",
          "ligature": "width",
          "action": "service",
          "args": {
            "kind": "StyleService",
            "msg": "ToggleWidth"
          }
        },
        {
          "name": "FontSize",
          "ligature": "format_size",
          "action": "service",
          "args": {
            "kind": "StyleService",
            "msg": "ToggleFontSize"
          }
        }
      ]
    }
  }
};