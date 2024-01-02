export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  update(inputs, state) {
    const {format, ...args} = inputs;
    if (args) {
      let result = [];
      for (let i = 0; i <= 4; ++i) {
        let arg = args[`arg${i}`];
        if (arg) {
          if (typeof arg === 'object') {
            arg = JSON.stringify(arg);
          }
          result.push(String(arg));
        }
      }
      result = result.join('/');
      return {result};
    }
  }
});
