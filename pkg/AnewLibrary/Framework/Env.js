/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Project from './Project.js';
import * as Controller from './Controller.js';

const log = logf('Env', '#800020');

export const createEnv = (xenon, onservice, onrender) => {
  return {
    projects: {},
    controllers: {},
    xenon,
    onservice,
    onrender
  };
};

export const createProject = async (env, name, meta) => {
  return env.projects[name] = Project.create(env, name, meta);
};

export const createController = async (env, name) => {
  return env.controllers[name] = Controller.create(name, env);
};
