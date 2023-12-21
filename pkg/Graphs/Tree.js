/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Tree = {
  "meta": {
    "id": "Tree"
  },
  // "UXPopupMenu31": {
  //   "type": "$library/UX/Atoms/UXPopupMenu",
  //   "container": "Container",
  //   "state": {
  //     "template": "",
  //     "show": null,
  //     "style": {
  //       "order": 1
  //     },
  //     "items": [
  //       {
  //         "label": "Open"
  //       },
  //       {
  //         "label": "-"
  //       },
  //       {
  //         "label": "NewFolder"
  //       },
  //       {
  //         "label": "NewDocument"
  //       },
  //       {
  //         "label": "-"
  //       },
  //       {
  //         "label": "Copy"
  //       },
  //       {
  //         "label": "Paste"
  //       },
  //       {
  //         "label": "Delete"
  //       }
  //     ]
  //   },
  //   "connections": {
  //     "target": [
  //       "FileListLayout$target"
  //     ],
  //     "show": [
  //       "FileListLayout$context"
  //     ]
  //   }
  // },
  // "Folders44": {
  //   "type": "$library/Documents/Atoms/Folders",
  //   "state": {
  //     "storeId": "",
  //     "style": {
  //       "order": 3
  //     }
  //   }
  // },
  "Atoms": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "state": {
      "service": "DesignService",
      "task": "GetAtomTree"
    } 
  },
  // "MenuService": {
  //   "type": "$library/Data/Atoms/ServiceAccess",
  //   "container": "Container",
  //   "state": {
  //     "service": "DocumentService",
  //     "style": {
  //       "order": 2
  //     }
  //   },
  //   "connections": {
  //     "data": [
  //       "FileListLayout$context"
  //     ],
  //     "task": [
  //       "UXPopupMenu31$selected"
  //     ]
  //   }
  // },
  // "OpenService": {
  //   "type": "$library/Data/Atoms/ServiceAccess",
  //   "container": "Container",
  //   "state": {
  //     "service": "DocumentService",
  //     "task": "Open",
  //     "style": {
  //       "order": 4
  //     }
  //   },
  //   "connections": {
  //     "data": [
  //       "FileListLayout$opened"
  //     ]
  //   }
  // },
  // "RenameService": {
  //   "type": "$library/Data/Atoms/ServiceAccess",
  //   "container": "Container",
  //   "state": {
  //     "service": "DocumentService",
  //     "task": "Rename",
  //     "style": {
  //       "order": 5
  //     }
  //   },
  //   "connections": {
  //     "data": [
  //       "FileListLayout$renamed"
  //     ]
  //   }
  // },
  "AtomListLayout": {
    "type": "$library/Layout/Atoms/TemplateLayout",
    //"container": "Container",
    "connections": {
      "items": [
        "Atoms$result"
        //"Folders44$folders"
      ]
    },
    "state": {
      "template": html`
<div top entry>
  <div subsection repeat="moar_t">{{entries}}</div>
  <template moar_t>
    <context-menu-anchor entry key$="{{id}}" selected$="{{selected}}" active$="{{activated}}" folder$="{{hasEntries}}" on-anchor="onItemContextMenu">
      <div label bar key$="{{id}}" on-click="onItemOpenClose">
          <div bar hidden showing$="{{hasEntries}}">
            <icon folder hidden showing$="{{closed}}">folder</icon>
            <icon folder hidden="{{closed}}">folder_open</icon>
          </div>
        <icon hidden="{{hasEntries}}">{{icon}}</icon>
      <list-item jit name key$="{{id}}" folder$="{{hasEntries}}" value="{{name}}" on-change="onItemRename">{{name}}</list-item>
          <span flex></span>
      </div>
      <div subsection closed$="{{closed}}" repeat="moar_t">{{entries}}</div>
    </context-menu-anchor>
  </template>
</div>
      `,
      "style": {
        "order": 0,
        "overflow": "auto",
        "flex": "1 1 0",
        "width": "auto"
      },
      "styleRules": `
icon {
  margin-right: 6px;
}
[top][entry] {
  padding: 2px;
}
[entry] {
  cursor: pointer;
  padding: 2px 0 2px 4px;
  border: 1px solid transparent;
  border-radius: 4px;
}
[entry][folder] {
  border-bottom: 1px dotted rgba(192, 192, 192, 0.3);
}
[entry][selected] {
  border: 1px solid purple;
}
[label] {
  align-items: center;
  padding: 2px 0;
}
[label]:hover {
  border-radius: 4px;
  background: rgba(192, 0, 192, 0.3);
}
[subsection] {
  font-size: 100%;
  font-weight: normal;
  color: black;
  padding-left: 12px;
  Xborder-left: 1px dotted purple;
}
[showing] {
  display: inline-flex !important; 
}
[name] {
  padding-bottom: 1px;
}
[folder] {
  font-weight: bold;
  color: purple;
}
[closed] {
  display: none;
}
context-menu-anchor {
  display: block;
}
`
    }
  }
};