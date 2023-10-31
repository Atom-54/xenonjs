/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export class LocalStorageService {
  static async persist(layer, atom, {storeId, data}) {
    if (storeId) {
      localStorage.setItem(storeId, JSON.stringify(data));
    }
  }
  static async restore(layer, atom, {storeId}) {
    try {
      const item = localStorage.getItem(storeId);
      return item ? JSON.parse(item) : null;
    } catch(x) {
      return null;
    }
  }
}