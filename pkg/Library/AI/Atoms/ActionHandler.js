export const atom = (log) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({cmd}) {
  return cmd;
},
async update({cmd, args, mediaDeviceState}, state, {service, isDirty}) {
  if (isDirty('cmd', 'args')) {
    let result;
    log(`do command '${cmd}' with args '${args}'`);
    if (cmd === 'camera' && mediaDeviceState) {
      mediaDeviceState.isCameraEnabled = (args === 'on');
      return {mediaDeviceState};
    } else if (cmd === 'create') {
      let node;
      if (args?.toLowerCase() === 'imagenode') {
        node = {type: '$library/Media/Nodes/ImageNode'}
      }
      result = await service({kind: 'GraphService', msg: 'AddObject', data: {node}});
    } else {
      result = await service({kind: 'ActionService', msg: 'DoAction', data: {cmd, args}});
    }
    return {result};
  }
}
});
