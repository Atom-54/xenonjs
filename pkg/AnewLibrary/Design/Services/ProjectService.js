/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import {makeCapName} from '../../../Library/CoreXenon/Reactor/Atomic/js/names.js';
import * as Design from '../../Design/Services/DesignService.js';
import * as Project from '../../Framework/Project.js';
export {Project};

const log = logf('ProjectService', 'brown', 'white');

export let currentProject = null;

export const ProjectService = {
  async LoadProject(host, data) {
  },
  async SaveProject(host, data) {
    saveProject(currentProject);
  }
};

export const initProject = async (projectName) => {
  let project = loadProject(projectName);
  project ??= Project.create({name: projectName});
  selectProject(project);
  log.debug(project);
};

export const reifyGraphs = async layer => {
  const project = currentProject;
  if (!project?.graphs.length) {
    await newGraph(layer);
    saveProject(project);
  } else {
    for (let graph of project.graphs) {
      await Design.reifyGraph(layer, graph.meta.id);
    }
  }
};

export const loadProject = name => {
  return restoreLocalProject(name);
};

export const saveProject = project => {
  persistLocalProject(project);
};

export const selectProject = project => {
  currentProject = project;
};

export const newGraph = async layer => {
  const name = makeCapName();
  const graph = {      
    meta: {
      id: name
    }
  };
  Project.addGraph(currentProject, graph);
  saveProject(currentProject);
  return Design.reifyGraph(layer, name);
};

export const getGraph = id => {
  return Project.getGraph(currentProject, id);
};

const persistLocalProject = project => {
  const qualifiedKey = `${globalThis.config.aeon}/projects/${project.meta.name}`;
  localStorage.setItem(qualifiedKey, JSON.stringify(project.meta));
  log.debug('persist', qualifiedKey);
  persistLocalGraphs(project.meta.name, project.graphs);
};

const persistLocalGraphs = (key, graphs) => {
  const qualifiedKey = `${globalThis.config.aeon}/${key}`;
  log('persist', qualifiedKey);
  // for human readability, we split the graphs out into individual storage entries
  const graphKeys = new Set();
  graphs?.forEach(g => {
    const graphKey = `${qualifiedKey}.${g.meta.id}`;
    localStorage.setItem(graphKey, JSON.stringify(g))
    graphKeys.add(graphKey);
  });
  // remove vestigial storage entries
  for (let i=0; i<localStorage.length; i++) {
    const storeKey = localStorage.key(i);
    if (storeKey.startsWith(`${qualifiedKey}.`) && !graphKeys.has(storeKey)) {
      localStorage.removeItem(storeKey);
    }
  }
};

const restoreLocalProject = name => {
  const qualifiedKey = `${globalThis.config.aeon}/projects/${name}`;
  const meta = getValue(qualifiedKey);
  if (meta) {
    const graphs = restoreLocalGraphs(name);
    return {
      meta,
      graphs
    };
  }
};

const restoreLocalGraphs = key => {
  const qualifiedKey = `${globalThis.config.aeon}/${key}`;
  let graphs = [];
  for (let i=0; i<localStorage.length; i++) {
    const storeKey = localStorage.key(i);
    if (storeKey.startsWith(`${qualifiedKey}.`)) {
      graphs.push(getValue(storeKey));
    }
  }
  return graphs;
};

const getValue = key => {
  let value = localStorage.getItem(key);
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (e) {
      log(e);
    }
  }
  return value;
};