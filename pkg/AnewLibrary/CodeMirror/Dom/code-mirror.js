/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {deepEqual} from '../../Xenon/Utils/object.js';
// codemirror library
import '../../../third-party/CodeMirror/lib/codemirror.min.js';
// syntax support
import '../../../third-party/CodeMirror/lib/javascript.min.js';
// themes
import {css as codeMirrorCss} from '../../../third-party/CodeMirror/themejs/codemirror.css.js';
import {css as materialDarkerCss} from '../../../third-party/CodeMirror/themejs/material-darker.css.js';

const {CodeMirror} = window;

const template = Xen.Template.html`
<style>${codeMirrorCss}</style>
<style>${materialDarkerCss}</style>
<style>
  :host {
    display: flex;
    flex-direction: column;
    font-family: monospace;
    overflow: hidden;
  }
  .CodeMirror {
    font-size: var(--code-mirror-font-size, inherit);
    font-family: var(--code-mirror-font-family), 'Google Mono', monospace;
    background-color: #333 !important;
    flex: 1;
  }
</style>

`;

export class CodeMirrorElement extends Xen.Async {
  static get observedAttributes() {
    return ['text', 'readonly', 'options'];
  }
  get template() {
    return template;
  }
  get value() {
    return this.mirror?.getValue() || '';
  }
  _didMount() {
    // update mirror layout when host size changes
    (new ResizeObserver(() => this.mirror?.refresh())).observe(this);
  }
  createMirror(options) {
    this.mirror = CodeMirror(this.host, {
      mode: 'javascript',
      lineNumbers: true,
      theme: 'material-darker', //'blackboard',
      ...(options??{})
    });
    this.observeCodeMirror(this.mirror, this.onMirrorChanges.bind(this), this.onMirrorBlur.bind(this));
  }
  disposeMirror() {
    if (this.mirror) {
      this.mirror.getWrapperElement().remove();
      this.unobserveCodeMirror(this.mirror);
    }
  }
  observeCodeMirror(mirror, onchanges, onblur) {
    this.memoizedHandlers = {onchanges, onblur};
    // react to edits
    mirror.on('changes', onchanges);
    mirror.on('blur', onblur);
  }
  unobserveCodeMirror(mirror) {
    if (mirror && this.memoizedHandlers) {
      mirror.off('changes', this.memoizedHandlers.onchanges);
      mirror.off('blur', this.memoizedHandlers.onblur);
    }
  }
  isDirty(value) {
    const dirty = this.state.__dirty ??= {};
    const i = Object.values(this._props).indexOf(value);
    const key = Object.keys(this._props)[i];
    if (!deepEqual(value, dirty[key])) {
      dirty[key] = value;
      //console.warn(i, key, value, 'was dirty');
      return true;
    }
    //console.warn(i, key, value, 'NO DIRTY');
    return false;
  }
  update({text, readonly, options}, state) {
    if (!this.mirror || this.isDirty(options)) {
      this.disposeMirror();
      this.createMirror(options);
    }
    this.mirror.setOption('readOnly', readonly);
    if (text != state.text) {
      state.text = text;
      if (text != this.value) {
        this.clearHistory();
        this.setMirrorText(text);
      }
    }
  }
  clearHistory() {
    this.mirror.clearHistory();
  }
  setMirrorText(text) {
    this.squelch = true;
    try {
      this.mirror.setValue(text);
    } finally {
      this.squelch = false;
    }
  }
  onMirrorChanges() {
    if (!this.squelch) {
      this.fire('input');
      this.fire('changes');
    }
  }
  onMirrorBlur() {
    this.fire('code-blur');
  }
}

customElements.define('code-mirror', CodeMirrorElement);