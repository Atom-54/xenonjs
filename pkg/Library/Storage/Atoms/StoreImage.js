export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({image}) {
  return image;
},
async update({image}, state, {service}) {
  const name = image?.name || image?.url.split('/').pop();
  if (name) {
    log('calling StorageService::StoreImage to store', name);
    const serviceResult = await service({kind: 'StorageService', msg: 'StoreImage', data: {image, name}});
    const storedImage = serviceResult;
    log('StorageService::StoreImage returned', storedImage);
    return {
      storedImage: {...storedImage, name}
    };
  }
}
});
  