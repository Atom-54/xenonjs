export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update({items, template}, state, {isDirty, output}) {
  if (isDirty('template')) {
    state.template = template || '<div center flex column style="{{style}}" key="{{key}}" on-click="onItemClick"><h2>{{name}}</h2></div>';
    // Xen renderer will attempt to cache DOM, and does not expect template to change, 
    // so we clear items for an first pass...
    state.items = [];
    timeout(() => {
      // ... and then render the real items as a second pass
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
  };
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
onItemDelete({eventlet: {key, value}}, state) {
  log('onItemDelete', key);
  return {delete: key, trigger: Math.random()};
},
onItemSelect({eventlet: {key, value}}, state) {
  log.debug('onItemSelect', key);
  debugger;
  state.selected = key;
  return {selected: key};
},
onItemRename({eventlet: {key, value}}, state) {
  log('onItemRename', key, value);
  state.renamed = {key, value};
  return {renamed: {key, value}, trigger: Math.random()};
},
onItemActivate({eventlet: {key, value}}, state) {
  log('onItemActivate', key);
  state.selected = key;
  return {activated: key, trigger: Math.random()};
},
template: html`
<style>${'{{styleRules}}'}</style>
<div>{{items}}</div>
`
});
