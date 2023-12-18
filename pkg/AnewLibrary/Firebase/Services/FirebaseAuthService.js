/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {firebase} from '../firebase-auth.js';
import {FirebaseGoogleLogin as Provider} from '../Auth/firebase-google-login.js';
//import {FirebaseGithubLogin as Provider} from '../Auth/firebase-github-login.js';

// const log = logFactory(logFactory.flags.services || logFactory.flags.AuthService, 'FirebaseAuthService', 'tomato');

const {firebaseConfig} = globalThis.config;
if (firebaseConfig) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(user_ => user = user_?.toJSON());
}

let user = {};

export const FirebaseAuthService = {
  GetUser() {
    return user;
  },
  Login() {
    //Provider.signInRedirect(firebase);
    Provider.signInPopup(firebase);
  },
  Logout() {
    Provider.signOut(firebase);
  }
};
