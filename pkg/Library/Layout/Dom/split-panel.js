/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {DragDrop} from '../../Dom/Common/drag-drop.js';

const log = logf('DOM: split-panel', 'black', 'orange');

const template = Xen.Template.html`
<style>
  :host {
    width: 100%;
    height: 100%;
    display: flex;
    --resizer-size: 6px;
    --handle-size: 16px;
  }
  /**/
  [resizer] {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: var(--xcolor-two);
  }
  [resizer]:not([vertical]) {
    width: auto;
    height: var(--resizer-size);
    cursor: ns-resize;
  }
  [resizer][vertical] {
    height: auto;
    width: var(--resizer-size);
    cursor: ew-resize;
  }
  [resizer]:hover, [resizer][dragging] {
    background-color: var(--xcolor-two);
  }
  [resizer]:hover > [handle], [resizer][dragging] > [handle] {
    border: 1px solid var(--xcolor-three);
  }
  /**/
  [handle] {
    box-sizing: border-box;
    background-color: var(--xcolor-three);
    border: 1px solid var(--xcolor-one);
    border-radius: 4px;
  }
  [handle]:not([vertical]) {
    height: var(--resizer-size);
    /* margin: 2px 0; */
    width: var(--handle-size);
  }
  [handle][vertical] {
    width: var(--resizer-size);
    /* margin: 0 2px; */
    height: var(--handle-size);
  }
  /**/
  [startside], [endside] {
    display: flex;
    flex-direction: column;
  }
</style>

<div startside xen:style="{{startStyle}}">
  <slot name="one"></slot>
</div>

<div resizer vertical$="{{vertical}}" dragging$="{{dragging}}" on-pointerdown="onDown">
  <div handle vertical$="{{vertical}}"></div>
</div>

<div endside xen:style="{{endStyle}}">
  <slot name="two"></slot>
</div>
`;

export class SplitPanel extends DragDrop {
  static get observedAttributes() {
    return ['divider', 'endflex', 'vertical', 'collapsed'];
  }
  get template() {
    return template;
  }
  async _didMount() {
    // Up listener for dragging the image grid resizer.
    this.upListener = () => {
      document.body.style.cursor = 'default';
      window.removeEventListener('pointerup', this.upListener);
    };
  }
  _wouldChangeProp(name, value) {
    return true;
  }
  update({divider, endflex, vertical, collapsed}, state) {
    if (!this.dragging) {
      // attributes are "" for true, null for false
      state.vertical = (vertical === '') || vertical;
      state.endflex = (endflex === '') || endflex;
      collapsed = collapsed || (collapsed === '');
      // alter collapsed state?
      if (collapsed !== Boolean(state.collapsed)) {
        state.collapsed = collapsed;
        if (collapsed) {
          state.holdDivider = divider;
          divider = 0;
        } else {
          divider = state.holdDivider;
        }
        //this.value = divider;
        //this.fire('divider-change');
      }
      divider = Number(divider);
      state.divider = isNaN(divider) ? null : divider;
      //console.log('update', state.divider);
    }
  }
  render(_, {vertical, divider, endflex}) {
    let dividerOrd;
    // if we've never messed with it manually, just do half
    if (divider !== 0 && !divider) {
      //log('defaulting divider to 50%');
      dividerOrd = `50%`;
    } else {
      dividerOrd = `${divider}px`
    };
    const ord = vertical ? 'width' : 'height';
    const offOrd = vertical ? 'height' : 'width';
    const flexStyle = endflex ? 'endStyle' : 'startStyle';
    const ordStyle = endflex ? 'startStyle' : 'endStyle';
    //console.log('dividerOrd', dividerOrd);
    const model = {
      [ordStyle]: {
        [ord]: dividerOrd,
        [offOrd]: 'auto',
        flex: 'none',
        overflow: 'visible',
      },
      [flexStyle]: {
        width: 'auto',
        height: 'auto',
        flex: 1,
        flexBasis: '0px',
        overflow: 'hidden'
      },
      vertical,
      dragging: this.dragging
    };
    return model;
  }
  doDown(e) {
    e.stopPropagation();
    let {vertical, divider} = this.state;
    document.body.style.cursor = vertical ? 'ew-resize' : 'ns-resize';
    window.addEventListener('pointerup', this.upListener);
    if (!divider) {
      const ord = vertical ? 'offsetWidth' : 'offsetHeight';
      const ordValue = this[ord];
      divider = ordValue / 2;
    }
    this.state.dividerStart = divider;
    this.invalidate();
  }
  doMove(dx, dy, sx, sy) {
    const {vertical, endflex, dividerStart} = this.state;
    //console.log(this.state.dividerStart, sy, dy);
    const d = vertical ? dx : dy;
    const divider = endflex
      ? dividerStart + d
      : dividerStart - d
      ;
    this.state.divider = Math.max(Math.round(divider), 0);
    //console.log('doMove', this.state.divider);
    this.invalidate();
  }
  doUp() {
    this.value = this.state.divider;
    this.fire('divider-change');
  }
}
customElements.define('split-panel', SplitPanel);
