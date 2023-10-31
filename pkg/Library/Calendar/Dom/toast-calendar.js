/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {css as mainCss} from '../../../third-party/toast/tui-calendar/tui-calendar.min.css.js';
import '../../../third-party/toast/tui-calendar/tui-calendar.min.js'

const {Calendar} = globalThis.tui;

const template = Xen.Template.html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  ${mainCss}
</style>
<div flex id="calendar"></div>
`;

export class ToastCalendar extends Xen.Async {
  static get observedAttributes() {
    // setting these properties will automatically trigger `update(inputs)`
    // these are the names of fields in `inputs`
    return ['columns', 'options', 'data', 'columnid'];
  }
  get template() {
    return template;
  }
  _didMount(_, state) {
    state.calendar = new Calendar(this.shadowRoot.querySelector('#calendar'), {
      defaultView: 'month',
      taskView: true,    
    });
    // const onresize = () => requestAnimationFrame(() => this.doresize());
    // this.resizeObserver = new ResizeObserver(onresize);
    // this.resizeObserver.observe(this);
    // setTimeout(() => this.doresize(), 250);
  }
  // doresize() {
  //   const {grid} = this.state;
  //   grid?.setHeight(this.clientHeight - 1);
  //   grid?.refreshLayout();
  // }
  async update({}, state) {
  }
}

customElements.define('toast-calendar', ToastCalendar);
