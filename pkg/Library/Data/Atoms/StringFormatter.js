export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  update(inputs, state) {
    const {format, ...args} = inputs;
    if (format) {
      let result = format;
      for (let i = 0; i <= 4; ++i) {
        let arg = args[`arg${i}`];
        if (typeof arg === 'object') {
          arg = JSON.stringify(arg);
        }
        result = result.replace(`$\{arg${i}}`, arg || '?');
      }
      return {result};
    }
  }
});
