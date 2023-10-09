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
    "AuthFlyOut": {
      "type": "$library/Layout/Nodes/FlyOutNode",
      "container": "Main$panel#Container"
    },
    "UserPanel": {
      "type": "$library/Layout/Nodes/PanelNode",
      "container": "AuthFlyOut$flyOut#Container"
    },
    "Auth": {
      "type": "$library/Auth/Nodes/AuthNode",
      "container": "UserPanel$panel#Container"
    },
    "UserSettings": {
      "type": "$library/Auth/Nodes/UserSettingsNode",
      "container": "UserPanel$panel#Container"
    },
    "Main": {
      "type": "$library/Layout/Nodes/DesignerNode",
      "container": "root$panel#Container"
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
    "SplitPanel": {
      "type": "$library/Layout/Nodes/SplitPanelNode",
      "container": "RightMainCollapse$panel#Container"
    },
    "FooterToolbar": {
      "type": "$library/NeonFlan/Nodes/FooterNode",
      "container": "RightMainCollapse$panel#Container"
    },
    "NodeInspectorAdaptor": {
      "type": "$library/Inspector/Nodes/NodeInspectorAdaptorNode"
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
    // "AtomToolbar": {
    //   "type": "$library/UX/Nodes/UXToolbarNode",
    //   "container": "design$Main$designer#ToolbarContainer"
    // },
    "GraphListFlyOut": {
      "type": "$library/Layout/Nodes/FlyOutNode",
      "container": "Main$panel#Container"
    },
    "GraphList": {
      "type": "$library/Graph/Nodes/GraphListNode",
      "container": "GraphListFlyOut$flyOut#Container"
    },
    // "GraphStylizer": {
    //   "type": "$library/Graph/Nodes/GraphStylizerNode"
    // },
    // "GraphListOptionsCollapse": {
    //   "type": "$library/Layout/Nodes/CollapsePanelNode",
    //   "container": "GraphList$graphList#settings"
    // },
    // "GraphListOptionsSelect": {
    //   "type": "$library/Fields/Nodes/SelectFieldNode",
    //   "container": "GraphListOptionsCollapse$panel#Container"
    // },
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
    "BottomWorkCollapse$panel$collapsed": true,
    "BottomWorkCollapse$panel$size": "320px",
    "BottomWorkCollapse$panel$side": "bottom",
    "NodeTypeListFlyOut$flyOut$side": "right",
    "ObjectInspector$inspector$customInspectors": {
      "OpenStyle": true
    },
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
        "action": "toggle",
        "stateKey": "RightMainCollapse$panel$collapsed"
      }
    ],
    "GetGraphName$JSONata$expression": "meta.id",
    "GraphName$echo$style": "text-align: left",
    // "GraphListOptionsSelect$field$label": "Choose Avatar Generator",
    // "GraphListOptionsSelect$field$options": ["SuperBots", "SuperPets","Elders"],
    "UxStatusBar$UXSnackBar$icon": "info",
    "Main$designer$layout": {
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
        "flex": "1"
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
      "Auth": {
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
    "DesignLayer$Layer$graph": "GraphList$graphAgent$graph",
    "UserSettings$settings$user": "Auth$Auth$user",
    //
    "GraphList$graphAgent$graph": "NodeGraph$Graph$graph",
    "NodeGraph$Graph$graph": "GraphList$graphAgent$graph",
    "NodeInspectorAdaptor$adaptor$graph": "GraphList$graphAgent$graph",
    "NodeTree$NodeTree$graph": "GraphList$graphAgent$graph",
    "GraphStatus$GraphStatus$graph": "GraphList$graphAgent$graph",
    "NodeStatus$NodeStatus$graph": "GraphList$graphAgent$graph",
    //
    "GetGraphName$JSONata$json": "GraphList$graphAgent$graph",
    "GraphName$echo$html": "GetGraphName$JSONata$result",
    //
    "NodeGraph$Graph$selected": "NodeTree$NodeTree$selected",
    "NodeInspectorAdaptor$adaptor$selected": "NodeGraph$Graph$selected",
    "NodeStatus$NodeStatus$selected": "NodeGraph$Graph$selected",
    "NodeTree$NodeTree$selected": "NodeGraph$Graph$selected",
    //
    "OpenStyleInspector$inspector$key": "NodeGraph$Graph$selected",
    "ObjectInspector$inspector$data": "NodeInspectorAdaptor$adaptor$data",
    "OpenStyleInspector$inspector$data": "NodeInspectorAdaptor$adaptor$data",
    "InfoEcho$echo$html": "NodeInspectorAdaptor$adaptor$info",
    "InspectorToolbar$UXToolbar$actions": "AtomToolbar$UXToolbar$actions",

    "UxStatusBar$UXSnackBar$message": "GraphList$graphAgent$message",
    "UxStatusBar$UXSnackBar$open": "GraphList$graphAgent$message"
  }
};
