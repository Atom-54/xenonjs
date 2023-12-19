/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Atom} from '../Atomic/js/core/Atom.js';
import {Paths} from '../atomic.js';

const kinds = {};

export const getFactory = kind => kinds[sanitize(kind)];
export const setFactory = (kind, factory) => kinds[sanitize(kind)] = factory;

const sanitize = kind => kind.replace(/\//g, '$');

export const industrialize = async (atoms, log) => {
  Object.entries(atoms??0).forEach(
    ([name, proto]) => kinds[name] = miniReactor(proto, log)
  );
};

export const miniReactor = (protoFactory, log) => {
  const atomProto = protoFactory(log, Paths.resolve.bind(Paths));
  const atomFactory = host => {
    const pipe = {
      log,
      output: host?.output?.bind(host),
      service: host?.service?.bind(host)
    };
    return new Atom(atomProto, pipe, /*beStateful=*/true);
  };
  return atomFactory;
};

export const enhosten = (host, factory) => {
  const atom = factory(host);
  host.installAtom(atom);
  return host;
};

