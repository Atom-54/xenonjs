import * as Reactor from './reactor.js';

const log = (...args) => console.log('[worker]', ...args);

const switchboard = {
  output: output => log('[output]', output),
  render: packet => log('[render]', packet),
  service: request => log('[service]', request)
};

Reactor.initialize(switchboard, log);

const atoms = [];
const messages = [];

onmessage = async event => {
  messages.push(event);
  log(messages.length);
  if (messages.length == 1) {
    log('(re)start pump');
    pump();
  }
};

const pump = async () => {
  while (messages.length) {
    log('pumping', messages.length);
    const message = messages[0];
    await domessage(message);
    messages.shift();
  }
};

const domessage = async message => {
  if (message.data) {
    const {name, data} = message.data;
    log(name, data);
    switch (name) {
      case 'create':
        atoms[data.path] = await Reactor.createAtom(data.path, data.etc);
        break;
      case 'setInputs':
        atoms[data.id].inputs = data.inputs;
        break;
    }
  }
};

postMessage('hello');
