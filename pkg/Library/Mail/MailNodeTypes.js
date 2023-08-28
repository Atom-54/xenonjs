/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Mail';

export const MailNodeTypes = {
  IMap: {
    category,
    description: 'Access iMap (email) accounts',
    types: {
      IMap$host: 'String',
      IMap$user: 'String',
      IMap$password: 'Password',
      IMap$messages: '[Message]'
    },
    type: '$library/Mail/Nodes/IMapNode'
  }
};
