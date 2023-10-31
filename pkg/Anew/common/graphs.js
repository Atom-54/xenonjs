export const graphOne = {
  Tabs: {
    type: '$library/Spectrum/Atoms/SpectrumTabs'
  },
  TabPanels: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels'
  },
  Card: {
    container: 'main$GraphOne$TabPanels#Container',
    type: '$library/Spectrum/Atoms/SpectrumCard',
    state: {
      heading: 'Cards for Fun',
      subheading: 'just trying stuff'
    },
  },
  Card2: {
    type: '$library/Spectrum/Atoms/SpectrumCard',
    state: {
      //size: 's',
      asset: 'file',
      heading: 'File Card',
      subheading: 'somefile.js',
      description: '3kb'
      //horizontal: true
    }
  },
  Card3: {
    type: '$library/Spectrum/Atoms/SpectrumCard',
    state: {
      imageSrc: '$library/Assets/dogs.png',
      heading: 'Dogs!'
    }
  },
  GraphThree: {
    type: '$library/Anew/Atoms/System',
    state: {
      graphId: 'graphThree'
    }
  }
};

export const inspectorGraph = {
  Echo: {
    type: '$library/Echo'
  },
  Inspector: {
    type: '$library/Anew/Atoms/Inspect'
  }
};

export const echoGraph = {
  Echo: {
    type: '$library/Echo'
  }
};

export const treeGraph = {
  AtomTree: {
    type: '$library/Graph/Atoms/AtomTree'
  }
};

export const catalogGraph = {
  Catalog: {
    type: '$library/Layout/Atoms/Templated',
    state: {
      items: [{
        category: "Atoms",
        items: [{
          name: 'Button',
          ligature: 'buttons_alt'
        }]
      }],
      template: html`
<div style="width: 100%; font-family: sans-serif;">
  <div style="padding: 8px 4px; font-weight: bold;">{{category}}</div>
  <div repeat="foo_t">{{items}}</div>
  <template foo_t>
    <div on-click="onItemClick" key="{{name}}" style="background-color: transparent; vertical-align: top; box-sizing: content-box; zoom: 0.4; display: inline-block; margin: 8px 4px 0 0; width: 126px;">
      <div style="width: 108px; background: #f9f9f9; border: 2px solid #bbbbbb; border-radius: 16px; margin: auto;">
        <drag-able key="{{name}}" type="node/type" style="position: relative; width: 104px; height:94px;">
          <img style="position: absolute; opacity: 0; top: -13px; right: -13px; width:32px; height:32px; pointer-events: none;" src="{{icon}}">
		  <icon style="font-size: 67px; padding: 14px 19px; color: var(--xcolor-brand);">{{ligature}}</icon>
        </drag-able>    
      </div>
      <div title="{{name}}" style="width: 100%; font-size: 22px; color: #888888; padding: 12px; text-align: center; overflow: hidden; text-overflow: ellipsis;">{{name}}</div>
    </div>
  </template>
</div>
      `
    }
  }
};

export const graphTwo = {
  Button: {
    type: '$library/Spectrum/Atoms/SpectrumButton',
    state: {
      label: 'GraphTwo!'
    }
  },
  GraphOne: {
    type: '$library/Anew/Atoms/System',
    state: {
      graphId: 'graphOne'
    }
  }
};

export const graphThree = {
  Button: {
    type: '$library/Spectrum/Atoms/SpectrumButton',
    state: {
      label: 'GraphThree!'
    }
  }
};

export const documentsGraph = {
  TabPanels: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    state: {
      tabs: ['Graph One', 'Graph Two']
    }
  },
  Card: {
    container: 'main$TabPanels#Container',
    type: '$library/Spectrum/Atoms/SpectrumCard',
    state: {
      imageSrc: '$library/Assets/dogs.png',
      heading: 'Cards for Fun',
      subheading: 'just trying stuff'
    }
  },
  GraphOne: {
    container: 'main$TabPanels#Container1',
    type: '$library/Anew/Atoms/System',
    state: {
      graphId: 'graphOne'
    }
  }
};