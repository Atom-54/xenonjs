/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Editors = {
  TabPanels: {
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    state: {
      tabs: ['Graph', 'Editor']
    }
  },
  AtomGraph: {
    type: '$anewLibrary/Design/Atoms/AtomGraph',
    container: 'TabPanels#Container',
    state: {
      style: {
        order: 1
      }
    }
  },
  CodeEditor: {
    type: '$anewLibrary/CodeMirror/Atoms/CodeMirror',
    container: 'TabPanels#Container',
    state: {
      style: {
        order: 2
      }
    }
  }
};