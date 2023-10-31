
/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const splitId = id => id.split('$');
export const joinId = (...args) => args.join('$');
export const qualifyId = joinId;
export const sliceId = (id, start, end) => qualifyId(...splitId(id).slice(start, end));
export const isQualifiedId = id => Boolean(sliceId(id, 2, 3));
export const objectIdFromAtomId = atomId => sliceId(atomId, 0, -1);
export const parsePropId = propId => {
  const ids = splitId(propId);
  const prop = ids.pop();
  const id = qualifyId(...ids);
  return {id, prop};
};
export const matchesIdPrefix = (id, prefix) => id?.startsWith?.(`${prefix}\$`);
export const startsWithId = matchesIdPrefix;
  