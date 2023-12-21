/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const dataConfigure = {
  "meta":{
    "id":"DataConfigure",
    "path":"a54.00/DataAnalyzer/DataConfigure",
    "atomGraphInfo":{
      "run$DataConfigureGraph$Graph$Description":[
        -776,
        192
      ],
      "run$DataConfigureGraph$Graph$FileField":[
        -528,
        56
      ],
      "run$DataConfigureGraph$Graph$UrlField":[
        -8,
        0
      ],
      "run$DataConfigureGraph$Graph$FileTitle":[
        56,
        80
      ],
      "run$DataConfigureGraph$Graph$CsvPreview":[
        -184,
        32
      ],
      "run$DataConfigureGraph$Graph$CsvData":[
        56,
        -184
      ]
    }
  },
  "MainPanel":{
    "type":"$library/Layout/Atoms/Panel",
    "container":"Container",
    "state":{
      "layout":"column",
      "style":{
        "order":1,
        "width":"100%"
      }
    }
  },
  "UrlField":{
    "type":"$library/Fields/Atoms/TextField",
    "container":"MainPanel#Container",
    "state":{
      "label":"Choose .csv URL:",
      "style":{
        "order":0,
        "flex":"0 0 auto"
      }
    }
  },
  "FileTitle":{
    "type":"$library/Fields/Atoms/TextField",
    "container":"CsvPanel#Container",
    "state":{
      "label":"File name",
      "disabled":true,
      "style":{
        "order":0,
        "flex":"1 0 auto"
      }
    },
    "connections":{
      "value":[
        "FileField$title"
      ]
    }
  },
  "FileField":{
    "type":"$library/Fields/Atoms/FileField",
    "container":"CsvPanel#Container",
    "state":{
      "type":"*.jpg",
      "accept":"",
      "label":"Upload file:",
      "button":"Choose",
      "style":{
        "order":1,
        "flex":"0 0 auto"
      }
    }
  },
  "Description":{
    "type":"$library/Fields/Atoms/TextField",
    "container":"MainPanel#Container",
    "state":{
      "label":"What does the file contains (short description)",
      "placeholder":"",
      "style":{
        "order":3,
        "flex":"0 0 auto"
      }
    },
    "connections":{
      
    }
  },
  "CsvPanel":{
    "type":"$library/Layout/Atoms/Panel",
    "container":"MainPanel#Container",
    "state":{
      "layout":"row",
      "style":{
        "order":1,
        "overflow":"auto",
        "flex":"0 0 auto"
      }
    }
  },
  "CsvPreview":{
    "type":"$library/Fields/Atoms/TextArea",
    "container":"MainPanel#Container",
    "state":{
      "label":"Data preview:",
      "style":{
        "padding":"0.5em",
        "order":2,
        "flex":"0 0 auto"
      }
    },
    "connections":{
      "text":[
        "CsvData$lines"
      ]
    }
  },
  "CsvData":{
    "type":"$library/Data/Atoms/CsvData",
    "container":"MainPanel#Container",
    "state":{
      
    },
    "connections":{
      "url":[
        "UrlField$value"
      ],
      "csv":[
        "FileField$content"
      ]
    }
  }
};
