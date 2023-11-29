export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({json}) {
  return Boolean(json);
},
update({json}) {
  if (typeof json === 'string') {
    try {
      const value = JSON.parse(json);
      return {value};
    } catch(x) {
      // gets here if json is a simple (unquoted) string
    }
  }
  return {value: json};
}
});
