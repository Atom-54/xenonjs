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
    type: `$library/UX/Nodes/UXToolbarNode`,
    icon: '$library/Assets/nodes/uxtoolbar.png',
    ligature: 'toolbar'
  },
  UXActionSet: {
    category,
    description: 'Collects UX action definitions for buttons and controls',
    type: `$library/UX/Nodes/UXActionSetNode`,
    ligature: 'bolt'
  },
  UXSelectionList: {
    category,
    description: 'Renders a list and allows user to select items',
    type: `$library/UX/Nodes/UXSelectionListNode`,
    ligature: 'fact_check'
  },
  UXSnackBar: {
    category,
    description: 'Renders a message in a temporary popup',
    types: {
      UXSnackBar$open: 'Nonce:String',
      UXSnackBar$icon: 'String',
      UXSnackBar$message: 'String',
      UXSnackBar$duration: 'Number'
    },
    type: `$library/UX/Nodes/UXSnackBarNode`,
    ligature: 'call_to_action'
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
    type: `$library/UX/Nodes/ProgressBarNode`,
    ligature: 'sliders'
  },
  WebPage: {
    category,
    description: 'Displays a web page',
    types: {
      WebPage$html: 'MultilineString',
      WebPage$src: 'String'
    },
    type: `$library/UX/Nodes/WebPageNode`,
    ligature: 'web'
  }
};