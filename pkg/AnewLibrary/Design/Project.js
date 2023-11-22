/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
const log = logf('Project', '#9F2B68');

export const create = (meta, graphs) => ({
  meta, 
  graphs: graphs || []
});

export const addGraph = (project, graph) => {
  project.graphs.push(graph);
};

export const getGraph = (project, id) => {
  return project.graphs.find(({meta}) => meta.id === id);
};