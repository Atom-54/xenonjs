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
  UXActionSet: {
    category,
    description: 'Collects UX action definitions for buttons and controls',
    type: `$library/UX/Nodes/UXActionSetNode`
  },
  UXSelectionList: {
    category,
    description: 'Render a list, allow user to select items',
    type: `$library/UX/Nodes/UXSelectionListNode`
  }
};