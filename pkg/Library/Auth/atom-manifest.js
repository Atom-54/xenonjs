/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Auth';

export const Auth = {
  Auth: {
    categories: [category],
    displayName: 'Auth',
    description: 'User authentication',
    ligature: 'person',
    type: '$library/Auth/Atoms/Auth',
    inputs: {
      requestLogin: 'Nonce',
      requestLogout: 'Nonce'
    },
    outputs: {
      user: 'Pojo',
      requireLogin: 'Boolean',
      maybeLoggedIn: 'Boolean',
      isLoggedIn: 'Boolean',
      uid: 'String',
      displayName: 'String',
      email: 'String',
      authToken: 'String'
    }
  },
  AuthPanel: {
    categories: [category],
    displayName: 'Auth Panel',
    description: 'User authentication UX',
    ligature: 'account_box',
    type: '$library/Auth/Atoms/AuthPanel',
    inputs: {
      user: 'Pojo'
    },
    outputs: {
      requestLogin: 'Nonce',
      requestLogout: 'Nonce'
    }
  }
};