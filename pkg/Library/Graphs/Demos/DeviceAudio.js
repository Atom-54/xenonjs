/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const graph = {
  "meta":{
    "id":"DeviceAudio"
  },
  "DeviceUx":{
    "type":"$library/Media/Atoms/DeviceUx",
    "container":"Container",
    "state":{
      "style":{
        "order":"0"
      }
    },
    "connections":{
      "mediaDevices":[
        "MediaStream60$mediaDevices"
      ]
    }
  },
  "MediaStream60":{
    "type":"$library/Media/Atoms/MediaStream",
    "container":"Container",
    "state":{
      "streamId":"default",
      "style":{
        "order":2
      },
      "mediaDeviceState":{
        "isCameraEnabled":false,
        "isMicEnabled":false,
        "isAudioEnabled":false
      }
    },
    "connections":{
      "mediaDeviceState":[
        "DeviceUx$mediaDeviceState"
      ]
    }
  },
  "SpeechRecognizer":{
    "type":"$library/Media/Atoms/SpeechRecognizer",
    "container":"Container",
    "state":{
      "style":{
        "order":3
      },
      "mediaDeviceState":{
        "isCameraEnabled":false,
        "isMicEnabled":false,
        "isAudioEnabled":false
      }
    },
    "connections":{
      "mediaDeviceState":[
        "DeviceUx$mediaDeviceState"
      ]
    }
  },
  "SpeechSynthesizer":{
    "type":"$library/Media/Atoms/SpeechSynthesizer",
    "container":"Container",
    "state":{
      "style":{
        "order":4
      },
      "mediaDeviceState":{
        "isCameraEnabled":false,
        "isMicEnabled":false,
        "isAudioEnabled":false
      }
    },
    "connections":{
      "mediaDeviceState":[
        "DeviceUx$mediaDeviceState"
      ]
    }
  }
};