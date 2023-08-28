export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state) {
  state.toys = [
    {ball: 'sports_soccer'},
    {car: 'toys'},
    {robot: 'robot'},
    {bone: 'pet_supplies'},
    {peers: 'pets'},
    {['laser pointer']: 'point_scan'},
    {food: 'set_meal'}
  ];
},

render({data, key}, state) {
  const selected = new Set(data?.props.find(p => p.name === key)?.value ?? []);
  return {
    toys: state.toys.map(toy => this.renderToy(toy, selected))
  };
},

renderToy(toy, selected) {
  const name = keys(toy)[0];
  return {
    name,
    icon: toy[name],
    selected: selected.has(name)
  };
},

toggleIcon({eventlet: {key: name}, data, key}) {
  const prop = data?.props.find(p => p.name === key);
  if (prop) {
    const index = prop.value?.findIndex(i => i === name);
    if (index >= 0) {
      prop.value.splice(index, 1);
    } else {
      (prop.value??=[]).push(name);
    }
    return {data};
  }
},

template: html`
<style>
:host {
  overflow: auto !important;
  font-size: 1.1em;
}
icon {
  margin: 10px;
  padding: 10px;
  font-size: 2em;
  color: var(--xcolor-four);
  border: 1px solid var(--xcolor-three);
  border-radius: 5px;
}
icon:hover {
  color: var(--xcolor-brand);
  background-color: var(--xcolor-two);
}
icon[selected] {
  color: var(--xcolor-one);
  background-color: var(--xcolor-brand);
  font-weight: bold;
}
</style>
<div>Toys:</div>
<div columns repeat="toy_t">{{toys}}</div>

<template toy_t>
  <icon selected$="{{selected}}" title="{{name}}" key="{{name}}" on-click="toggleIcon">{{icon}}</icon>
</template>
`
});
