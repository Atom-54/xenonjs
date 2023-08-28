/**
 * @license
 * Copyright (c) 2023 sjmiles. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
({
template: html`
<style>
  * {
    box-sizing: border-box;
  }
  :host {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #d1d8ec;
  }
  [grid] {
    align-content: flex-start;
    padding: 1em;
  }
  ::slotted(*) {
    box-sizing: border-box;
    max-width: 16em;
    min-width: 16em;
    min-height: 12em;
    max-height: 12em;
    /**/
    background: #e9ecf730;
    border-radius: 51px;
    box-shadow: 9px 9px 24px #bcc2d4, -9px -9px 24px #e6eeff;
    overflow: hidden;
    border: none;
    padding: 1.4em;
    margin: 0.8em;
  }
  ::slotted(*:hover) {
    box-shadow: 12px 12px 24px #b8bed0, -12px -12px 24px #eaf2ff;
    background: #eff3ff;
  }
</style>
<div flex scrolling grid>
  <slot name="Container"></slot>
</div>
`
});
