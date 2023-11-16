
const log = (...args) => console.log('[main]', ...args);

const worker = new Worker('./worker.js', {type: 'module', name: 'Reactor'});

// const handshake = e => {
//   if (e.data === 'hello') {
//     //URL.revokeObjectURL(oUrl);
//     log('[main] worker said hello');
//     //worker.removeEventListener('message', handshake);
//   }
//   const config = {foo: 42};
//   worker.postMessage({
//     name: 'config',
//     data: config
//   });
// };
// worker.addEventListener('message', handshake);

export const createAtom = (path, etc) => {
  worker.postMessage({name: 'create', data: {path: './atom.js', etc}});
  return {
    set inputs(inputs) {
      worker.postMessage({name: 'setInputs', data: {id: './atom.js', inputs}});
    }
  };
};