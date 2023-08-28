export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({query, icon, placeholder}, state) {
  const hideQueryButton = !(icon?.length > 0);
  return {
    query: state.query??query??'',
    icon,
    queryStyle: `padding: 0 ${hideQueryButton ? 20 : 40}px 0 ${hideQueryButton ? 20 : 40}px;`,
    hideQueryButton,
    placeholder: placeholder??'',
    hideClearButton: !(query?.length > 0)
  };
},

onTextChanged({eventlet: {value}, reactive}, state) {
  state.query = value;
  if (reactive) {
    return {query: value};
  }
},

onTextEditDone({eventlet: {value}, reactive}, state) {
  state.query = value;
  if (!reactive) {
    return {query: value};
  }
},

onClearClick({}, state) {
  state.query = '';
  return {query: ''};
},

template: html`
<style>
  :host {
    flex: none !important;
  }
  [container] {
    position: relative;
    background-color: var(--theme-color-bg-2);
    color: var(--theme-color-fg-0);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 13px 20px;
  }
  [container] input {
    width: 100%;
    height: 40px;
    border-radius: 5px;
    border: none;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    /* padding: 0 40px 0 40px; */
  }
  [container] icon {
    position: absolute;
    font-size: 24px;
  }
  [container] icon[query] {
    left: 32px;
  }
  [container] icon[clear] {
    right: 32px;
    cursor: pointer;
  }
</style>
<div container on-click="donothing">
  <icon hide$="{{hideQueryButton}}" query>{{icon}}</icon>
  <input placeholder="{{placeholder}}" on-input="onTextChanged" on-blur="onTextEditDone" value="{{query}}" xen:style="{{queryStyle}}"/>
  <icon clear hide$="{{hideClearButton}}" on-click="onClearClick">close</icon>
</div>
`
});
