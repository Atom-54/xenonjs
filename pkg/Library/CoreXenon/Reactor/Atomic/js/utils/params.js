/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let url;
let params;
export class Params {
    static prefix = '';
    static update() {
        url = new URL(document.URL);
        params = url.searchParams;
    }
    static getParam(name) {
        return params.get(name);
    }
    static hasParam(name) {
        return params.get(name) != null;
    }
    static setParam(name, value) {
        params.set(name, value);
        globalThis.history.replaceState({}, '', decodeURIComponent(url.href));
    }
    static setUrlParam(name, value) {
        globalThis.history.pushState({}, '', this.setUrlParamQuietly(name, value));
    }
    static replaceUrlParam(name, value) {
        globalThis.history.replaceState({}, '', this.setUrlParamQuietly(name, value));
    }
    static setUrlParamQuietly(name, value) {
        const url = new URL(globalThis.location.toString());
        if (value) {
            url.searchParams.set(name, value);
        }
        else {
            url.searchParams.delete(name);
        }
        return url.href;
    }
    static qualifyName(name) {
        return `${this.prefix}${name}`;
    }
    static fetchValue(name) {
        return localStorage.getItem(this.qualifyName(name));
    }
    static storeValue(name, value) {
        return localStorage.setItem(this.qualifyName(name), value);
    }
    static fetchJsonValue(name) {
        return JSON.parse(localStorage.getItem(this.qualifyName(name)));
    }
    static storeJsonValue(name, value) {
        return localStorage.setItem(this.qualifyName(name), JSON.stringify(value));
    }
}
;
Params.update();
