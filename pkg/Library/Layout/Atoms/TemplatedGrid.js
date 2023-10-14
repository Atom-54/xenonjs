export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({items, template}, state, {isDirty, output}) {
  if (isDirty('template')) {
    state.template = template || '<div center flex column style="{{style}}" key="{{key}}" on-click="onItemClick"><h2>{{name}}</h2></div>';
    // Xen renderer does not expect template to change, 
    // so we clear items for an initial render...
    state.items = [];
    timeout(() => {
      // ... and then render the proper items as a second pass
      state.items = items;
      output();
    }, 0);
  } else {
    state.items = items;
  }
},
render({style}, {items, template}) {
  const defaults = {
    name: 'Unnamed Item'
    // thumb: resolve('$library/AI/Assets/delmer.png'),
    // owner: 'scott.miles@gmail.com<br>02/11/23',
    // description: 'An amazing piece of kit. Use it again and again. Even better than "Cats"!'
  };
  const std = ''; //'border-radius: 13px; margin: 8px;';
  const mapImages = items => items?.map?.(i => {
    if (typeof i === 'object') {
      values(i).forEach(ii => mapImages(ii));
      for (let n of ['thumb', 'icon', 'image']) {
        if (i[n]) {
          i[n] = resolve(i[n]);
        }
      }
    }
    return i;
  });
  const models = mapImages(items)?.map?.(i => {
    return {
      ...defaults,
      ...i,
      style: `${i.selected ? 'border: 1px solid red; ' : ''} ${std}`
    };
  });
  return {
    style,
    items: {
      template,
      models
    }
  }
},
onItemClick({eventlet: {key, value}, events}) {
  events = [];
  events.push({kind: key, id: value});
  return {events};
},
template: html`
<style>
  :host {
    flex: 1;
    display: flex;
    height: 100%;
  }
  * {
    box-sizing: border-box;
  }
  [grid] {
    align-content: flex-start;
    padding: 1em;
    height: 100% !important; /*50em;*/
  }
  [grid] > * {
    min-width: 4em;
    min-height: 4em;
    flex-basis: auto !important;
  }
  [cgrid] {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: masonry;
  }
</style>
<style>${'{{style}}'}</style>
<div flex scrolling grid>{{items}}</div>

`
});
