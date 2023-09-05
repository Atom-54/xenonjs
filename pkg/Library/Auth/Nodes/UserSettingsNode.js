/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const UserSettingsNode = {
  inspector: {
    type: '$library/Inspector/Atoms/ObjectInspector',
    bindings: {
      data: 'settings$data'
    },
    outputs: ['data']
  },
  settings: {
    type: '$library/Auth/Atoms/UserSettingsInspectorAdaptor',
    inputs: ['user', 'userSettings'],
    bindings: {
      data: 'inspector$data'
    },
    outputs: ['userSettings', 'data']
  }
};
