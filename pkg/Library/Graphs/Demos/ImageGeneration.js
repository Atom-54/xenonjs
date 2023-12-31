const graph = {
  "meta":{
    "id":"ImageGeneration"
  },
  "TextField":{
    "type":"$library/Fields/Atoms/TextField",
    "container":"Container",
    "state":{
      "label":"Make an image:",
      "style":{
        "borderWidth":"0",
        "padding":"var(--size-2)",
        "order":"1",
        "color":"var(--xcolor-four)",
        "fontSize":"var(--font-size-3)",
        "flex":"0 0 auto"
      }
    }
  },
  "SelectField":{
    "type":"$library/Fields/Atoms/SelectField",
    "container":"Container",
    "state":{
      "label":"Choose a model",
      "options":[
        "dreamlike-art/dreamlike-photoreal-2.0",
        "stabilityai/stable-diffusion-2",
        "prompthero/openjourney-v4"
      ],
      "style":{
        "borderWidth":"0",
        "order":"2",
        "fontSize":"var(--font-size-1)",
        "padding":"var(--size-2)",
        "color":"var(--xcolor-four)",
        "flex":"0 0 auto"
      }
    }
  },
  "ProgressBar":{
    "type":"$library/UX/Atoms/ProgressBar",
    "container":"Container",
    "state":{
      "height":3,
      "interval":100,
      "state":{
        "borderWidth":"0",
        "order":"4",
        "color":"var(--xcolor-three)",
        "flex":"0 0 auto"
      },
      "style":{
        "order":4,
        "flex":"0 0 auto",
        "padding":"var(--size-2) 0"
      }
    },
    "connections":{
      "inProgress":[
        "HuggingFaceImage$working"
      ]
    }
  },
  "Image":{
    "type":"$library/Media/Atoms/Image",
    "container":"Container",
    "state":{
      "style":{
        "borderWidth":"0",
        "order":"5",
        "flex":"1",
        "backgroundColor":"var(--xcolor-one)"
      }
    },
    "connections":{
      "image":"HuggingFaceImage$image"
    }
  },
  "HuggingFaceImage":{
    "type":"$library/HuggingFace/Atoms/HuggingFaceImage",
    "container":"Container",
    "connections":{
      "prompt":"TextField$value",
      "textToImageModel":"SelectField$value",
      "trigger":"Button$value"
    }
  },
  "Button":{
    "type":"$library/Fields/Atoms/Button",
    "container":"Container",
    "state":{
      "action":"toggle",
      "label":"Generate",
      "style":{
        "alignItems":"center",
        "order":"3",
        "flex":"0 0 auto",
        "padding":"var(--size-2)"
      }
    }
  }
};
