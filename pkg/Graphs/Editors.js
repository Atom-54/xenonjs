/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Editors = {
  TabPanels: {
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    state: {
      tabs: ['Graph', 'Editor']
    }
  },
  AtomGraph: {
    type: '$library/Design/Atoms/AtomGraph',
    container: 'TabPanels#Container',
    state: {
      style: {
        order: 1
      }
    }
  },
  CodeEditor: {
    type: '$library/CodeMirror/Atoms/CodeMirror',
    container: 'TabPanels#Container',
    state: {
      style: {
        order: 2
      }
    }
  }
};