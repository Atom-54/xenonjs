/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'CodeMirror';

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