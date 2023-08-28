/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
({
onImage({eventlet: {value: image}}) {
  return {image};
},
template: html`
  <pixi-view flex demo="{{demo}}" image="{{image}}" on-image="onImage"></pixi-view>
`
})