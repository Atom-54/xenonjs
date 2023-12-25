/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import * as Controller from '../../Framework/Controller.js';
import {Storage} from './Storage.js';

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
    closeDocument(data.label);
  }
  static async Save(atom, {document, content}) {
    //log.debug('Save', {document, content});
    saveDocument(atom.layer.controller, document, content);
  }
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
  static async makeDocumentPanel(typed, layer, name, container, index, id, content) {
    return makeDocumentPanel(typed, layer, name, container, index, id, content);
  }
  static async GetFolders(atom, {storeId}) {
    return Storage.getFolders(storeId);
  }
};

const documents = {};
let clipboard;

const acquireStorage = key => {
  return Storage;
};

export const deleteData = async (atom, key) => {
  const storage = acquireStorage(key);
  storage.removeFolder(key);
  storage.notifyFolderObservers(atom.layer.controller);
};

export const pasteData = async (atom, key) => {
  const storage = acquireStorage(key);
  const name = clipboard.split('/').pop();
  const pasteKey = key + '/' + name;
  if (clipboard && !storage.hasItem(pasteKey)) {
    const content = await fetchDocument(clipboard);
    storage.setItem(pasteKey, content);
    storage.notifyFolderObservers(atom.layer.controller);
    log('pasted from', clipboard, 'to', key, ':', content);
  }
};

export const renameData = async (atom, key, name) => {
  const storage = acquireStorage(key);
  const keys = key.split('/').slice(0, -1);
  const newKey = [...keys, name].join('/');
  storage.renameItem(key, newKey);
  storage.notifyFolderObservers(atom.layer.controller);
};

export const fetchDocument = async key => {
  const storage = acquireStorage(key);
  let content = storage.getItem(key);
  if (!content) {
    const sourceKeys = key.split('/');
    const name = sourceKeys.pop();
    const altKey = sourceKeys.join('/') + '.' + name;
    content = storage.getItem(altKey);
  }
  return content;
};

export const putDocument = async (controller, key, content) => {
  const storage = acquireStorage(key);
  storage.setItem(key, content);
};

export const newDocument = async (atom, key) => {
  newItem(atom, key, 'Untitled (text)', '');
};

export const newFolder = async (atom, key) => {
  newItem(atom, key, 'NewFolder', '');
};

const newItem = async (atom, key, name, data) => {
  Storage.newItem(key, name, data);
  const {layer} = atom.layer.host;
  Storage.notifyFolderObservers(layer.controller);
};

const openDocument = async (atom, key) => {
  // punt if document is open
  if (documents[key]) {
    return;
  }
  //
  // get the document content 
  const content = await fetchDocument(key);
  // document name at end
  const name = key.split('/').pop();
  // new index = how many open documents there are now
  const index = Object.keys(documents).length;
  // create document item
  const document = documents[key] = {
    index,
    key,
    name,
    content
  };
  //
  // TODO(sjmiles): stumbled into dynamic graph creation 'the hard way' 
  //
  // create document atom
  document.atom = await makeDocumentAtom(atom.layer.host.layer, name + 'Document', document);
  // create document panel
  document.panel = await createDocumentPanel(document, atom, name, index, key, content);
  // work out binding ids
  const [src, trg] = [
    document.panel.id + '$Editor$text', 
    document.atom.id + '$content'
  ];
  // inject binding directly
  Controller.updateBindings(atom.layer.controller.connections.inputs, src, trg);
};

const saveDocument = async (controller, document, content) => {
  return putDocument(controller, document.key, content);
};

const closeDocument = async name => {
  const [key, document] = Object.entries(documents).find(([key, document]) => document.name === name) || [];
  if (key && document) {
    delete documents[key];
    Controller.removeAtom(document.panel.layer.controller, document.panel);
  }
};

const createDocumentPanel = async (document, atom, name, index, id, content) => {
  const {layer} = atom.layer.host;
  const {controller} = layer;
  // get document panel container
  const panelsId = atom.id.split('$').slice(0, -2).join('$') + '$DocumentTabs';
  const panels = controller.atoms[panelsId];
  if (panels) {
    // reset tabs and select new one
    panels.inputs = {
      tabs: Object.values(documents).map(({name})=>name),
      selected: index
    };
    const container = panelsId.split('$').slice(1).join('$') + '#Container';
    // construct a suitable panel for `content`
    const typed = getTypedContent(content);
    return DocumentService.makeDocumentPanel(typed, layer, name, container, index, id, content);
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

// TODO(sjmiles): obvs different from `createDocumentPanel`
const makeDocumentPanel = async (typed, layer, name, container, index, id, content) => {
  const state = {style: {order: index}};
  if (typed.type === 'graph') {
    const graph = {
      ...content,
      meta: {
        ...content.meta ?? {},
        path: id
      }
    };
    return makeBuildPanel(layer, name + 'Graph', container, graph, state);
    //return makeGraphPanel(layer, name + 'Graph', container, index, content);
  } else {
    return makeCodeMirror(layer, name, container, content, state);
  }
};

const makeDocumentAtom = async (layer, name, document) => {
  return Controller.reifyAtom(layer.controller, layer, {
    name, 
    type: '$library/Documents/Atoms/TextDocument', 
    state: {
      document
    }
  });
};

const makeCodeMirror = async (layer, name, container, content, state) => {
  return Controller.reifyAtom(layer.controller, layer, {
    name, 
    container,
    type: '$library/Graph/Atoms/Graph', 
    state: {
      ...state,
      graphId: 'GeneralEditor',
      Editor$text: content
    }
  });
};

// const makeRunPanel = async (layer, name, container, content, state) => {
//   return Controller.reifyAtom(layer.controller, layer, {
//     name, 
//     container,
//     type: '$library/Graph/Atoms/Graph', 
//     state: {
//       ...state,
//       graphId: content, 
//     }
//   });
// };

const makeBuildPanel = async (layer, name, container, graph, state) => {
  return Controller.reifyAtom(layer.controller, layer, {
    name, 
    container,
    type: '$library/Graph/Atoms/Graph', 
    state: {
      ...state,
      graphId: 'Design',
      Graph$graphId: graph
    }
  });
};