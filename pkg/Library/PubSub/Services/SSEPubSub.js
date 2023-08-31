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
  async publish(path, value) {
    const response = await fetch(`${this.url}/${path}.json`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(value)
    });
    return response?.status;
  }
  subscribe(path, signal) {
    if (!this.source) {
      this.source = new EventSource(`${this.url}/${path}.json`, {});
      this.source.addEventListener('put', e => this.onPut(path, e.data));
      this.source.addEventListener('patch', e => this.onPatch(path, e.data));
    }
    this.subs.push({path, signal});
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
    const debounce = this.debounce;
    debounce.value = value;
    const commit = () => {
      debounce.timer = false;
      setter(debounce.value);
    };
    if (!debounce.timer) {
      debounce.timer = true;
      setTimeout(commit, ms);
    };
  }
};