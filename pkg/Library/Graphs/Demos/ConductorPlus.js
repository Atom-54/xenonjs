/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// TODO: This is WIP:
// 1. Layer doesn't support `graph` input.
// 2. GraphFlanner and GraphAgent weren't ported yet.

const graph = {
  "meta":{
    "id":"ConductorPlus"
  },
  "Layer":{
    "type":"$library/Graph/Atoms/Graph",
    "container":"Container",
    "state": {
      "style":{
        "flex":"1",
        "order":"3",
        "borderWidth":"var(--border-size-1)",
        "color":"var(--xcolor-two)",
        "padding":"var(--size-2)"
      },
    },
    "connections": {
      "graphId":["GraphFlanner$graphId"],
      "graph":["GraphFlanner$graph"]
    }
  },
  "DeviceAudio":{
    "type":"$library/Graph/Atoms/Graph",
    "container":"Panel#Container",
    "state":{
      "graphId":"FirstProject/DeviceAudio",
      "style":{
        "flex":"0 0 auto",
        "order": "0",
        "color":"var(--xcolor-four)",
        "align-items":"center"
      }
    },
  },
  "Image":{
    "type":"$library/Media/Atoms/Image",
    "container":"Panel#Container",
    "state": {
      "image":{
        "url":"https://xenon-js.web.app/assets/site/favicon2.png"
      },
      "style":{
        "borderRadius":"var(--radius-round)",
        "padding":"",
        "borderWidth":"",
        "color":"black",
        "backgroundColor":"black",
        "order":"1",
      }
    }
  },
  "Panel":{
    "type":"$library/Layout/Atoms/Panel",
    "container":"Container",
    "state": {
      "layout":"row",
      "style":{
        "padding":"var(--size-2)",
        "backgroundColor":"var(--xcolor-one)",
        "order":"1"
      },
    }
  },
  "GraphFlanner":{
    "type":"$library/Atom54/Atoms/GraphFlanner",
    "container":"Container",
    "state": {
      "label":"I'd like to:",
      "style":{
        "color":"var(--xcolor-four)",
        "padding":"var(--size-2)",
        "borderWidth":"",
        "order":"2",
        "flex":""
      }
    },
    "connections": {
      "query":["DeviceAudio$SpeechRecognizer$transcript"],
      "graphs":["JSONata$result"]    
    }
  },
  "GraphAgent":{
    "type":"$library/Graph/Atoms/GraphAgent",
    "container":"Container",
    "state": {
      "publishedGraphsUrl":"https://xenon-js-default-rtdb.firebaseio.com/v1/publicGraphs"
    }
  },
  "JSONata":{
    "type":"$library/Json/Atoms/JSONata",
    "container":"Container",
    "state": {
      "expression":"meta"
    },
    "connections":{  
      "json":["GraphAgent$publicGraphs"],
    }
  },
};
