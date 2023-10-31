/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export class EventEmitter {
    // map of event name to listener array
    listeners = {};
    getEventListeners(eventName) {
        return this.listeners[eventName] || (this.listeners[eventName] = []);
    }
    fire(eventName, ...args) {
        const listeners = this.getEventListeners(eventName);
        if (listeners?.forEach) {
            listeners.forEach(listener => listener(...args));
        }
    }
    listen(eventName, listener, listenerName) {
        if (!listener) {
            console.warn('Got a null listener', eventName);
            return;
        }
        const listeners = this.getEventListeners(eventName);
        listeners.push(listener);
        listener._name = listenerName || '(unnamed listener)';
        return listener;
    }
    unlisten(eventName, listener) {
        const list = this.getEventListeners(eventName);
        const index = (typeof listener === 'string') ? list.findIndex(l => l._name === listener) : list.indexOf(listener);
        if (index >= 0) {
            list.splice(index, 1);
        }
        else {
            console.warn('failed to unlisten from', eventName);
        }
    }
}
