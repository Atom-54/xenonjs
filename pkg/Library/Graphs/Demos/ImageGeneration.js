const graph = {
  "meta":{
    "timestamp":1688761063637,
    "owner":"",
    "graphRects":{
      "TextField":{
        "l":16,
        "t":48,
        "w":200,
        "h":96
      },
      "SelectField":{
        "l":16,
        "t":144,
        "w":200,
        "h":116
      },
      "ProgressBar":{
        "l":544,
        "t":192,
        "w":200,
        "h":156
      },
      "Image":{
        "l":544,
        "t":48,
        "w":200,
        "h":76
      },
      "HuggingFaceImage":{
        "l":304,
        "t":80,
        "w":200,
        "h":96
      }
    },
    "id":"ImageGeneration",
    "designerId":"Main",
    "description":"generate an image using a HuggingFace model of your choice"
  },
  "nodes":{
    "Main":{
      "type":"$library/Layout/Nodes/DesignerNode",
      "container":"root$panel#Container"
    },
    "TextField":{
      "type":"$library/Fields/Nodes/TextFieldNode",
      "container":"Main$panel#Container"
    },
    "SelectField":{
      "type":"$library/Fields/Nodes/SelectFieldNode",
      "container":"Main$panel#Container"
    },
    "ProgressBar":{
      "type":"$library/UX/Nodes/ProgressBarNode",
      "container":"Main$panel#Container"
    },
    "Image":{
      "type":"$library/Media/Nodes/ImageNode",
      "container":"Main$panel#Container"
    },
    "HuggingFaceImage":{
      "type":"$library/HuggingFace/Nodes/HuggingFaceImageNode",
      "container":"Main$panel#Container"
    }
  },
  "state":{
    "Main$designer$disabled":false,
    "Main$designer$style":"width: auto; height: auto;",
    "Main$panel$canvasLayout":"column",
    "ProgressBar$bar$height":3,
    "Main$designer$layout":{
      "HuggingFace":{
        "l":32,
        "t":32,
        "w":132,
        "h":132,
        "borderWidth":"var(--border-size-2)",
        "borderStyle":"solid"
      },
      "TextField":{
        "l":32,
        "t":32,
        "w":631,
        "h":34,
        "borderWidth":"0",
        "borderStyle":"solid",
        "width":"auto",
        "height":"auto",
        "padding":"var(--size-3)",
        "order":"1",
        "color":"var(--xcolor-four)",
        "fontSize":"var(--font-size-3)"
      },
      "Main":{
        "backgroundColor":"var(--xcolor-one)",
        "borderRadius":"var(--radius-5)",
        "padding":"var(--size-5)",
        "borderWidth":"var(--border-size-4)",
        "color":"var(--xcolor-three)",
        "height":"auto",
        "flex":"1",
        "position":""
      },
      "SelectField":{
        "l":32,
        "t":32,
        "w":132,
        "h":132,
        "borderWidth":"0",
        "borderStyle":"solid",
        "order":"2",
        "height":"auto",
        "fontSize":"var(--font-size-1)",
        "padding":"var(--size-3)",
        "color":"var(--xcolor-four)",
        "width":"auto"
      },
      "ProgressBar":{
        "l":32,
        "t":32,
        "w":132,
        "h":132,
        "borderWidth":"0",
        "borderStyle":"solid",
        "order":"3",
        "height":"auto",
        "backgroundColor":"",
        "color":"var(--xcolor-three)",
        "width":"auto"
      },
      "Image":{
        "l":32,
        "t":32,
        "w":132,
        "h":132,
        "borderWidth":"0",
        "borderStyle":"solid",
        "order":"4",
        "flex":"1",
        "height":"auto",
        "width":"auto",
        "backgroundColor":"var(--xcolor-one)"
      },
      "HuggingFaceImage":{
        "l":32,
        "t":32,
        "w":132,
        "h":132,
        "borderWidth":"var(--border-size-2)",
        "borderStyle":"solid"
      }
    },
    "TextField$field$label":"make an image:",
    "SelectField$field$label":"choose a model",
    "SelectField$field$options":[
      "dreamlike-art/dreamlike-photoreal-2.0",
      "stabilityai/stable-diffusion-2",
      "prompthero/openjourney-v4"
    ],
    "ProgressBar$bar$interval":100
  },
  "connections":{
    "HuggingFaceImage$HuggingFace$prompt":"TextField$field$value",
    "HuggingFaceImage$HuggingFace$textToImageModel":"SelectField$field$value",
    "Image$image$image":"HuggingFaceImage$HuggingFace$image",
    "ProgressBar$bar$inProgress":"HuggingFaceImage$HuggingFace$working"
  }
};
