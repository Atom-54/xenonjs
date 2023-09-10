export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({selected}, state, {service}) {
  state.context = await service('SystemService', 'request-context');
},
render({selected}, {context}) {
  const selectedKey = `design$${selected}`;
  const stateKeys = values(context.layers).flatMap(layerState => keys(layerState).filter(key => key?.includes(selectedKey)));
  log(stateKeys);
  return {
    selected: selected || '(no selection)'
  };
},
getObjectId(id) {
  return id?.split('$').slice(0, -1).join('$') ?? '';
},
template: html`
<style>
  :host {
    padding: 4px;
  }
  h3 {
    margin: 0;
  }
</style>
<h3>{{selected}}</h3>
`
});
