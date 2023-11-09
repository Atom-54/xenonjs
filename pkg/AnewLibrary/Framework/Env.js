/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from './Controller.js';

const log = logf('Env', '#800020');

export const createEnv = (xenon, onservice, onrender) => {
  return {
    controllers: {},
    xenon,
    onservice,
    onrender
  };
};

export const createController = async (env, name, bindings) => {
  return env.controllers[name] = Controller.create(name, bindings, env);
};
