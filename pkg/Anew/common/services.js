/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import {DesignService} from '../../AnewLibrary/Design/Services/DesignService.js';
import {LayerService} from '../../AnewLibrary/Graph/Services/LayerService.js';

const log = globalThis.logf('services', '#555555', 'orange');

const services = {LayerService, DesignService};
export {LayerService, DesignService};

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
