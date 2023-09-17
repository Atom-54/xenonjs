/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Perform `action` if `delay` ms have elapsed since last debounce call for `key`.
 *
 * ```
 * // invoke 'task' one second after last time this line executed
 * this.debounceTask = debounce(this.debounceTask, task, 1000);
 * ```
 */
const keys = [];

export const debounce = (key, action, delay) => {
  const timer = keys[key];
  if (timer >= 0) {
    clearTimeout(timer);
  }
  if (action && delay) {
    const timer = setTimeout(() => {
      delete keys[key];
      action();
    }, delay);
    keys[key] = timer;
  }
};

export const async = task => {
  return async (...args) => {
    await Promise.resolve();
    task(...args);
  };
};

export const asyncTask = (task, delayMs) => {
  setTimeout(task, delayMs ?? 0);
};
