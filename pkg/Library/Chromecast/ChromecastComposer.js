/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Composer as BaseComposer} from '../CoreXenon/Reactor/Atomic/js/core/Composer.js';
import {ChromecastService} from './Services/ChromecastService.js';

export const Composer = class {
  static createComposer(onevent, root) {
    return new ChromecastComposer(root, onevent);
  }
};

export const ChromecastComposer = class extends BaseComposer {
  render(packet) {
    ChromecastService.Render(packet);
  }
};
