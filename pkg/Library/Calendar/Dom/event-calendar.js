/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {css as mainCss} from '../../../third-party/@event-calendar/event-calendar_2.3.2_event-calendar.min.css.js';
import '../../../third-party/@event-calendar/event-calendar_2.3.2_event-calendar.min.js'

const {EventCalendar} = globalThis;

const template = Xen.Template.html`
<style>
  :host, #calendar {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  #calendar {
    flex: 1 1 0;
  }
  #calendar > div:first-child {
    overflow: hidden;
  }
  ${mainCss}
</style>
<div id="calendar"></div>
`;

export class XenEventCalendar extends Xen.Async {
  static get observedAttributes() {
    return ['events', 'view'];
  }
  get template() {
    return template;
  }
  _didMount() {
    this.calendar = new EventCalendar(this.shadowRoot.querySelector('#calendar'), {
      view: 'listWeek',
      headerToolbar: {
        start: '', //'prev,next today',
        center: '', //'title',
        end: '', //'dayGridMonth,timeGridWeek,timeGridDay,listWeek', // resourceTimeGridWeek'
      },
      buttonText: function (texts) {
        texts.resourceTimeGridWeek = 'resources';
        return texts;
      },
      resources: [
        {id: 1, title: 'Resource A'},
        {id: 2, title: 'Resource B'}
      ],
      scrollTime: '09:00:00',
      views: {
        timeGridWeek: {pointer: true},
        resourceTimeGridWeek: {pointer: true}
      },
      dayMaxEvents: true,
      nowIndicator: true,
      selectable: true
    });
  }
  update({events, view}) {
    //events = events || createEvents();
    const opt = (n, v) => v && this.calendar.setOption(n, v);
    opt('view', view);
    opt('events', events);
  }
}

customElements.define('event-calendar', XenEventCalendar);
