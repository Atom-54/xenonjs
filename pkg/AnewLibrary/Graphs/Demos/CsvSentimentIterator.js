/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// TODO: This is WIP:
// 1. Cannot load the .csv - 404: "/data.csv"
// 2. Chart css is wrong

export const graph = {
  "meta":{
    "id":"CsvSentimentIterator"
  },
  "CsvData":{
    "type":"$anewLibrary/Data/Atoms/CsvData",
    "container":"Container",
    "state":{
      "url":"/data.csv",
      "style":{
        "order":0
      }
    }
  },
  "JSONata":{
    "type":"$anewLibrary/Json/Atoms/JSONata",
    "container":"Container",
    "state":{
      "expression":"$filter(\n  $map($, function($v, $i, $a) {\n    $v[0]\n  }), function($v, $i, $a) {\n  $i > 0 and $i < 50\n})[]\n",
      "style":{
        "order":1
      }
    },
    "connections":{
      "json":[
        "CsvData$lines"
      ]
    }
  },
  "Panel":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"Panel5#Container",
    "state":{
      "layout":"column",
      "style":{
        "order":1,
        "padding":"var(--size-1)",
        "flex":"0 0 auto",
        "alignItems":"center"
      }
    }
  },
  "AskButton":{
    "type":"$anewLibrary/Fields/Atoms/Button",
    "container":"Panel#Container",
    "state":{
      "label":"Ask",
      "action":"toggle",
      "style":{
        "order":4,
        "flex":"0 0 auto"
      }
    }
  },
  "TextArea":{
    "type":"$anewLibrary/Fields/Atoms/TextArea",
    "container":"Panel5#Container",
    "state":{
      "text":"Summarize top six reasons that products other than I were chosen.",
      "style":{
        "order":0,
        "padding":"var(--size-2)",
        "fontSize":"var(--font-size-1)"
      }
    }
  },
  "OpenAISimpleChat":{
    "type":"$anewLibrary/OpenAI/Atoms/OpenAISimpleChat",
    "container":"Container",
    "state":{
      "on":true,
      "style":{
        "order":2
      },
      "user":"Summarize top six reasons that products other than I were chosen."
    },
    "connections":{
      "system":[
        "StringFormatter2$result"
      ],
      "user":[
        "TextArea$text"
      ],
      "go":[
        "AskButton$value"
      ]
    }
  },
  "Echo22":{
    "type":"$anewLibrary/Echo",
    "container":"Panel5#Container",
    "state":{
      "style":{
        "flex":"3",
        "padding":"var(--size-3)",
        "order":3,
        "backgroundColor":"white",
        "whiteSpace":"pre-wrap",
        "lineHeight":"180%"
      }
    },
    "connections":{
      "html":[
        "OpenAISimpleChat$result"
      ]
    }
  },
  "ProgressBar":{
    "type":"$anewLibrary/UX/Atoms/ProgressBar",
    "container":"Panel2#Container",
    "state":{
      "height":8,
      "interval":60,
      "percentage":0,
      "style":{
        "padding":"",
        "borderRadius":"var(--radius-3)",
        "order":"6",
        "flex":"0 0 auto"
      }
    },
    "connections":{
      "inProgress":[
        "OpenAISimpleChat$working"
      ]
    }
  },
  "Panel2":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"Panel5#Container",
    "state":{
      "layout":"column",
      "style":{
        "order":2,
        "flex":"0 0 auto",
        "padding":""
      }
    }
  },
  "Table":{
    "type":"$anewLibrary/Data/Atoms/Table",
    "container":"Panel3#Container",
    "state":{
      "options":{
        
      },
      "columns":[
        {
          "name":"chosen",
          "header":"Chosen",
          "width":120
        },
        {
          "name":"reason",
          "header":"Reasoning",
          "XwhiteSpace":"normal"
        }
      ],
      "style":{
        "fontSize":"var(--font-size-0)",
        "order":3,
        "flex":"1"
      }
    },
    "connections":{
      "data":[
        "Iterator$results"
      ]
    }
  },
  "StringFormatter2":{
    "type":"$anewLibrary/Data/Atoms/StringFormatter",
    "container":"Container",
    "state":{
      "format":"${arg0}\n${arg1}\n",
      "arg0":"The JSON array below contains summaries of customer interaction.",
      "style":{
        "order":3
      },
      "arg1":[
        "<html><head>",
        "<title>404 Not Found</title>",
        "</head><body>",
        "<h1>Not Found</h1>",
        "<p>The requested URL was not found on this server.</p>",
        "</body></html>"
      ]
    },
    "connections":{
      "arg1":[
        "JSONata$result"
      ]
    }
  },
  "JSONata3":{
    "type":"$anewLibrary/Json/Atoms/JSONata",
    "container":"Container",
    "state":{
      "expression":"(\n$foo := $map($distinct(*.chosen), function($v) {\n  {\"chosen\": $v, \"count\": $count($filter($.chosen, function($v2) { $v2 = $v }))}\n});\n$bar := {\n    \"labels\": [$foo.chosen], \n    \"datasets\": [{\n        \"label\": \"Products\",\n        \"data\": [$foo.count],\n        \"backgroundColor\": [\n            'red',\n            'green',\n            'blue',\n            'yellow',\n            'purple'\n        ]\n    }]}\n)",
      "style":{
        "order":4
      }
    },
    "connections":{
      "json":[
        "Iterator$results"
      ]
    }
  },
  "Chart":{
    "type":"$anewLibrary/Data/Atoms/Chart",
    "container":"Panel7#Container",
    "state":{
      "type":"pie",
      "style":{
        "order":"1",
        "alignItems":"",
        "backgroundColor":"white",
        "padding":"none",
        "width":"100%"
      },
      "data":null
    },
    "connections":{
      "data":[
        "JSONata3$result"
      ]
    }
  },
  "TabPages":{
    "type":"$anewLibrary/Layout/Atoms/TabPages",
    "container":"Container",
    "state":{
      "tabs":[
        "Information",
        "Knowledge"
      ],
      "style":{
        "width":"auto",
        "flex":"1",
        "order":5
      }
    }
  },
  "Panel3":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"TabPages#pageContainer",
    "state":{
      "layout":"column",
      "style":{
        "flex":"1",
        "backgroundColor":"var(--xcolor-one)",
        "order":0
      }
    }
  },
  "Panel5":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"TabPages#pageContainer",
    "state":{
      "layout":"column",
      "style":{
        "flex":"1",
        "order":1
      }
    }
  },
  "Panel6":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"Panel3#Container",
    "state":{
      "layout":"column",
      "style":{
        "padding":"var(--size-3)",
        "paddingBottom":"0px",
        "backgroundColor":"var(--xcolor-one)",
        "order":0,
        "flex":"0 0 auto"
      }
    }
  },
  "ConsiderButton":{
    "type":"$anewLibrary/Fields/Atoms/Button",
    "container":"Panel6#Container",
    "state":{
      "label":"Consider",
      "action":"toggle",
      "style":{
        "order":3,
        "flex":"0 0 auto",
        "max-width":"100px"
      }
    }
  },
  "Panel4":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"Panel3#Container",
    "state":{
      "layout":"column",
      "style":{
        "padding":"var(--size-1)",
        "order":1,
        "flex":"0 0 auto"
      }
    }
  },
  "ProgressBar2":{
    "type":"$anewLibrary/UX/Atoms/ProgressBar",
    "container":"Panel4#Container",
    "state":{
      "height":8,
      "percentage":0,
      "inProgress":false,
      "interval":60,
      "style":{
        "flex":"0 0 auto",
        "borderRadius":"var(--radius-3)",
        "order":20
      }
    },
    "connections":{
      "inProgress":[
        "OpenAISimpleChat2222$working"
      ]
    }
  },
  "Panel7":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"Panel3#Container",
    "state":{
      "layout":"column",
      "style":{
        "padding":"var(--size-2)",
        "order":2
      }
    }
  },
  "Data22":{
    "type":"$anewLibrary/Data/Atoms/Data",
    "container":"Container",
    "connections":{
      "json":[
        "OpenAISimpleChat2222$result"
      ]
    }
  },
  "JSONata222":{
    "type":"$anewLibrary/Json/Atoms/JSONata",
    "container":"Container",
    "state":{
      "expression":"$filter(\n  $map($, function($v, $i, $a) {\n    $v[0]\n  }), function($v, $i, $a) {\n    $i > 0 and $i <= 50\n})[]\n",
      "style":{
        "order":7
      },
      "json":[
        [
          "<!DOCTYPE HTML PUBLIC -//IETF//DTD HTML 2.0//EN>"
        ],
        [
          "<html><head>"
        ],
        [
          "<title>404 Not Found</title>"
        ],
        [
          "</head><body>"
        ],
        [
          "<h1>Not Found</h1>"
        ],
        [
          "<p>The requested URL was not found on this server.</p>"
        ],
        [
          "</body></html>"
        ]
      ]
    },
    "connections":{
      "json":[
        "CsvData$lines"
      ]
    }
  },
  "Iterator":{
    "type":"$anewLibrary/Data/Atoms/Iterator",
    "container":"Container",
    "state":{
      "stride":"5",
      "style":{
        "order":8
      },
      "source":[
        "<html><head>",
        "<title>404 Not Found</title>",
        "</head><body>",
        "<h1>Not Found</h1>",
        "<p>The requested URL was not found on this server.</p>",
        "</body></html>"
      ]
    },
    "connections":{
      "source":[
        "JSONata222$result"
      ],
      "response":[
        "Data22$value"
      ]
    }
  },
  "OpenAISimpleChat2222":{
    "type":"$anewLibrary/OpenAI/Atoms/OpenAISimpleChat",
    "container":"Container",
    "state":{
      "on":true,
      "user":"",
      "auto":"true",
      "system":"Produce a JSON array with one entry for each input entry. The produced entries should have fields called 'chosen' and 'reason'. 'chosen' is which product was chosen, and 'reason' is a one line summary of why.",
      "kTokens":"2",
      "temperature":"0.1",
      "style":{
        "order":9
      }
    },
    "connections":{
      "user":[
        "Gate$value"
      ]
    }
  },
  "StringFormatter2222":{
    "type":"$anewLibrary/Data/Atoms/StringFormatter",
    "container":"Container",
    "state":{
      "format":"${arg0}\n${arg1}\n",
      "arg0":"The JSON array below contains summaries of customer interaction.",
      "style":{
        "order":10
      }
    },
    "connections":{
      "arg1":[
        "Iterator$data"
      ]
    }
  },
  "Gate":{
    "type":"$anewLibrary/Data/Atoms/Gate",
    "container":"Container",
    "connections":{
      "json":[
        "StringFormatter2222$result"
      ],
      "trigger":[
        "ConsiderButton$value"
      ]
    }
  }
};