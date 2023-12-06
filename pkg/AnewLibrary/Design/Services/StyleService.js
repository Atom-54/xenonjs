/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
import * as Controller from '../../Framework/Controller.js';
import * as Design from './DesignService.js';

const log = logf('StyleService', '#552E2F', 'white');

export const StyleService = {
  async ToggleFlex(callingHost) {
    log.debug('ToggleFlex');
    const host = Design.designSelectedHost;
    if (host) {
      let style = host.layer.controller.state[host.id + '$style'] || {};
      log.debug(host.id, style);
      if (style.flex === '0 0 auto') {
        style.flex = '1 1 0'
      } else {
        style.flex = '0 0 auto'
      }
      commitStyleChange(host, style);
    }
  },
  async ToggleScrolling(callingHost) {
    log.debug('ToggleScrolling');
    const host =  Design.designSelectedHost;
    if (host) {
      let style = host.layer.controller.state[host.id + '$style'] || {};
      log.debug(host.id, style);
      if (style.overflow === 'auto') {
        style.overflow = 'hidden'
      } else {
        style.overflow = 'auto'
      }
      commitStyleChange(host, style);
    }
  },
  async ToggleWidth(callingHost) {
    log.debug('ToggleWidth');
    const host =  Design.designSelectedHost;
    if (host) {
      let style = host.layer.controller.state[host.id + '$style'] || {};
      log.debug(host.id, style);
      const w = ((Number((style.width || '').slice(0,-2)) || 0) + 100) % 600;
      style.width = (w ? w + 'px' : 'auto');
      commitStyleChange(host, style);
    }
  },
  async ToggleFontSize(callingHost) {
    log.debug('ToggleFontSize');
    const host =  Design.designSelectedHost;
    if (host) {
      let style = host.layer.controller.state[host.id + '$style'] || {};
      log.debug(host.id, style);
      let fs = Number((style.fontSize || '').slice(0,-1)) || 0;
      const s = (fs+10) % 260;
      style.fontSize = (s ? s + '%' : '');
      commitStyleChange(host, style);
    }
  }
};

const commitStyleChange = (host, style) => {
  Controller.set(host.layer.controller, host.id, {style})
  Design.designSelect(host.layer.controller, null);
  Design.designSelect(host.layer.controller, host.id);
};
