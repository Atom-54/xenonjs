/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../framework/Controller.js';
import * as Schema from '../framework/Schema.js';

export const init = controller => {
  initClick(controller);
  initPointermove(controller);
};

const initClick = controller => {
  document.body.addEventListener('click', e => {
    //if (e.altKey) {
      let elt = e.target;
      elt = isAtomElement(elt) ? elt : findAncestorAtom(elt);
      if (elt) {
        const key = elt.id.replace(/_/g, '$');
        const host = controller.atoms[key];
        if (host && host.layer.id !== 'build$Inspector') {
          const schema = Schema.schemaForHost(host);
          const candidates = Schema.schemaForController(controller);
          Controller.setInputs(controller, 'build$Inspector$Inspector', {id: host.id, schema, candidates});
          Controller.setInputs(controller, 'build$Inspector$Echo', {html: `<h4 style="text-align: center;">${host.id.replace(/\$/g, '.')}</h4>`});
          Controller.setInputs(controller, 'build$AtomTree', {junk: Math.random()});
        }
      }
    //}
  }, {capture: true});
};

const isAtomElement = elt => {
  return elt?.hasAttribute('atom');
};

const findAncestorAtom = elt => {
  let atom;
  for (atom=elt; atom=atom?.parentElement; atom && !isAtomElement(atom));
  return atom;
};

const initPointermove = () => {
  let lastElt = null;
  document.body.addEventListener('pointermove', e => {
    let elt = e.target;
    if (lastElt) {
      lastElt.style.outline = null;
      lastElt.style.zIndex = null;
      lastElt.style.position = null;
    }
    lastElt = elt;
    //if (e.altKey) {
      while (elt && !elt.hasAttribute('atom')) {
        elt = elt.parentElement;
      }
      if (elt) {
        elt.style.position = 'relative';
        elt.style.outline = '1px solid orange';
        elt.style.outlineOffset = '-1px';
        elt.style.zIndex = 1000;
      }
    //}
  }, {capture: true});
};