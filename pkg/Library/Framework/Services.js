/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import {SystemService} from './Services/SystemService.js';

const log = globalThis.logf('services', '#555555', 'orange');

export const services = {SystemService};

export const addServices = _services => Object.assign(services, _services);

export const onservice = async (host, {kind, msg, data, resolve}) => {
  let value;
  const service = services[kind];
  if (service) {
    const task = service[msg];
    if (task) {
      value = await task(host, data);
    } else {
      log.warn(`onservice: no method for [ ${kind}::${msg} ] from`, host.id);
    }
  } else {
    log.warn(`onservice: no service for [ ${kind}::${msg} ] from`, host.id);
  }
  resolve(value);
};
