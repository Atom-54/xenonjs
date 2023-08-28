export const UXSchemaNode = {
  "types": {
    "expression": "MultilineText",
    "html": "String",
    "style": "CSSStyle",
    "disabled": "Boolean",
    "canvasLayout": "DesignerNodeCanvasLayoutString",
    "canvasLayoutValues": [
      "default",
      "column",
      "row",
      "absolute"
    ],
    "label": "String",
    "value": "String",
    "layout": "String",
    "layoutValues": [
      "default",
      "column",
      "row",
      "absolute"
    ],
    "center": "Boolean"
  },
  "JSONata_JSONata": {
    "type": "$library/JSONata/Atoms/JSONata",
    "inputs": [
      "expression",
      "json"
    ],
    "outputs": [],
    "bindings": {
      "json": "ObjectInspector_inspector$data"
    },
    "container": "Main_panel#Container"
  },
  "JSONata2_JSONata": {
    "type": "$library/JSONata/Atoms/JSONata",
    "inputs": [
      "json",
      "expression"
    ],
    "outputs": [],
    "bindings": {
      "json": "TagField_field$value"
    },
    "container": "Main_panel#Container"
  },
  "EchoNode_echo": {
    "type": "$library/Echo",
    "inputs": [
      "html",
      "style"
    ],
    "container": "Panel_panel#Container"
  },
  "Main_designer": {
    "type": "$library/Layout/Atoms/DesignerPanel",
    "inputs": [
      "disabled",
      "layout",
      "selected"
    ],
    "outputs": [
      "layout",
      "selected"
    ],
    //"container": "$root$panel#Container"
  },
  "Main_panel": {
    "type": "$library/Layout/Atoms/Panel",
    "inputs": [
      "canvasLayout"
    ],
    "bindings": {
      "layout": "Main_panel$canvasLayout"
    },
    "container": "Main_designer#Container"
  },
  "ObjectInspector_inspector": {
    "type": "$library/Inspector/Atoms/ObjectInspector",
    "inputs": [
      "customInspectors"
    ],
    "outputs": [],
    "bindings": {
      "data": "JSONata2_JSONata$result"
    },
    "container": "Panel_panel#Container"
  },
  "ObjectInspector2_inspector": {
    "type": "$library/Inspector/Atoms/ObjectInspector",
    "inputs": [
      "data",
      "customInspectors"
    ],
    "outputs": [
      "data"
    ],
    "bindings": {
      "data": "JSONata_JSONata$result"
    },
    "container": "Panel_panel#Container"
  },
  "TagField_field": {
    "type": "$library/Fields/Atoms/TagField",
    "inputs": [
      "label",
      "value"
    ],
    "container": "Panel2_panel#Container"
  },
  "Panel_panel": {
    "type": "$library/Layout/Atoms/Panel",
    "inputs": [
      "layout",
      "center",
      "style"
    ],
    "container": "Main_panel#Container"
  },
  "Panel2_panel": {
    "type": "$library/Layout/Atoms/Panel",
    "inputs": [
      "layout",
      "center",
      "style"
    ],
    "container": "Main_panel#Container"
  },
  "state": {
    "Main_designer$disabled": true,
    "Main_designer$style": "width: auto; height: auto;",
    "Main_panel$canvasLayout": "column",
    "Main_designer$layout": {
      "ObjectInspector": {
        "l": 8,
        "t": 8,
        "w": 503,
        "h": 881,
        "borderWidth": "var(--border-size-1)",
        "borderStyle": "solid",
        "flex": "1",
        "order": "1",
        "fontSize": "",
        "borderRadius": "var(--radius-2)"
      },
      "Data": {
        "l": 32,
        "t": 32,
        "w": 132,
        "h": 132,
        "borderWidth": "var(--border-size-2)",
        "borderStyle": "solid"
      },
      "Main": {
        "l": 0,
        "t": 0,
        "w": 798,
        "h": 467,
        "padding": "",
        "fontSize": "var(--font-size-0)",
        "backgroundColor": ""
      },
      "PixiApp": {
        "l": 224,
        "t": 32,
        "w": 350,
        "h": 281,
        "borderWidth": "var(--border-size-2)",
        "borderStyle": "solid",
        "height": {}
      },
      "PixiNuPogodi": {
        "l": 32,
        "t": 32,
        "w": 132,
        "h": 132,
        "borderWidth": "var(--border-size-2)",
        "borderStyle": "solid"
      },
      "Data2": {
        "l": 82,
        "t": 82,
        "w": 132,
        "h": 132,
        "borderWidth": "var(--border-size-2)",
        "borderStyle": "solid"
      },
      "JSONata": {
        "l": 32,
        "t": 32,
        "w": 132,
        "h": 132,
        "borderWidth": "var(--border-size-2)",
        "borderStyle": "solid"
      },
      "StaticText2": {
        "l": 480,
        "t": 320,
        "w": 381,
        "h": 402,
        "borderWidth": "var(--border-size-2)",
        "borderStyle": "solid"
      },
      "Panel": {
        "l": 0,
        "t": 50,
        "w": 936,
        "h": 436,
        "borderWidth": "",
        "borderStyle": "solid",
        "padding": "var(--size-2)",
        "flex": "2",
        "order": "2",
        "backgroundColor": "var(--xcolor-two)",
        "fontSize": "var(--font-size-0)"
      },
      "EchoNode": {
        "l": 511,
        "t": 8,
        "w": 16,
        "h": 881,
        "borderWidth": "0",
        "borderStyle": "solid",
        "order": "2"
      },
      "Panel2": {
        "l": 24,
        "t": 24,
        "w": 750,
        "h": 50,
        "borderWidth": "",
        "borderStyle": "solid",
        "flex": "",
        "height": {},
        "order": "1",
        "padding": "",
        "backgroundColor": "var(--xcolor-two)"
      },
      "TagField": {
        "l": 0,
        "t": 0,
        "w": 750,
        "h": 64,
        "borderWidth": "0",
        "borderStyle": "solid",
        "height": "auto",
        "flex": "1",
        "position": "",
        "backgroundColor": "var(--xcolor-one)",
        "padding": "var(--size-1)"
      },
      "JSONata2": {
        "l": 32,
        "t": 32,
        "w": 132,
        "h": 132,
        "borderWidth": "var(--border-size-2)",
        "borderStyle": "solid"
      },
      "ObjectInspector2": {
        "l": 527,
        "t": 8,
        "w": 503,
        "h": 306,
        "borderWidth": "var(--border-size-1)",
        "borderStyle": "solid",
        "order": "3",
        "flex": "1",
        "borderRadius": "var(--radius-2)"
      }
    },
    "JSONata_JSONata$expression": "{\n \"key\": \"Data\",\n \"title\": \"Sample Data\",\n \"props\": props.{\n   \"name\": name, \n   \"propId\": name,\n   \"store\": {\n     \"$type\": value\n    },\n    \"visible\": true\n  }\n}\n",
    "Panel_panel$layout": "row",
    "TagField_field$label": "Properties",
    "TagField_field$value": "Name,Score,Space,FlimFlan",
    "JSONata2_JSONata$expression": "{\n  \"key\": \"Data\",\n  \"title\": \"Data Typos\",\n  \"props\": $.{\n    \"name\": $,\n    \"propId\": $,\n    \"store\": {\n      \"$type\": \"Type\",\n      \"values\": [\n        \"String\",\n        \"Number\",\n        \"MultilineText\",\n        \"Object\",\n        \"Custom\"\n      ]\n    },\n    \"value\": \"String\",\n    \"visible\": true\n  }\n}",
  }
};