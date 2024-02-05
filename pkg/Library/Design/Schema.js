import {atomInfo} from '../../Library/Xenon/Library.js';
import * as Controller from '../Framework/Controller.js';
import * as Graph from './Graph.js';

const log = logf('Schema', '#953553');

export const schemaForLayer = (controller, layerId) => {
  // TODO(sjmiles): hacked cache for speed-up; track schema state properly instead 
  const layer = Controller.findLayer(controller, layerId);
  if (Date.now() < (layer.schemaTimeout??0)) {
    return layer.schema;
  }
  layer.schemaTimeout = Date.now() + 500;
  //
  log.debug('schemaForLayer the hard way', layerId);
  // if (layer.schema && Math.random() > 0.30) {
  //   return layer.schema;
  // }
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
  captureConnectionValues(layer.graph, schema.inputs);
  // cache
  layer.schema = schema;
  // here is schema
  return schema;
};

const captureConnectionValues = (graph, inputs) => {
  // const prefixId = layer.id + '$';
  // const layerBindings = Object.entries(bindings || {})
  //   .filter(([id]) => id.startsWith(prefixId))
  //   .map(([id, bound]) => ({id, bound}))
  //   ;
  // Object.entries(inputs).forEach(([key, info]) => {
  //   const localName = key.replaceAll('.', '$');
  //   //const _key = key.split('.');
  //   //const atomName = _key[0];
  //   layerBindings.forEach(({id, bound}) => {
  //     const inbound = bound.find(v => v.endsWith(localName));
  //     if (inbound) {
  //       info.connection = id.split('$').slice(-2).join('.');
  //     } 
  //   });
  // });
  Object.entries(inputs).forEach(([key, info]) => {
    const _key = key.split('.');
    const atomName = _key.shift();
    const atomInfo = graph[atomName];
    if (atomInfo) {
      const {connections} = atomInfo;
      if (connections) {
        const propName = _key.join('$');
        const connection = connections[propName];
        if (connection) {
          info.connection = connection[0];
        }
      }
    }
  // } else {
  //   const propName = _key.pop();
  //   if (!['style', 'name'].includes(propName)) {
  //     log.warn(`[${key}] is connected to graph [${id}] which does not exist`);
  //   }
  // }
  });
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
  // host has these connections
  let connections = host.layer.graph[host.name]?.connections;
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
  if (layerSchema) {
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
  }
  return schema;
};
