/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// KISS solution since our practical problem is exactly here
const alias = {
  'Pojo': 'Json',
  'Json': 'Pojo',
  'Tensor': 'Image',
  'Image': 'Tensor',
  'String': 'MultilineText',
  'MultilineText': 'String'
};
// it's unclear to me how declare this formally,
// it's a weird pseudo-thing, it's "works with this kind"
// that why neither & or |
const DELIM = ':';
const any = {pojo: 1, any: 1, object: 1, json: 1};
// once we export the function
// then task one is complete...
//
// plumbing it into xenonjs-support (nee xenonjs-apps)
// is task two
//
// it may seem trivial but I want it to be two
// tasks on purpose, there are considerations
// this code took me an hour or so to get right
// this was the actual task of making 'typeMatcher'
export const TypeMatcher = (A, B) => {
  if (A === B || A === alias[B] || any[A.toLowerCase()] || any[B.toLowerCase()]) {
    //if (A === B || A === alias[B]) {
    return true;
  }
  // we might have a compound type somewhere
  const Aparts = A.split(DELIM);
  const Bparts = B.split(DELIM);
  // if one of these is compound, use the more expensive comparison
  if (Aparts.length > 1 || Bparts.length > 1) {
    return Aparts.includes(B) || Bparts.includes(A) /* // ?? */ || Aparts.includes(alias[B]) || Bparts.includes(alias[A]);
  }
  // not matching
  return false;
};
// added a test thing, to make sure it worked as expected
// literally pasted this whole module into console to test
// const tm = (a, b) => {
//   console.log(a, b, typeMatcher(a, b));
// };
// tm('foo', 'bar');
// tm('foo', 'foo');
// tm('Tensor', 'Image');
// tm('Image', 'Tensor');
// tm('Image:Tensor', 'Tensor');
// tm('Image:Output', 'Tensor');
// tm('Image:Output', 'Output');
// tm('Image:Output', 'Image');
// tm('Tensor', 'Image:Tensor');
// tm('Tensor', 'Image:Output');
// tm('Output', 'Image:Output');
// tm('Image', 'Tensor:Output');
// tm('Image:Output', 'foo');
