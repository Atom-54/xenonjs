/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {css as mainCss} from '../../../third-party/event-calendar/event-calendar.css.js';
import '../../../third-party/event-calendar/event-calendar.min.mod.js'

const {eventCalendar: Calendar} = globalThis;

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

export class EventCalendar extends Xen.Async {
  static get observedAttributes() {
    return ['calendarstate'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.calendar = new Calendar({
      selector: this.shadowRoot.querySelector('#calendar'),
      state: {
        currentTime: Date.now() 
      }
    });
  }
  update({calendarstate}) {
    if (calendarstate) {
      this.calendar.setState(calendarstate);
    }
  }
}

customElements.define('event-calendar', EventCalendar);
