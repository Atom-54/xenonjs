/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
let waitFor;

export const classifyPose = async image => {
  const pose = await globalThis.requirePose();
  //
  const t = Date.now();
  if (t < waitFor) return;
  waitFor = t + 200;
  //
  return new Promise(async resolve => {
    pose.onResults(resolve);
    pose.send(image);
  });
};
