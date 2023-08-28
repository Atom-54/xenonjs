/**
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
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
  pages: {
    kind: "$library/Layout/Atoms/TabPages",
    inputs: ['tabs'],
  //   slots: {
  //     PagesContainer: {}
  //   }
  }
};