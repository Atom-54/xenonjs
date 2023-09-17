export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({graph}) {
  return graph;
},
async update({graph, image, avatar, avatars}, state, {service}) {
  if (!graph.meta?.stylized) {
    if (image && image.url !== state.url) {
      state.url = image.url;
      const args = {image, size: {width: 128, height: 128}};
      const resizedImage = await service({kind: 'ImageService', msg: 'ResizeImage', data: args});
      image = resizedImage ?? image;
      const meta = {...graph.meta, image};
      delete meta.stylized3;
      meta.stylized = true;
      log('stylized graph meta', meta);
      await service('DesignService', 'SetGraphMeta', meta);
      return {restart: false};
    }
    const vav = values(avatars);
    const prompt = vav[Math.floor(Math.random()*vav.length)]
    //const prompt = avatars?.[avatar] 
      ?? 'Striking photo portrait of an android action hero character of mixed-race of any gender.'
      ;
    return {prompt: `(fig ${Math.floor(Math.random()*100)}) ${prompt}`, restart: true};
  }
}
});
