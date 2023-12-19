/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const State = {
  StateService: {
    type: '$library/Data/Atoms/ServiceAccess',
    state: {
      service: 'LayerService',
      task: 'ObserveState',
      data: 'State'
    }
  },
  State: {
    type: '$library/Data/Atoms/DataExplorer',
    state: {
      style: {
        fontSize: '80%',
        overflow: 'auto'
      },
      expandLevel: 0
    }
  }
};