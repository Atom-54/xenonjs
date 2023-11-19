/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const graph = {
  "meta":{
    "id":"SpryGuidance"
  },
  "TextField3":{
    "type":"$anewLibrary/Fields/Atoms/TextField",
    "container":"Container",
    "state":{
      "label":"Text Field",
      "style":{
        "flex":"0 0 auto",
        "padding":"0.5em",
        "order":1
      },
      "options":"[\"My Location\"]"
    }
  },
  "GoogleMap27":{
    "type":"$anewLibrary/Locale/Atoms/GoogleMap",
    "container":"Container",
    "state":{
      "style":{
        "order":2
      }
    },
    "connections":{
      "geolocation":[
        "Geolocation31$geolocation"
      ]
    }
  },
  "Geolocation31":{
    "type":"$anewLibrary/Locale/Atoms/Geolocation",
    "container":"Container",
    "state":{
      "live":true
    },
    "connections":{
      "address":[
        "TextField3$value"
      ]
    }
  }
};
