export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update() {
  return {emptyString: ''};
},
onSendClick({inputString}, {}, {output}) {
  if (inputString?.length) {
    output({emptyString: '-'});
    return {outputString: inputString, emptyString: ''};
  }
},
template: html`
<!-- <style>
  :host {
  }
</style> -->
<wl-button disabled="{{disabled}}" on-click="onSendClick">Send</wl-button>
`
});
