export const atom = (log) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({transcript, textResult}) {
  return textResult || transcript?.transcript;
},
async update({transcript: {transcript}, textResult}, state, {isDirty}) {
  if (isDirty('transcript') && transcript.length) {
    return {prompt: `${transcript}?`}
  }
  if (isDirty('textResult')) {
    // we must have a textResult
    const parts = textResult.split(']');
    const cmd = parts?.[0]?.split('[').pop();
    const args = parts?.[1]?.slice(1);
    // if we have a textResult and cannot figure out anything, we are confused
    let message = parts.length > 1 ? "Sorry I don't understand." : "";
    if (!args && textResult.includes('moment')) {
      //message = ['hm', 'uh', 'hrm', 'sec', 'ok'][Math.floor(Math.random()*5)];
      //message = 'ok';
      message = '';
    }
    if (cmd && args) {
      log(`"${textResult}" => [${cmd}][${args}]`);
      message = `${cmd} ${args}`;
    }
    log(`chose "${message}" for "${textResult}"`);
    return {textResult, message, cmd, args};
  }
}
});
