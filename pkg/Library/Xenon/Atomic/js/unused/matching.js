/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export function matches(candidateMeta, targetMeta) {
    for (const property in targetMeta) {
        if (candidateMeta[property] !== targetMeta[property]) {
            return false;
        }
    }
    return true;
}
;
