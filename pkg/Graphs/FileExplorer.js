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
          "label": "-"
        },
        {
          "label": "NewFolder"
        },
        {
          "label": "NewDocument"
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
  "Folders44": {
    "type": "$library/Documents/Atoms/Folders",
    "container": "Container",
    "state": {
      "storeId": "a54.00",
      "style": {
        "order": 3
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
    "state": {
      "template": "<div top entry>\n  <div subsection repeat=\"moar_t\">{{entries}}</div>\t\n  <template moar_t>\n    <context-menu-anchor entry key$=\"{{id}}\" selected$=\"{{selected}}\" active$=\"{{activated}}\" folder$=\"{{hasEntries}}\" on-anchor=\"onItemContextMenu\">\n\t  <div label bar key$=\"{{id}}\" on-click=\"onItemOpenClose\">\n        <div bar hidden showing$=\"{{hasEntries}}\">\n          <icon folder hidden showing$=\"{{closed}}\">folder</icon>\n          <icon folder hidden=\"{{closed}}\">folder_open</icon>\n        </div>\n    \t<icon hidden=\"{{hasEntries}}\">scatter_plot</icon>\n\t\t<list-item jit name key$=\"{{id}}\" folder$=\"{{hasEntries}}\" value=\"{{name}}\" on-change=\"onItemRename\">{{name}}</list-item>\n        <span flex></span>\n \t  </div>\n\t  <div subsection closed$=\"{{closed}}\" repeat=\"moar_t\">{{entries}}</div>\t\n    </context-menu-anchor>\n  </template>\n</div>",
      "style": {
        "order": 0,
        "overflow": "auto",
        "flex": "1 1 0",
        "width": "auto"
      },
      "styleRules": "icon {\n  margin-right: 6px;\n}\n[top][entry] {\n  padding: 2px;\n}\n[entry] {\n  cursor: pointer;\n  padding: 2px 0 2px 4px;\n  border: 1px solid transparent;\n  border-radius: 4px;\n}\n[entry][folder] {\n  border-bottom: 1px dotted rgba(192, 192, 192, 0.3);\n}\n[entry][selected] {\n  border: 1px solid purple;\n}\n[label] {\n  align-items: center;\n  padding: 2px 0;\n}\n[label]:hover {\n  background: white;\n}\n[subsection] {\n  font-size: 100%;\n  font-weight: normal;\n  color: black;\n  padding-left: 12px;\n  border-left: 1px dotted purple;\n}\n[showing] {\n  display: inline-flex !important; \n}\n[name] {\n  padding-bottom: 1px;\n}\n[folder] {\n  font-weight: bold;\n  color: purple;\n}\n[closed] {\n  display: none;\n  background: red;\n}\n[label]:not(:hover) [menu] {\n  display: none;\n}\ncontext-menu-anchor {\n  display: block;\n}\n"
    },
    "connections": {
      "items": [
        "Folders44$folders"
      ]
    }
  }
};