/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {XenComposer} from '../Library/Dom/XenComposer/XenComposer.js';
import {loadCss} from '../Library/Dom/dom.js';
import '../Library/dom.js';

// Load library css
loadCss(`${config.xenonPath}/Library/Common/theme.css`);
loadCss(`${config.xenonPath}/Library/Dom/Material/material-icon-font/icons.css`);
loadCss(`${config.xenonPath}/third-party/open-props/open-props.min.css`);

//xenon.AtomFactory.setAtomOptions({injections: {themeRules}});

export const options = {
  root: document.body
};

export const createComposer = (onevent, root, useShadowDOM=true) => {
  return new XenComposer(root ?? options.root ?? document.body, useShadowDOM, onevent ?? (_=>_));
};
