/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export class LocalStorageService {
  static async persist(atom, {storeId, data}) {
    if (storeId) {
      localStorage.setItem(storeId, JSON.stringify(data));
    }
  }
  static async restore(atom, {storeId}) {
    try {
      const item = localStorage.getItem(storeId);
      return item ? JSON.parse(item) : null;
    } catch(x) {
      return null;
    }
  }
}