import {atomInfo} from '../common/atomInfo.js';

const log = logf('Schema', '#953553');

export const schemaForController = controller => {
  const schema = {};
  for (const host of Object.values(controller.atoms)) {
    const hostSchema = schemaForHost(host);
    for (const [prop, value] of entries(hostSchema)) {
      const key = `${host.id}$${prop}`.replace(/\$/g, '.');
      schema[key] = value;
    }
  }
  return schema;
};

export const schemaForHost = host => {
  const schema = {};
  schemaFromHost(schema, host);
  return schema;
};

const schemaFromHost = (schema, host) => {
  const kind = host.type.split('/').pop();
  const info = atomInfo[kind];
  if (info) {
    for (const [key, type] of Object.entries(info.inputs)) {
      const schemaKey = key;
      schema[schemaKey] = {
        type, 
        value: null
      };
    }
  }
  // add default schema
  schema.name = {type: 'String', value: host.name};
  schema.style = {type: 'String', value: {}};
};