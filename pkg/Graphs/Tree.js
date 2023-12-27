/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const Tree = {
  "meta": {
    "id": "Tree"
  },
  "Atoms": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "state": {
      "service": "DesignService",
      "task": "GetAtomTree"
    } 
  },
  "AtomListLayout": {
    "type": "$library/Layout/Atoms/TemplateLayout",
    "connections": {
      "items": [
        "Atoms$result"
      ]
    },
    "state": {
      "template": html`
<div top entry>
  <div subsection repeat="moar_t">{{entries}}</div>
  <template moar_t>
    <context-menu-anchor entry color$="{{color}}" key$="{{id}}" selected$="{{selected}}" active$="{{activated}}" folder$="{{hasEntries}}" on-anchor="onItemContextMenu">
      <div label bar key$="{{id}}" on-click="onItemOpenClose">
          <div bar hidden showing$="{{hasEntries}}">
            <icon folder hidden showing$="{{closed}}">folder</icon>
            <icon folder hidden="{{closed}}">folder_open</icon>
          </div>
        <icon hidden="{{hasEntries}}">{{icon}}</icon>
      <list-item jit name key$="{{id}}" folder$="{{hasEntries}}" value="{{name}}" on-change="onItemRename">{{name}}</list-item>
          <span flex></span>
      </div>
      <div subsection closed$="{{closed}}" repeat="moarmoar_t">{{containers}}</div>
    </context-menu-anchor>
  </template>
  <template moarmoar_t>
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
  font-weight: bold;
  padding-bottom: 1px;
}
[folder] {
  font-weight: normal;
  color: purple;
}
[closed] {
  display: none;
}
[color=green] {
  color: green;
}
context-menu-anchor {
  display: block;
}
`
    }
  }
};