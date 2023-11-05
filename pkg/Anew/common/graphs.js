export const Build = {
  Layout: {
    type: '$library/Anew/Atoms/System',
    state: {
      graphId: 'BuildLayout'
    }
  },
  Inspector: {
    type: '$library/Anew/Atoms/System',
    container: 'Layout$BodyRight#Container2',
    state: {
      graphId: 'inspectorGraph',
      style: {
        order: 1,
        borderBottom: '1px solid #cccccc'
      }
    }
  },
  AtomTree: {
    type: '$library/Anew/Atoms/AtomTree',
    container: 'Layout$BodyRight#Container2',
    state: {
      style: {
        padding: '0.6rem',
        order: 2
      }
    }
  },
  Catalog: {
    type: '$library/Layout/Atoms/Templated',
    container: 'Layout$BodyLeft#Container',
    state: {
      style: {
        padding: '0.6rem'
      },
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
  },
  TabPanels: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    container: 'Layout$BodyMiddle#Container2',
    state: {
      tabs: ['Graph', 'State', 'Editor']
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
      style: {
        height: '48px',
        flex: '0 0 auto',
        background: '#cccccc'
      }
    }
  },
  BodyLeft: {
    type: '$library/Layout/Atoms/SplitPanel',
    container: 'Panel#Container',
    state: {
      layout: 'row',
      divider: 200,
      endflex: true
    }
  },
  BodyRight: {
    type: '$library/Layout/Atoms/SplitPanel',
    container: 'BodyLeft#Container2',
    state: {
      layout: 'row',
      divider: 260
    }
  },
  BodyMiddle: {
    type: '$library/Layout/Atoms/SplitPanel',
    container: 'BodyRight#Container',
    state: {
      layout: 'column',
      divider: 260
    }
  },
  Footer: {
    type: '$library/Layout/Atoms/Panel',
    container: 'Panel#Container',
    state: {
      style: {
        height: '56px',
        flex: '0 0 auto',
        background: '#cccccc'
      }
    }
  }
};

export const inspectorGraph = {
  Echo: {
    type: '$library/Echo',
    state: {
      style: {
        borderBottom: '1px solid #cccccc'
      }
    }
  },
  Inspector: {
    type: '$library/Anew/Atoms/Inspect'
  }
};

