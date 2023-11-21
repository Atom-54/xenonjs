export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize({}, state, {service}) {
  state.doDrop = async eventlet => service('DesignService', 'DesignDragDrop', {eventlet});
},
async update({selected}, state, {service}) {
  state.selected = selected;
  state.atoms = await service('DesignService', 'GetAtomInfo', {});
},
shouldRender({}, {atoms}) {
  return atoms;
},
render({}, {atoms, selected}) {
  atoms.forEach(atom => atom.name = atom.id.replace(atoms.designLayerId + '$', '').replace(/\$/g, '.'));
  const rootAtoms = this.atomsInContainer(atoms, atoms.designLayerId + '#Container')
  const root = {
    name: 'root',
    atoms: rootAtoms,
    disabled: true
  };
  this.stratify(atoms, root, selected);
  return {
    tree: [root]
  };
},
stratify(allAtoms, root, selected) {
  const _stratify = containerNode => {
    containerNode.atoms.forEach(atom => {
      atom.selected = atom.id === selected;
      if (!atom.type.endsWith('Graph')) {
        const atoms = this.atomsInParent(allAtoms, atom.id)
        const foundContainers = new Set(atoms.map(({container}) => container.split('#').pop().replace(allAtoms.designLayerId, '')));
        if (atom.isContainer) {
          foundContainers.add('Container');
        }
        const containers = [...foundContainers];
        atom.containers = containers.map(name => {
          const contained = this.atomsInContainer(atoms, `${atom.id}#${name}`);
          const node = {name, id: atom.id + '#' + name, atoms: contained};
          _stratify(node);
          return node;
        });
      }
    });
  };
  return _stratify(root);
},
atomsInParent(allAtoms, parentName) {
  return allAtoms.filter(({container}) => container.split('#').shift() === parentName);
},
atomsInContainer(allAtoms, containerName) {
  const atoms = allAtoms.filter(({container}) => container === containerName);
  return atoms;
},
onDrop({eventlet}, {doDrop}) {
  doDrop(eventlet);
},
onDropBefore({eventlet}, {doDrop}) {
  eventlet.before = true;
  doDrop(eventlet);
},
onDropAfter({eventlet}, {doDrop}) {
  eventlet.after = true;
  doDrop(eventlet);
},
onClick({eventlet}, state, {service}) {
  service('DesignService', 'Select', {atomId: eventlet.key});
},
onKeyDown({eventlet}, state, {service}) {
  if (['Delete', 'Backspace'].includes(eventlet.key) && state.selected) {
    service('DesignService', 'Delete', {atomId: state.selected});
  }
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
    padding-left: 0.8em;
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
  [atoms] drag-able[label] {
    background-color: white;
  }
  [atoms] drag-able[label][selected] {
    background-color: purple;
    color: white;
    outline: 2px solid purple;
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
  drop-target > * {
    pointer-events: none;
  }
</style>

<div flex scrolling tabindex="-1" on-click="onClick" on-keydown="onKeyDown">
  <div repeat="container_t" >{{tree}}</div>
</div>

<template container_t>
  <div container>
    <drop-target label targetkey="{{id}}" disabled="{{disabled}}" on-target-drop="onDrop">
      <icon>folder</icon>
      <span>{{name}}</span>
    </drop-target>
    <div atoms repeat="atom_t">{{atoms}}</div>
  </div>
</template>

<template atom_t>
  <div>
    <drop-target before targetkey="{{id}}" on-target-drop="onDropBefore"></drop-target>
    <drag-able label selected$="{{selected}}" key="{{id}}" on-click="onClick">
      <icon>settings</icon>
      <span>{{name}}</span>
    </drag-able>
    <div repeat="container_t">{{containers}}</div>
    <drop-target after targetkey="{{id}}" on-target-drop="onDropAfter"></drop-target>
  </div>
</template>
`
});