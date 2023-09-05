/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

({
onImage({eventlet: {value: image}}) {
  return {image};
},
template: html`
  <pixi-view flex demo="{{demo}}" image="{{image}}" on-image="onImage"></pixi-view>
`
})