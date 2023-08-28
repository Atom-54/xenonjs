export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({json}) {
  return json;
},
update({json}) {
  if (typeof json === 'string') {
    try {
      const value = JSON.parse(json);
      return {value};
    } catch(x) {
      log(x);
    }
  } else if (json) {
    return {value: json};
  }
}
});
