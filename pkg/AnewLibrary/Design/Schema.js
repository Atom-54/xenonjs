import {atomInfo} from '../../AnewLibrary/manifest.js';
export {atomInfo};

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
    const key = `${idPrefix}$${prop}`.replace(/\$/g, '.');
    modalSchema[key] = value;
  }
};

export const schemaForHost = host => {
  let graph = host.layer.graph;
  const hostState = graph[host.name].state;
  const state = Object.assign({}, hostState || {});
  while (graph) {
    graph = null;
    const parentHost = host.layer.host;
    const qualifiedHostParts = parentHost.id.split('$');
    if (qualifiedHostParts.length > 2) {
      const parentLayer = parentHost.layer;
      const qualifiedHostId = qualifiedHostParts.pop();
      const graphState = parentLayer.graph[qualifiedHostId].state;
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
  const schema = {
    inputs: {
      name: {type: 'String', value: host.name},
      style: {type: 'CssStyle', value: state.style || {}}
    },
    outputs: {
    }
  };
  schemaFromHost(schema, host, state);
  return schema;
};

const schemaFromHost = (schema, host, state) => {
  const connections = host.layer.graph[host.name].connections;
  const kind = host.type.split('/').pop();
  const info = atomInfo[kind];
  if (info) {
    schemaMode(schema.inputs, info.inputs, state, connections);
    schemaMode(schema.outputs, info.outputs, state, connections);
  }
};

const schemaMode = (modalSchema, modalInfo, state, connections) => {
  for (const [key, type] of Object.entries(modalInfo || {})) {
    const defaultValue = (type.includes('String') || type.includes('Text')) ? '' : null;
    modalSchema[key] = {
      type, 
      value: state[key] || defaultValue,
      connection: connections?.[key]?.[0]
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
