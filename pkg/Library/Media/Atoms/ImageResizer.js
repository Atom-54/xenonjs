export const atom = (log, resolve) => ({

/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({image, size}) {
  return image && size?.width && size?.height;
},
async update({image, size}, state, {service}) {
  if (image && image.url !== state.url) {
    state.url = image.url;
    const resizedImage = await this.resizeImage(service, image, size);
    return {resizedImage};
  }
},
async resizeImage(service, image, size) {
  return await service({kind: 'ImageService', msg: 'ResizeImage', data: {image, size}});
}
});