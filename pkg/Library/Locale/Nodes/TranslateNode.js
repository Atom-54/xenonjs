/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const TranslateNode = {
  translate: {
    type: '$library/Locale/Atoms/Translate',
    inputs: ['text', 'inLang', 'outLang'],
    outputs: ['translation', 'working']
  }
};
