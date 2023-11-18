/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {jsonrepair/*, JSONRepairError*/} from '../../../third-party/jsonrepair/index.js';

export const JsonRepairService = {
  async Repair(host, {value}) {
    let json = value;
    if (value?.length) {
      try {
        json = jsonrepair(value);
      } catch(x) {
        return null;
      }
    }
    return {json};
  }
}