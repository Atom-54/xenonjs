
export const Build = {
  Layout: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    state: {
      graphId: 'BuildLayout'
    }
  },
  HeaderToolbar: {
    type: '$library/UX/Atoms/UXToolbar',
    container: 'Layout$Header#Container',
    connections: {
      event: 'UXActionExecutor$event'
    },
    state: {
      style: {
        fontSize: '1.5rem'
      },
      actions: [
        // {
        //   "label": "Atom54"
        // }, 
        {
          "name": "Graphs Menu",
          // "ligature": "dashboard_customize",
          "image": "$xenon/Library/Assets/icons/favicon.png",
          //"action": "toggle",
          //"stateKey": "GraphListFlyOut$flyOut$show"
        },
        // {
        //   "name": "Graph Name",
        //   "slot": "graphName",
        // },
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
    type: '$library/UX/Atoms/UXActionExecutor',
    connections: {
      event: 'HeaderToolbar$event'
    }
  },
  InspectorPanel: {
    type: '$anewLibrary/Layout/Atoms/Panel',
    container: 'Layout$BodyRight#Container'
  },
  InspectorEcho: {
    type: '$library/Echo',
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
        order: 2
      }
    }
  },
  PropertyInspector: {
    type: '$anewLibrary/Design/Atoms/PropertyInspector',
    container: 'InspectorPanels#Container'
  },
  ConnectionInspector: {
    type: '$anewLibrary/Design/Atoms/ConnectionInspector',
    container: 'InspectorPanels#Container2'
  },
  AtomTree: {
    type: '$anewLibrary/Design/Atoms/AtomTree',
    container: 'Layout$BodyLeftSplit#Container2',
    state: {
      style: {
        overflow: 'auto',
        padding: '0.6rem',
        order: 2
      }
    }
  },  
  Catalog: {
    type: '$anewLibrary/Graph/Atoms/Graph',
    container: 'Layout$BodyLeftSplit#Container',
    state: {
      graphId: 'catalogGraph',
      style: {
        overflow: 'auto'
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
  },
  TabPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container2',
    state: {
      tabs: ['Graph', 'Editor']
    }
  },
  NodeGraph: {
    type: '$anewLibrary/Design/Atoms/NodeGraph',
    container: 'TabPanels#Container'
  },
  DesignPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container'
  },
  DesignSelector: {
    type: '$anewLibrary/Design/Atoms/DesignSelector',
    connections: {
      index: 'DesignPanels$selected'
    }
  }
};

export const BuildLayout = {
  Panel: {
    type: '$library/Layout/Atoms/Panel'
  },
  Header: {
    type: '$library/Layout/Atoms/Panel',
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
      divider: 200,
      endflex: true
    }
  },
  BodyLeftSplit: {
    type: '$anewLibrary/Layout/Atoms/SplitPanel',
    container: 'BodyLeft#Container',
    state: {
      layout: 'column'
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
    type: '$library/Echo',
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
  Catalog: {
    type: '$anewLibrary/Layout/Atoms/Templated',
    state: {
      style: {
        padding: '0.6rem',
        flex: '0 0 auto'
      },
      template: html`
  <div style="width: 100%; font-family: sans-serif;">
  <div style="padding: 8px 4px; font-weight: bold;">{{category}}</div>
  <div repeat="foo_t">{{types}}</div>
  <template foo_t>
    <div on-click="onItemClick" key="{{name}}" style="background-color: transparent; vertical-align: top; box-sizing: content-box; zoom: 0.4; display: inline-block; margin: 8px 4px 0 0; width: 130px;">
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
      imageSrc: '$library/Assets/dogs.png',
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
      imageSrc: '$library/Assets/dogs.png',
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