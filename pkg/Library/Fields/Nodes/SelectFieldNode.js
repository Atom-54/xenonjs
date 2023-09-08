/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const SelectFieldNode = {
  field: {
    type: '$library/Fields/Atoms/SelectField',
    inputs: ['form', 'label', 'options', 'value', 'multiple'],
    outputs: ['value']
  }
};