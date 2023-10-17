/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Composer} from '../CoreXenon/Reactor/Atomic/js/core/Composer.js';
import {ChromecastService} from './Services/ChromecastService.js';

export const ChromecastComposer = class extends Composer {
  render(packet) {
    if (packet.container?.endsWith('Layer$Layer#Container')) {
      packet.container = 'root';
    }
    if (ChromecastService.GetCurrentSession()) {
      ChromecastService.Render(packet);
    } else {
      this.pendingPackets.push(packet);
    }
  }
};
