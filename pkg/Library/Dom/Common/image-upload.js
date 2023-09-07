/**
 * @license
 * Copyright 2023 NeonFlan LLC
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

const log = logf('ImageUpload', '#ffb9b4');

export class ImageUpload extends Xen.Async {
  onClick(e) {
    e.stopPropagation();
  }
  get template() {
    return template;
  }
  static get observedAttributes() {
    return ['multiple', 'accept'];
  }
  render({accept, multiple}) {
    return {accept, multiple};
  }
  onFilesChanged(e) {
    const files = e.currentTarget.files;
    for (let i=0; i<files?.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const img = document.createElement("img");
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
          this.value = img.src;
          // log(this.value);
          this.fire('image', img);
        };
        reader.readAsDataURL(file);
      }
    }
  }
}
customElements.define('image-upload', ImageUpload);