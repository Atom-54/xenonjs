/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const Spectrum = {
  SpectrumButton: {
    displayName: 'Spectrum Button',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumButton',
    inputs: {
      label: 'String'
    },
    ligature: 'buttons_alt'
  },
  SpectrumCard: {
    displayName: 'Spectrum Card',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumCard',
    inputs: {
      asset: 'AssetEnum', 
      heading: 'String',
      subheading: 'String', 
      horizontal: 'Boolean'
    },
    types: {
      AssetEnum: ['file', 'folder']
    },
    ligature: 'problem'
  },
  SpectrumTabs: {
    displayName: 'Spectrum Tabs',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    ligature: 'tab'
  },
  SpectrumTabPanels: {
    displayName: 'Spectrum Tab Panels',
    type: '$anewLibrary/Spectrum/Atoms/SpectrumTabPanels',
    ligature: 'tabs'
  }
};