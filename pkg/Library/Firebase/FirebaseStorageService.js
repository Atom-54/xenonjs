/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {firebase} from './firebase-storage.js';

//const {firebaseConfig} = globalThis.config;
// if (firebaseConfig) {
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.auth().onAuthStateChanged(user_ => user = user_?.toJSON());
// }

export const FirebaseStorageService = {
  async StoreImage(app, atom, {image, name}) {
    let url = '';
    // need Cloud Storage 
    const storage = firebase.storage();
    // Create a reference
    const imageRef = storage.ref(name);
    // get some data
    if (image.url) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      await imageRef.put(blob);
      url = await imageRef.getDownloadURL();
    }
    return {url};
  },
  async ListImages() {
    // need Cloud Storage 
    const storage = firebase.storage();
    // create a reference
    const ref = storage.ref();
    // get the stuffs
    const list = await ref.listAll();
    const result = [];
    let base = '';
    for (let item of list.items) {
      const child = ref.child(item.name);
      if (!base) {
        const url = await child.getDownloadURL();
        base = url.split()
      }
      const url = await child.getDownloadURL();
      result.push({url, name: item.name});
    }
    return result;
  }
};
