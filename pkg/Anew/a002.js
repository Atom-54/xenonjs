/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
// configuration
import './common/config.js';
// xenon start up
import {start} from 'xenonjs/Library/Common/start.js';
// rendering
import '../Library/Spectrum/Dom/spectrum-tab-panels.js';
import * as Composer from '../Library/CoreXenon/Framework/Composer.js';
import * as Mouse from './common/mouse.js';
// framework
import * as Env from './framework/Env.js';
import * as Pcb from './framework/Pcb.js';
// services
import {onservice} from './common/services.js';
// graphs
import * as Graphs from './common/graphs.js';

const log = logf('Index', 'magenta');

start(async (xenon) => {
  // create a xenon environment
  const env = globalThis.env = Env.createEnv(xenon, onservice, onrender);
  // conjure some bindings
  const bindings = {
    inputs: {
      'main$GraphOne$GraphThree$Button$value': 'one$main$Thing$trigger'
    },
    outputs: {
    }
  };
  // make a pcb
  const one = await Env.createPcb(env, 'one', bindings);
  // add layers
  await Pcb.reifyLayer(one, one.layers, 'main', Graphs.documentsGraph);
  await Pcb.reifyLayer(one, one.layers, 'inspector', Graphs.inspectorGraph);
  await Pcb.reifyLayer(one, one.layers, 'schema', Graphs.echoGraph);
  await Pcb.reifyLayer(one, one.layers, 'catalog', Graphs.catalogGraph);
  await Pcb.reifyLayer(one, one.layers, 'tree', Graphs.treeGraph);
  // init mouse handler
  Mouse.init(one);
  // display atoms
  Pcb.setInputs(one, 'tree$AtomTree', {kick: Math.random()});
});

const onrender = async (host, packet) => {
  const {layer} = host;
  if (!layer.composer) {
    layer.composer = Composer.createComposer(layer.uxEventHandler, window[layer.root || layer.name]);
  }
  packet.container = host.container;
  layer.composer.render(packet);
};
