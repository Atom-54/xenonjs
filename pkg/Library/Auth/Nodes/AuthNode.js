/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const AuthNode = {
  Auth: {
    type: '$library/Auth/Atoms/Auth',
    inputs: ['requestLogin', 'requestLogout'],
    outputs: ['user', 'requireLogin', 'maybeLoggedIn', 'isLoggedIn', 'uid', 'displayName', 'email', 'authToken']
  }
};
