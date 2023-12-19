import {Atom} from '../Core/Atom.js';
import {Host} from '../Core/Host.js';

let switchboard, log, resolve;

const html =(strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();

export const initialize = (_switchboard, _log, _resolve) => {
  switchboard = _switchboard;
  log = _log || (i => i);
  resolve = typeof _resolve === 'function' ? resolve : (i => i);
};

const createHostedAtom = (name, proto, etc) => {
  const atom =  new Atom(proto, {});
  return new Host(atom, {name, switchboard, ...etc});
};

const protos = {};

const loadAtom = async path => {
  if (!protos[path]) {
    const {atom: factory} = await import(path);
    protos[path] = factory(log, html, resolve);
  }
  return protos[path];
};

export const createAtom = async (path, etc)  => {
  const proto = protos[path] || await loadAtom(path);
  return createHostedAtom(path, proto, etc);
};