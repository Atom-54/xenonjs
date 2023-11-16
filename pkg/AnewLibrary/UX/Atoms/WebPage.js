export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  template: html`
  <style>
    iframe {
      border: none;
    }
  </style>
  <iframe flex src="{{url}}" srcdoc="{{html}}"></iframe>
  `
  });
  