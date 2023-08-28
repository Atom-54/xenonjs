/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
import {Paths} from '../Core/utils.js';
import {loadScript} from '../Dom/dom.js';

const pixijs = Paths.resolve('$root/third_party/pixijs');
// await loadScript({src: `${pixijs}/pixi.6.5.7.min.js`});
// await loadScript({src: `${pixijs}/pixi-plugins/pixi-spine.js`});

await loadScript({src: `${pixijs}/pixi-legacy.6.5.8.js`});
//await loadScript({src: `${pixijs}/pixi-plugins/pixi-spine.js`});

export const {PIXI} = globalThis;
