// global scope is out here; `timeout` and `html` are here;
// there might be nothing else
export const atom = (log, resolve) => ({
// proper "internal" Atom starts below. The wrapper above is to create
// a closure in restricted runtimes that must import Atoms as JS.
// Atoms may be stored without the wrapper; wrappers may be altered
// by servers.
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// Atom scope is in here; `log` and `resolve` are here
update({items, template}, state, {isDirty, output}) {
  // instance scope is in here ... tools are bound to our instance: `isDirty`, `output`, `service` are here
  if (isDirty('template')) {
    this.updateTemplate({items, template}, state, {output});
  } else {
    state.items = items;
  }
},
updateTemplate({items, template}, state, {output}) {
  // our new template
  state.template = template || '<div center flex column style="{{style}}" key="{{key}}" on-click="onItemClick"><h2>{{name}}</h2></div>';
  // Xen renderer will attempt to cache DOM, and does not expect template to change, 
  // so we clear items for a first pass...
  state.items = [];
  timeout(() => {
    // ... then render the real items as a second pass
    state.items = items;
    output();
  }, 0);
},
render({styleRules}, {items, template, selected, activated}) {
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
        selected: [i, item.name].includes(selected),
        activated: [i, item.name].includes(activated),
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
onItemSelect({eventlet: {key}}, state) {
  log.debug('onItemSelect', key);
  state.selected = key;
  return {selected: key};
},
onItemRename({eventlet: {key, value}}, state) {
  log('onItemRename', key, value);
  state.renamed = {key, value};
  return {renamed: {key, value}, trigger: Math.random()};
},
onItemActivate({eventlet: {key}}, state) {
  log.debug('onItemActivate', key);
  state.activated = key;
  state.selected = key;
  return {activated: key, trigger: Math.random()};
},
template: html`
<style>${'{{styleRules}}'}</style>
<div>{{items}}</div>
`
});
