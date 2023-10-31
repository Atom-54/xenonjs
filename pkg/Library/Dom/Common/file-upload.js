/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../Xen/xen-async.js';

const template = Xen.Template.html`
  <style>
    ::slotted(*) {
      cursor: pointer;
    }
    label {
      display: block;
    }
    input[type="file"] {
      display: none;
    }
  </style>
  <label on-click="onClick">
    <input type="file" accept$="{{accept}}" multiple$="{{multiple}}" on-change="onFilesChanged">
    <slot></slot>
  </label>
`;

const log = logf('FileUpload', '#ffb9b4');

// Note: atm FileUpload only support text files.
export class FileUpload extends Xen.Async {
  onClick(e) {
    e.stopPropagation();
  }
  get template() {
    return template;
  }
  static get observedAttributes() {
    return ['multiple', 'accept'];
  }
  render({accept, multiple}, state) {
    return {
      accept: '.txt',
      multiple
    };
  }
  onFilesChanged(e) {
    const files = e.currentTarget.files;
    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        this.key = file.name;
        this.value = reader.result;
        // log(`${this.key}: ${this.value}`);
        this.fire('file', reader.result);
      };
      reader.readAsText(file);
    }
  }
}
customElements.define('file-upload', FileUpload);