const graph = {
  "meta":{
    "id":"ImageCompletion"
  },
  "Image":{
    "type":"$library/Media/Atoms/Image",
    "container":"Container",
    "state":{
      "image":{
        "url":"../Apps/EinsteinHat/einstein.png"
      },
      "style":{
        "order":0,
        "display":"none"
      }
    }
  },
  "OpenAIImageCompletion":{
    "type":"$library/OpenAI/Atoms/OpenAIImageCompletion",
    "container":"Container",
    "state":{
      "enabled":true,
      "style":{
        "order":2
      },
      "image":{
        "url":"../Apps/EinsteinHat/einstein.png"
      }
    },
    "connections":{
      "image":[
        "Image$image"
      ],
      "prompt":[
        "TextField$value"
      ],
      "restart":[
        "Button$value"
      ]
    }
  },
  "Image2":{
    "type":"$library/Media/Atoms/Image",
    "container":"Container",
    "style":{
      "borderWidth":"",
      "order":"3",
      "flex":"1",
      "backgroundColor":"var(--xcolor-one)",
      "padding":"var(--size-2)"
    },
    "connections":{
      "image":[
        "OpenAIImageCompletion$result"
      ]
    },
    "state":{
      "style":{
        "order":3
      }
    }
  },
  "TextField":{
    "type":"$library/Fields/Atoms/TextField",
    "container":"Panel#Container",
    "state":{
      "label":"What should Prof. Einstein wear on his head?",
      "value":"",
      "options":[
        "tiara",
        "helmet",
        "football",
        "headphones"
      ],
      "style":{
        "order":0,
        "flex":"1 0 auto"
      }
    }
  },
  "ProgressBar":{
    "type":"$library/UX/Atoms/ProgressBar",
    "container":"Container",
    "state":{
      "height":2,
      "interval":200,
      "style":{
        "order":2,
        "backgroundColor":"var(--xcolor-one)",
        "padding":"5px 0",
        "flex":"0 0 auto"
      }
    },
    "connections":{
      "inProgress":[
        "OpenAIImageCompletion$working"
      ]
    }
  },
  "Button":{
    "type":"$library/Fields/Atoms/Button",
    "container":"Panel#Container",
    "state":{
      "action":"toggle",
      "label":"complete",
      "style":{
        "order":1,
        "padding":"var(--size-3)",
        "padding-top":"var(--size-7)",
        "flex":"0 0 auto"
      }
    }
  },
  "Panel":{
    "type":"$library/Layout/Atoms/Panel",
    "container":"Container",
    "state":{
      "layout":"row",
      "style":{
        "backgroundColor":"var(--xcolor-one)",
        "order":1,
        "flex":"0 0 auto",
        "padding":"20px 10px 0px 10px"
      }
    }
  }
};