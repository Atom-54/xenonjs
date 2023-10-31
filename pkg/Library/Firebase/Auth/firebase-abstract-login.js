/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const FirebaseAbstractLogin = {
  async enable(Firebase, onSignIn, onSignOut) {
    // react to auth activity
    Firebase.auth().onAuthStateChanged(user => user ? onSignIn(user) : onSignOut());
  },
  async disable(Firebase) {
    this.signOut(Firebase);
  },
  async signOut(Firebase) {
    return Firebase.auth().signOut();
  },
  async signInAnonymously(Firebase) {
    return Firebase.auth().signInAnonymously(Firebase.auth);
  },
  async signInRedirect(Firebase) {
    return await Firebase.auth().signInWithRedirect(this.getProvider(Firebase));
  },
  async signInPopup(Firebase) {
    return await Firebase.auth().signInWithPopup(this.getProvider(Firebase));
  },
  // getProvider(Firebase) {
  // }
};
