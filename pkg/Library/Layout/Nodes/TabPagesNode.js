/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const TabPagesNode = {
  // $meta: {
  //   id: 'MaterialTabPagesNode',
  //   displayName: 'Material TabPages',
  //   category: 'Panels'
  // },
  // $stores: {
  //   tabs: {
  //     $type: 'String'
  //   }
  // },
  TabPages: {
    type: "$library/Layout/Atoms/TabPages",
    inputs: ['tabs'],
  //   slots: {
  //     PagesContainer: {}
  //   }
  }
};