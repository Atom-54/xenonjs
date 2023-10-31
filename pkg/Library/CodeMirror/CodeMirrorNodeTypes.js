/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'UX';

export const CodeMirrorNodeTypes = {
  CodeMirror: {
    category,
    description: 'Displays and edits source code',
    types: {
      text$text: 'MultilineText'
    },  
    type: `$library/CodeMirror/Nodes/CodeMirrorNode`
  }
};