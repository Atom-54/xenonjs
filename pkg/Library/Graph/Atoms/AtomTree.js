export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({}, state, {service}) {
  const allAtoms = await service('LayerService', 'GetAtomInfo', {});
  const root = {
    name: 'root',
    atoms: this.atomsInContainer(allAtoms, 'root')
  };
  root.atoms.forEach(atom => atom.name = atom.id.replace('$', '.'));
  //
  const stratify = containerNode => {
    containerNode.atoms.forEach(atom => {
      const atoms = this.atomsInParent(allAtoms, atom.id)
      const containers = [...new Set(atoms.map(({container}) => container.split('#').pop()))];
      atom.containers = containers.map(name => {
        const contained = this.atomsInContainer(atoms, `${atom.id}#${name}`);
        contained.forEach(atom => atom.name = atom.id.replace('$', '.'));
        return {name, atoms: contained}
      });
    });
  };
  stratify(root);
  //log(JSON.stringify(root, null, '  '));
  state.tree = [root];
},
atomsInParent(allAtoms, parentName) {
  return allAtoms.filter(({container}) => container.split('#').shift() === parentName);
},
atomsInContainer(allAtoms, containerName) {
  return allAtoms.filter(({container}) => container === containerName);
},
template: html`
<style>
  :host {
    font-size: 70%;
  }
  [atoms], [container] {
    padding-left: 12px;
  }
</style>

<div repeat="container_t">{{tree}}</div>

<template container_t>
  <div container>
    <div><icon>folder</icon>&nbsp;<span>{{name}}</span></div>
    <div atoms repeat="atom_t">{{atoms}}</div>
  </div>
</template>

<template atom_t>
  <div>
    <div><icon>settings</icon>&nbsp;<span>{{name}}</span></div>
    <div repeat="container_t">{{containers}}</div>
  </div>
</template>
`
});