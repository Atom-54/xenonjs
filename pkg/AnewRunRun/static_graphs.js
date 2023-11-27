export const RunRun = {
  DevTools: {
    type: '$anewLibrary/DevTools/Atoms/DevTools',
  },
  // Main: {
  //   type: '$anewLibrary/Graph/Atoms/Graph'
  //   // state: {
  //   //   graphId: 'BuildLayout'
  //   // }
  // }
};

export const DefaultGraph = {
};

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
  HeaderToolbar: {
    type: '$anewLibrary/UX/Atoms/UXToolbar',
    container: 'Layout$Header#Container',
    connections: {
      event: 'UXActionExecutor$event'
    },
    state: {
      style: {
        fontSize: '1.5rem',
        padding: '2px'
      },
      actions: [
        {
          "name": "XenonJs",
          "image": "$xenon/AnewLibrary/Assets/icons/favicon.png",
        },
        {
          "name": "spanner",
          "flex": 1
        },
        {
          "name": "New Graph",
          "ligature": "add",
          "action": "service",
          "args": {
            "kind": "DesignService",
            "msg": "NewGraph"
          }
        },
        {
          "name": "spanner",
          "flex": 1
        }
      ]
    }
  },
  UXActionExecutor: {
    type: '$anewLibrary/UX/Atoms/UXActionExecutor',
    connections: {
      event: 'HeaderToolbar$event'
    }
  },
  GraphPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyLeft#Container',
    state: {
      tabs: ['Atoms', 'Projects'],
      style: {
        overflow: 'auto',
        order: 1
      }
    }
  },
  AtomPanel: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'GraphPanels#Container',
    state: {
      style: {
        order: 1
      }
    }
  },  
  Catalog: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'AtomPanel#Container',
    state: {
      graphId: 'catalogGraph',
      style: {
        order: 1
      }
    }
  },
  AtomTree: {
    type: '$anewLibrary/Design/Atoms/AtomTree',
    container: 'AtomPanel#Container2',
    state: {
      style: {
        overflow: 'auto',
        padding: '0.6rem',
        order: 2
      }
    }
  },
  ProjectListPanel: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'GraphPanels#Container',
    state: {
      graphId: 'ProjectGraph',
      style: {
        order: 2,
        zoom: '75%',
        overflow: 'auto'
      }
    }
  },
  TabPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container2',
    state: {
      tabs: ['Graph', 'Editor']
    }
  },
  AtomGraph: {
    type: '$anewLibrary/Design/Atoms/AtomGraph',
    container: 'TabPanels#Container',
    state: {
      style: {
        order: 1
      }
    }
  },
  CodeEditor: {
    type: '$anewLibrary/CodeMirror/Atoms/CodeMirror',
    container: 'TabPanels#Container',
    state: {
      style: {
        order: 2
      }
    }
  },
  DesignPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container',
    state: {
      closeable: true
    }
  },
  DesignSelector: {
    type: '$anewLibrary/Design/Atoms/DesignSelector',
    connections: {
      index: 'DesignPanels$selected'
    }
  },
  InspectorPanel: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'Layout$BodyRight#Container'
  },
  InspectorEcho: {
    type: '$anewLibrary/Echo',
    container: 'InspectorPanel#Container',
    state: {
      style: {
        order: 1,
        flex: '0 0 auto',
        borderBottom: '1px solid #cccccc',
        backgroundColor: '#e4e4e4'
      }
    }
  },
  InspectorPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'InspectorPanel#Container',
    state: {
      tabs: ['Properties', 'Connections'],
      style: {
        overflow: 'hidden auto',
        order: 2
      }
    }
  },
  PropertyInspector: {
    type: '$anewLibrary/Design/Atoms/PropertyInspector',
    container: 'InspectorPanels#Container',
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
  State: {
    type: '$anewLibrary/Data/Atoms/DataExplorer',
    container: 'Layout$BodyRight#Container2',
    state: {
      style: {
        fontSize: '80%',
        overflow: 'auto'
      },
      expandLevel: 2
    }
  }
};

export const BuildLayout = {
  Panel: {
    type: '$anewLibrary/Layout/Atoms/Panel'
  },
  Header: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'Panel#Container',
    state: {
      layout: 'row',
      style: {
        flex: '0 0 auto',
        background: '#ececec'
      }
    }
  },
  BodyLeft: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'Panel#Container',
    state: {
      layout: 'row',
      divider: 212,
      endflex: true
    }
  },
  BodyMiddleRight: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'BodyLeft#Container2',
    state: {
      layout: 'row',
      divider: 260
    }
  },
  BodyMiddle: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'BodyMiddleRight#Container',
    state: {
      layout: 'column',
      divider: 260
    }
  },
  BodyRight: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'BodyMiddleRight#Container2',
    state: {
      layout: 'column',
      divider: 200
    }
  },
  Footer: {
    type: '$anewLibrary/Echo',
    container: 'Panel#Container',
    state: {
      html: 'atom54.com',
      style: {
        textAlign: 'right',
        fontSize: '70%',
        padding: '4px',
        flex: '0 0 auto',
        background: '#cccccc'
      }
    }
  }
};

