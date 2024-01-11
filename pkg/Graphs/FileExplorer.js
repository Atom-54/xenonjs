/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const FileExplorer = {
  "meta": {
    "id": "FileExplorer",
    "atomGraphInfo": {
      "build$LustrousCost$TemplateLayout34": [
        24,
        128
      ],
      "build$LustrousCost$SpectrumActionMenu47": [
        -520,
        -32
      ],
      "build$LustrousCost$TemplateLayout78": [
        -120,
        104
      ],
      "build$LustrousCost$ServiceAccess9": [
        136,
        16
      ],
      "build$LustrousCost$ServiceAccess26": [
        -352,
        48
      ],
      "build$FilesGraph$TemplateLayout78": [
        248,
        40
      ],
      "build$FilesGraph$ServiceAccess9": [
        16,
        8
      ],
      "build$FilesGraph$StaticText70": [
        -328,
        168
      ],
      "build$FilesGraph$FlyOut39": [
        -80,
        -16
      ],
      "build$FilesGraph$UXPopupMenu31": [
        272,
        -32
      ],
      "build$FilesGraph$ServiceAccess91": [
        16,
        128
      ],
      "build$FilesGraph$Folders44": [
        -784,
        40
      ],
      "build$FilesGraph$ServiceAccess33": [
        536,
        120
      ],
      "build$FilesGraph$ServiceAccess59": [
        280,
        168
      ],
      "build$FilesGraph$RenameService": [
        272,
        152
      ],
      "build$FilesGraph$FileListLayout": [
        256,
        8
      ],
      "build$FilesGraph$MenuService": [
        8,
        120
      ],
      "build$FilesGraph$OpenService": [
        528,
        112
      ]
    }
  },
  "UXPopupMenu31": {
    "type": "$library/UX/Atoms/UXPopupMenu",
    "container": "Container",
    "state": {
      "template": "",
      "show": null,
      "style": {
        "order": 1
      },
      "items": [
        {
          "label": "Open"
        },
        {
          "label": "Open As Text"
        },
        {
          "label": "Copy Path"
        },
        {
          "label": "-"
        },
        {
          "label": "NewFolder"
        },
        {
          "label": "NewDocument"
        },
        {
          "label": "New Graph"
        },
        {
          "label": "-"
        },
        {
          "label": "Copy"
        },
        {
          "label": "Paste"
        },
        {
          "label": "Duplicate"
        },
        {
          "label": "Rename"
        },
        {
          "label": "-"
        },
        {
          "label": "Delete"
        }
      ]
    },
    "connections": {
      "target": [
        "FileListLayout$target"
      ],
      "show": [
        "FileListLayout$context"
      ]
    }
  },
  "Auth": {
    "type": "$library/Auth/Atoms/Auth"
  },
  "LocalStorageFiles": {
    "type": "$library/Documents/Atoms/FileSystem",
    "state": {
      "providerId": "",
      "storeId": "a54.00",
      "storeName": "Root (Local Storage)"
    }
  },
  "FirebasePublicFiles": {
    "type": "$library/Documents/Atoms/FileSystem",
    "state": {
      "providerId": "fb",
      "storeId": "Guest",
      "storeName": "Public (Firebase)"
    }
  },
  "FirebaseUserFiles": {
    "type": "$library/Documents/Atoms/FileSystem",
    "state": {
      "providerId": "fb"
    },
    "connections": {
      "storeId": "Auth$uid",
      "authToken": "Auth$authToken",
      "storeName": "Auth$displayName"
    }
  },
  "FileSystemFolders": {
    "type": "$library/Documents/Atoms/FileSystemFolders",
    "container": "Container",
    "state": {
      "style": {
        "order": 11
      }
    }
  },
  "MenuService": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "container": "Container",
    "state": {
      "service": "DocumentService",
      "style": {
        "order": 2
      }
    },
    "connections": {
      "data": [
        "FileListLayout$context"
      ],
      "task": [
        "UXPopupMenu31$selected"
      ]
    }
  },
  "OpenService": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "container": "Container",
    "state": {
      "service": "DocumentService",
      "task": "Open",
      "style": {
        "order": 4
      }
    },
    "connections": {
      "data": [
        "FileListLayout$opened"
      ]
    }
  },
  "RenameService": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "container": "Container",
    "state": {
      "service": "DocumentService",
      "task": "Rename",
      "style": {
        "order": 5
      }
    },
    "connections": {
      "data": [
        "FileListLayout$renamed"
      ]
    }
  },
  "FileListLayout": {
    "type": "$library/Layout/Atoms/TemplateLayout",
    "container": "Container",
    "connections": {
      "items": [
        "FileSystemFolders$folders"
      ]
    },
    "state": {
      "template": html`
<div top entry>
  <div subsection repeat="moar_t">{{entries}}</div>
  <template moar_t>
    <context-menu-anchor entry key$="{{id}}" selected$="{{selected}}" active$="{{activated}}" folder$="{{hasEntries}}" on-anchor="onItemContextMenu">
      <div label bar key$="{{id}}" on-click="onItemOpenClose" on-dblclick="onItemOpen">
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
  user-select: none;
}
[label]:hover {
  border-radius: 4px;
  background: rgba(192, 0, 192, 0.3);
}
[subsection] {
  font-size: 100%;
  font-weight: normal;
  color: #381138;
  padding-left: 12px;
  Xborder-left: 1px dotted purple;
}
[showing] {
  display: inline-flex !important; 
}
[name] {
  padding-bottom: 1px;
  font-weight: bold;
}
[folder] {
  color: purple;
  font-weight: normal;
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