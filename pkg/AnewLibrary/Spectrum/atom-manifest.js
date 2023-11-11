/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const Spectrum = {
  SpectrumButton: {
    displayName: 'Spectrum Button',
    ligature: 'buttons_alt',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumButton',
    inputs: {
      label: 'String'
    },
    state: {
      label: 'Button',
      style: {
        flex: '0 0 auto'
      }
    }
  },
  SpectrumCard: {
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
      subheading: 'A blank card.'
    },
    types: {
      AssetEnum: ['file', 'folder']
    }
  },
  SpectrumTabs: {
    displayName: 'Spectrum Tabs',
    ligature: 'tab',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    state: {
      tabs: 'Tab'
    }
  },
  SpectrumTabPanels: {
    displayName: 'Spectrum Tab Panels',
    ligature: 'tabs',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    state: {
      tabs: 'Tab'
    }
  }
};