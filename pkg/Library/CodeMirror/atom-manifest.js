/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'UX';

export const CodeMirror = {
  CodeMirror: {
    categories: [category],
    description: 'Displays and edits source code',
    ligature: 'format_ink_highlighter',
    inputs: {
      text: 'Text',
      altSource: 'Text'
    },  
    outputs: {
      text: 'Text'
    },
    type: `$library/CodeMirror/Atoms/CodeMirror`
  }
};