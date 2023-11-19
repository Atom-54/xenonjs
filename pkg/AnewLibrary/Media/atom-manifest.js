/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Media';

const compositeOperationValues = [
  'source-over',
  'source-in',
  'source-out',
  'source-atop',
  'destination-over',
  'destination-in',
  'destination-out',
  'destination-atop',
  'lighter',
  'copy',
  'xor',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity'
];

const speechSynthesizerVoices = [
  "Samantha",
  "Albert",
  "Bad News",
  "Bahh",
  "Bells",
  "Boing",
  "Bubbles",
  "Cellos",
  "Daniel",
  "Wobble",
  "Eddy (English (UK))",
  "Eddy (English (US))",
  "Flo (English (UK))",
  "Flo (English (US))",
  "Fred",
  "Good News",
  "Grandma (English (UK))",
  "Grandma (English (US))",
  "Grandpa (English (UK))",
  "Grandpa (English (US))",
  "Jester",
  "Junior",
  "Karen",
  "Kathy",
  "Moira",
  "Organ",
  "Superstar",
  "Ralph",
  "Reed (English (UK))",
  "Reed (English (US))",
  "Rishi",
  "Rocko (English (UK))",
  "Rocko (English (US))",
  "Sandy (English (UK))",
  "Sandy (English (US))",
  "Shelley (English (UK))",
  "Shelley (English (US))",
  "Tessa",
  "Trinoids",
  "Whisper",
  "Zarvox",
  "Google US English",
  "Google UK English Female",
  "Google UK English Male"
];

export const Media = {
  Image: {
    categories: [category, 'Common'],
    description: 'Displays an image',
    ligature: 'image',
    type: '$anewLibrary/Media/Atoms/Image',
    inputs: {
      image: 'Image',
      selfie: 'Boolean'
    }
  },
  DeviceUx: {
    categories: [category],
    description: 'Provides UX to control device video and audio inputs and outputs',
    displayName: 'Device UX',
    type: `anewLibrary/Media/Atoms/DeviceUx`,
    ligature: 'camera_video',
    inputs: {
      mediaDeviceState: 'MediaDeviceState',
      mediaDevices: '[Pojo]'
    },
    outputs: {
      mediaDeviceState: 'MediaDeviceState'
    }
    // {
    //   defaultStream$streamId: 'String',
    //   defaultStream$stream: 'Stream'
    // },
  },
  MediaStream: {
    categories: [category],
    description: 'Device video and audio streams',
    displayName: 'Media Stream',
    type: `anewLibrary/Media/Atoms/MediaStream`,
    ligature: 'camera_video',
    inputs: {
      mediaDeviceState: 'MediaDeviceState',
      streamId: 'String'
    },
    outputs: {
      mediaDevices: '[Pojo]',
      stream: 'Stream'
    },
    state: {
      streamId: 'default'
    }
  },
  SpeechRecognizer: {
    categories: [category],
    description: 'Listens to audio input and returns the transcript',
    displayName: 'Speech Recognizer',
    type: `anewLibrary/Media/Atoms/SpeechRecognizer`,
    ligature: 'hearing',
    inputs: {
      mediaDeviceState: 'MediaDeviceState'
    },
    outputs: {
      mediaDeviceState: 'MediaDeviceState',
      transcript: 'String',
      interimTranscript: 'String'
    }
  },
  SpeechSynthesizer: {
    categories: [category],
    description: 'Synthesizes audio output speech for the given transcript',
    displayName: 'Speech Synthesizer',
    type: `anewLibrary/Media/Atoms/SpeechSynthesizer`,
    ligature: 'record_voice_over',
    inputs: {
      voice: 'Voice|String',
      transcript: 'String',
      lang: 'String',
      mediaDeviceState: 'MediaDeviceState'
    },
    outputs: {
      mediaDeviceState: 'MediaDeviceState'
    },
    types: {
      Voice: speechSynthesizerVoices
    }
  },
  FrameCapture: {
    categories: [category],
    description: 'Captures a frame image from a video stream',
    displayName: 'Frame Capture',
    type: `$library/Media/Nodes/FrameCaptureNode`,
    ligature: 'screenshot_frame',
    inputs: {
      stream: 'Stream',
      fps: 'Number'
    },
    outputs: {
      frame: 'Image'
    }
  },
  ImageComposite: {
    categories: [category],
    description: 'Composes multiple images together',
    displayName: 'Image Composite',
    type: `$library/Media/Nodes/ImageCompositeNode`,
    ligature: 'tune',
    inputs: {
      opA: 'CompositeOperation|String',
      opB: 'CompositeOperation|String',
      opC: 'CompositeOperation|String',
      opD: 'CompositeOperation|String',
      imageA: 'Image',
      imageB: 'Image',
      imageC: 'Image',
      imageD: 'Image'
    },
    outputs: {
      output: 'Image'
    },
    types: {
      CompositeOperation: compositeOperationValues
    }
  }
};