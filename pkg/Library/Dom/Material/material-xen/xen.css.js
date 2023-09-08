/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const XenCss = `
:host {
  --xen-pad: 8px;
  --cell-margin: var(--xen-pad) var(--xen-pad) 0 0;
  --cell-pad: var(--xen-pad);
}
* {
  box-sizing: border-box;
}
[rows], [column], [columns], [row], [bar], [toolbar] {
  display: flex;
  align-items: stretch;
}
[rows], [column] {
  flex-direction: column;
}
[centered][rows], [centered][column], [centering][columns], [centering][row], [bar], [toolbar] {
  align-items: center;
}
[centered][columns], [centered][row], [centering][rows], [centering][column] {
  justify-content: center;
}
[center] {
  justify-content: center;
  align-items: center;
  text-align: center;
  align-content: center;
}
[right-aligned] {
  align-items: end;
  align-content: end;
  justify-content: right;
  text-align: right;
}
[left-aligned] {
  align-items: start;
  align-content: start;
  justify-content: left;
  text-align: left;
}
[evenly-aligned] {
  align-content: space-evenly;
}
[spacer] {
  padding: 8px;
}
[bar], [toolbar]  {
  white-space: nowrap;
}
[toolbar] {
  padding: var(--xen-pad);
}
[toolbar] > * {
  margin-right: var(--xen-pad);
}
[toolbar] > *:last-child {
  margin-right: 0;
}
[fullbleed] {
  height: 100dvh;
  width: 100dvw;
  /* height: 100%;
  width: 100%; */
  margin: 0;
  overflow: hidden;
}
[dark] {
  color-scheme: dark;
}
[scrolling] {
  overflow: auto !important;
}
[flex] {
  flex: 1 1 0;
}
[flex][x2] {
  flex: 2;
}
[flex][x3] {
  flex: 3;
}
[flex][x4] {
  flex: 4;
}
[flex][x5] {
  flex: 5;
}
[flex][x6] {
  flex: 6;
}
[flex][x7] {
  flex: 7;
}
[flex][scrolling] {
  height: 0;
  flex: 1 1 auto;
}
[grid] {
  display: flex;
  flex-wrap: wrap;
}
[grid] > * {
  flex: 1 0 0;
  margin: var(--cell-margin);
  padding: var(--cell-pad);
}
[hidden], [hide]:not([hide="false"]), [display="hide"], [display="false"], [show="false"] {
  display: none !important;
}
[invisible] {
  visibility: hidden;
}
[clip] {
  overflow: hidden;
}
[noclip] {
  overflow: visible;
}
[trbl] {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
[no-events] {
  pointer-events: none;
}
icon {
  font-family: var(--icon-font);
  font-weight: normal;
  font-style: normal;
  /* font-size: 24px; */
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-feature-settings: "liga";
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
`;