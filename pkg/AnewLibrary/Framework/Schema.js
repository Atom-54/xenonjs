import {atomInfo} from '../../Anew/common/atomInfo.js';

const log = logf('Schema', '#953553');

export const schemaForLayer = (controller, layerId) => {
  const schema = {
    inputs: {},
    outputs: {}
  };
  for (const host of Object.values(controller.atoms)) {
    if (host.id.startsWith(layerId + '$')) {
      const hostSchema = schemaForHost(host);
      rekeySchemaMode(host.id, hostSchema.inputs, schema.inputs);
      rekeySchemaMode(host.id, hostSchema.outputs, schema.outputs);
    }
  }
  return schema;
};

const rekeySchemaMode = (hostId, modalHostSchema, modalSchema) => {
  for (const [prop, value] of entries(modalHostSchema)) {
    const key = `${hostId}$${prop}`.replace(/\$/g, '.');
    modalSchema[key] = value;
  }
};

export const schemaForController = controller => {
  const schema = {
    inputs: {},
    outputs: {}
  };  for (const host of Object.values(controller.atoms)) {
    if (host.id.startsWith('build$Design')) {
      const hostSchema = schemaForHost(host);
      rekeySchemaMode(host.id, hostSchema.inputs, schema.inputs);
      rekeySchemaMode(host.id, hostSchema.outputs, schema.outputs);
    }
  }
  return schema;
};

export const schemaForHost = host => {
  const schema = {
    inputs: {
      name: {type: 'String', value: host.name},
      style: {type: 'CssStyle|String', value: {}}
    },
    outputs: {
      // name: {type: 'String', value: host.name},
      // style: {type: 'CssStyle|String', value: {}}
    }
  };
  schemaFromHost(schema, host);
  return schema;
};

const schemaFromHost = (schema, host) => {
  const kind = host.type.split('/').pop();
  const info = atomInfo[kind];
  if (info) {
    schemaMode(schema.inputs, info.inputs);
    schemaMode(schema.outputs, info.outputs);
  }
};

const schemaMode = (modalSchema, modalInfo) => {
  for (const [key, type] of Object.entries(modalInfo || {})) {
    modalSchema[key] = {
      type, 
      value: null
    };
  }
};