/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
// import * as Controller from '../../AnewLibrary/Framework/Controller.js';
// import * as Schema from '../../AnewLibrary/Framework/Schema.js';
import * as Design from '../../AnewLibrary/Design/Services/DesignService.js';

let rootId;
let inited = false;

export const init = (controller, _rootId) => {
  rootId = _rootId.replace(/\$/g, '_');
  if (!inited) {
    initClick(controller);
    initPointermove();
    inited = true;
  }
};

const initClick = (controller) => {
  document.body.addEventListener('click', e => {
    let elt = validTarget(e.target, rootId);
    if (elt) {
      //Design.designUpdate(controller);
      const key = elt.id.replace(/_/g, '$');
      Design.designSelect(controller, key);
      // const host = controller.atoms[key];
      // if (host && host.layer.id !== 'build$Inspector') {
      //   const schema = Schema.schemaForHost(host).inputs;
      //   const candidates = Schema.schemaForController(controller, 'build$Design').outputs;
      //   Controller.writeInputsToHost(controller, 'build$Inspector$Inspector', {id: host.id, schema, candidates});
      //   Controller.writeInputsToHost(controller, 'build$Inspector$Echo', {html: `<h4 style="text-align: center;">${host.id.replace('build$Design$', '').replace(/\$/g, '.')}</h4>`});
      //   Controller.writeInputsToHost(controller, 'build$AtomTree', {junk: Math.random()});
      //   Controller.writeInputsToHost(controller, 'build$NodeGraph', {layerId: 'build$Design', junk: Math.random()});
      //   const state = prefixedState(controller.state, host.id + '$');
      //   Controller.writeInputsToHost(controller, 'build$State', {object: state});
      // }
    }
  }, {capture: true});
};

// const prefixedState = (state, prefix)=> {
//   const prefixedState = {};
//   entries(state).forEach(([id, value]) => {
//     if (id.startsWith(prefix)) {
//       prefixedState[id.slice(prefix.length).replace(/\$/g, '.')] = value;
//     }
//   });
//   return prefixedState;
// };

const validTarget = (elt, targetId) => {
  const root = document.querySelector(`#${targetId}`);
  if (root) { 
    if (root.contains(elt)) {
      return elt.closest('[atom]');
    }
  }
};

// const isAtomElement = elt => {
//   return elt?.hasAttribute('atom');
// };

// const findAncestorAtom = elt => {
//   let atom;
//   for (atom=elt; atom=atom?.parentElement; atom && !isAtomElement(atom));
//   return atom;
// };

const initPointermove = () => {
  let lastElt = null;
  document.body.addEventListener('pointermove', e => {
    if (lastElt) {
      lastElt.style.outline = null;
      lastElt.style.zIndex = null;
      lastElt.style.position = null;
      lastElt = null;
    }
    let elt = validTarget(e.target, rootId);
    if (elt) { //if (e.altKey) {
      lastElt = elt;
      while (elt && !elt.hasAttribute('atom')) {
        elt = elt.parentElement;
      }
      if (elt) {
        elt.style.outline = '5px dotted orange';
        elt.style.outlineOffset = '-2px';
      }
    }
  }, {capture: true});
};