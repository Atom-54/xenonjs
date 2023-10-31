/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Pcb from '../framework/Pcb.js';
import * as Schema from '../framework/Schema.js';

export const init = pcb => {
  initClick(pcb);
  initPointermove(pcb);
};

const initClick = pcb => {
  document.body.addEventListener('click', e => {
    //if (e.altKey) {
      let elt = e.target;
      elt = isAtomElement(elt) ? elt : findAncestorAtom(elt);
      //while (elt) {
      if (elt) {
        const key = elt.id.replace(/_/g, '$');
        const layers = key.split('$');
        /*const atomName =*/ layers.pop();
        let layer = pcb;
        let id = '';
        for (let layerName of layers) {
          id = id ? `${id}$${layerName}` : layerName;
          layer = layer?.layers?.[id];
        }
        //log.debug(layer);
        const host = layer.atoms[key];
        //log.debug(key, host);
        if (layer.name !== 'inspector' && host) {
          Pcb.setInputs(pcb, 'inspector$Echo', {html: `<h4 style="text-align: center;">${host.id.replace(/\$/g, '.')}</h4>`});
          const schema = Schema.schemaForHost(host);
          const candidates = Schema.schemaForLayers(pcb.layers);
          Pcb.setInputs(pcb, 'inspector$Inspector', {id: host.id, schema, candidates});
          Pcb.setInputs(pcb, 'schema$Echo', {html: `<pre>${JSON.stringify(candidates, null, ' ')}</pre>`});
          Pcb.setInputs(pcb, 'tree$AtomTree', {junk: Math.random()});
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
        elt.style.zIndex = 1000;
      }
    //}
  }, {capture: true});
};