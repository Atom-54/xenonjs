export const atom = log => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state) {
  state.defaultResponse = {
    status: "error",
    resultMsg: "no handler"
  };
},
shouldUpdate({event}) {
  return event;
},
async update({event, readonly}, {defaultResponse}, {service}) {
  log(event);
  if (readonly) {
    return;
  }
  if (!event.complete) {
    event.complete = true;
    await this.updateEvent(event, defaultResponse, service);
  }
  return {event};
},
async updateEvent(event, defaultResponse, service) {
  const handled = await this.handleEvent(event, service);
  if (!handled) {
    assign(event, defaultResponse);
  }
},
async handleEvent({action}, service) {
  if (action.actions?.length > 0) {
    for (let i=0, actionI; (actionI = action.actions[i]); i++) {
      await this.handleAction({...action, ...actionI}, service);
    }
  } else {
    return this.handleAction(action, service);
  }
},
async handleAction(action, service) {
  const fn = `${action.action}_action`;
  if (this[fn]) {
    await this[fn](action, service);
    return true;
  }
},
async service_action({args}, service) {
  //log('service_action:', args);
  await service(args);
},
async toggle_action({stateKey}, service) {
  let value = await service({kind: 'SystemService', msg: 'GetStateValue', data: {stateKey}});
  //log('toggle_action::StateService::GetStateValue', stateKey, value);
  value = !value;
  //log('toggle_action::StateService::SetStateValue', stateKey, value);
  return service({kind: 'SystemService', msg: 'SetStateValue', data: {stateKey, value}})
},
async set_action({stateKey, value}, service) {
  //log('set_action::StateService::SetStateValue', stateKey, value);
  return service({kind: 'SystemService', msg: 'SetStateValue', data: {stateKey, value}})
}
});
    
