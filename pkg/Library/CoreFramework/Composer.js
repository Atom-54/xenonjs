/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {XenComposer} from '../Dom/XenComposer/XenComposer.js';
import {loadCss} from '../Dom/dom.js';
import '../Dom/Common/common.js';
import '../Layout/Dom/designer-panel.js';
import '../../third-party/weightless/weightless.min.js';

// Load library css
loadCss(`${config.xenonPath}/Apps/common/theme.css`);
loadCss(`${config.xenonPath}/Library/Dom/Material/material-icon-font/icons.css`);
loadCss(`${config.xenonPath}/third-party/open-props/open-props.min.css`);

// const log = logf('FrameworkComposer', '#8f43ee');
// logf.flags.FrameworkComposer = true;

// be lazy
const {assign} = Object;

//xenon.AtomFactory.setAtomOptions({injections: {themeRules}});

// do a body fade-in just to mask font-fouc
// or other brief improprieties
requestAnimationFrame(() => {
  assign(document.documentElement.style, {
    opacity: 0,
    //scale: 20
  });
  setTimeout(() => assign(document.documentElement.style, {
    transition: 'all 400ms ease-in-out',
    opacity: 1,
    //scale: 1
  }), 100);
});

export const options = {
  root: document.body
};

export const createComposer = (onevent, root, useShadowDOM=true) => {
  return new XenComposer(root ?? options.root ?? document.body, useShadowDOM, onevent ?? (_=>_));
};
