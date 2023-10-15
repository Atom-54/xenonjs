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
render({styleRules}, {items, template, selected}) {
  const defaults = {
    name: 'Unnamed Item',
    ligature: 'settings_backup_restore'
    // thumb: resolve('$library/AI/Assets/delmer.png'),
    // owner: 'scott.miles@gmail.com<br>02/11/23',
    // description: 'An amazing piece of kit. Use it again and again. Even better than "Cats"!'
  };
  //const std = ''; //'border-radius: 13px; margin: 8px;';
  let i = 0;
  const mapImages = items => items?.map?.(item => {
    if (typeof item === 'object') {
      item = deepCopy(item);
      map(item, (k, v) => item[k] = mapImages(v) || v);
      item = {
        ...defaults,
        key: i,
        selected: i === selected,
        ...item
      };
      for (let n of ['thumb', 'icon', 'image']) {
        if (item[n]) {
          item[n] = resolve(item[n]);
        }
      }
    }
    i++;
    return item;
  });
  const models = mapImages(items);
  return {
    styleRules,
    items: {
      template,
      models
    }
  }
},
onItemClick({eventlet: {key, value}}, state) {
  state.selected = key;
  log('onItemClick', key);
},
onDragStart({eventlet: {key, value}}) {
  //e.dataTransfer.setData('text/plain', key);
},
template: html`
<style>${'{{styleRules}}'}</style>
<div>{{items}}</div>
`
});
