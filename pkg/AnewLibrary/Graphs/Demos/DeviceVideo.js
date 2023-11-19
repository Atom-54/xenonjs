/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const graph = {
  "meta":{
    "id":"DeviceVideo"
  },
  "DeviceUx43":{
    "type":"$anewLibrary/Media/Atoms/DeviceUx",
    "container":"Container",
    "state":{
      "style":{
        "order":0
      },
      "mediaDevices":{
        "audioinput:Default - Acrux (Bluetooth)":{
          "deviceId":"default",
          "kind":"audioinput",
          "label":"Default - Acrux (Bluetooth)",
          "groupId":"db63a3a749014ab45611480e3e404fc80d8ae83ab62d4f6b0c6f68f760c83680"
        },
        "audioinput:Acrux (Bluetooth)":{
          "deviceId":"56e88d370c4495ec4a486bb6af8d6a3c73585728817765e3c3cb71f7f8aba579",
          "kind":"audioinput",
          "label":"Acrux (Bluetooth)",
          "groupId":"db63a3a749014ab45611480e3e404fc80d8ae83ab62d4f6b0c6f68f760c83680"
        },
        "audioinput:MacBook Pro Microphone (Built-in)":{
          "deviceId":"f7be8090939cf968b4241ab5c8c49f597df737dfbad862f65ee24aa86d8e6803",
          "kind":"audioinput",
          "label":"MacBook Pro Microphone (Built-in)",
          "groupId":"6a7e47d18511357790de9e7ff9103caad5d131c77ea00b593704f94863460ebb"
        },
        "videoinput:FaceTime HD Camera (2C0E:82E3)":{
          "deviceId":"78b9a3cbb15e58bcad7645e71b3741d6da72fb612bb3e0536c888fb9d3b81ee7",
          "kind":"videoinput",
          "label":"FaceTime HD Camera (2C0E:82E3)",
          "groupId":"d34f3f1f64b813a8cb12933120b0b25955964bd01881ea9d96848e9decaf6441"
        },
        "audiooutput:Default - Acrux (Bluetooth)":{
          "deviceId":"default",
          "kind":"audiooutput",
          "label":"Default - Acrux (Bluetooth)",
          "groupId":"db63a3a749014ab45611480e3e404fc80d8ae83ab62d4f6b0c6f68f760c83680"
        },
        "audiooutput:Acrux (Bluetooth)":{
          "deviceId":"b042edc64fca96101afc8ab55c9efefb614cffe28eb4b6216df45e3a8ba1666f",
          "kind":"audiooutput",
          "label":"Acrux (Bluetooth)",
          "groupId":"db63a3a749014ab45611480e3e404fc80d8ae83ab62d4f6b0c6f68f760c83680"
        },
        "audiooutput:MacBook Pro Speakers (Built-in)":{
          "deviceId":"218714e17f1c9a307c3f58c8c8f99499e567495720d18296333e124ff8145963",
          "kind":"audiooutput",
          "label":"MacBook Pro Speakers (Built-in)",
          "groupId":"6a7e47d18511357790de9e7ff9103caad5d131c77ea00b593704f94863460ebb"
        }
      }
    },
    "connections":{
      "mediaDevices":[
        "MediaStream8$mediaDevices"
      ]
    }
  },
  "MediaStream8":{
    "type":"$anewLibrary/Media/Atoms/MediaStream",
    "container":"Container",
    "state":{
      "streamId":"default",
      "style":{
        "order":1
      },
      "mediaDeviceState":{
        "isCameraEnabled":false,
        "isMicEnabled":false,
        "isAudioEnabled":false
      }
    },
    "connections":{
      "mediaDeviceState":[
        "DeviceUx43$mediaDeviceState"
      ]
    }
  },
  "FrameCapture27":{
    "type":"$anewLibrary/Media/Atoms/FrameCapture",
    "container":"Container",
    "state":{
      "fps":30,
      "style":{
        "order":2
      },
      "stream":{
        "id":"default",
        "version":0.7917435685707188
      }
    },
    "connections":{
      "stream":[
        "MediaStream8$stream"
      ]
    }
  }
};
