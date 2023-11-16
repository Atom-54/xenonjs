/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'UX';

export const UX = {
  UXToolbar: {
    categories: [category],
    displayName: 'UX Toolbar',
    description: 'Displays a UX toolbar with text, icons and button',
    type: '$anewLibrary/UX/Atoms/UXToolbar',
    ligature: 'toolbar',
    inputs: {
      actions: '[Pojo]',
      controls: '[String]'
    },
    outputs: {
      event: 'Event'
    }
  },
  UXActionExecutor: {
    categories: [category],
    displayName: 'UX Action Executor',
    description: 'Handler UX Toolbar events',
    ligature: 'arrow_split',
    type: '$anewLibrary/UX/Atoms/UXActionExecutor',
    inputs: {
      event: 'Event',
      readonly: 'Boolean'
    }
  },
  UXActionSet: {
    categories: [category],
    displayName: 'UX Action Set',
    description: 'Collects UX action definitions for buttons and controls',
    type: '$anewLibrary/UX/Atoms/UXActionSet',
    ligature: 'bolt',
    inputs: {
      actions: '[Pojo]'
    },
    outputs: {
      actions: '[Pojo]'
    }
  },
  UXSelectionList: {
    categories: [category],
    displayName: 'UX Selection List',
    description: 'Renders a list and allows user to select items',
    type: '$anewLibrary/UX/Atoms/UXSelectionList',
    ligature: 'fact_check',
    inputs: {
      list: '[Pojo]',
      selection: 'Pojo'
    },
    outputs: {
      selection: 'Pojo'
    }
  },
  UXSnackBar: {
    categories: [category],
    displayName: 'UX Snack Bar',
    description: 'Renders a message in a temporary popup',
    type: '$anewLibrary/UX/Atoms/UXSnackBar',
    ligature: 'call_to_action',
    inputs: {
      open: 'Nonce:String',
      icon: 'String',
      message: 'String',
      duration: 'Number'
    }
  },
  ProgressBar: {
    categories: [category],
    displayName: 'Progress Bar',
    description: 'Displays progress bar',
    type: '$anewLibrary/UX/Atoms/ProgressBar',
    ligature: 'sliders',
    inputs: {
      percentage: 'Number',
      total: 'Number',
      count: 'Number',
      height: 'Number',
      inProgress: 'Boolean',
      interval: 'Number',
    },
    state: {
      height: 30
    }
  },
  WebPage: {
    categories: [category],
    displayName: 'Web Page',
    description: 'Displays a web page',
    type: '$anewLibrary/UX/Atoms/WebPage',
    ligature: 'web',
    inputs: {
      html: 'MultilineText',
      src: 'String'
    }
  }
};
