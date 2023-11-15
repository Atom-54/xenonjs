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
      const prefix = host.id.slice(layerId.length + 1);
      const hostSchema = schemaForHost(host);
      rekeySchemaMode(prefix, hostSchema.inputs, schema.inputs);
      rekeySchemaMode(prefix, hostSchema.outputs, schema.outputs);
    }
  }
  return schema;
};

const rekeySchemaMode = (idPrefix, modalHostSchema, modalSchema) => {
  for (const [prop, value] of entries(modalHostSchema)) {
    const key = `${idPrefix}$${prop}`.replace(/\$/g, '.');
    modalSchema[key] = value;
  }
};

export const schemaForHost = host => {
  const graph = host.layer.graph;
  const state = graph[host.name].state;
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
  const kind = host.type.split('/').pop();
  const info = atomInfo[kind];
  if (info) {
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