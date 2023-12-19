/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Parts = {
  Filter: {
    type: '$library/Fields/Atoms/QueryBar',
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
    type: '$library/Layout/Atoms/TemplateLayout',
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