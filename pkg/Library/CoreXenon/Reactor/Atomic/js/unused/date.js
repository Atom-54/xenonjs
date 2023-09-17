/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const computeAgeString = (date, now) => {
    let deltaTime = Math.round((now - date) / 1000);
    if (isNaN(deltaTime)) {
        return `•`;
    }
    let plural = '';
    if (deltaTime < 60) {
        if (deltaTime > 1)
            plural = 's';
        return `${deltaTime} second${plural} ago`;
    }
    deltaTime = Math.round(deltaTime / 60);
    if (deltaTime < 60) {
        if (deltaTime > 1)
            plural = 's';
        return `${deltaTime} minute${plural} ago`;
    }
    deltaTime = Math.round(deltaTime / 60);
    if (deltaTime < 24) {
        if (deltaTime > 1)
            plural = 's';
        return `${deltaTime} hour${plural} ago`;
    }
    deltaTime = Math.round(deltaTime / 24);
    if (deltaTime < 30) {
        if (deltaTime > 1)
            plural = 's';
        return `${deltaTime} day${plural} ago`;
    }
    deltaTime = Math.round(deltaTime / 30);
    if (deltaTime < 12) {
        if (deltaTime > 1)
            plural = 's';
        return `${deltaTime} month${plural} ago`;
    }
    deltaTime = Math.round(deltaTime / 12);
    if (deltaTime > 1)
        plural = 's';
    return `${deltaTime} year${plural} ago`;
};
