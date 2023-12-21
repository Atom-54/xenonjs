/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const graph = {
  "meta":{
    "id":"DataAnalyzer",
    "path":"a54.00/DataAnalyzer/DataAnalyzer",
    "atomGraphInfo":{
      "run$DataAnalyzerGraph$Graph$TabPages":[
        -584,
        64
      ],
      "run$DataAnalyzerGraph$Graph$Configure":[
        192,
        112
      ],
      "run$DataAnalyzerGraph$Graph$Info":[
        312,
        112
      ],
      "run$DataAnalyzerGraph$Graph$Knowledge":[
        56,
        32
      ],
      "run$DataAnalyzerGraph$Graph$Folders60":[
        264,
        -32
      ],
      "run$DataAnalyzerGraph$Graph$Image49":[
        8,
        -8
      ]
    }
  },
  "TabPages":{
    "type":"$library/Layout/Atoms/TabPages",
    "container":"Container",
    "state":{
      "tabs":[
        "Configure",
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
  "Configure":{
    "type":"$library/Graph/Atoms/Graph",
    "container":"TabPages#pageContainer",
    "state":{
      "graphId":"DataAnalyzer/DataConfigure",
      "UrlField$value":"$library/../../../data.csv",
      "Description$value": "summaries of customer interaction",
      "style":{
        "order":0,
        "flex":"1 1 auto",
        "align-items":"center"
      }
    }
  },
  "Info":{
    "type":"$library/Graph/Atoms/Graph",
    "container":"TabPages#pageContainer",
    "state":{
      "graphId":"DataAnalyzer/DataInfo",
      "style":{
        "order":0,
        "flex":"1 1 auto",
        "align-items":"center"
      }
    },
    "connections":{
      "JSONata$json":[
        "Configure$CsvData$lines"
      ]
    }
  },
  "Knowledge":{
    "type":"$library/Graph/Atoms/Graph",
    "container":"TabPages#pageContainer",
    "state":{
      "graphId":"DataAnalyzer/DataKnowledge",
      "style":{
        "order":1,
        "flex":"1 1 auto",
        "align-items":"center"
      }
    },
    "connections":{
      "JSONata$json":[
        "Configure$CsvData$lines"
      ],
      "StringFormatter$arg1": [
        "Configure$Description$value"
      ]
    }
  }
};
