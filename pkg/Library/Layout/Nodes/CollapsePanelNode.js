/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const CollapsePanelNode = {
  panel: {
    type: '$library/Layout/Atoms/CollapsePanel',
    inputs: ['collapsed', 'expanded', 'side', /*'style',*/ 'size', 'nubCollapsed', 'nubExpanded'],
    outputs: ['collapsed', 'expanded']
  }
};
