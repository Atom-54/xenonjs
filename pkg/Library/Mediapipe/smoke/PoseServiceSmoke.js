/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
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
