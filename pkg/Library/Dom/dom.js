/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const nob = Object.create(null);

export const define = customElements.define.bind(customElements);

const create = (tag, props) => Object.assign(document.createElement(tag), props || nob);
export const dom = (tag, props, parent) => parent ? parent.appendChild(create(tag, props)) : create(tag, props);
export const loadScript = async props => new Promise(resolve => dom('script', {...props, onload: resolve}, document.head));
export const loadCss = async href => dom('link', {type: 'text/css', rel: 'stylesheet', href}, document.head);

export const deepQuerySelector = (root, selector) => {
  const find = (element, selector) => {
    let result;
    while (element && !result) {
      result =
        (element.matches?.(selector) ? element : null)
        ?? find(element.firstElementChild, selector)
        ?? find(element.shadowRoot?.firstElementChild, selector)
        ;
      element = element.nextElementSibling;
    }
    return result;
  };
  return find(root ?? document.body, selector);
};
