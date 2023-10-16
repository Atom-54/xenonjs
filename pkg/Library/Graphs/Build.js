/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
export const graph = {
  "meta": {
    "id": "Bob",
    "designerId": "Main"
  },
  "nodes": {
    "Auth": {
      "type": "$library/Auth/Nodes/AuthNode"
    },
    "Main": {
      "type": "$library/Layout/Nodes/DesignerNode",
      "container": "root$panel#Container"
    },
    "AuthFlyOut": {
      "type": "$library/Layout/Nodes/FlyOutNode",
      "container": "Main$panel#Container"
    },
    "UserPanel": {
      "type": "$library/Layout/Nodes/PanelNode",
      "container": "AuthFlyOut$flyOut#Container"
    },
    "AuthPanel": {
      "type": "$library/Auth/Nodes/AuthPanelNode",
      "container": "UserPanel$panel#Container"
    },
    "UserSettings": {
      "type": "$library/Auth/Nodes/UserSettingsNode",
      "container": "UserPanel$panel#Container"
    },
    "LeftMainCollapse": {
      "type": "$library/Layout/Nodes/CollapsePanelNode",
      "container": "Main$panel#Container"
    },
    "RightMainCollapse": {
      "type": "$library/Layout/Nodes/CollapsePanelNode",
      "container": "Main$panel#Container"
    },
    "OuterWorkPanel": {
      "type": "$library/Layout/Nodes/PanelNode",
      "container": "Main$panel#Container"
    },
    "UXToolbar": {
      "type": "$library/UX/Nodes/UXToolbarNode",
      "container": "OuterWorkPanel$panel#Container"
    },
    "GetGraphName": {
      "type": "$library/JSONata/Nodes/JSONataNode",
    },
    "GraphName": {
      "type": "$library/EchoNode",
      "container": "UXToolbar$UXToolbar#graphName"
    },
    "GraphStatus": {
      "type": "$library/Graph/Nodes/GraphStatusNode",
      "container": "OuterWorkPanel$panel#Container"
    },
    "WorkPanel": {
      "type": "$library/Layout/Nodes/SplitPanelNode",
      "container": "OuterWorkPanel$panel#Container"
    },
    "DesignLayer": {
      "type": "$library/Graph/Nodes/LayerNode",
      "container": "WorkPanel$splitPanel#Container"
    },
    "NodeGraph": {
      "type": "$library/Graph/Nodes/NodeGraphNode",
      "container": "WorkPanel$splitPanel#Container2"
    },
    "FooterToolbar": {
      "type": "$library/NeonFlan/Nodes/FooterNode",
      "container": "RightMainCollapse$panel#Container"
    },
    "SplitPanel": {
      "type": "$library/Layout/Nodes/SplitPanelNode",
      "container": "RightMainCollapse$panel#Container"
    },
    "NodeInspectorAdaptor": {
      "type": "$library/Inspector/Nodes/NodeInspectorAdaptorNode"
    },
    "NodeCatalog": {
      "type": "$library/Graph/Nodes/LayerNode",
      "container": "LeftMainCollapse$panel#Container"
    },
    "ObjectInspector": {
      "type": "$library/Inspector/Nodes/ObjectInspectorNode",
      "container": "SplitPanel$splitPanel#Container"
    },
    "InspectorToolbar": {
      "type": "$library/UX/Nodes/UXToolbarNode",
      "container": "ObjectInspector$inspector#ToolbarContainer"
    },
    "InfoEcho": {
      "type": "$library/EchoNode",
      "container": "ObjectInspector$inspector#infoContainer"
    },
    "OpenStyleInspector": {
      "type": "$library/Inspector/Nodes/OpenStyleInspectorNode",
      "container": "ObjectInspector$inspector#OpenStyleInspectorContainer"
    },
    "SplitSplitPanel": {
      "type": "$library/Layout/Nodes/SplitPanelNode",
      "container": "SplitPanel$splitPanel#Container2"
    },
    "NodeTree": {
      "type": "$library/Graph/Nodes/NodeTreeNode",
      "container": "SplitSplitPanel$splitPanel#Container"
    },
    "NodeStatus": {
      "type": "$library/Graph/Nodes/NodeStatusNode",
      "container": "SplitSplitPanel$splitPanel#Container2"
    },
    "GraphListFlyOut": {
      "type": "$library/Layout/Nodes/FlyOutNode",
      "container": "Main$panel#Container"
    },
    "GraphList": {
      "type": "$library/Graph/Nodes/GraphListNode",
      "container": "GraphListFlyOut$flyOut#Container"
    },
    "NodeTypeListFlyOut": {
      "type": "$library/Layout/Nodes/FlyOutNode",
      "container": "root$panel#Container"
    },
    "NodeTypeList": {
      "type": "$library/Graph/Nodes/NodeTypeListNode",
      "container": "NodeTypeListFlyOut$flyOut#Container"
    },
    "UxStatusBar": {
      "type": "$library/UX/Nodes/UXSnackBarNode",
      "container": "OuterWorkPanel$panel#Container"
    }
  },
  "state": {
    "DesignLayer$Layer$designable": true,
    "Main$panel$canvasLayout": "row",
    "UserPanel$panel$layout": "row",
    "Main$designer$disabled": true,
    "LeftMainCollapse$panel$size": "240px",
    "BottomWorkCollapse$panel$collapsed": true,
    "BottomWorkCollapse$panel$size": "320px",
    "BottomWorkCollapse$panel$side": "bottom",
    "NodeTypeListFlyOut$flyOut$side": "right",
    "ObjectInspector$inspector$customInspectors": {
      "OpenStyle": true
    },
    "UXToolbar$UXToolbar$actions": [
      {
        "name": "Graphs Menu",
        // "ligature": "dashboard_customize",
        "image": "$xenon/Library/Assets/icons/favicon.png",
        "action": "toggle",
        "stateKey": "GraphListFlyOut$flyOut$show"
      },
      {
        "name": "Graph Name",
        "slot": "graphName",
      },
      {
        "name": "spanner",
        "flex": 1
      },
      {
        "name": "Add Object",
        "ligature": "add",
        "actions": [{
          "action": "set",
          "stateKey": "NodeGraph$Graph$selected",
          "value": null
        }, {
          "action": "toggle",
          "stateKey": "NodeTypeListFlyOut$flyOut$show"  
        }]
      },
      {
        "name": "spanner",
        "flex": 1
      },
      {
        "name": "Run in Run",
        "ligature": "arrow_outward",
        "action": "service",
        "args": {
          "kind": "GraphService",
          "msg": "OpenUrl",
          "data": {"url": "RunInRun"}
        }
      },
      {
        "name": "User Menu",
        "ligature": "account_circle",
        "action": "toggle",
        "stateKey": "AuthFlyOut$flyOut$show"
      },
      {
        "name": "Fullscreen",
        "ligature": "fullscreen",
        "actions": [{
          "action": "toggle",
          "stateKey": "WorkPanel$splitPanel$collapsed"
        },{
          "action": "toggle",
          "stateKey": "RightMainCollapse$panel$collapsed"
        },{
          "action": "toggle",
          "stateKey": "LeftMainCollapse$panel$collapsed"
        }]
      },
      {
        "name": "Zoom Graph",
        "ligature": {
          true: "top_panel_close",
          false: "bottom_panel_close",
          undefined: "bottom_panel_close"
        },
        "action": "toggle",
        "stateKey": "WorkPanel$splitPanel$collapsed"
      },
      {
        "name": "Zoom Inspector",
        "ligature": {
          true: "left_panel_close",
          false: "right_panel_close",
          undefined: "right_panel_close"
        },
        //"action": "toggle",
        // TODO(sjmiles): doesn't render without a stateKey (?)
        "stateKey": "RightMainCollapse$panel$collapsed",
        "actions": [{
          "action": "toggle",
          "stateKey": "RightMainCollapse$panel$collapsed"
        }, {
          "action": "toggle",
          "stateKey": "LeftMainCollapse$panel$collapsed"
        }]
      }
    ],
    "InspectorToolbar$UXToolbar$actions": [
      {
        "name": "Clone Object",
        "ligature": "content_copy",
        "action": "service",
        "args": {
          "kind": "DesignService",
          "msg": "CloneObject"
        }
      },
      {
        "name": "Morph Object", 
        "ligature": "shapes",
        "action": "toggle",
        "stateKey": "NodeTypeListFlyOut$flyOut$show"
      },
      {
        "name": "Delete Object", 
        "ligature": "delete",
        "action": "service",
        "args": {
          "kind": "DesignService",
          "msg": "DeleteSelectedObject"
        }
      }
    ],
    "AtomToolbar$UXToolbar$actions": [
      {
        "name": "Clone Object",
        "ligature": "content_copy",
        "action": "service",
        "args": {
          "kind": "DesignService",
          "msg": "CloneObject"
        }
      },
      {
        "name": "Morph Object", 
        "ligature": "shapes",
        "action": "toggle",
        "stateKey": "NodeTypeListFlyOut$flyOut$show"
      },
      {
        "name": "Delete Object", 
        "ligature": "delete",
        "action": "service",
        "args": {
          "kind": "DesignService",
          "msg": "DeleteSelectedObject"
        }
      }
    ],
    "GetGraphName$JSONata$expression": "meta.id",
    "GraphName$echo$style": "text-align: left",
    // "GraphListOptionsSelect$field$label": "Choose Avatar Generator",
    // "GraphListOptionsSelect$field$options": ["SuperBots", "SuperPets","Elders"],
    "UxStatusBar$UXSnackBar$icon": "info",
    "NodeCatalog$Layer$graphId": "fb:scottmiles/NodeTypeList",
    "Main$designer$layout": {
      "NodeCatalog": {
        "flex": "1"
      },
      "RightMainCollapse": {
        "order": "2"
      },
      "OuterWorkPanel": {
        "flex": "1",
        "order": "1",
        "backgroundColor": "var(--xcolor-one)"
      },
      "WorkPanel": {
        "flex": "1",
        "order": "3",
        "backgroundColor": "var(--xcolor-one)"
      },
      "BottomWorkCollapse": {
        "order": "3"
      },
      "UXToolbar": {
        //"order": "1",
        "height": "auto",
        "fontSize": "var(--font-size-3)",
        "padding": "var(--size-1)",
        "backgroundColor": "var(--xcolor-one)"
      },
      "GraphStatus": {
        "order": "2",
        "height": "auto"
      },
      "Main": {
        "order": "2"
      },
      "DesignLayer": {
        "flex": "1"
      },
      "ObjectInspector": {
        "flex": "1",
        "order": "2"
      },
      "NodeTree": {
        "flex": "1",
        "backgroundColor": "var(--xcolor-one)"
      },
      "NodeStatus": {
        "backgroundColor": "var(--xcolor-one)"
      },
      "InfoEcho": {
        "padding": "var(--size-2)"
      },
      "SplitPanel": {
        "order": 1
      },
      "FooterToolbar": {
        "order": 2,
        "backgroundColor": "var(--xcolor-one)",
        "padding": "10px 0",
        "border-top": "1px solid var(--xcolor-two)"
      },
      "UserPanel": {
        "border": "1px solid var(--xcolor-two)",
        "backgroundColor": "var(--xcolor-one)"
      },
      "AuthPanel": {
        "order": "1",
        "flex": "1",
        "border": "1px solid var(--xcolor-two)",
        "borderRadius": "25px",
        "margin": "10px"
      },
      "UserSettings": {
        "order": "2",
        "flex": "1",
        "border": "1px solid var(--xcolor-two)",
        "borderRadius": "25px",
        "margin": "10px 10px 10px 0"
      }
    }
  },
  "connections": {
    "GraphList$graphAgent$user": "Auth$Auth$user",
    "GraphList$graphList$user": "Auth$Auth$user",
    "UserSettings$settings$user": "Auth$Auth$user",
    "AuthPanel$Panel$user": "Auth$Auth$user",
    "Auth$Auth$requestLogin": "AuthPanel$Panel$requestLogin",
    "Auth$Auth$requestLogout": "AuthPanel$Panel$requestLogout",
    "DesignLayer$Layer$graph": "GraphList$graphAgent$graph",
    "GraphList$graphAgent$graph": "NodeGraph$Graph$graph",
    "NodeGraph$Graph$graph": "GraphList$graphAgent$graph",
    "NodeInspectorAdaptor$adaptor$graph": "GraphList$graphAgent$graph",
    "NodeTree$NodeTree$graph": "GraphList$graphAgent$graph",
    "GraphStatus$GraphStatus$graph": "GraphList$graphAgent$graph",
    "NodeStatus$NodeStatus$graph": "GraphList$graphAgent$graph",
    "GetGraphName$JSONata$json": "GraphList$graphAgent$graph",
    "GraphName$echo$html": "GetGraphName$JSONata$result",
    "NodeGraph$Graph$selected": "NodeTree$NodeTree$selected",
    "NodeInspectorAdaptor$adaptor$selected": "NodeGraph$Graph$selected",
    "NodeStatus$NodeStatus$selected": "NodeGraph$Graph$selected",
    "NodeTree$NodeTree$selected": "NodeGraph$Graph$selected",
    "OpenStyleInspector$inspector$key": "NodeGraph$Graph$selected",
    "ObjectInspector$inspector$data": "NodeInspectorAdaptor$adaptor$data",
    "OpenStyleInspector$inspector$data": "NodeInspectorAdaptor$adaptor$data",
    "InfoEcho$echo$html": "NodeInspectorAdaptor$adaptor$info",
    "UxStatusBar$UXSnackBar$message": "GraphList$graphAgent$message",
    "UxStatusBar$UXSnackBar$open": "GraphList$graphAgent$message"
  }
};
