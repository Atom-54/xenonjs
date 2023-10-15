/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const AuthPanelNode = {
  Panel: {
    type: '$library/Auth/Atoms/AuthPanel',
    inputs: ['user'],
    outputs: ['requestLogin', 'requestLogout']
  }
};
