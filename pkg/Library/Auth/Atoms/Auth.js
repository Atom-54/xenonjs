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
async update({requestLogin, requestLogout}, state, {invalidate, isDirty}) {
  const response = await state.auth('GetUser');
  const user = response;
  if (keys(user).length && isDirty('user')) {
    //log('user changed', user);
    this.resetPolling(state, 0);
  } else if (state.pollInterval > 0) {
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
},
// render({}, {user}) {
//   return {
//     loggedIn: String(keys(user).length > 0),
//     displayName: user?.displayName ?? 'Guest',
//     email: user?.email ?? 'not logged in',
//     photoURL: user?.photoURL ?? resolve('$library/Auth/Assets/user.png')
//   };
// },
// async onLoginClick(inputs, state, {invalidate}) {
//   await state.auth('Login');
//   this.resetPolling(state, 500);
//   invalidate();
// },
// async onLogoutClick(inputs, state, {invalidate}) {
//   await state.auth('Logout');
//   state.user = null;
//   this.resetPolling(state, 1000);
//   invalidate();
//   return {user: state.user};
// },
// template: html`
// <style>
//   :host {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     color: var(--theme-color-fg-1);
//     background-color: var(--xcolor-one);
//     min-height: 350px;
//     ${globalThis.themeRules??''}
//   }
//   img {
//     border-radius: 50%;
//   }
//   button {
//     padding: 5px 20px;
//   }
// </style>

// <div flex center column>
//   <div bar>
//     <img referrerpolicy="no-referrer" src="{{photoURL}}">
//     <span spacer></span>
//     <h2>{{displayName}}</h2>
//   </div>
//   <h4>{{email}}</h4>
//   <button hide$="{{loggedIn}}" raised on-click="onLoginClick">Login</button>
//   <button show$="{{loggedIn}}" on-click="onLogoutClick">Logout</button>
// </div>
// `
});
