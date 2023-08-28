/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 * @module basic-reactor
 */
import {Atom, Paths} from '../atomic-core.js';

const kinds = {};
const sanitize = kind => kind.replace(/\//g, '$');

/** */
export const getFactory = kind => kinds[sanitize(kind)];
/** */
export const setFactory = (kind, factory) => kinds[sanitize(kind)] = factory;

/** */
export const industrialize = async (atoms, log) => {
  Object.entries(atoms??0).forEach(
    ([name, proto]) => kinds[name] = miniReactor(proto, log)
  );
};

/** */
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

/** */
export const enhosten = (host, factory) => {
  const atom = factory(host);
  host.installAtom(atom);
  return host;
};

