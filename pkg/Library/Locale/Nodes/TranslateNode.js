/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const TranslateNode = {
  translate: {
    type: '$library/Locale/Atoms/Translate',
    inputs: ['text', 'inLang', 'outLang', 'enabled', 'trigger'],
    outputs: ['translation', 'working']
  }
};
