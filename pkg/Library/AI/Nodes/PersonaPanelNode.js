/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const PersonaPanelNode = {
  PersonaPanel: {
    type: '$library/AI/Atoms/PersonaPanel',
    inputs: ['name', 'avatar', 'profile'],
    slots: 'Container'
  },
  state: {
    PersonaPanel$avatar: '$library/AI/Assets/delmer.png'
  }
};

