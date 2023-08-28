/**
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
import {Xen} from '../Dom/Xen/xen-async.js';
import * as tools from '../../third-party/threejs/editor-imports.js';

Number.prototype.format = function () {
  return this.toString().replace( /(\d)(?=(\d{3})+(?!\d))/g, '$1,' );
};

export class ThreejsEditor extends Xen.Async {
  static get observedAttributes() {
    return [];
  }
  _didMount() {
    this.editor = this.mountEditor(this.shadowRoot);
  }
  mountEditor(container) {
    const editor = new tools.Editor();
    const views = [
      new tools.Viewport(editor),
      new tools.Toolbar(editor),
      new tools.Script(editor),
      new tools.Player(editor),
      new tools.Sidebar(editor),
      new tools.Menubar(editor),
      new tools.Resizer(editor)
    ];
    views.forEach(v => container.appendChild(v.dom));
    views[0].dom.addEventListener('pointerdown', e => e.stopPropagation());
    const onResize = () => editor.signals.windowResize.dispatch();
    const observer = new ResizeObserver(onResize);
    observer.observe(this);
    setTimeout(onResize, 100);
    return editor;
  }
  get template() {
    return Xen.Template.html`
<style>
  :host {
    display: block;
    /* width: 640px;
    height: 480px; */
    position: relative;
    background-color: black;
    border: 3px solid red;
  }
</style>
<link rel="stylesheet" href="${tools.editor}/css/main.css">
<link rel="stylesheet" href="${tools.editor}/js/libs/codemirror/codemirror.css">
<link rel="stylesheet" href="${tools.editor}/js/libs/codemirror/theme/monokai.css">
<link rel="stylesheet" href="${tools.editor}/js/libs/codemirror/addon/dialog.css">
<link rel="stylesheet" href="${tools.editor}/js/libs/codemirror/addon/show-hint.css">
<link rel="stylesheet" href="${tools.editor}/js/libs/codemirror/addon/tern.css">
    `;
  }
}

customElements.define('threejs-editor', ThreejsEditor);