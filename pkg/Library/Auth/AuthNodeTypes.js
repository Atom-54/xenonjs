/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Application';

export const AuthNodeTypes = {
  Auth: {
    category,
    description: 'User login',
    type: `$library/Auth/Nodes/AuthNode`
  },
  UserSettings: {
    category,
    description: 'Inspects and configures user personal configuration and keys',
    type: `$library/Auth/Nodes/UserSettingsNode`
  }
};