/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import {makeCapName} from '../..//CoreXenon/Reactor/Atomic/js/names.js';
import * as Design from '../../Design/Services/DesignService.js';
import * as Project from '../../Framework/Project.js';
export {Project};

const log = logf('ProjectService', 'brown', 'white');

export let currentProject = null;

export const ProjectService = {
  async Discover() {
    return discoverLocalGraphs();
  },
  async Load(host, data) {
    const build = host.layer.controller.layers.build;
    await Design.reifyGraph(build, data);
  },
  async Delete(host, name) {
    log.debug(host.id);
    log.debug(name);
    const graphId = currentProject.meta.name + '.' + name;
    const graph = restoreLocalGraph(graphId);
    if (graph) {
      persistLocalGraph('Deleted', graph)
      removeLocalGraph(graphId);
    }
  },
  async SaveProject(host, data) {
    saveProject(currentProject);
  }
};

export const initProject = async (projectName) => {
  const project = loadProject(projectName);
  //const project = Project.create({name: projectName});
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

export const saveProject = (project) => {
  persistLocalProject(project, Design.sublayers.map(n=>n.split('$').pop()));
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

const persistLocalProject = (project, sublayers) => {
  const qualifiedKey = `${globalThis.config.aeon}/projects/${project.meta.name}`;
  localStorage.setItem(qualifiedKey + '/sublayers', JSON.stringify(sublayers));
  localStorage.setItem(qualifiedKey, JSON.stringify(project.meta));
  log.debug('persist', qualifiedKey);
  persistLocalGraphs(project.meta.name, project.graphs);
};

const persistLocalGraphs = (key, graphs) => {
  log('persist', key);
  // for human readability, we split the graphs out into individual storage entries
  graphs?.forEach(graph => persistLocalGraph(key, graph));
  // remove vestigial storage entries
  // for (let i=0; i<localStorage.length; i++) {
  //   const storeKey = localStorage.key(i);
  //   if (storeKey.startsWith(`${qualifiedKey}.`) && !graphKeys.has(storeKey)) {
  //     localStorage.removeItem(storeKey);
  //   }
  // }
};

const persistLocalGraph = (key, graph) => {
  localStorage.setItem( `${globalThis.config.aeon}/${key}.${graph.meta.id}`, JSON.stringify(graph));
};

const removeLocalGraph = key => {
  localStorage.removeItem( `${globalThis.config.aeon}/${key}`);
};

const restoreLocalProject = name => {
  const qualifiedKey = `${globalThis.config.aeon}/projects/${name}`;
  const meta = getValue(qualifiedKey);
  const sublayers = getValue(qualifiedKey + '/sublayers');
  if (meta) {
    const graphs = restoreLocalGraphs(name);
    return {
      sublayers,
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

const restoreLocalGraph = key => {
  const qualifiedKey = `${globalThis.config.aeon}/${key}`;
  return getValue(qualifiedKey);
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

const discoverLocalGraphs = () => {
  //const prefix = `${globalThis.config.aeon}/projects/`;
  // let projects = [];
  // for (let i=0; i<localStorage.length; i++) {
  //   const key = localStorage.key(i);
  //   if (key.startsWith(prefix)) {
  //     const name = key.slice(prefix.length);
  //     const project = localStorage.getItem(key);
  //     projects.push({name, project});
  //   }
  // }
  const prefix = `${globalThis.config.aeon}/`;
  let projects = {};
  for (let i=0; i<localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
      const id = key.slice(prefix.length);
      const parts = id.split('.');
      if (parts.length > 1) {
        const project = parts[0];
        const graphs = (projects[project] ??= {graphs:[]}).graphs;
        graphs.push({
          project,
          name: parts[1]
        })
      }
    }
  }
  return Object.entries(projects).map(([name, {graphs}]) => ({name, graphs}));
};