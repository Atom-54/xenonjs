/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
({

async initialize() {
  // important so other objects know when new classifier comes online
  return {
    classifierResults: null,
    status: 'initializing',
    modelKind: 'mobilenet'
  };
},

async update({imageRef, model, modelKind}, state, {service, output}) {
  // we always update once when we output, block the cycle here
  if (this.hasChanges({imageRef, model}, state)) {
    assign(state, {imageRef, model});
    //log('working on', state);
    output({classifierResults: null, status: 'working'});
    return await this.perceive({imageRef, model}, service);
  }
},

hasChanges({imageRef, model}, state) {
  return (state.imageRef?.json !== imageRef?.json) || (state.model?.url !== model?.url);
},

async perceive({imageRef, model}, service) {
  const args = {
    kind: 'TensorFlowService',
    msg: 'toolClassify',
    data: {
      imageRef,
      modelUrl: model?.url,
      modelKind: 'mobilenet'
    }
  };
  const classifierResults = await service(args);
  return {
    status: classifierResults ? 'complete' : 'failed',
    classifierResults
  };
}

});
