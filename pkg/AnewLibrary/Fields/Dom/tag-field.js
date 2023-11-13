/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../../Library/Dom/Xen/xen-async.js';
import '../../../third-party/tagger/tagger.js';
const {tagger} = globalThis;

export class TagField extends Xen.Async {
  static get observedAttributes() {
    return ['tags'];
  }
  _didMount() {
    this.input = this._dom.$('input');
    this.tagger = tagger(this.input, {
      add_on_blur: true,
      allow_spaces: true,
      link: _=> false,
      // completion: {
      //   list: ['name', 'number', 'object', 'bool']
      // }
    });
  }
  update({tags}) {
    this.resetTags(tags);
    // if (typeof tags === 'string') {
    //   tags = tags.split(',').map(s=>s?.trim?.());
    // }
    // tags?.forEach?.(tag => this.tagger.add_tag(tag));
  }
  resetTags(tags) {
    this.squelch = true;
    try {
      [...this.tagger._tags].forEach(tag => this.tagger.remove_tag(tag));
      if (typeof tags === 'string') {
        tags = tags.split(',').map(s=>s?.trim?.());
      }
      // this.input.value = '';
      // this.tagger._tags = [];
      tags?.forEach?.(tag => this.tagger.add_tag(tag));
    } finally {
      this.squelch = false;
    }
  }
  onInputChange(/*{target: {value}}*/) {
    if (!this.squelch) {
      this.value = this.tagger._tags;
      this.fire('tags-change');
    }
    //this.value = (value ?? '').split(',');
  }
  get template() {
    return template;
  }
}

const template = Xen.Template.html`
<style>
:host {
  display: inline-block;
}
/**@license
 *  _____
 * |_   _|___ ___ ___ ___ ___
 *   | | | .'| . | . | -_|  _|
 *   |_| |__,|_  |_  |___|_|
 *           |___|___|   version 0.4.4
 *
 * Tagger - Zero dependency, Vanilla JavaScript Tag Editor
 *
 * Copyright (c) 2018-2022 Jakub T. Jankiewicz <https://jcubic.pl/me>
 * Released under the MIT license
 */
.tagger {
  /* border-bottom: 1px solid #909497; */
  display: inline-flex;
}
.tagger input[type="hidden"] {
  /* fix for bootstrap */
  display: none;
}
.tagger > ul {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 4px 5px 0;
  justify-content: space-between;
  box-sizing: border-box;
  height: auto;
  flex: 0 0 auto;
  /* overflow-y: auto; */
  margin: 0;
  list-style: none;
}
.tagger > ul > li {
  padding-bottom: 0.2rem;
  margin-right: 6px;
  /* margin: 0.4rem 5px 4px; */
}
.tagger > ul > li > a {
  /* vertical-align: middle;
  padding: 4px; */
  display: inline-flex;
  align-items: center;
}
.tagger > ul > li:not(.tagger-new) a,
.tagger > ul > li:not(.tagger-new) a:visited {
    text-decoration: none;
    color: black;
}
.tagger > ul > li:not(.tagger-new) > :first-child {
    padding: 4px 4px 4px 8px;
    background: #B1C3D7;
    border: 1px solid #4181ed;
    border-radius: 3px;
}
.tagger > ul > li:not(.tagger-new) > span,
.tagger > ul > li:not(.tagger-new) > a > span {
    white-space: nowrap;
}
.tagger li a.close {
    /* padding: 4px; */
    margin-left: 6px;
    /* for bootstrap */
    /* float: none;
    filter: alpha(opacity=100);
    opacity: 1; */
    /* font-size: 16px;
    line-height: 16px; */
}
.tagger li a.close:hover {
    color: white;
}
.tagger .tagger-new input {
    border: none;
    outline: none;
    box-shadow: none;
    width: 10px;
    padding: 4px;
    /* 
    width: 100%; 
    padding-left: 0;
    background: transparent;
    */
    box-sizing: border-box;
}
.tagger .tagger-new {
    flex-grow: 1;
    position: relative;
    /* min-width: 10px;
    width: 1px; */
}
.tagger .tagger-new input:focus {
  min-width: 60px;
}
.tagger.wrap > ul {
    flex-wrap: wrap;
    justify-content: start;
}
</style>
<input type="text" on-input="onInputChange">
`;

customElements.define('tag-field', TagField);
