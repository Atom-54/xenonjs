export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  initialize(inputs, state) {
    state.defaultData = {
      title: 'User settings',
      readonly: false,
      props: [{
        name: 'Custom Libraries',
        store: {type: 'Pojo'},
        visible: true
      },
      {
        name: 'Storage',
        store: {
          type: 'String',
          values:['Local', 'Firebase']
        },
        value: 'Local',
        disabled: true,
        visible: true
      },
      {
        name: 'OpenAI API key',
        store: {type: 'String'},
        value: 'coming soon...',
        disabled: true,
        visible: true
      }, {
        name: 'HuggingFace API key',
        store: {type: 'String'},
        value: 'coming soon...',
        disabled: true,
        visible: true
      }]
    };
  },
  
  async update({user, data, userSettings}, state, {isDirty, output}) {
    if (data && isDirty('data')) {
      const value = data.props?.find(p => p.name === 'Custom Libraries')?.value;
      if (state.customLibraries !== value) {
        state.customLibraries = value;
        output({
          userSettings: {
            customLibraries: state.customLibraries
          }
        });
      }
    }
    if (isDirty('user') || isDirty('userSettings')) {
      if (user) {
        state.defaultData.props.find(p => p.name === 'Custom Libraries').value = userSettings?.customLibraries;
        return {
          data: state.defaultData
        };
      }
      return {
        data: {title: '', readonly: true}  
      };
    }
  }
  });