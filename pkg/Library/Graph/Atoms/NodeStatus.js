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
  delete context.base;
  const info = {};
  const prefix = `${selected}\$`;
  values(context.layers)
    .flatMap(layerState => keys(layerState)
      .forEach(key => {
        if (key?.startsWith(prefix)) {
          const displayKey = key.slice(prefix).replace(/\$/g, '.');
          info[displayKey] = layerState[key];
        }
      })
    )
  ;
  //log(info);
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
    overflow: auto !important;
    flex: 1 !important;
    user-select: text;
  }
</style>
<pre flex>{{info}}</pre>
`
});
