/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Calendar';

export const Calendar = {
  Calendar: {
    categories: [category, 'Media'],
    displayName: 'Calendar',
    description: 'Calendar',
    ligature: 'cast',
    type: '$library/Calendar/Atoms/Calendar',
    inputs: {
      events: 'Json',
      view: 'String'
      // 'dayGridMonth', 'listDay', 'listWeek', 'listMonth', 'listYear', 'resourceTimeGridDay', 'resourceTimeGridWeek', 'timeGridDay' or 'timeGridWeek'.
    }
  }
};