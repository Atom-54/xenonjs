import './config.js';
import {Flan} from '../../../Library/CoreXenon/Framework/Flan.js';
import {graph as baseGraph} from '../../../Library/Graphs/Base.js';
import {loadGraph} from '../../../Library/CoreXenon/Designer/GraphService.js';
import * as Library from '../../../Library/CoreXenon/Framework/Library.js'

export const main = async (xenon, Composer) => {
  await xenon.industrialize();
  // TODO(maria): this should be passed as parameter.
  const graph = await loadGraph('fb:neonflan/Translate');
  if (graph) {
    graph.state[`Main$designer$disabled`] = true;
    // xenon.setPaths(Paths.map);
    const library = await Library.importLibraries(graph.meta.customLibraries ?? {});
    const flan = globalThis.flan = new Flan(xenon.emitter, Composer, library);
    Composer.options.root = document.getElementById('container');
    // create layer
    await flan.createLayer([baseGraph, graph], 'base');
    // ready;
    console.log('flan is live 🌈');  
  }
};
