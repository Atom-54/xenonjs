/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {FirebaseAbstractLogin} from './firebase-abstract-login.js';

export const FirebaseGoogleLogin = {
  ...FirebaseAbstractLogin,
  getProvider(Firebase) {
    const provider = new Firebase.auth.GoogleAuthProvider();
    return provider;
  }
};
