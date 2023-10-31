/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Pcb from './Pcb.js';

const log = logf('Env', '#800020');

export const createEnv = (xenon, onservice, onrender) => {
  return {
    pcbs: {},
    xenon,
    onservice,
    onrender
  };
};

export const createPcb = async (env, name, bindings) => {
  return env.pcbs[name] = Pcb.create(name, bindings, env);
};
