import {atomInfo} from '../../AnewLibrary/Xenon/Library.js';
import * as Graph from './Graph.js';

const log = logf('Schema', '#953553');

export const schemaForLayer = (controller, layerId) => {
  const schema = {
    inputs: {},
    outputs: {}
  };
  for (const host of Object.values(controller.atoms)) {
    if (host.id.startsWith(layerId + '$')) {
      const hostSchema = schemaForHost(host);
      const prefix = host.id.slice(layerId.length + 1);
      rekeySchemaMode(prefix, hostSchema.inputs, schema.inputs);
      rekeySchemaMode(prefix, hostSchema.outputs, schema.outputs);
    }
  }
  return schema;
};

const rekeySchemaMode = (idPrefix, modalHostSchema, modalSchema) => {
  for (const [prop, value] of Object.entries(modalHostSchema)) {
    const ids = [...(idPrefix||'').split('$'), prop];
    const key = ids.join('.');
    if (ids[ids.length-1] !== 'name' || ids.length < 3) {
      modalSchema[key] = value;
    }
  }
};

export const schemaForHost = host => {
  const state = Graph.getAtomState(host);
  /*
  let graph = host.layer.graph;
  // accumulate host state
  const hostState = graph[host.name].state;
  const state = Object.assign({}, hostState || {});
  while (graph) {
    graph = null;
    const parentHost = host.layer.host;
    const qualifiedHostParts = parentHost.id.split('$');
    if (qualifiedHostParts.length > 2) {
      const parentLayer = parentHost.layer;
      const qualifiedHostId = qualifiedHostParts.pop();
      const graphState = parentLayer.graph[qualifiedHostId]?.state || {};
      for (let [name, value] of Object.entries(graphState)) {
        const nameParts = name.split('$');
        const propName = nameParts.pop();
        const hostName = nameParts.join('$');
        if (hostName === host.name) {
          state[propName] = value;
        }
      }
      graph = qualifiedHostParts.length > 3 ? parentLayer.graph : null;
      graph && log.debug(graph);
    }
  }
  */
  // host has these connections
  let connections = host.layer.graph[host.name].connections;
  // const parentLayer = host.layer;
  // const parentHost = parentLayer.host;
  // //const parentLayer = parentHost?.layer;
  // if (parentLayer?.id.split('$')?.length > 1) {
  //   connections = {};
  //   const qualifedConnections = parentLayer.graph[parentHost.name]?.connections;
  //   for (const [key, value] of entries(qualifedConnections)) {
  //     if (key.startsWith(host.name + '$')) {
  //       connections[key.slice(host.name.length + 1)] = value;
  //     }
  //   }
  // }
  // build schema
  const schema = {
    inputs: {
      name: {type: 'String', value: host.name},
      style: {type: 'CssStyle', value: state.style || {}}
    },
    outputs: {
    }
  };
  schemaFromHost(schema, host, state, connections);
  return schema;
};

const schemaFromHost = (schema, host, state, connections) => {
  const kind = host.type.split('/').pop();
  const info = atomInfo[kind];
  if (info) {
    schemaMode(schema.inputs, info.inputs, state);
    schemaMode(schema.outputs, info.outputs, state);
  }
  entries(connections).forEach(([key, connection]) => {
    const input = schema.inputs[key] ??= {};
    input.connection = connection[0];
  });
};

const schemaMode = (modalSchema, modalInfo, state) => {
  for (const [key, type] of Object.entries(modalInfo || {})) {
    const defaultValue = (type.includes('String') || type.includes('Text')) ? '' : null;
    modalSchema[key] = {
      type, 
      value: state[key] || defaultValue
    };
  }
};

export const deepSchemaForHost = (layerSchema, host) => {
  const schema = {
    inputs: {},
    outputs: {}
  };
  const prefix = host.id.split('$').slice(2).join('.') + '.';
  for (const [propName, value] of Object.entries(layerSchema.inputs)) {
    if (propName.startsWith(prefix)) {
      const shortName = propName.slice(prefix).split('.').slice(1).join('.');
      schema.inputs[shortName] = value;
    }
  }
  for (const [propName, value] of Object.entries(layerSchema.outputs)) {
    if (propName.startsWith(prefix)) {
      const shortName = propName.slice(prefix).split('.').slice(1).join('.');
      schema.outputs[shortName] = value;
    }
  }
  return schema;
};
