/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
// configuration
import './config.js';
// xenon start up
import {start} from 'xenonjs/Library/Common/start.js';
// dependencies
import '../Library/Spectrum/Dom/spectrum-tab-panels.js';
import * as Composer from '../Library/CoreXenon/Framework/Composer.js';
import * as Graphs from './graphs.js';
import * as Schema from './schema.js';
import {Env, Flan, System} from './simple.js';

const log = logf('Index', 'magenta');

start(async (xenon) => {
  // create a xenon environment
  const env = globalThis.env = Env.createEnv(xenon, onservice);
  // conjure some bindings
  const bindings = {
    inputs: {
      'main_System_System$Button$value': 'one$main$Thing$trigger'
    },
    outputs: {
    }
  };
  // make a flan
  const one = await Env.createFlan(env, 'one', bindings);
  // add systems
  await reifySystem(one, one.systems, 'main', window.one, Graphs.graphTwo);
  await reifySystem(one, one.systems, 'inspector', window.inspector, Graphs.inspectorGraph);
  await reifySystem(one, one.systems, 'schema', window.schema, Graphs.echoGraph);
  await reifySystem(one, one.systems, 'catalog', window.catalog, Graphs.catalogGraph);
});

document.body.addEventListener('click', e => {
  const flan = env.flans.one;
  let elt = e.target;
  elt = isAtomElement(elt) ? elt : findAncestorAtom(elt);
  //while (elt) {
  if (elt) {
    const key = elt.id.replace(/_/g, '$');
    const systems = key.split('$');
    /*const atomName =*/ systems.pop();
    let system = flan;
    let id = '';
    for (let systemName of systems) {
      id = id ? `${id}$${systemName}` : systemName;
      system = system?.systems?.[id];
    }
    log.debug(system);
    const host = system.atoms[key];
    log.debug(key, host);
    if (system.name !== 'inspector' && host) {
      Flan.setInputs(flan, 'inspector$Echo', {html: `<h4 style="text-align: center;">${host.id.replace(/\$/g, '.')}</h4>`});
      const schema = Schema.schemaForHost(host);
      const candidates = Schema.schemaForSystems(flan.systems);
      Flan.setInputs(flan, 'inspector$Inspector', {id: host.id, schema, candidates});
      Flan.setInputs(flan, 'schema$Echo', {html: `<pre>${JSON.stringify(candidates, null, ' ')}</pre>`});
    }
  }
}, {capture: true});

let lastElt = null;
document.body.addEventListener('pointermove', e => {
  let elt = e.target;
  while (elt && !elt.hasAttribute('atom')) {
    elt = elt.parentElement;
  }
  if (lastElt) {
    lastElt.style.outline = null;
    lastElt.style.zIndex = null;
    lastElt.style.position = null;
  }
  if (elt) {
    lastElt = elt;
    elt.style.position = 'relative';
    elt.style.outline = '1px solid orange';
    elt.style.zIndex = 1000;
  }
}, {capture: true});

const isAtomElement = elt => {
  return elt?.hasAttribute('atom');
};

const findAncestorAtom = elt => {
  let atom;
  for (atom=elt; atom=atom?.parentElement; atom && !isAtomElement(atom));
  return atom;
};

const onservice = async (host, request) => {
  const {kind, msg, data} = request;
  switch (kind) {
    case 'SystemService':
      switch (msg) {
        case 'CreateSystem': 
          log.debug('msg', data);
          const {system} = host;
          const {controller: flan} = system;
          const graph = Graphs[data.id];
          if (graph) {
            const name = `${system.name}$${host.name}`;
            reifySystem(flan, system.systems, name, window[flan.name], graph);
            // const composer = Composer.createComposer(null, window[flan.name]);
            // const subsystem = System.create(name, composer, flan);
            // system.systems[name] = subsystem;
            // await System.reify(subsystem, graph);
          }
        break;
      }
    default: 
      log.debug('onservice', host, request);
    break;
  }
};

const reifySystem = async (flan, systems, name, root, graph) => {
  // as of now, every system needs it's own composer for event-forwarding
  const composer = Composer.createComposer(null, root);
  const subsystem = System.create(name, composer, flan);
  systems[name] = subsystem;
  await System.reify(subsystem, graph);
  return subsystem;
};

// const reifySystem0 = async (flan, name, root, graph) => {
//   // as of now, every system needs it's own composer for event-forwarding
//   const composer = Composer.createComposer(null, root);
//   const system = Flan.createSystem(flan, name, composer);
//   await System.reify(system, graph);
//   return system;
// };