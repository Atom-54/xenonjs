export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({user}, {}) {
  return {
    loggedIn: String(keys(user).length > 0),
    displayName: user?.displayName ?? 'Guest',
    email: user?.email ?? 'not logged in',
    photoURL: user?.photoURL ?? resolve('$library/Auth/Assets/user.png')
  };
},
async onLoginClick(inputs, state, {invalidate}) {
  return {loginRequest: Math.random()};
},
async onLogoutClick(inputs, state, {invalidate}) {
  return {logoutRequest: Math.random()};
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
    /*${globalThis.themeRules??''}*/
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
