export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({query, icon, placeholder}, state) {
  const hideQueryButton = !(icon?.length > 0);
  const theQuery = state.query ?? query ?? '';
  return {
    query: theQuery,
    //focus: true,
    icon,
    queryStyle: `padding-right: ${hideQueryButton ? 20 : 40}px;`,
    hideQueryButton,
    placeholder: placeholder??'',
    hideClearButton: !(theQuery?.length > 0)
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
    margin: .4em 1em;
  }
  [input] {
    width: 100%;
    border-radius: 5px;
    border: none;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    padding: .8em 2.7em;
  }
  icon {
    position: absolute;
    font-size: 20px;
  }
  icon[query] {
    left: 8px;
  }
  icon[clear] {
    right: 8px;
    cursor: pointer;
  }
</style>
<div row container on-click="donothing">
  <icon hide$="{{hideQueryButton}}" query>{{icon}}</icon>
  <!-- <fancy-input input placeholder="{{placeholder}}" on-input="onTextChanged" on-blur="onTextEditDone" value="{{query}}" xen:style="{{queryStyle}}"></fancy-input> -->
  <input input focus="{{focus}}" placeholder="{{placeholder}}" on-input="onTextChanged" on-blur="onTextEditDone" value="{{query}}" xen:style="{{queryStyle}}">
  <icon clear hide$="{{hideClearButton}}" on-click="onClearClick">close</icon>
</div>
`
});
