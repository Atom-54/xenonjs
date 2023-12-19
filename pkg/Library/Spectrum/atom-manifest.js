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
    type: '$library/Spectrum/Atoms/SpectrumButton',
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
  SpectrumActionMenu: {
    categories: [category, 'Common'],
    displayName: 'Spectrum Action Menu',
    ligature: 'menu',
    type: '$library/Spectrum/Atoms/SpectrumActionMenu',
    inputs: {
      items: 'Json',
      selected: 'String',
      label: 'String'
    },
    outputs: {
      value: 'String'
    },
    state: {
      label: 'Actions',
      style: {
        flex: '0 0 auto',
        // padding: '0.5em'
      }
    }
  },
  SpectrumCard: {
    categories: [category],
    displayName: 'Spectrum Card',
    ligature: 'problem',
    type: '$library/Spectrum/Atoms/SpectrumCard',
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
    type: '$library/Spectrum/Atoms/SpectrumTabs',
    inputs: {
      tabs: 'Pojo',
    },
    outputs: {
      tab: 'String'
    },
    state: {
      tabs: ['Tab']
    }
  },
  SpectrumTabPanels: {
    categories: [category, 'Common'],
    displayName: 'Spectrum Tab Panels',
    ligature: 'tabs',
    type: '$library/Spectrum/Atoms/SpectrumTabPanels',
    inputs: {
      tabs: 'Pojo',
      closeable: 'Boolean'
    },
    outputs: {
      tabs: 'Pojo',
      closed: 'String'
    },
    state: {
      tabs: ['Tab']
    }
  }
};