export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
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
async update(inputs, state, {invalidate}) {
  const response = await state.auth('GetUser');
  const user = response;
  if (!deepEqual(user, state.user) && keys(user).length) {
    //log('user changed', user);
    state.user = user;
    this.resetPolling(state, 0);
  }
  if (state.pollInterval > 0) {
    state.attemptsBeforeRequestLogin--;
    timeout(invalidate, state.pollInterval);
  }
  const requireLogin = state.attemptsBeforeRequestLogin <= 0;
  const isLoggedIn = keys(user).length > 0;
  return {
    user, //: state.user,
    uid: user?.uid,
    displayName: user?.displayName,
    email: user?.email,
    authToken: user?.stsTokenManager?.accessToken,
    requireLogin,
    maybeLoggedIn: !requireLogin,
    isLoggedIn
    //isLoggedIn: keys(state.user).length > 0
  };
},
render({}, {user}) {
  return {
    loggedIn: String(keys(user).length > 0),
    displayName: user?.displayName ?? 'Guest',
    email: user?.email ?? 'not logged in',
    photoURL: user?.photoURL ?? resolve('$library/Auth/Assets/user.png')
  };
},
async onLoginClick(inputs, state, {invalidate}) {
  await state.auth('Login');
  this.resetPolling(state, 500);
  invalidate();
},
async onLogoutClick(inputs, state, {invalidate}) {
  await state.auth('Logout');
  state.user = null;
  this.resetPolling(state, 1000);
  invalidate();
  return {user: state.user};
},
template: html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--theme-color-fg-1);
    background-color: var(--xcolor-one);
    min-height: 350px;
    ${globalThis.themeRules??''}
  }
  img {
    border-radius: 50%;
  }
  button {
    padding: 5px 20px;
  }
</style>

<div flex center column>
  <div bar>
    <img referrerpolicy="no-referrer" src="{{photoURL}}">
    <span spacer></span>
    <h2>{{displayName}}</h2>
  </div>
  <h4>{{email}}</h4>
  <button hide$="{{loggedIn}}" raised on-click="onLoginClick">Login</button>
  <button show$="{{loggedIn}}" on-click="onLogoutClick">Logout</button>
</div>
`
});
