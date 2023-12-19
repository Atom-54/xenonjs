
const log = (...args) => console.log('[main]', ...args);

export const start = (onrender, onservice) => {
  const worker = new Worker('./worker.js', {type: 'module', name: 'Reactor'});
  const listener = e => {
    const {msg, data} = e;
    switch (e.name) {
      case 'hello':
        log('worker said hello');
        break;
    }
  };
  worker.addEventListener('message', listener);
  const oneventlet = eventlet => {
    log('posting eventlet', eventlet);
    worker.postMessage({
      name: 'eventlet',
      data: eventlet
    });
  };
  // const config = {foo: 42};
  // worker.postMessage({
  //   name: 'config',
  //   data: config
  // });
  return {
    worker,
    oneventlet
  }
};
