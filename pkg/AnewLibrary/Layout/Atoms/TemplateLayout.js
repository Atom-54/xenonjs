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
render({styleRules}, state) {
  const {items, template, selected, activated, opened} = state;
  const defaults = {
    name: 'Unnamed Item',
    ligature: 'settings_backup_restore'
  };
  let i = 0;
  state.imap = [];
  const mapItems = items => items?.map?.(item => {
    if (typeof item === 'object') {
      item = deepCopy(item);
      map(item, (k, v) => item[k] = mapItems(v) || v);
      item = {
        ...defaults,
        key: i,
        ...item,
        closed: !opened?.[i],
        selected: [String(i), item.name].includes(selected),
        activated: [String(i), item.name].includes(activated),
      };
      for (let n of ['thumb', 'icon', 'image']) {
        if (item[n]) {
          item[n] = resolve(item[n]);
        }
      }
    }
    i++;
    state.imap.push(item);
    return item;
  });
  const models = mapItems(items);
  return {
    styleRules,
    items: {
      template,
      models
    }
  };
},
onItemOpenClose({eventlet: {key}}, state) {
  log('onItemOpenClose', key);
  (state.opened ??= {})[key] = !state.opened[key];
  return this.onItemSelect({eventlet: {key}}, state);
},
onItemDelete({eventlet: {key}}, state) {
  log('onItemDelete', key);
  return {delete: key, trigger: Math.random()};
},
onItemSelect({eventlet}, state) {
  log.debug('onItemSelect', eventlet);
  const selected = state.selected = eventlet.key;
  return {selected};
},
onItemRename({eventlet: {key, value}}, state) {
  log('onItemRename', key, value);
  state.renamed = {key, value};
  return {renamed: {key, value}, trigger: Math.random()};
},
onItemActivate({eventlet: {key}}, state) {
  log.debug('onItemActivate', key, state.imap[key], state.imap);
  state.activated = key;
  state.selected = key;
  return {activated: state.imap[key], trigger: Math.random()};
},
template: html`
<style>${'{{styleRules}}'}</style>
<div>{{items}}</div>
`
});
