/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Weightless Components';

export const Weightless = {
  WeightlessTabPanels: {
    categories: [category, 'Common', 'Layout'],
    displayName: 'Weightless Tab Panels',
    ligature: 'tabs',
    type: '$library/Weightless/Atoms/WeightlessTabPanels',
    inputs: {
      tabs: 'Pojo'
    },
    state: {
      tabs: [
        'Panel One',
        'Panel Two'
      ]
    }
  },
  WeightlessAccordion: {
    categories: [category, 'Layout'],
    displayName: 'Weightless Accordion',
    description: 'Set of panels in an accordion',
    ligature: 'unfold_less',
    type: '$library/Weightless/Atoms/WeightlessAccordion',
    inputs: {
      sections: 'Pojo'
    },
    state: {
      sections: [
        'Panel A',
        'Panel B'
      ]
    }
  }
};