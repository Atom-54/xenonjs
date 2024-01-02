export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  initialize(inputs, state, {service}) {
    state.auth = method => service('AuthService', method);
    this.resetPolling(state, 500);
  },
  resetPolling(state, interval) {
    state.pollInterval = interval;
    state.attemptsBeforeRequestLogin = 3;
  },
  async update({requestLogin, requestLogout}, state, {invalidate, isDirty}) {
    const response = await state.auth('GetUser');
    const user = response;
    if (keys(user).length) {
      this.resetPolling(state, 0);
    }
    if (state.pollInterval > 0) {
      state.attemptsBeforeRequestLogin--;
      timeout(invalidate, state.pollInterval);
    }
    if (requestLogin && isDirty('requestLogin')) {
      this.requestLogin(state);
    } 
    if (requestLogout && isDirty('requestLogout')) {
      this.requestLogout(state);
    }
    const requireLogin = state.attemptsBeforeRequestLogin <= 0;
    const isLoggedIn = keys(user).length > 0;
    const {uid, displayName, email, stsTokenManager} = user || 0;
    return {
      user,
      uid,
      displayName,
      email,
      authToken: stsTokenManager?.accessToken,
      requireLogin,
      maybeLoggedIn: !requireLogin,
      isLoggedIn
    };
  },
  async requestLogin(state) {
    await state.auth('Login');
    this.resetPolling(state, 500);
  },
  async requestLogout(state) {
    await state.auth('Logout');
    this.resetPolling(state, 500);
  }
  });