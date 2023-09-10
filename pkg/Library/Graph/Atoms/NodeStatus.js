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
  const info = {};
  values(context.layers)
    .flatMap(layerState => keys(layerState)
      .forEach(key => {
        if (key?.includes(selectedKey)) {
          info[key] = layerState[key];
        }
      })
    );
  log(info);
  return {
    info: JSON.stringify(info, null, '  ')
  };
},
getObjectId(id) {
  return id?.split('$').slice(0, -1).join('$') ?? '';
},
template: html`
<style>
  :host {
    padding: 4px;
    font-size: 75%;
    overflow: scroll !important;
  }
</style>
<pre>{{info}}</pre>
`
});
