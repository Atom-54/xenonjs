/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {UXToolbarNode} from '../../UX/Nodes/UXToolbarNode.js';

export const FooterNode = {
  ...UXToolbarNode,
  state: {
    UXToolbar$actions: [{
        "name": "spanner",
        "flex": 1
      }, {
        "name": "name",
        "label": "© 2023 NeonFlan, LLC",
        "style": "font-size: 0.6em; color: var(--xcolor-three);"
      }, {
        "name": "spanner",
        "flex": 1
      }, {
        "name": "File an issue",
        "image": "$xenon/Library/Assets/github.png",
        "style": "opacity: 0.8; cursor: pointer; height: 18px; height: 18px",
        "action": "service",
        "args": {
          "kind": "GraphService",
          "msg": "OpenUrl",
          "data": {"url": "BugReport"}
        }
      }, {
        "name": "Contact us",
        "image": "$xenon/Library/Assets/discord.png",
        "style": "opacity: 0.7; cursor: pointer; height: 18px; width: 18px",
        "action": "service",
        "args": {
          "kind": "GraphService",
          "msg": "OpenUrl",
          "data": {"url": "ContactUs"}
        }
      }, {
        "name": "Email",
        "ligature": "mail",
        "style": "font-size: 18px",
        "action": "service",
        "args": {
          "kind": "GraphService",
          "msg": "OpenUrl",
          "data": {"url": "Email"}
        }
      }, {
        "name": "spanner",
        "flex": 1
    }]
  }
};
