import {atomInfo} from '../../AnewLibrary/Xenon/Library.js';
import * as Controller from '../Framework/Controller.js';
import * as Graph from './Graph.js';

const log = logf('Schema', '#953553');

export const schemaForLayer = (controller, layerId) => {
  // map input/output property names to meta data including
  // value, connection, and type
  const schema = {
    inputs: {},
    outputs: {}
  };
  // capture io, type, and value
  for (const host of Object.values(controller.atoms)) {
    if (host.id.startsWith(layerId + '$')) {
      // fetch raw schema for host
      const hostSchema = schemaForHost(host);
      // outer scope id for removal
      const localId = host.id.slice(layerId.length + 1);
      // adjust schema names for scope and dot format 
      rekeySchemaMode(localId, hostSchema.inputs, schema.inputs);
      rekeySchemaMode(localId, hostSchema.outputs, schema.outputs);
    }
  }
  // capture connection settings
  captureConnectionValues(controller, layerId, controller.connections.inputs, schema.inputs);
  // here is schema
  return schema;
};

const captureConnectionValues = (controller, layerId, connections, inputs) => {
  if (layerId) {
    const layer = Controller.findLayer(controller, layerId);
    if (layer) {
      //log.debug(layer.graph, inputs);
      Object.entries(inputs).forEach(([key, info]) => {
        const [id, ...prop] = key.split('.');
        const atomInfo = layer.graph[id];
        if (!atomInfo) {
          log.warn(`[${key}] is connected to graph [${id}] which does not exist`);
        } else {
          const {connections} = atomInfo;
          if (connections) {
            const propName = prop.join('$');
            const connection = connections[propName];
            if (connection) {
              info.connection = connection[0];
            }
          }
        }
      });
    }
  }
};

const rekeySchemaMode = (localId, modalHostSchema, modalSchema) => {
  for (const [prop, value] of Object.entries(modalHostSchema)) {
    const ids = [
      ...(localId ? localId.split('$') : []), 
      ...prop.split('$')
    ];
    const key = ids.join('.');
    if (ids[ids.length-1] !== 'name' || ids.length < 3) {
      modalSchema[key] = value;
    }
  }
};

export const schemaForHost = host => {
  // static state provided by atom
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
  // `info` is atom meta data
  // inputs: maps prop-name to type
  // outputs: maps prop-name to type
  // connections: maps prop-name to connection value
  if (info) {
    // all declared IO becomes schema IO
    // state values are captured into schema
    schemaMode(schema.inputs, info.inputs, state);
    schemaMode(schema.outputs, info.outputs, state);
  }
  // for all provided connections
  // entries(connections).forEach(([key, connection]) => {
  //   // require input schema for the left-hand-side; the data receiver
  //   const input = schema.inputs[key] ??= {};
  //   // record this connection value in this input schema
  //   input.connection = connection[0];
  // });
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

export const deepSchemaForHost = (layerSchema, hostId) => {
  const schema = {
    inputs: {},
    outputs: {}
  };
  const prefix = hostId.split('$').slice(3).join('.') + '.';
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
