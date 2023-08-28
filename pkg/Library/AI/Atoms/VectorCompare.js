export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 NeonFlan LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  shouldUpdate({vectors}) {
    return vectors?.length === 2;
  },
  update({vectors}, state, {isDirty}) {
    return {
      similarity: this.cosineSimilarity(vectors[0], vectors[1])
    };
  },
  cosineSimilarity(A,B) {
     function dotp(x, y) {
      function dotp_sum(a, b) {
        return a + b;
      }
      function dotp_times(a, i) {
        return x[i] * y[i];
      }
      return x.map(dotp_times).reduce(dotp_sum, 0);
    }
    var similarity = dotp(A, B) / (Math.sqrt(dotp(A,A)) * Math.sqrt(dotp(B,B)));
    return similarity;
  }
});