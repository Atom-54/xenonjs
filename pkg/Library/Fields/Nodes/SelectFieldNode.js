/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
export const SelectFieldNode = {
  field: {
    type: '$library/Fields/Atoms/SelectField',
    inputs: ['label', 'options', 'value', 'multiple'],
    outputs: ['value']
  }
};