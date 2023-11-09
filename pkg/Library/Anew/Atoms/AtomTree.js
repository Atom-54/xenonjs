export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({}, state, {service}) {
  const allAtoms = await service('LayerService', 'GetAtomInfo', {});
  allAtoms.forEach(atom => atom.name = atom.id.replace(/\$/g, '.').replace('build.Design.', ''));
  const root = {
    name: 'root',
    atoms: allAtoms //this.atomsInContainer(allAtoms, 'build$Design#Container')
  };
  //
  const stratify = containerNode => {
    containerNode.atoms.forEach(atom => {
      const atoms = this.atomsInParent(allAtoms, atom.id)
      const containers = [...new Set(atoms.map(({container}) => container.split('#').pop().replace('build$Design', '')))];
      atom.containers = containers.map(name => {
        const contained = this.atomsInContainer(atoms, `${atom.id}#${name}`);
        const node = {name, atoms: contained};
        stratify(node);
        return node;
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
  const atoms = allAtoms.filter(({container}) => container === containerName);
  //atoms.forEach(atom => atom.name = atom.name.replace('build.Design', ''));
  return atoms;
},
template: html`
<style>
  :host {
    box-sizing: border-box;
  }
  [container] {
    display: block;
    font-size: .7rem;
  }
  [atoms] {
    font-size: .8rem;
  }
  [atoms], [container] {
    padding-left: 0.4em;
  }
  [label] {
    user-select: none;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }
  [label] > icon {
    padding-right: 1.2em;
  }
  icon {
    width: 10px;
    height: 10px;
  }
  [container] > drop-target {
    padding: 4px 0;
    background-color: #eeeeee;
  }
  [atoms] div[label] {
    background-color: white;
  }
  drop-target {
    display: block;
  }
  drop-target[over] {
    background-color: var(--xcolor-hi-one, violet);
    color: white;
    font-weight: bold;
  }
  [before], [after] {
    background-color: white;
    height: 4px;
  }
</style>

<div repeat="container_t">{{tree}}</div>

<template container_t>
  <div container>
    <drop-target label key="{{id}}" on-target-drop="onDrop">
      <icon>folder</icon>
      <span>{{name}}</span>
    </drop-target>
    <div atoms repeat="atom_t">{{atoms}}</div>
  </div>
</template>

<template atom_t>
  <div>
    <drop-target before key="{{id}}" on-target-drop="onDropBefore"></drop-target>
    <div label draggable="true"><icon>settings</icon><span>{{name}}</span></div>
    <drop-target after key="{{id}}" on-target-drop="onDropAfter"></drop-target>
    <div repeat="container_t">{{containers}}</div>
  </div>
</template>
`
});