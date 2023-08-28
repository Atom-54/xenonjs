/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ButtonNode = {
  button: {
    type: '$library/Fields/Atoms/Button',
    inputs: ['label', 'value', 'action'],
    outputs: ['value']
  },
  state: {
    button$action: 'toggle'
  }
};

// The `action` interface is inspired by UXToolbar actions.
// Currently supports:
// action: 'toggle'
// or
// action: {action: 'set', value: 'foo'}
// TODO: consider emiting `event` with a timestamp, to avoid
// identical outputs being ignored.