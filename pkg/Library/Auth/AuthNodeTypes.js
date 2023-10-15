/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Application';

export const AuthNodeTypes = {
  Auth: {
    category,
    description: 'User authentication processing',
    type: `$library/Auth/Nodes/AuthNode`,
    types: {
      Auth$User: 'User',
      Auth$requestLogin: 'Nonce',
      Auth$requestLogout: 'Nonce'
    }
  },
  AuthPanel: {
    category,
    description: 'User authentication UX',
    type: `$library/Auth/Nodes/AuthNode`,
    types: {
      Panel$User: 'User',
      Panel$requestLogin: 'Nonce',
      Panel$requestLogout: 'Nonce'
    }
  },
  UserSettings: {
    category,
    description: 'Inspects and configures user personal configuration and keys',
    type: `$library/Auth/Nodes/UserSettingsNode`
  }
};