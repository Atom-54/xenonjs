/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

({
render({items}, {selected}) {
  const defaults = {
    name: 'Default',
    thumb: resolve('$library/AI/Assets/delmer.png'),
    owner: 'scott.miles@gmail.com<br>02/11/23',
    description: 'An amazing piece of kit. Use it again and again. Even better than "Cats"!'
  };
  return {
    items: items?.map((item) => ({...defaults, ...item, selected: item.key === selected}))
  }
},
find(items, key) {
  return items.find(item => item.key === key);
},
onItemClick({eventlet: {key}, items}, state) {
  if (key != null) {
    state.selected = key;
    const selection = this.find(items, key);
    return {selection};
  }
},
onNameChange({eventlet: {value}, items}, {selected}) {
  const selection = this.find(items, selected);
  if (selection) {
    selection.editedName = value;
    log(value, selection);
    return {selection};
  }
},
template: html`
<style>
  * {
    box-sizing: border-box;
  }
  :host {
    background: #d1d8ec;
    font-size: 0.9em;
  }
  [neumorph] {
    background: #e9ecf730;
    border-radius: 31px;
    box-shadow: 9px 9px 24px #bcc2d4, -9px -9px 24px #e6eeff;
    overflow: hidden;
    border: none;
    padding: 1.0em 1.4em;
    margin: 0.7em;
  }
  [neumorph]:hover {
    box-shadow: 12px 12px 24px #b8bed0, -12px -12px 24px #eaf2ff;
    background: #eff3ff;
  }
  [neumorph][selected] {
    box-shadow: 12px 12px 24px #b8bed0, -12px -12px 24px #eaf2ff;
    background: #eff3ef; 
  }
  [grid] {
    align-content: flex-start;
    padding: 1em 0;
  }
  [grid] > * {
    width: 22em;
    height: 10em;
  }
  label {
    padding-right: 0.2em;
    font-size: 0.9em;
  }
  img {
    border-radius: 32px;
    width: 48px;
    height: 48px;
    padding-right: 0.1em;
  }
  [name] {
    font-size: 1.0em;
  }
  [owner] {
    font-size: 0.7em;
  }
  [description] {
    font-style: italic;
    font-size: 0.7em;
    padding-right: 4px;
  }
  [default-aligned] {
    justify-content: left;
    align-items: stretch;
    text-align: left;
  }
  icon {
    font-size: 12px;
    width: 12px;
    height: 12px;
  }
  spacer {
    display: inline-block;
    width: 12px;
    height: 12px;
  }
  fancy-input {
    border: none;
  }
</style>

<div flex scrolling>
  <div center grid repeat="item_t">{{items}}</div>
</div>

<template item_t>
  <div neumorph default-aligned column key="{{key}}" selected$="{{selected}}" on-click="onItemClick">
    <div bar>
      <span flex></span>
      <icon>delete</icon>
    </div>
    <div row>
      <img src="{{thumb}}">
      <spacer></spacer>
      <div center row>
        <fancy-input disabled name key="{{key}}" value="{{name}}" on-change="onNameChange" on-doclick="onItemClick"></fancy-input>
      </div>
    </div>
    <spacer></spacer>
    <span flex description>{{description}}</span>
    <spacer></spacer>
    <span owner unsafe-html="{{owner}}"></span>
  </div>
</div>
`
});
