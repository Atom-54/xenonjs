/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {jsonrepair/*, JSONRepairError*/} from '../../third-party/jsonrepair/index.js';

export class jsonrepairService {
  static async repair(layer, atom, {value}) {
    let json = value;
    if (value?.length) {
      try {
        json = jsonrepair(value);
      } catch(x) {
        // check for badness?
      }
    }
    return {json};
  }
}