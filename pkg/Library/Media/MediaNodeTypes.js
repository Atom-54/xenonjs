/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Media';

const CompositeOperationValues = [
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

export const MediaNodeTypes = {
  Image: {
    category,
    description: 'Displays an image',
    types: {
      image$image: 'Image',
      image$selfie: 'Boolean'
    },
    type: `$library/Media/Nodes/ImageNode`,
    ligature: 'image'
  },
  DeviceUx: {
    category,
    description: 'Provides UX to control device video and audio inputs and outputs',
    types: {
      defaultStream$streamId: 'String',
      defaultStream$stream: 'Stream'
    },
    type: `$library/Media/Nodes/DeviceUxNode`,
    ligature: 'camera_video'
  },
  Stream: {
    category,
    description: 'Passthrough for stream',
    types: {
      Stream$stream: 'Stream'
    },
    type: `$library/Media/Nodes/StreamNode`,
    ligature: 'stream'
  },
  VideoStream: {
    category,
    description: 'Display video streams',
    types: {
      VideoStream$src: 'String',
      VideoStream$stream: 'Stream'
    },
    type: `$library/Media/Nodes/VideoStreamNode`,
    ligature: 'smart_display'
  },
  FrameCapture: {
    category,
    description: 'Captures a frame image from a video stream',
    types: {
      FrameCapture$stream: 'Stream',
      FrameCapture$frame: 'Image',
      FrameCapture$fps: 'Number'
    },
    type: `$library/Media/Nodes/FrameCaptureNode`,
    ligature: 'screenshot_frame'
  },
  FrameStream: {
    category,
    description: 'Converts given frame(s) into a video stream',
    types: {
      FrameStream$frame: 'Image',
      FrameStream$stream: 'Stream'
    },
    type: `$library/Media/Nodes/FrameStreamNode`,
    ligature: 'capture'
  },
  ImageComposite: {
    category,
    description: 'Composes multiple images together',
    types: {
      ImageComposite$opA: 'CompositeOperation',
      ImageComposite$opAValues: CompositeOperationValues,
      ImageComposite$opB: 'CompositeOperation',
      ImageComposite$opBValues: CompositeOperationValues,    
      ImageComposite$opC: 'CompositeOperation',
      ImageComposite$opCValues: CompositeOperationValues,   
      ImageComposite$opD: 'CompositeOperation',
      ImageComposite$opDValues: CompositeOperationValues,
      ImageComposite$imageA: 'Image',
      ImageComposite$imageB: 'Image',
      ImageComposite$imageC: 'Image',
      ImageComposite$imageD: 'Image',
      ImageComposite$output: 'Image'
    },
    type: `$library/Media/Nodes/ImageCompositeNode`,
    ligature: 'tune'
  },
  VideoSender: {
    category,
    description: 'Sends the camera stream using WebRTC',
    types: {
      VideoSender$frame: 'Image'
    },
    type: '$library/media/Nodes/VideoSenderNode',
    ligature: 'screen_share'
  },
  Listen: {
    category,
    description: 'Listens to audio input and returns the transcript',
    types: {
      SpeechRecognizer$transcript: 'String',
      SpeechRecognizer$interimTranscript: 'String'
    },
    type: `$library/Media/Nodes/ListenNode`,
    ligature: 'hearing'
  },
  Speak: {
    category,
    description: 'Synthesizes audio output speech for the given transcript',
    types: {
      SpeechSynthesizer$transcript: 'String',
      SpeechSynthesizer$voice: 'String',
      SpeechSynthesizer$voiceValues: speechSynthesizerVoices
    },
    type: `$library/Media/Nodes/SpeakNode`,
    ligature: 'voice_selection'
  },
  Masking: {
    category,
    type: `$library/Media/Nodes/MaskingNode`,
    ligature: 'domino_mask'
  }
};