/**
 * @license
 * Copyright (c) 2022 Google LLC All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
({
async update({image}, state, {service}) {
  const data = await service({kind: 'CocoSsdService', msg: 'classify', data: {image}});
  return {data};
}
});
