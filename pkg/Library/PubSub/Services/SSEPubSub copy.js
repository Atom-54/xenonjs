/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const defaultUrl = globalThis.config?.firebaseConfig?.databaseURL;

export const SSEPubSub = class {
  constructor(url) {
    this.subs = [];
    this.url = url || defaultUrl;
  }
  makeJsonRequestUrl(auth)  {
    return `${this.url}.json${auth ? `?auth=${auth}` : ''}`;
  }
  async publish(value, auth) {
    const request = this.makeJsonRequestUrl(auth);
    const response = await fetch(request, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(value)
    });
    return response?.status;
  }
  subscribe(name, path, signal, auth) {
    if (!this.source) {
      const request = this.makeJsonRequestUrl(auth);
      this.source = new EventSource(request, {});
      this.source.addEventListener('put', e => this.onPut(path, e.data));
      this.source.addEventListener('patch', e => this.onPatch(path, e.data));
    }
    this.subs.push({name, path, signal});
  }
  attach() {
    const request = this.makeJsonRequestUrl(auth);
    this.source = new EventSource(request, {});
    this.source.addEventListener('put', e => this.onPut(path, e.data));
    this.source.addEventListener('patch', e => this.onPatch(path, e.data));
  }
  unsubscribe(name, path) {
    const index = this.subs.findIndex(sub => sub.name === name && sub.path === path);
    if (index >= 0) {
      this.subs.splice(index, 1);
    }
  }
  onPut(path, json) {
    try {
      const put = JSON.parse(json);
      //console.log('(put)', put);
      this.notify({...put, path});
    } catch(x) {
    }
  }
  onPatch(path, json) {
    try {
      const patch = JSON.parse(json);
      //console.log('(patch)', patch);
      this.notify({...patch, path});
    } catch(x) {
    }
  }
  notify(change) {
    this.subs.forEach(({path, signal}) => {
      if (path === change.path) {
        //console.log('signalling');
        signal(change.data);
      }
    });
  }
  debounce(setter, value, ms = 50) {
    const {debounce} = this;
    debounce.value = value;
    if (!debounce.timer) {
      debounce.timer = true;
      const commit = () => {
        debounce.timer = false;
        setter(debounce.value);
      };
      setTimeout(commit, ms);
    };
  }
};