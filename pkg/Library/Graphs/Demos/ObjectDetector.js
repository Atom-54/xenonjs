export const graph = {
  "meta":{
    "id":"ObjectDetector"
  },
  "ObjectDetector":{
    "type":"$library/TensorFlow/Atoms/ObjectDetector",
    "container":"Container",
    "connections":{
      "image":[
        "DeviceVideo$FrameCapture$frame"
      ],
      "display":[
        "FrameCapture2$frame"
      ]
    }
  },
  "DeviceVideo":{
    "type":"$library/Graph/Atoms/Graph",
    "container":"Container",
    "state":{
      "graphId":"FirstProject/DeviceVideo",
      "FrameCapture$fps":5,
      "style":{
        "order":"1",
        "flex":"0 0 auto",
        "align-items":"center"
      }
    }
  },
  "Image2":{
    "type":"$library/Media/Atoms/Image",
    "container":"Container",
    "state":{
      "style":{
        "borderWidth":"",
        "flex":"1",
        "order":"4",
        "alignItems":"center"
      }
    },
    "connections":{
      "image":[
        "ObjectDetector$display"
      ]
    }
  },
  "JSONata":{
    "type":"$library/Json/Atoms/JSONata",
    "container":"Container",
    "connections":{
      "json":[
        "ObjectDetector$data"
      ],
      "expression":[
        "StringFormatter$result"
      ]
    }
  },
  "TextField":{
    "type":"$library/Fields/Atoms/TextField",
    "container":"Container",
    "state":{
      "value":"cat",
      "label":"Looking for:",
      "style":{
        "order":"2",
        "padding":"var(--size-2)",
        "flex":"0 0 auto"
      }
    }
  },
  "StringFormatter":{
    "type":"$library/Data/Atoms/StringFormatter",
    "container":"Container",
    "state":{
      "format":"$boolean($[class=\"${arg0}\"]) ? 'padding: 7px' : 'display: none'",
      "style":{
        "order":7
      },
      "arg0":"cat"
    },
    "connections":{
      "arg0":[
        "TextField$value"
      ]
    }
  },
  "FrameCapture2":{
    "type":"$library/Media/Atoms/FrameCapture",
    "container":"Container",
    "state":{
      "fps":60,
      "style":{
        "order":8
      }
    },
    "connections":{
      "stream":[
        "DeviceVideo$MediaStream$stream"
      ]
    }
  },
  "Echo":{
    "type":"$library/Echo",
    "container":"Panel2#Container",
    "style":{
      "style":{
        "borderWidth":"",
        "backgroundColor":"violet",
        "fontSize":"var(--font-size-2)",
        "borderRadius":"var(--radius-5)",
        "color":"var(--xcolor-one)",
        "alignItems":"center",
        "flex":"1"
      }
    },
    "connections":{
      "html":[
        "StringFormatter2$result"
      ],
      "style":[
        "JSONata$result"
      ]
    }
  },
  "StringFormatter2":{
    "type":"$library/Data/Atoms/StringFormatter",
    "container":"Container",
    "state":{
      "format":"I see the ${arg0}!",
      "style":{
        "order":10
      },
      "arg0":"cat"
    },
    "connections":{
      "arg0":[
        "TextField$value"
      ]
    }
  },
  "Panel2":{
    "type":"$library/Layout/Atoms/Panel",
    "container":"Container",
    "state":{
      "layout":"column",
      "style":{
        "order":"3",
        "fontSize":"var(--font-size-3)",
        "alignItems":"center",
        "maxHeight":"2em",
        "color":"var(--xcolor-brand)"
      }
    }
  }
};
