/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import './config.js';
import '../Library/Common/configKeys.js';
import {logf} from '../Library/CoreXenon/Reactor/Atomic/js/logf.js';
import * as Library from '../Library/Xenon/Library.js';
import * as Env from '../Library/Framework/Env.js';
import * as Controller from '../Library/Framework/Controller.js';
import * as Services from '../Library/Framework/Services.js';
//import {Graphs} from './graphs.js';
import {createComposer} from './composer.js';
import * as services from './services.js';
import {start} from '../Library/Common/start.js';
import * as Project from '../Library/Design/Services/ProjectService.js';

const log = logf('Index', 'magenta');

start(async xenon => {
  // create a xenon environment
  const env = globalThis.env = Env.createEnv(xenon, Services.onservice, onrender);
  Library.importLibrary(env);
  Services.addServices(services);
  // create project
  await Project.initProject('FirstProject');
  // make a controller
  const main = await Env.createController(env, 'main');
  globalThis.main = main;
  // add layers
  const graph = Project.restoreLocalGraph('FirstProject.KeyRecommendation');
  log.debug(graph);
  await Controller.reifyLayer(main, main.layers, 'run', graph);
});

const onrender = async (host, packet) => {
  const {layer} = host;
  const {controller} = layer;
  if (!controller.composer) {
    const root = window[layer.root || layer.id.replace(/\$/g, '_')] || window.root;
    controller.composer = createComposer(controller.onevent, root);
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
