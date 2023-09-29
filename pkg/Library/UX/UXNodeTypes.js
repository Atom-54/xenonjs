/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'UX';

export const UXNodeTypes = {
  UXToolbar: {
    category,
    description: 'Displays a UX toolbar with text, icons and button',
    types: {
      UXActionExecutor$readonly: 'Boolean'
    },
    type: `$library/UX/Nodes/UXToolbarNode`
  },
  UXActionSet: {
    category,
    description: 'Collects UX action definitions for buttons and controls',
    type: `$library/UX/Nodes/UXActionSetNode`
  },
  UXSelectionList: {
    category,
    description: 'Renders a list and allows user to select items',
    type: `$library/UX/Nodes/UXSelectionListNode`,
  },
  UXSnackBar: {
    category,
    description: 'Renders a message in a temporary popup',
    types: {
      UXSnackBar$open: 'Nonce',
      UXSnackBar$icon: 'String',
      UXSnackBar$message: 'String',
      UXSnackBar$duration: 'Number'
    },
    type: `$library/UX/Nodes/UXSnackBarNode`
  },
  ProgressBar: {
    category,
    description: 'Displays progress bar',
    types: {
      bar$percentage: 'Number',
      bar$total: 'Number',
      bar$count: 'Number',
      bar$height: 'Number',
      bar$inProgress: 'Boolean',
      bar$interval: 'Number',
    },
    type: `$library/UX/Nodes/ProgressBarNode`
  },
  WebPage: {
    category,
    description: 'Displays a web page',
    types: {
      WebPage$html: 'MultilineString',
      WebPage$src: 'String'
    },
    type: `$library/UX/Nodes/WebPageNode`
  }
};