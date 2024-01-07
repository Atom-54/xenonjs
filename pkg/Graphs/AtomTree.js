/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
export const AtomTree = {
  "meta": {
    "id": "AtomTree"
  },
  "Atoms": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "state": {
      "service": "DesignService",
      "task": "GetAtomTree"
    } 
  },
  "DropService": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "state": {
      "service": "DesignService",
      "task": "DesignDragDrop"
    },
    "connections": {
      "data": "AtomListLayout$dropped"
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
  <drop-target></drop-target>
  <template moar_t>
    <context-menu-anchor entry color$="{{color}}" key$="{{id}}" selected$="{{selected}}" active$="{{activated}}" folder$="{{hasEntries}}" on-anchor="onItemContextMenu">
      <drop-target targetkey="{{id}}"></drop-target>
      <div label bar key$="{{id}}" on-click="onItemOpenClose">
        <div bar hidden showing$="{{hasEntries}}">
          <icon folder hidden showing$="{{closed}}">folder</icon>
          <icon folder hidden="{{closed}}">folder_open</icon>
        </div>
        <icon hidden="{{hasEntries}}">{{icon}}</icon>
        <drag-able key="{{id}}">
          <list-item jit name key$="{{id}}" folder$="{{hasEntries}}" value="{{name}}" on-change="onItemRename">{{name}}</list-item>
        </drag-able>
        <span flex></span>
      </div>
      <div subsection closed$="{{closed}}" repeat="moarmoar_t">{{containers}}</div>
    </context-menu-anchor>
  </template>
  <template moarmoar_t>
    <context-menu-anchor entry key$="{{id}}" selected$="{{selected}}" active$="{{activated}}" folder$="{{hasEntries}}" on-anchor="onItemContextMenu">
      <drop-target flex column targetkey="{{id}}" on-target-drop="onItemDrop">
        <div label bar key$="{{id}}" on-click="onItemOpenClose">
          <div bar hidden showing$="{{hasEntries}}">
            <icon folder hidden showing$="{{closed}}">folder</icon>
            <icon folder hidden="{{closed}}">folder_open</icon>
          </div>
          <icon hidden="{{hasEntries}}">{{icon}}</icon>
          <list-item disabled jit name key$="{{id}}" folder$="{{hasEntries}}" value="{{name}}" on-change="onItemRename">{{name}}</list-item>
          <span flex></span>
        </div>
      </drop-target>
      <div subsection closed$="{{closed}}" repeat="moar_t">{{entries}}</div>
      <drop-target targetkey="end"></drop-target>
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
  padding: 0px 0 0px 4px;
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
  Xpadding: 2px 0;
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
drop-target {
  display: block; 
  min-height: 4px;
}
drop-target:hover {
  background-color: rgba(192, 0, 192, 0.3);
}
`
    }
  }
};