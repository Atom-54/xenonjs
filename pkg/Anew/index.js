/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import './config.js';
import {logf} from '../Library/CoreXenon/Reactor/Atomic/js/logf.js';
import * as Env from '../AnewLibrary/Framework/Env.js';
import * as Controller from '../AnewLibrary/Framework/Controller.js';
import {start} from 'xenonjs/Library/Common/start.js';
import * as Services from './common/services.js';
import * as Graphs from './common/graphs.js';
import * as Composer from '../Library/CoreXenon/Framework/Composer.js';
import '../AnewLibrary/Spectrum/Dom/spectrum-tab-panels.js';

const log = logf('Index', 'magenta');

start(async xenon => {
  // create a xenon environment
  const env = globalThis.env = Env.createEnv(xenon, Services.onservice, onrender);
  // conjure some bindings
  const bindings = {
    inputs: {
      'build$DesignPanels$selected': 'build$DesignSelector$index'
    },
    outputs: {
    }
  };
  // make a controller
  const main = await Env.createController(env, 'main', bindings);
  // add layers
  await Controller.reifyLayer(main, main.layers, 'build', Graphs.Build);
  let designLayer = 'build$Design';
  // init design system
  Services.DesignService.SetDesignLayer({layer: {controller: main}}, {layerId: designLayer})
});

const onrender = async (host, packet) => {
  const {layer} = host;
  const {controller} = layer;
  if (!controller.composer) {
    const root = window[layer.root || layer.id.replace(/\$/g, '_')] || window.root;
    controller.composer = Composer.createComposer(controller.uxEventHandler, root);
  }
  if (controller.composer) {
    // TODO(sjmiles): doing this to avoid walking each sublayer to set all the 'root' containers; which way is simpler?
    packet.container = (host.container === 'root' && layer.host && `${layer.host.id}#Container`) || host.container; 
    const style = controller.state[`${host.id}$style`];
    if (style) {
      ((packet.content ??= {}).model ??= {}).style = style;
    }
    controller.composer.render(packet);
  }
};
