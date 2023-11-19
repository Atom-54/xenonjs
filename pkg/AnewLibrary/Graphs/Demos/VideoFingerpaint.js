/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const graph = {
  "meta":{
    "id":"VideoFingerpaint"
  },
  "DeviceUx":{
    "type":"$anewLibrary/Media/Atoms/DeviceUx",
    "container":"Panel#Container",
    "state": {
      "DeviceUx":{
        "l":16,
        "t":0,
        "w":384,
        "h":40,
        "borderWidth":"0",
        "borderStyle":"solid",
        "order":"1",
        "width":"auto",
        "height":"auto",
        "backgroundColor":"var(--xcolor-three)",
        "color":"var(--xcolor-four)",
        "padding":"var(--size-2)",
        "borderRadius":"var(--radius-3)",
        "justifyContent":"center",
        "alignItems":"center"
      }
    },
    "connections":{
      "mediaDevices":[
        "MediaStream$mediaDevices"
      ]
    }
  },
  "MediaStream":{
    "type":"$anewLibrary/Media/Atoms/MediaStream",
    "container":"Container",
    "state":{
    },
    "connections":{
      "mediaDeviceState":[
        "DeviceUx$mediaDeviceState"
      ]
    }
  },
  "FrameCapture":{
    "type":"$anewLibrary/Media/Atoms/FrameCapture",
    "container":"Panel#Container",
    "state":{
      "fps":30,
      "style":{
        "borderWidth":"var(--border-size-2)",
        "borderStyle":"solid",
        "color":"var(--xcolor-one)",
        "justifyContent":"center",
        "order":"",
        "backgroundColor":""
      }
    },
    "connections": {
      "stream":["MediaStream$stream"]
    }
  },
  "Holistic":{
    "type":"$anewLibrary/Mediapipe/Atoms/Holistic",
    "container":"Container",
    "connections": {
      "image":["FrameCapture$frame"]
    }
  },
  "ImageComposite":{
    "type":"$anewLibrary/Media/Atoms/ImageComposite",
    "container":"Container",
    "state": {
      "style":{
        "l":320,
        "t":64,
        "w":132,
        "h":132,
        "borderWidth":"var(--border-size-2)",
        "borderStyle":"solid"
      }
    },
    "connections": {
      "imageA":["FrameCapture$frame"],
      "imageB":["PointerPoms$image"]  
    }
  },
  "Image3":{
    "type":"$anewLibrary/Media/Atoms/Image",
    "container":"Panel#Container",
    "state": {
      "image":{
        "alt":"no image"
      },
      "selfie":true,
      "style":{
        "l":4,
        "t":38,
        "w":1042,
        "h":151,
        "borderWidth":"0",
        "borderStyle":"solid",
        "flex":"1",
        "order":"3",
        "width":"auto",
        "borderRadius":"var(--radius-round)",
        "backgroundColor":"var(--xcolor-three)"
      }
    },
    "connections": {
      "image":["ImageComposite$output"]
    }
  },
  "UXToolbar":{
    "type":"$anewLibrary/UX/Atoms/UXToolbar",
    "container":"Panel#Container",
    "state": {
      "actions":[
        {
          "name":"red",
          "ligature":"palette",
          "style":"background-color: red; border-radius: 25px; color: hsla(292, 3%, 20%, 1)",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"red"
        },
        {
          "name":"orange",
          "ligature":"palette",
          "style":"background-color: orange; border-radius: 25px; color: hsla(292, 3%, 20%, 1)",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"orange"
        },
        {
          "name":"yellow",
          "ligature":"palette",
          "style":"background-color: yellow; border-radius: 25px; color: hsla(292, 3%, 20%, 1)",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"yellow"
        },
        {
          "name":"green",
          "ligature":"palette",
          "style":"background-color: green; border-radius: 25px",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"green"
        },
        {
          "name":"lightblue",
          "ligature":"palette",
          "style":"background-color: lightblue; border-radius: 25px; color: hsla(292, 3%, 20%, 1)",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"lightblue"
        },
        {
          "name":"blue",
          "ligature":"palette",
          "style":"background-color: blue; border-radius: 25px",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"blue"
        },
        {
          "name":"purple",
          "ligature":"palette",
          "style":"background-color: purple; border-radius: 25px",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"purple"
        },
        {
          "name":"grey",
          "ligature":"palette",
          "style":"background-color: grey; border-radius: 25px; color: hsla(292, 3%, 20%, 1)",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"grey"
        },
        {
          "name":"white",
          "ligature":"palette",
          "style":"background-color: white; border-radius: 25px; color: hsla(292, 3%, 20%, 1)",
          "action":"set",
          "stateKey":"PointerPoms$color",
          "value":"white"
        }
      ],
      "style":{
        "l":0,
        "t":38,
        "w":425,
        "h":62,
        "borderWidth":"0",
        "borderStyle":"solid",
        "backgroundColor":"var(--xcolor-three)",
        "height":"auto",
        "padding":"var(--size-3)",
        "flex":"none",
        "order":"3",
        "width":"auto",
        "borderRadius":"var(--radius-3)"
      }
    },
    "connections": {
      "event": ["UXActionExecutor$event"]
    }
  },
  "UXActionExecutor": {
    "type": "$anewLibrary/UX/Atoms/UXActionExecutor",
    "container": "Container",
    "state": {},
    "connections": {
      "event": ["UXToolbar$event"]
    }
  },
  "Panel":{
    "type":"$anewLibrary/Layout/Atoms/Panel",
    "container":"Container",
    "state": {
      "layout":"column",
      "center":true
    },
    "style":{
      "l":384,
      "t":32,
      "w":443,
      "h":332,
      "borderWidth":"var(--border-size-4)",
      "borderStyle":"solid",
      "padding":"var(--size-1)",
      "backgroundColor":"var(--xcolor-three)",
      "flex":"1",
      "color":"var(--xcolor-three)",
      "borderRadius":"var(--radius-round)",
      "justifyContent":""
    }
  },
  "VirtualPointer":{
    "type":"$anewLibrary/Mediapipe/Atoms/VirtualPointer",
    "container":"Container",
    "connections": {
      "results":["Holistic$results"]
    }
  },
  "PointerPoms":{
    "type":"$anewLibrary/Mediapipe/Atoms/PointerPoms",
    "container":"Container",
    "state": {
      "penSize":2
    },
    "connections": {
      "tracking":["VirtualPointer$tracking"]
    }
  }
};
