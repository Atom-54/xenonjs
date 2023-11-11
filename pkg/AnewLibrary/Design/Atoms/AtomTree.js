export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async initialize({}, state, {service}) {
  state.onDrop = async eventlet => {
    eventlet.key = eventlet.key.replace(/\$/g, '_');
    service('DesignService', 'DesignDragDrop', {eventlet});
  }
},
async update({}, state, {service}) {
  const atoms = await service('DesignService', 'GetAtomInfo', {});
  atoms.forEach(atom => atom.name = atom.id.replace(atoms.designLayerId + '$', '').replace(/\$/g, '.'));
  const rootAtoms = this.atomsInContainer(atoms, atoms.designLayerId + '#Container')
  const root = {
    name: 'root',
    atoms: rootAtoms
  };
  this.stratify(atoms, root);
  state.tree = [root];
},
stratify(allAtoms, root) {
  const _stratify = containerNode => {
    containerNode.atoms.forEach(atom => {
      const atoms = this.atomsInParent(allAtoms, atom.id)
      const containers = [...new Set(atoms.map(({container}) => container.split('#').pop().replace(allAtoms.designLayerId, '')))];
      atom.containers = containers.map(name => {
        const contained = this.atomsInContainer(atoms, `${atom.id}#${name}`);
        const node = {name, id: atom.id + '#' + name, atoms: contained};
        _stratify(node);
        return node;
      });
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
onDrop({eventlet}, {onDrop}) {
  log.debug(eventlet);
  onDrop(eventlet);
},
onDropBefore({eventlet}, {onDrop}) {
  eventlet.before = true;
  log.debug(eventlet);
  onDrop(eventlet);
},
onDropAfter({eventlet}, {onDrop}) {
  eventlet.after = true;
  log.debug(eventlet);
  onDrop(eventlet);
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
  drop-target > * {
    pointer-events: none;
  }
</style>

<div repeat="container_t">{{tree}}</div>

<template container_t>
  <div container>
    <drop-target label targetkey="{{id}}" on-target-drop="onDrop">
      <icon>folder</icon>
      <span>{{name}}</span>
    </drop-target>
    <div atoms repeat="atom_t">{{atoms}}</div>
  </div>
</template>

<template atom_t>
  <div>
    <drop-target before targetkey="{{id}}" on-target-drop="onDropBefore"></drop-target>
    <div label draggable="true"><icon>settings</icon><span>{{name}}</span></div>
    <drop-target after targetkey="{{id}}" on-target-drop="onDropAfter"></drop-target>
    <div repeat="container_t">{{containers}}</div>
  </div>
</template>
`
});