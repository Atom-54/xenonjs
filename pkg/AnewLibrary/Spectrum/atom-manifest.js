/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Spectrum Components';

export const Spectrum = {
  SpectrumButton: {
    categories: [category, 'Common', 'Fields'],
    displayName: 'Spectrum Button',
    ligature: 'buttons_alt',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumButton',
    inputs: {
      value: 'Pojo',
      label: 'String'
    },
    outputs: {
      value: 'Nonce'
    },
    state: {
      label: 'Button',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  SpectrumCard: {
    categories: [category],
    displayName: 'Spectrum Card',
    ligature: 'problem',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumCard',
    inputs: {
      asset: 'AssetEnum', 
      heading: 'String',
      subheading: 'String', 
      horizontal: 'Boolean'
    },
    state: {
      heading: 'Card',
      subheading: 'A blank card.',
      style: {
        flex: '0 0 auto'
      }
    },
    types: {
      AssetEnum: ['file', 'folder']
    }
  },
  SpectrumTabs: {
    categories: [category],
    displayName: 'Spectrum Tabs',
    ligature: 'tab',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabs',
    inputs: {
      tabs: '[String]',
    },
    state: {
      tabs: 'Tab'
    }
  },
  SpectrumTabPanels: {
    categories: [category, 'Common'],
    displayName: 'Spectrum Tab Panels',
    ligature: 'tabs',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    inputs: {
      tabs: '[String]',
    },
    outputs: {
      tabs: '[String]'
    },
    state: {
      tabs: ['Tab']
    }
  }
};