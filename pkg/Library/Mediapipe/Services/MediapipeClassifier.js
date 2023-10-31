/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const MediapipeClassifier = {
  async import(path) {
    await this.semaphore;
    // TODO(sjmiles): account for an apparent failure of
    // the mediapipe loader to be re-entrant over some
    // unknown period of time (allowing 1s atm)
    return this.semaphore = new Promise(resolve => {
      (async () => {
        const module = await import(path);
        resolve(module);
        //setTimeout(() => resolve(module), 1000);
      })();
    });
  },
  async classify(classifier, testImage) {
    if (this.busy) {
      return {};
    }
    else {
      // TODO(sjmiles): probably want some timeout protection to keep
      // this from becoming stuck true in case of error
      this.busy = true;
      // promise a value
      const promise = new Promise(resolve => {
        // resolves when classifier has results
        classifier.onResults(results => {
          resolve(results);
          this.busy = false;
        });
        // ask classifier to process testImage
        classifier.send({image: testImage});
      });
      // wait for the promise
      const fullResults = await promise;
      // extract results
      const {canvas, image, ...results} = fullResults;
      // package output
      return {
        results: {...results, width: testImage.width, height: testImage.height}
      };
    }
  }
};