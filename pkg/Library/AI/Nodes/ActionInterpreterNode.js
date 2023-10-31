/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const ActionInterpreterNode = {
  ActionInterpreter: {
    type: '$library/AI/Atoms/ActionInterpreter',
    inputs: ['transcript', 'textResult'],
    outputs: ['prompt', 'textResult', 'message', 'cmd', 'args']
  }
};

