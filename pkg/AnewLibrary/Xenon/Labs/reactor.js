import {Atom} from '../Core/Atom.js';
import {Host} from '../Core/Host.js';

//export const log = console.log.bind(console);

let log, resolve;

const html =(strings, ...values) => `${strings[0]}${values.map((v, i) => `${v}${strings[i + 1]}`).join('')}`.trim();

export const initialize = (_log, _resolve) => {
  log = _log;
  resolve = typeof _resolve === 'function' ? resolve : i => i;
};

const switchboard = {
  output: output => log('[output]', output),
  render: packet => log('[render]', packet),
  service: request => log('[service]', request)
};

const createHostedAtom = (name, proto, container, etc) => {
  const atom =  new Atom(proto, {});
  return new Host(atom, {name, switchboard, container, ...etc});
};

export const selfScoped = (log, html, resolve) => ({
  async update(inputs, state, {service}) {
    log('Atom lives');
    await service('Foo', 'FooFoo', {foo: 42});
    return {foo: 3};
  },
  template: `foo`
});

const protos = {};

const loadAtom = async path => {
  if (!protos[path]) {
    const {atom: factory} = await import(path);
    protos[path] = factory(log, html, resolve);
  }
  return protos[path];
};

export const createAtom = async path => {
  const proto = protos[path] || await loadAtom(path);
  return createHostedAtom(path, proto);
};