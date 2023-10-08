/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const log = logf('SSEPubSub', 'orange', 'black');
logf.flags.SSEPubSub = true;

const composeJsonRequestUrl = (url, auth) => {
  return `${url}.json${auth ? `?auth=${auth}` : ''}`;
};

const sources = {};

const createSource = url => {
  log('createSource:', url);
  const source = new EventSource(url);
  source.listeners = {};
  source.addEventListener('put', e => onEvent(source, e));
  source.addEventListener('patch', e => onEvent(source, e));
  return source;
}

const onEvent = (source, e) => {
  try {
    const info = JSON.parse(e.data);
    const packet = {type: e.type, data: info.data};
    console.log(source, packet);
    notify(source, packet);
  } catch(x) {
    log.error(x);
  }
};

const notify = (source, packet) => {
  Object.values(source.listeners).forEach(l => l(packet));
};

export const subscribe = (id, signal, url, auth) => {
  const reqUrl = composeJsonRequestUrl(url, auth);
  const source = (sources[url] ??= createSource(reqUrl));
  source.listeners[id] = signal;
};

export const unsubscribe = (id, url) => {
  const source = sources[url];
  if (source) {
    delete source.listeners[id];
  }
};

export const publish = async (url, auth, value) => {
  const request = composeJsonRequestUrl(url, auth);
  const response = await fetch(request, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(value)
  });
  return response?.status;
};


// export const SSEPubSubx = class {
//   constructor(url) {
//     this.subs = [];
//     this.url = url || defaultUrl;
//   }
//   makeJsonRequestUrl(auth)  {
//     return `${this.url}.json${auth ? `?auth=${auth}` : ''}`;
//   }
//   async publish(value, auth) {
//     const request = this.makeJsonRequestUrl(auth);
//     const response = await fetch(request, {
//       method: 'PUT',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(value)
//     });
//     return response?.status;
//   }
//   subscribe(name, path, signal, auth) {
//     if (!this.source) {
//       const request = this.makeJsonRequestUrl(auth);
//       this.source = new EventSource(request, {});
//       this.source.addEventListener('put', e => this.onPut(path, e.data));
//       this.source.addEventListener('patch', e => this.onPatch(path, e.data));
//     }
//     this.subs.push({name, path, signal});
//   }
//   unsubscribe(name, path) {
//     const index = this.subs.findIndex(sub => sub.name === name && sub.path === path);
//     if (index >= 0) {
//       this.subs.splice(index, 1);
//     }
//   }
//   onPut(path, json) {
//     try {
//       const put = JSON.parse(json);
//       //console.log('(put)', put);
//       this.notify({...put, path});
//     } catch(x) {
//     }
//   }
//   onPatch(path, json) {
//     try {
//       const patch = JSON.parse(json);
//       //console.log('(patch)', patch);
//       this.notify({...patch, path});
//     } catch(x) {
//     }
//   }
//   notify(change) {
//     this.subs.forEach(({path, signal}) => {
//       if (path === change.path) {
//         //console.log('signalling');
//         signal(change.data);
//       }
//     });
//   }
//   debounce(setter, value, ms = 50) {
//     const {debounce} = this;
//     debounce.value = value;
//     if (!debounce.timer) {
//       debounce.timer = true;
//       const commit = () => {
//         debounce.timer = false;
//         setter(debounce.value);
//       };
//       setTimeout(commit, ms);
//     };
//   }
// };