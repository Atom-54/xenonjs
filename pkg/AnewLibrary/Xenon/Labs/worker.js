import * as Reactor from './reactor.js';

const log = (...args) => console.log('[worker]', ...args);
Reactor.initialize(log);

onmessage = async event => {
  if (event.data) {
    const {name, data} = event.data;
    log(name, data);
    switch (name) {
      case 'create':
        createAtom(data);
        break;
    }
  }
};
postMessage('hello');

const createAtom = async path => {
  const atom = await Reactor.createAtom(path);
  atom.inputs = {bar: 42};  
};
