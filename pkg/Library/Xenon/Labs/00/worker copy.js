import {Atom} from '../Core/Atom.js';

const createAtom = proto => {
  return new Atom(proto, {}, /*beStateful=*/true);
};

const atom = createAtom({
  async update(inputs, state, {service}) {
    await service('Foo', 'FooFoo', {foo: 42});
    return {foo: 3};
  }
});

Object.assign(atom.pipe, {
  log: data => {
    console.log('log', data);
  },
  output: data => {
    console.log('output', data);
  },
  service: request => {
    console.log('service', request);
  }
});

atom.inputs = {};
