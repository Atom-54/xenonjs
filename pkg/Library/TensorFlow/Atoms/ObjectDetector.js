export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({image, model, display, options}, state, {service, output, isDirty}) {
  const kind = `${model || 'CocoSsd'}Service`;
  state.options = {addTolerance: 2, removeTolerance: 4, distanceDelta: 15, ...options??{}};
  if (isDirty('image')) {
    this.updateImage({image, kind}, state, {service, output});
  }
  if (isDirty('display')) {
    if (display?.canvas && state.data) {
      await service(kind, 'drawBoxes', {canvas: display.canvas, data: state.data})
      display.version = Math.random();
      return {display};
    }
  }
  if (!image) {
    return {data: []};
  }
},

async updateImage({image, kind}, state, {service, output}) {
  if (!state.classifying) {
    state.classifying = true;
    const data = await service(kind, 'classify', {image});
    state.classifying = false;
    state.data = this.computeNewData(data, state);
    this.logDetection(data, state);
    output({data: state.data});
  }
},

computeNewData(data, state) {
  if (!state.data) {
    return data;
  }

  const newClasses = {};
  data.forEach(d => newClasses[d.class] = d);
  const oldClasses = {};
  const newStateData = [];
  const {addTolerance, removeTolerance, distanceDelta} = state.options;

  state.data.forEach(d => {
    // For already detected object
    const cl = d.class;
    if (newClasses[cl]) {
      // Keep the object; only update box coordinates, if significant change.
      newStateData.push(this.maybeUpdateData(newClasses[cl], d, distanceDelta));
      delete state.maybeGone?.[cl];
      oldClasses[cl] = d;
    } else {
      (state.maybeGone ??= {})[cl] ??= 0;
      state.maybeGone[cl]++;
      if (state.maybeGone[cl] < removeTolerance) {
        // Count object disapperance, but still keep detected object.
        newStateData.push(d);
        oldClasses[cl] = d;
      } else {
        // Object is not detected above tolerance, no longer detected.
        delete state.maybeGone[cl];
      }
    }
  });
  data.forEach(d => {
    // For newly classified objects
    const cl = d.class;
    if (oldClasses[cl]) {
      // Object was detected previously, and classified now; reset "maybeGone" count
      delete state.maybeGone?.[cl];
    } else {
      // Count new appearances
      (state.maybeNew ??= {})[cl] ??= 0;
      state.maybeNew[cl]++;
      if (state.maybeNew[cl] >= addTolerance) {
        // Add new object detection, if above tolerance.
        newStateData.push(d);
        delete state.maybeNew[cl];
      }
    }
  });

  return newStateData;
},

maybeUpdateData(newData, oldData, distanceDelta) {
  if (newData.bbox.every((b, i) => Math.abs(b - oldData.bbox[i]) <= distanceDelta))  {
    return oldData;
  }
  return newData;
},

logDetection(data, state) {
  const form = maybe => entries(maybe).map(([cl, count]) => `${cl} (${count})`);
  log(`Detected: [${state.data.map(d => d.class).join(', ')}]`);
  log(`Classified: [${data.map(d => d.class).join(', ')}]; maybe: [${form(state.maybeNew)}]; maybe not: [${form(state.maybeGone)}]`);
}

});
