/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const CollapsePanelNode = {
  panel: {
    type: '$library/Layout/Atoms/CollapsePanel',
    inputs: ['collapsed', 'expanded', 'side', /*'style',*/ 'size', 'nubCollapsed', 'nubExpanded'],
    outputs: ['collapsed', 'expanded']
  }
};