export const catalogGraph = {
  Filter: {
    type: '$anewLibrary/Fields/Atoms/QueryBar',
    state: {
      reactive: true,
      icon: 'search',
      placeholder: 'Filter',
      style: {
        ['min-height']: '40px',
      }
    }
  },
  Catalog: {
    type: '$anewLibrary/Layout/Atoms/TemplateLayout',
    state: {
      style: {
        padding: '0 0.6rem',
        overflow: 'auto'
      },
      template: html`
  <div style="width: 100%; font-family: sans-serif;">
    <div style="padding: 8px 4px; font-weight: bold;">{{category}}</div>
    <div repeat="foo_t">{{types}}</div>
    <template foo_t>
      <div on-click="onItemClick" key="{{name}}" style="background-color: transparent; vertical-align: top; box-sizing: content-box; zoom: 0.4; display: inline-block; margin: 8px 4px 0 0; width: 136px;">
        <div style="width: 108px; background: #f9f9f9; border: 2px solid #bbbbbb; border-radius: 16px; margin: auto;">
          <drag-able key="{{name}}" type="node/type" style="position: relative; width: 104px; height:94px;">
            <img style="position: absolute; opacity: 0; top: -13px; right: -13px; width:32px; height:32px; pointer-events: none;" src="{{icon}}">
            <icon style="font-size: 67px; padding: 14px 19px; color: var(--xcolor-brand);">{{ligature}}</icon>
          </drag-able>    
        </div>
        <div title="{{displayName}}" style="width: 100%; font-size: 22px; color: #888888; padding: 12px; text-align: center; overflow: hidden; text-overflow: ellipsis;">{{displayName}}</div>
      </div>
    </template>
  </div>
      `
    }
  }
};

export const ProjectGraph = {
  "meta": {
    "id": "ProjectListGraph"
  },
  "ProjectList": {
    "type": "$anewLibrary/Layout/Atoms/TemplateLayout",
    "container": "Container",
    "state": {
      "template": "<div>\n <div project toolbar>\n   <icon>topic</icon>\n   <span>{{name}}</span>\n </div>\t\n <div graphs repeat=\"graph_t\">{{graphs}}</div>\n <template graph_t>\n   <div graph toolbar tabindex=\"-1\" key=\"{{name}}\" on-dblclick=\"onItemActivate\">\n     <icon>account_tree</icon>\n     <fancy-input jit style=\"flex: 0 1 auto;\" key=\"{{name}}\" value=\"{{name}}\" on-change=\"onItemRename\"></fancy-input>\n\t <span flex></span>\n     <icon hover key=\"{{name}}\" on-click=\"onItemActivate\">open_in_new</icon>\n     <span hover>|</span>\n     <icon hover key=\"{{name}}\" on-click=\"onItemDelete\">delete</icon>\n   </div>\t\n  </template>  \n</div>",
      "styleRules": "[project] {\n  color: purple;\n  background-color: white;\n  font-weight: bold;\n  font-size: 90%;\n}\n[graphs] {\n padding: 0 12px;\n}\n[graph]:hover {\n background-color: purple;\n color: white;\n cursor: pointer;\n}\n[graph] > [hover] {\n  visibility: hidden;\n}\n[graph]:hover > [hover] { \n visibility: visible;\n}",
      "style": {
        "flex": "0 0 auto",
        "order": 0
      }
    },
    "connections": {
      "items": [
        "DiscoverService$result"
      ]
    }
  },
  "DiscoverService": {
    "type": "$anewLibrary/Data/Atoms/ServiceAccess",
    "container": "Container",
    "state": {
      "template": "",
      "service": "ProjectService",
      "task": "Discover",
      "data": {},
      "style": {
        "order": 1
      },
      "interval": 0
    },
    "connections": {
      "data": [
        "ProjectList$trigger"
      ]
    }
  },
  "LoadService": {
    "type": "$anewLibrary/Data/Atoms/ServiceAccess",
    "container": "Container",
    "state": {
      "template": "",
      "service": "ProjectService",
      "task": "Load",
      "style": {
        "order": 2
      }
    },
    "connections": {
      "data": [
        "ProjectList$activated"
      ]
    }
  },
  "DeleteService": {
    "type": "$anewLibrary/Data/Atoms/ServiceAccess",
    "container": "Container",
    "state": {
      "service": "ProjectService",
      "task": "Delete",
      "style": {
        "order": 3
      },
      "template": ""
    },
    "connections": {
      "data": [
        "ProjectList$delete"
      ]
    }
  },
  "RenameService": {
    "type": "$anewLibrary/Data/Atoms/ServiceAccess",
    "container": "Container",
    "state": {
      "template": "",
      "service": "ProjectService",
      "task": "RenameGraph",
      "style": {
        "order": 4
      }
    },
    "connections": {
      "data": [
        "ProjectList$renamed"
      ]
    }
  }
};

export const graphOne = {
  TabPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    state: {
      style: {
        overflow: 'auto'
      },
      tabs: ['One', 'Two', 'Three']
    }
  },
  Card: {
    container: 'TabPanels#Container',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumCard',
    state: {
      style: {
        flex: '0 0 auto'
      },
      imageSrc: '$anewLibrary/Assets/dogs.png',
      heading: 'Cards for Fun',
      subheading: 'just trying stuff'
    },
  },
  Panel: {
    container: 'TabPanels#Container', 
    type: '$anewLibrary/Layout/Atoms/Panel',
    state: {
      style: {background: 'yellow'}
    }
  },
  Card2: {
    container: 'TabPanels#Container2',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumCard',
    state: {
      style: {
        flex: '0 0 auto'
      },
      size: 's',
      asset: 'file',
      heading: 'File Card',
      subheading: 'somefile.js',
      description: '3kb',
      horizontal: true
    }
  },
  Card3: {
    container: 'TabPanels#Container3',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumCard',
    state: {
      style: {
        flex: '0 0 auto'
      },
      imageSrc: '$anewLibrary/Assets/dogs.png',
      heading: 'Dogs!'
    }
  }
};

export const graphThree = {
  Button: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumButton',
    state: {
      label: 'GraphThree!',
      style: {
        flex: '0 0 auto'
      }
    }
  }
};