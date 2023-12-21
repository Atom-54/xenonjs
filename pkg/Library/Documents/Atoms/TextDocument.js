export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
initialize(inputs, state, {service}) {
  const s = (task, args) => service('DocumentService', task, args);
  state.documents = {
    save: (document, content) => s('Save', {content, document})
  };
},
async update({content, document}, state) {
  // if document has changed or is null
  if (!document || (state.document?.key !== document?.key)) {
    state.document = document;
    // state.content remains unchanged so we can detect changes
  }
  // content has changed
  if (content !== state.content) {
    // this is the new new state content
    state.content = content;
    // it may not be new compared to the document itself
    if (state.content !== document?.content) {
      // save new document content
      state.documents.save(state.document, content);
    }
  }
}
});
