export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
onClick({eventlet: {value}}) {
  return {value: Math.random()};
},
template: html`
<sp-button theme="spectrum" size="m" on-click="onClick"><icon>{{icon}}</icon>&nbsp;<span>{{label}}</span></sp-button>
`
});
