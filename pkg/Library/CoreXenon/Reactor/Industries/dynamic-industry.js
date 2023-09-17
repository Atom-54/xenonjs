/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Basic from './basic-reactor.js';
import {Paths} from '../atomic.js';

const log = logf('Industry: Dynamic', 'RebeccaPurple');
//logf.flags.Industry = true;

export const industrialize = atoms => {
  Basic.industrialize(atoms, log);
};

export const emit = async (Host, name, kind) => {
  if (!kind) {
    log.error('emit: required "kind" argument is null');
    return;
  }
  let factory = Basic.getFactory(kind);
  if (!factory) {
    log('creating factory for', [kind]);
    factory = await load(kind);
    Basic.setFactory(kind, factory);
  }
  if (factory) {
    log('emitting', [kind]);
    const host = new Host(name);
    return Basic.enhosten(host, factory);
  }
};

const load = async kind => {
  const paths = {
    Library: '../..',
    AIClock$ai: 'OpenAI/Atoms/OpenAIText', 
    AIClock$clock: 'AI/Atoms/AIClock'
  };
  const path = 
    paths[kind] 
    ? `${paths.Library}/${paths[kind]}`
    : Paths.resolve(kind)
    ;
  const {atom} = await import(`${path}.js`);
  const atomLog = logf(`Atom: ${kind.split('/').pop()}`, 
    // hsl(277 // purply
    // hsl(97 // neon green
    // hsl(57 // bright yellow
    `hsl(${Math.random()<.5 ? 97 : 57}, ${Math.floor(Math.random()*20)+80}%, ${Math.floor(Math.random()*20)+40}%)`, '#111');
  try {
    return Basic.miniReactor(atom, atomLog);
  } catch(x) {
    log.groupCollapsed('Reactor failed for', kind);
    log.warn(x);
    log.groupEnd();
  }
};
