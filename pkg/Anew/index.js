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
import * as Controller from './framework/Controller.js';
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
  // make a controller
  const main = await Env.createController(env, 'main', bindings);
  // add layers
  //await Controller.reifyLayer(one, one.layers, 'main', Graphs.documentsGraph);
  await Controller.reifyLayer(main, main.layers, 'build', Graphs.Build);
  //await Controller.reifyLayer(one, one.layers, 'inspector', Graphs.inspectorGraph);
  // await Controller.reifyLayer(one, one.layers, 'schema', Graphs.echoGraph);
  // await Controller.reifyLayer(one, one.layers, 'catalog', Graphs.catalogGraph);
  // await Controller.reifyLayer(one, one.layers, 'tree', Graphs.treeGraph);
  // init mouse handler
  Mouse.init(main);
});

const onrender = async (host, packet) => {
  const {layer} = host;
  const {controller} = layer;
  if (!controller.composer) {
    const root = window[layer.root || layer.id.replace(/\$/g, '_')] || window.root;
    controller.composer = Composer.createComposer(controller.uxEventHandler, root);
  }
  if (controller.composer) {
    // TODO(sjmiles): doing this to avoid walking each sublayer to set all the 'root' containers; which way is more efficient?
    packet.container = (host.container === 'root' && layer.host && `${layer.host.id}#Container`) || host.container; 
    const style = controller.state[`${host.id}$style`];
    if (style) {
      ((packet.content ??= {}).model ??= {}).style = style;
      // packet.content.model ??= {};
      // packet.content.model.style = style;
    }
    controller.composer.render(packet);
  }
};
