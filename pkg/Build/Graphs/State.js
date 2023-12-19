/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const State = {
  StateService: {
    type: '$anewLibrary/Data/Atoms/ServiceAccess',
    state: {
      service: 'LayerService',
      task: 'ObserveState',
      data: 'State'
    }
  },
  State: {
    type: '$anewLibrary/Data/Atoms/DataExplorer',
    state: {
      style: {
        fontSize: '80%',
        overflow: 'auto'
      },
      expandLevel: 2
    }
  }
};