import './config.js';
import * as Flan from '../../../Library/CoreXenon/Framework/Flan.js';
import * as Library from '../../../Library/CoreXenon/Framework/Library.js'
import {loadGraph} from '../../../Library/CoreXenon/Designer/GraphService.js';
import {graph as baseGraph} from '../../../Library/Graphs/Base.js';

export const main = async (xenon, Composer) => {
  Composer.options.root = document.getElementById('container');
  await xenon.industrialize();
  // TODO(maria): this should be passed as parameter.
  const graph = await loadGraph('fb:neonflan/Translate');
  if (graph) {
    graph.state[`Main$designer$disabled`] = true;
    // xenon.setPaths(Paths.map);
    const library = await Library.importLibraries(graph.meta.customLibraries ?? {});
    const flan = globalThis.flan = Flan.createFlan(xenon.emitter, Composer, library);
    // create layer
    await Flan.createLayer(flan, [baseGraph, graph], 'base');
    // ready;
    console.log('flan is live 🌈');  
  }
};
