export const atom = (log, resolve) => ({
  /**
   * @license
   * Copyright 2023 Atom54 LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  async update({graphId}, state, {isDirty, service}) {
    if (isDirty('graphId')) {
      await service('LayerService', 'CreateLayer', {id: graphId});
      log('LayerService::CreateLayer completed for', graphId);
    }
  },
  async loadLocalProjects() {
    LocalStorage.
    const url = this.formatFetchPublishGraphsUrl(publishedGraphsUrl);
    const res = await fetch(url);
    if (res.status === 200) {
      // Replacing % with $ is backward compatibility for graphs,
      // that were published before double stringification.
      const text = (await res.text())?.replace(/%/g, '$');
      const parsed = values(JSON.parse(text)).map(v => typeof v === 'string' ? JSON.parse(v) : v);
      const publicGraphs = parsed.map(g => g.meta ? g : values(g)?.map(gg => JSON.parse(gg))).flat()
      if (!publicGraphs.every(g => g.meta.readonly)) {
        log.warn(`All public graphs must be readonly`);
      }
      return publicGraphs;
    }
  },
  template: html`
  <slot name="Container"></slot>
  `
  });
    