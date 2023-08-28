/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const AuthNode = {
  Auth: {
    type: '$library/Auth/Atoms/Auth',
    outputs: ['user', 'requireLogin', 'maybeLoggedIn', 'isLoggedIn']
  }
};
