/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
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
      const key = elt.id.replace(/_/g, '$');
      Design.designSelect(controller, key);
    }
  }, {capture: true});
};

const validTarget = (elt, targetId) => {
  const root = document.querySelector(`#${targetId}`);
  if (root) { 
    if (root.contains(elt)) {
      return elt.closest('[atom]');
    }
  }
};

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