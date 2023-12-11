/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Controller from '../../Framework/Controller.js';
import * as Storage from '../../LocalStorage/Services/LocalStorageService.js';

const log = globalThis.logf('DocumentService', '#555555', 'orange');

export const DocumentService = class {
  static async Open(atom, data) {
    log.debug('Open', data, atom.id);
    openDocument(atom, data);
  }
  static async NewFolder(atom, data) {
    log.debug('NewFolder', data, atom.id);
    newFolder(atom, data);
  }
  static async NewDocument(atom, data) {
    log.debug('NewDocument', data, atom.id);
    newDocument(atom, data);
  }
  static async Close(atom, data) {
    log.debug('Close', data);
  }
  // static async Cut(atom, data) {
  //   log.debug('Cut', data);
  // }
  static async Copy(atom, data) {
    log.debug('Copy', data);
    clipboard = data;
  }
  static async Paste(atom, data) {
    log.debug('Paste', data);
    pasteData(atom, data);
  }
  static async Rename(atom, {key, value}) {
    log.debug('Rename', key, value);
    renameData(atom, key, value);
  }
  static async Delete(atom, id) {
    log.debug('Delete', id);
    const name = id.split('/').pop();
    const ok = window.confirm(`Delete "${name}"?`);
    if (ok) {
      return deleteData(atom, id);
    }
  }
};

const documents = {};
let clipboard;

export const deleteData = async (atom, key) => {
  Storage.removeFolder(key);
  Storage.notifyFolderObservers(atom.layer.controller);
};

export const pasteData = async (atom, key) => {
  const name = clipboard.split('/').pop();
  const pasteKey = key + '/' + name;
  if (clipboard && !Storage.hasItem(pasteKey)) {
    const content = await fetchDocument(clipboard);
    Storage.setItem(pasteKey, content);
    Storage.notifyFolderObservers(atom.layer.controller);
    log('pasted from', clipboard, 'to', key, ':', content);
  }
};

export const renameData = async (atom, key, name) => {
  const content = await fetchDocument(key);
  const keys = key.split('/').slice(0, -1);
  const newKey = [...keys, name].join('/');
  Storage.setItem(newKey, content);
  Storage.removeItem(key);
  Storage.notifyFolderObservers(atom.layer.controller);
};

export const fetchDocument = async key => {
  let content = Storage.getItem(key);
  if (!content) {
    const sourceKeys = key.split('/');
    const name = sourceKeys.pop();
    const altKey = sourceKeys.join('/') + '.' + name;
    content = Storage.getItem(altKey);
  }
  return content;
};

export const newDocument = async (atom, key) => {
  newItem(atom, key, 'NewDocument', {});
};

export const newFolder = async (atom, key) => {
  newItem(atom, key, 'NewFolder', 'folder');
};

const newItem = async (atom, key, name, data) => {
  key = getFolderKey(key);
  const uniqueKey = findUniqueKey(key + '/' + name);
  Storage.setItem(uniqueKey, data);
  const {layer} = atom.layer.host;
  Storage.notifyFolderObservers(layer.controller);
};

const getFolderKey = key => {
  const folder = key.split('/').slice(0, -1).join('/');
  const content = fetchDocument(key);
  if (content && content !== 'folder') {
    key = folder;
  }
  return key;
};

const findUniqueKey = key => {
  let newKey;
  for (let i=0;; i++) {
    newKey = key + (i ? ` (${i+1})` : '');
    if (!Storage.hasItem(newKey)) {
      return newKey;
    };
  }
};

const openDocument = async (atom, key) => {
  // punt if document is open
  if (documents[key]) {
    return;
  }
  // get the document content 
  const content = await fetchDocument(key);
  // document name at end
  const name = key.split('/').pop();
  // new index = how many open documents there are now
  const index = Object.keys(documents).length;
  // open another document
  documents[key] = {
    index,
    key,
    name,
    content
  };
  // create document ux
  return createDocumentPanel(atom, name, index, content);
};

const createDocumentPanel = async (atom, name, index, content) => {
  const {layer} = atom.layer.host;
  const {controller} = layer;
  const panelsId = atom.id.split('$').slice(0, -2).join('$') + '$DocumentPanels';
  const panels = controller.atoms[panelsId];
  //log.debug(panelsId, panels);
  if (panels) {
    // make a tab and select it
    panels.inputs = {tabs: Object.values(documents).map(({name})=>name)};
    panels.inputs = {selected: index};
    // try to put something there
    const container = panelsId.split('$').slice(1).join('$') + '#Container';
    // construct a suitable graph for `content`
    const typed = getTypedContent(content);
    if (typed.type === 'graph') {
      await makeGraphPanel(layer, name + 'Graph', container, index, content);
    } else {
      await makeCodeMirror(layer, name, container, index, content);
    }
  }
};

const getTypedContent = content => {
  let doc = content;
  if (typeof doc === 'string') {
    try {
      doc = JSON.parse(content);
    } catch(x) {
      //
    }
  }
  if (doc && typeof doc === 'object') {
    if (doc.meta?.id) {
      return {type: 'graph', content: doc};
    }
  }
  return {type: typeof doc, content: doc};
};

const makeCodeMirror = async (layer, name, container, index, content) => {
  await Controller.reifyAtom(layer.controller, layer, {
    name, container,
    type: '$anewLibrary/CodeMirror/Atoms/CodeMirror', 
    state: {
      style: {order: index},
      text: content
    }
  });
};

const makeGraphPanel = async (layer, name, container, index, content) => {
  await Controller.reifyAtom(layer.controller, layer, {
    name, container,
    type: '$anewLibrary/Graph/Atoms/Graph', 
    state: {
      graphId: content.meta.id,
      style: {order: index}
    }
  });
};

