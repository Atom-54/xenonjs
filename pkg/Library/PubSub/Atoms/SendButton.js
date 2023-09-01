export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
update() {
  return {outputString: '', emptyString: ''};
},
onSendClick({inputString}, {}, {output}) {
  output({emptyString: '-'});
  return {outputString: inputString, emptyString: ''};
},
template: html`
<!-- <style>
  :host {
  }
</style> -->
<button disabled="{{disabled}}" on-click="onSendClick">Send</button>
`
});
