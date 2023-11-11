/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
const log = globalThis.logf('services', '#555555', 'orange');

export const services = {};

export const addServices = _services => Object.assign(services, _services);

export const onservice = async (host, request) => {
  const {kind, msg, data, resolve} = request;
  const service = services[kind];
  if (service) {
    const task = service[msg];
    if (task) {
      const value = await task(host, data);
      resolve(value);
    } else {
      log.warn(`onservice: no method for [ ${request.kind}::${request.msg} ] from`, host.id);
    }
  } else {
    log.warn(`onservice: no service for [ ${request.kind}::${request.msg} ] from`, host.id);
  }
};
