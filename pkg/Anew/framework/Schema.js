import {atomInfo} from '../common/atomInfo.js';

const log = logf('Schema', '#953553');

export const schemaForLayers = layers => {
  const schema = {};
  for (const layer of Object.values(layers)) {
    Object.assign(schema, schemaForLayer(layer));
  }
  return schema;
};

export const schemaForLayer = layer => {
  //log.debug(layer);
  const schema = {};
  for (const host of Object.values(layer.atoms)) {
    const hostSchema = schemaForHost(host);
    for (const [id, value] of entries(hostSchema)) {
      schema[`${layer.name}$${host.name}$${id}`] = value;
    }
  }
  const subSchema = schemaForLayers(layer.layers);
  return {...schema, ...subSchema};
};

/* */

export const schemaForHost = host => {
  const schema = {};
  schemaFromHost(schema, host);
  //log.debug(schema);
  return schema;
};

const schemaFromHost = (schema, host) => {
  const kind = host.type.split('/').pop();
  const [layer, atomName] = host.id.split('$');
  //const [layer, sublayer] = _layer.split('-');
  const info = atomInfo[kind];
  if (info) {
    for (const [key, type] of Object.entries(info.inputs)) {
      //const schemaKey = `${sublayer ? `${sublayer}.` : ''}${key}`;
      //const schemaKey = `${atomName}$${key}`;
      const schemaKey = key;
      schema[schemaKey] = {
        type, 
        value: null
      };
    }
  }
  schema.name = {type: 'String', value: host.name};
};