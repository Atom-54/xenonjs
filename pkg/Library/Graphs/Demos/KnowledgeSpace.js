const graph = {
  "meta":{
    "graphRects":{
      "CollapsePanel":{
        "h":136,
        "l":80,
        "t":464,
        "w":200
      },
      "ColumnNata":{
        "h":76,
        "l":896,
        "t":32,
        "w":200
      },
      "Data":{
        "l":352,
        "t":48,
        "w":200,
        "h":60
      },
      "Echo":{
        "h":76,
        "l":624,
        "t":624,
        "w":200
      },
      "Echo2":{
        "l":896,
        "t":624,
        "w":200,
        "h":76
      },
      "Grid":{
        "l":1152,
        "t":32,
        "w":200,
        "h":96
      },
      "KnowledgeSpace":{
        "l":80,
        "t":176,
        "w":200,
        "h":76
      },
      "LocalStorage":{
        "h":76,
        "l":352,
        "t":624,
        "w":200
      },
      "OpenAISimpleChat":{
        "l":624,
        "t":448,
        "w":200,
        "h":116
      },
      "Panel":{
        "h":96,
        "l":80,
        "t":528,
        "w":200
      },
      "PromptNata":{
        "l":352,
        "t":336,
        "w":200,
        "h":76
      },
      "RowNata":{
        "l":896,
        "t":336,
        "w":200,
        "h":76
      },
      "StringFormatter":{
        "l":352,
        "t":144,
        "w":200,
        "h":156
      },
      "StringFormatter2":{
        "l":896,
        "t":144,
        "w":200,
        "h":156
      },
      "TagField":{
        "l":80,
        "t":32,
        "w":200,
        "h":76
      },
      "ProgressBar":{
        "l":896,
        "t":432,
        "w":200,
        "h":156
      },
      "Button":{
        "l":624,
        "t":272,
        "w":200,
        "h":96
      }
    },
    "owner":"",
    "readonly":false,
    "timestamp":1691959626310,
    "id":"KnowledgeSpace",
    "designerId":"Main",
    "description":"query OpenAI and get structured responses"
  },
  "nodes":{
    "CollapsePanel":{
      "container":"Main$panel#Container",
      "type":"$library/Layout/Nodes/CollapsePanelNode"
    },
    "ColumnNata":{
      "container":"Main$panel#Container",
      "type":"$library/JSONata/Nodes/JSONataNode"
    },
    "Data":{
      "container":"Main$panel#Container",
      "type":"$library/Data/Nodes/DataNode"
    },
    "Echo":{
      "container":"CollapsePanel$panel#Container",
      "type":"$library/EchoNode"
    },
    "Echo2":{
      "container":"CollapsePanel$panel#Container",
      "type":"$library/EchoNode"
    },
    "Grid":{
      "container":"Panel$panel#Container",
      "type":"$library/Data/Nodes/TableNode"
    },
    "KnowledgeSpace":{
      "container":"Panel$panel#Container",
      "type":"$library/Fields/Nodes/TextAreaNode"
    },
    "LocalStorage":{
      "container":"Main$panel#Container",
      "type":"$library/LocalStorage/Nodes/LocalStorageNode"
    },
    "Main":{
      "container":"root$panel#Container",
      "type":"$library/Layout/Nodes/DesignerNode"
    },
    "OpenAISimpleChat":{
      "container":"Main$panel#Container",
      "type":"$library/OpenAI/Nodes/OpenAISimpleChatNode"
    },
    "Panel":{
      "container":"Main$panel#Container",
      "type":"$library/Layout/Nodes/PanelNode"
    },
    "PromptNata":{
      "container":"Main$panel#Container",
      "type":"$library/JSONata/Nodes/JSONataNode"
    },
    "RowNata":{
      "container":"Main$panel#Container",
      "type":"$library/JSONata/Nodes/JSONataNode"
    },
    "StringFormatter":{
      "container":"Main$panel#Container",
      "type":"$library/Data/Nodes/StringFormatterNode"
    },
    "StringFormatter2":{
      "container":"Main$panel#Container",
      "type":"$library/Data/Nodes/StringFormatterNode"
    },
    "TagField":{
      "container":"Panel$panel#Container",
      "type":"$library/Fields/Nodes/TagFieldNode"
    },
    "ProgressBar":{
      "type":"$library/UX/Nodes/ProgressBarNode",
      "container":"Panel$panel#Container"
    },
    "Button":{
      "type":"$library/Fields/Nodes/ButtonNode",
      "container":"Panel$panel#Container"
    }
  },
  "state":{
    "Grid$chart$options":{},
    "Main$designer$disabled":false,
    "Main$designer$style":"width: auto; height: auto;",
    "Main$panel$canvasLayout":"column",
    "Panel$panel$layout":"column",
    "ProgressBar$bar$height":2,
    "Button$button$action":"toggle",
    "CollapsePanel$panel$collapsed":true,
    "CollapsePanel$panel$side":"right",
    "CollapsePanel$panel$size":"240px",
    "ColumnNata$JSONata$expression":"cols.{\"header\": $, \"name\": $}",
    "Echo$echo$style":"overflow: hidden !important; white-space: pre-wrap;",
    "Echo2$echo$style":"white-space: wrap",
    "KnowledgeSpace$field$label":"Knowledge Space",
    "KnowledgeSpace$field$text":"Five nice places to visit in Napa, CA.",
    "LocalStorage$LocalStorage$key":"flarnFlarn",
    "Main$designer$layout":{
      "CollapsePanel":{
        "borderStyle":"solid",
        "borderWidth":"",
        "flex":"",
        "h":455,
        "l":453,
        "order":"2",
        "position":"",
        "t":0,
        "w":453,
        "display":"none"
      },
      "ColumnNata":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "Data":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "Echo":{
        "backgroundColor":"var(--xcolor-one)",
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "flex":"1",
        "fontSize":"var(--font-size-0)",
        "h":291,
        "l":0,
        "padding":"var(--size-2)",
        "t":0,
        "w":240
      },
      "Echo2":{
        "backgroundColor":"var(--xcolor-one)",
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "flex":"1",
        "fontSize":"var(--font-size-0)",
        "h":209,
        "l":0,
        "padding":"var(--size-3)",
        "t":193,
        "w":240
      },
      "GoButton":{
        "borderStyle":"solid",
        "borderWidth":"",
        "h":36,
        "height":"auto",
        "l":0,
        "order":"2",
        "padding":"var(--size-2)",
        "t":203.6953125,
        "w":928
      },
      "Grid":{
        "borderStyle":"solid",
        "borderWidth":"0",
        "flex":"1",
        "h":59,
        "l":0,
        "order":"5",
        "t":267.1953125,
        "w":813,
        "width":"auto",
        "height":"auto"
      },
      "GridData":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "KnowledgeSpace":{
        "borderStyle":"solid",
        "borderWidth":"0",
        "h":164,
        "l":0,
        "t":0,
        "w":671,
        "height":{
          
        },
        "order":"1",
        "width":"auto"
      },
      "LocalStorage":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "Main":{
        "h":612,
        "l":0,
        "t":0,
        "w":856,
        "backgroundColor":"var(--xcolor-one)"
      },
      "OpenAISimpleChat":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "Panel":{
        "borderStyle":"solid",
        "borderWidth":"0",
        "flex":"1",
        "h":23,
        "l":0,
        "t":0,
        "w":653,
        "height":null,
        "width":null
      },
      "PromptNata":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "RowNata":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "StringFormatter":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "StringFormatter2":{
        "borderStyle":"solid",
        "borderWidth":"var(--border-size-2)",
        "h":132,
        "l":32,
        "t":32,
        "w":132
      },
      "TagField":{
        "borderStyle":"solid",
        "borderWidth":"0",
        "h":45,
        "height":"auto",
        "l":0,
        "order":"2",
        "t":159,
        "w":928,
        "width":"auto"
      },
      "ProgressBar":{
        "l":32,
        "t":32,
        "w":132,
        "h":132,
        "borderWidth":"",
        "borderStyle":"solid",
        "height":"auto",
        "order":"4",
        "width":"auto"
      },
      "Button":{
        "l":32,
        "t":32,
        "w":132,
        "h":132,
        "borderWidth":"0",
        "borderStyle":"solid",
        "order":"3",
        "height":"auto",
        "flex":"",
        "justifyContent":"end",
        "padding":"var(--size-3)",
        "width":"auto",
        "alignItems":"end"
      }
    },
    "OpenAISimpleChat$OpenAISimpleChat$assistant":"I will list whatever you describe.",
    "OpenAISimpleChat$OpenAISimpleChat$system":"Make lists as an Array of items in JSON, each item is an Array of field values. Ensure the list has correct use of double-quotes for JSON. There is no top-level object. Only output the JSON.",
    "PromptNata$JSONata$expression":"(\n    $s := query;\n    $chunks := [\n        \"Please make a list of \" & $s & \".\\nThe fields are: \",\n        $join($map(cols[], function($v, $i) { ($i + 1) & \". \" & $v }), \", \")\n    ];\n    $join($chunks, \"\");\n)",
    "RowNata$JSONata$expression":"(\n    $map(rows[], function($v, $i, $a) {\n        $merge(\n            $map($v, function($v, $i, $a) {\n                {cols[$i]: $v}\n            })\n        ) \n    })  \n)",
    "StringFormatter$formatter$arg2":"",
    "StringFormatter$formatter$arg4":"",
    "StringFormatter$formatter$format":"{\"cols\":${arg0},\"query\": \"${arg1}\"}",
    "StringFormatter2$formatter$format":"{\"rows\": ${arg0}, \"cols\": ${arg1}}",
    "TagField$field$label":"Facts to Gather",
    "TagField$field$value":"Name, Location, Cost, Attraction",
    "ProgressBar$bar$interval":100,
    "Button$button$label":"Search"
  },
  "connections":{
    "ColumnNata$JSONata$json":"StringFormatter$formatter$result",
    "Data$Data$json":"TagField$field$json",
    "Echo$echo$html":"OpenAISimpleChat$OpenAISimpleChat$result",
    "Echo2$echo$html":"StringFormatter$formatter$result",
    "Grid$chart$columns":"ColumnNata$JSONata$result",
    "Grid$chart$data":"RowNata$JSONata$result",
    "LocalStorage$LocalStorage$storeValue":"KnowledgeSpace$field$text",
    "OpenAISimpleChat$OpenAISimpleChat$user":"PromptNata$JSONata$result",
    "PromptNata$JSONata$json":"StringFormatter$formatter$result",
    "RowNata$JSONata$json":"StringFormatter2$formatter$result",
    "StringFormatter$formatter$arg0":"Data$Data$value",
    "StringFormatter$formatter$arg1":"KnowledgeSpace$field$text",
    "StringFormatter2$formatter$arg0":"OpenAISimpleChat$OpenAISimpleChat$result",
    "StringFormatter2$formatter$arg1":"TagField$field$value",
    "ProgressBar$bar$inProgress":"OpenAISimpleChat$OpenAISimpleChat$working",
    "Button$button$value":"OpenAISimpleChat$OpenAISimpleChat$working",
    "OpenAISimpleChat$OpenAISimpleChat$on":"Button$button$value"
  }
};
