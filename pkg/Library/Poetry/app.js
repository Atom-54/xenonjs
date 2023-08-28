/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Layers from '../Framework/Layers.js';
import * as Binder from '../Framework/Binder.js';
export {revalidate} from '../Framework/Layers.js';

// better than bad, it's good! it's log!
const log = logf('App', 'purple');
logf.flags.App = true;

// init the app with Atom industry `atomEmitter`
export const create = async (atomEmitter, graph) => {
  const layer = await Layers.reifyGraphLayer(graph, atomEmitter);
  bindAtoms(layer);
  return layer;
};

// connect Atoms 
const bindAtoms = ({atoms, bindings}) => {
  Object.entries(atoms).forEach(([name, atom]) => 
    atom.listen('output', output => forwardBoundOutput(name, output, bindings))); 
};

// translate atom output into input bindings, send input to Atoms
const forwardBoundOutput = (name, output, bindings) => {
  const scopedOutput = Binder.processOutput(name, output, bindings.outputBindings);
  const boundInput = Binder.processInput(scopedOutput, bindings.inputBindings);
  boundInput.forEach(({id, inputs}) => atoms[id].inputs = inputs);
};
