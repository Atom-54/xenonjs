import {Atom} from '../Core/Atom.js';

const log = (...args) => console.log('[worker]', ...args);

postMessage('hello');

onmessage = async event => {
  if (event.data) {
    const {name, data} = event.data;
    log(name, data);
    switch (name) {
      case 'create':
        loadAtom(data);
        break;
    }
  }
};

const html = '';
const resolve = '';

const loadAtom = async path => {
  const {atom: factory} = await import(path);
  const proto = factory(log, html, resolve);
  const atom = new Atom(proto);
  Object.assign(atom.pipe, {
    log: data => {
      log('log', data);
    },
    output: data => {
      log('output', data);
    },
    service: request => {
      log('service', request);
    }
  });
  atom.inputs = {};  
};


