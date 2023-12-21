export const Run = {
  "meta": {
    "id": "Run"
  },
  "DevTools": {
    "type": "$library/DevTools/Atoms/DevTools",
  },
  "Toolbar": {
    "type": "$library/UX/Atoms/UXToolbar",
    "state": {
      "style": {
        "flex": "0 0 auto",
        "padding": "4px"
      },
      "actions": [{
        "action": "trigger",
        "stateKey": "PopOver$show",
        "ligature": "menu"
      },{
        "flex": "1"
      }]
    },
    "connections": {
      "event": ["Action$event"]
    }
  },
  "Action": {
    "type": "$library/UX/Atoms/UXActionExecutor",
    "connections": {
      "event": ["Toolbar$event"]
    }
  },
  "PopOver": {
    "type": "$library/Layout/Atoms/PopOver",
    "connections": {
      "hide": ["FileGraph$FileListLayout$opened"]
    }
  },
  "FileGraph": {
    "type": "$library/Graph/Atoms/Graph",
    "container": "PopOver#Container",
    "containers": [],
    "state": {
      "style": {
        "order": 0
      },
      "graphId": "FileExplorer",
      "UXPopupMenu31$show": null
    }
  },
  "DocumentTabs": {
    "type": "$library/Spectrum/Atoms/SpectrumTabPanels",
    "state": {
      "tabs": [],
      "style": {
        "order": 99
      },
      "closeable": true
    }
  },
  "CloseService": {
    "type": "$library/Data/Atoms/ServiceAccess",
    "container": "DocumentPanels#Container",
    "state": {
      "style": {
        "order": 3
      },
      "service": "DocumentService",
      "task": "Close"
    },
    "connections": {
      "data": [
        "DocumentTabs$closed"
      ]
    }
  }
};