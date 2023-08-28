/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const UXToolbarNode = {
  UXToolbar: {
    type: '$library/UX/Atoms/UXToolbar',
    bindings: {event: 'UXActionExecutor$event'},
    inputs: ['actions']
  },
  UXActionExecutor: {
    type: '$library/UX/Atoms/UXActionExecutor',
    bindings: {event: 'UXToolbar$event'},
    inputs: ['readonly']
  }
};