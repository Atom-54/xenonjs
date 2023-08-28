/**
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
import * as dom from '../../Library/Dom/dom.js';

const third = `../third_party`;
const three = `${third}/threejs`;
const editor = `${three}/editor`;
const libs = `${editor}/js/libs`;

const scripts = [
  `${third}/ffmpeg/ffmpeg.min.js`,
  `${three}/libs/draco/draco_encoder.js`,
  `${libs}/codemirror/codemirror.js`,
  `${libs}/codemirror/mode/javascript.js`,
  `${libs}/codemirror/mode/glsl.js`,
  `${libs}/esprima.js`,
  `${libs}/jsonlint.js`,
  `${libs}/codemirror/addon/dialog.js`,
  `${libs}/codemirror/addon/show-hint.js`,
  `${libs}/codemirror/addon/tern.js`,
  `${libs}/acorn/acorn.js`,
  `${libs}/acorn/acorn_loose.js`,
  `${libs}/acorn/walk.js`,
  `${libs}/ternjs/polyfill.js`,
  `${libs}/ternjs/signal.js`,
  `${libs}/ternjs/tern.js`,
  `${libs}/ternjs/def.js`,
  `${libs}/ternjs/comment.js`,
  `${libs}/ternjs/infer.js`,
  `${libs}/ternjs/doc_comment.js`,
  `${libs}/tern-threejs/threejs.js`,
  `${libs}/signals.min.js`,
];
for (const script of scripts) {
  await dom.loadScript({src: script});
}

//dom.loadCss(`../../Library/Threejs/main.css`);
//dom.loadCss(`${editor}/css/main.css`);

import * as THREE from './three.module.js';
export {Editor} from './editor/js/Editor.js';
export {Viewport} from './editor/js/Viewport.js';
export {Toolbar} from './editor/js/Toolbar.js';
export {Script} from './editor/js/Script.js';
export {Player} from './editor/js/Player.js';
export {Sidebar} from './editor/js/Sidebar.js';
export {Menubar} from './editor/js/Menubar.js';
export {Resizer} from './editor/js/Resizer.js';
import {VRButton} from './addons/webxr/VRButton.js';

export {THREE, VRButton, editor};

globalThis.THREE = THREE; // Expose THREE to APP Scripts and Console
globalThis.VRButton = VRButton; // Expose VRButton to APP Scripts