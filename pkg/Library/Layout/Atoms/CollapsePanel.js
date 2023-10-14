export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
render({side, size, width, collapsed, expanded, style, nubCollapsed, nubExpanded}) {
  collapsed = (collapsed === true) && !expanded;
  side ??= 'right';
  const isRight = (side === 'right');
  const isBottom = (side === 'bottom');
  const ord = isBottom ? 'height' : 'width';
  size ??= width ?? '300px';  
  const ord2 = isBottom ? 'top' : 'left';
  const nub = (collapsed ? nubCollapsed : nubExpanded) ?? (
    isRight
      //? (collapsed ? '👈' : '👉') 
      ? ''
      : isBottom 
        ? (collapsed ? '👆' : '👇') 
        : ''
  );
  return { 
    side, 
    nub,
    showNub: String(Boolean(nub)),
    rules: 
`:host { 
  ${ord2}: auto !important;
  ${ord}: ${collapsed ? `0px` : size} !important;
}
:host {
  ${style??''}
}
`
  };
},
onCollapseClick({collapsed}) {
  return {collapsed: !collapsed, expanded: collapsed};
},
template: html`
<style>
:host {
  transition: all 120ms ease-in-out; 
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 1;
}
[nub] {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--xcolor-one);
  border: 1px solid var(--xcolor-two);
  cursor: pointer;
  z-index: 100
}
[nub][side=right] {
  width: 10px;
  top: 12px;
  left: -10px;
  /**/
  background: #c331d9;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
  overflow: hidden;
}
[nub][side=bottom] {
  top: -32px;
  left: 12px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
}
</style>
<style>${`{{rules}}`}</style>
<slot name="Container"></slot>
<div center column nub display$="{{showNub}}" side$="{{side}}" on-click="onCollapseClick">{{nub}}</div>
`
});
