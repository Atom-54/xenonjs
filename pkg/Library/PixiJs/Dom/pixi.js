/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as pixiModules from '../../../third-party/pixijs/v7.3.1/pixi.mjs'; 
// import {Paths} from '../../CoreXenon/Reactor/Atomic/js/utils/paths.js';
// import {loadScript} from '../../Dom/dom.js';

const PIXI = {...pixiModules}
globalThis.PIXI = PIXI;
export {PIXI};

//const pixijs = Paths.resolve('$xenon/third-party/pixijs/v7.2.4');
//await loadScript({src: `${pixijs}/pixi-spine.js`});

//await loadScript({src: `${pixijs}/pixi-legacy.6.5.8.js`});
//await loadScript({src: `${pixijs}/pixi-plugins/pixi-spine.js`});

//export const {PIXI} = globalThis;
// import '../../../third-party/pixijs/v7.2.4/pixi.min.js';
//export const {PIXI} = globalThis;
//console.log(PIXI);

//await import('../../../third-party/pixijs/v7.2.4/pixi-spine.js');
//export const Spine = {};

//export {Spine} from '../../../third-party/pixijs/v7.2.4/pixi-spine.mjs';
//import {Spine as Tines} from '../../../third-party/pixijs/v7.2.4/pixi-spine.mjs';
