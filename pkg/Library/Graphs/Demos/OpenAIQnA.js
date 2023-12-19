/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const graph = {
  "meta":{
    "id":"OpenAIQnA"
  },
  "AskText":{
    "type":"$library/Fields/Atoms/TextField",
    "container":"VerticalPanel#Container",
    "state": {
      "label":"question",
      "style":{
        "height":"auto",
        "order":1,
        "padding":"var(--size-3)",
        "backgroundColor":"var(--xcolor-one)",
        "flex":1,
        "width":"auto"
      }
    },
    "connections":{
      "value":[
        "Listen$transcript"
      ]
    }
  },
  "AnswerText":{
    "type":"$library/Fields/Atoms/StaticText",
    "container":"Container",
    "state":{
      "style":{
        "borderWidth":"var(--border-size-1)",
        "borderStyle":"solid",
        "height":"auto",
        "backgroundColor":"var(--xcolor-one)",
        "padding":"var(--size-3)",
        "flex":1,
        "order":4,
        "borderRadius":"var(--radius-3)",
        "width":"auto"
      }
    },
    "connections":{
      "text":[
        "OpenAIText$result"
      ]
    }
  },
  "OpenAIText":{
    "type":"$library/OpenAI/Atoms/OpenAIText",
    "container":"Container",
    "state":{
      "context":"provide brief informative answer to questions;\n",
      "enabled":true,
      "style":{}
    },
    "connections":{
      "prompt":[
        "AskText$value"
      ],
      "restart":[
        "Button$value"
      ]
    }
  },
  "ProgressBar":{
    "type":"$library/UX/Atoms/ProgressBar",
    "container":"Container",
    "state":{
      "height":2,
      "interval":100,
      "style":{
        "borderWidth":"0px",
        "borderStyle":"solid",
        "height":"auto",
        "flex": "0 0 auto",
        "backgroundColor":"var(--xcolor-one)",
        "order":3,
        "padding":"var(--size-2)",
        "width":"auto"
      }
    },
    "connections":{
      "inProgress":[
        "OpenAIText$working"
      ]
    }
  },
  "Button":{
    "type":"$library/Fields/Atoms/Button",
    "container":"VerticalPanel#Container",
    "state":{
      "action":"toggle",
      "label":"Ask",
      "style":{
        "order":2,
        "height":"auto",
        "flex": "0 0 auto",
        "width":"auto",
        "padding":"var(--size-3)",
        "justifyContent":"end"
      }
    }
  },
  "VerticalPanel":{
    "type":"$library/Layout/Atoms/Panel",
    "container":"Container",
    "state":{
      "layout":"row",
      "style":{
        "order":2,
        "borderWidth":"var(--border-size-1)",
        "borderStyle":"solid",
        "height":"auto",
        "borderRadius":"var(--radius-3)",
        "flex": "0 0 auto",
        "width":"auto",
        "justifyContent":"start"
      }
    }
  },
  "DeviceUx":{
    "type":"$library/Media/Atoms/DeviceUx",
    "container":"Container",
    "state": {
      "style":{
        "order": 1
      }
    },
    "connections": {
      "mediaDevices": ["MediaStream$mediaDevices"],
      "mediaDeviceState": [
        "Listen$mediaDeviceState",
        "Speak$mediaDeviceState"
      ]
    }
  },
  "MediaStream": {
    "type":"$library/Media/Atoms/MediaStream",
    "container":"Container",
    "state": {},
    "connections": {
      "mediaDeviceState": [
        "DeviceUx$mediaDeviceState"
      ]
    }
  },
  "Listen":{
    "type":"$library/Media/Atoms/SpeechRecognizer",
    "container":"Container",
    "state": {
      "style":{}
    },
    "connections": {
      "mediaDeviceState": [
        "DeviceUx$mediaDeviceState"
      ]
    }
  },
  "Speak":{
    "type":"$library/Media/Atoms/SpeechSynthesizer",
    "container":"Container",
    "state": {
      "style":{}
    },
    "connections":{
      "mediaDeviceState":[
        "DeviceUx$mediaDeviceState"
      ],
      "transcript":[
        "OpenAIText$result"
      ]
    }
  }
};
