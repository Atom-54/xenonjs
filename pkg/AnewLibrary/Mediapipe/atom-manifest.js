/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Mediapipe';

export const LocaleNodeTypes = {
  FaceMesh: {
    categories: [category],
    description: 'Recognizes face',
    displayName: 'Face Mesh',
    type: '$anewLibrary/Mediapipe/Atoms/FaceMesh',
    ligature: 'face_5',
    inputs: {
      image: 'Image',
    },
    outputs: {
      data: 'FaceMeshData'
    }
  },
  FaceMeshDisplay: {
    categories: [category],
    description: 'Renders face',
    displayName: 'Face Mesh Display',
    type: '$anewLibrary/Mediapipe/Atoms/FaceMeshDisplay',
    ligature: 'face_5',
    inputs: {
      data: 'FaceMeshData'
    },
    outputs: {
      image: 'Image',
    }
  },
  SelfieSegmentation: {
    categories: [category],
    description: 'Segments selfie image',
    displayName: 'Selfie Segmentation',
    type: '$anewLibrary/Mediapipe/Atoms/SelfieSegmentation',
    ligature: 'background_replace',
    inputs: {
      image: 'Image'
    },
    outputs: {
      mask: 'Image'
    },
  },
  Holistic: {
    categories: [category],
    description: 'Uses Mediapipe classifier for pose recognition',
    type: '$anewLibrary/Mediapipe/Atoms/Holistic',
    ligature: 'frame_person',
    inputs: {
      image: 'Image'
    },
    outputs: {
      mask: 'Image',
      results: 'HolisticResults'
    },
  },
  BodyPoseDisplay: {
    categories: [category],
    description: '',
    displayName: 'Body Pose Display',
    type: '$anewLibrary/Mediapipe/Atoms/BodyPoseDisplay',
    ligature: 'hand_bones',
    inputs: {
      data: 'HolisticResults'
    },
    outputs: {
      image: 'Image'
    }
  },
  FingerPaint: {
    categories: [category],
    description: 'Paints and/or erases painting following fingers motion.',
    displayName: 'Finger Paint',
    type: '$anewLibrary/Mediapipe/Atoms/FingerPaint',
    ligature: 'gesture',
    inputs: {
      results: 'HolisticResults',
      image: 'Image',
      color: 'String',
      penSize: 'Number',
      eraserSize: 'Number'
    },
    outputs: {
      image: 'Image'
    }
  },
  VirtualPointer: {
    categories: [category],
    description: 'Tracks finger motion',
    displayName: 'Virtual Pointer',
    type: '$anewLibrary/Mediapipe/Atoms/VirtualPointer',
    ligature: 'pan_tool_alt',
    inputs: {
      results: 'HolisticResults'
    },
    outputs: {
      tracking: 'VirtualPointerTracking'
    }
  },
  PointerPoms: {
    categories: [category],
    description: 'Paints and/or erases according to the given pointer tracking',
    displayName: 'Pointer Poms',
    type: '$anewLibrary/Mediapipe/Atoms/PointerPoms',
    ligature: 'touch_app',
    inputs: {
      tracking: 'VirtualPointerTracking',  
      penSize: 'Number',
      eraserSize: 'Number',
      erase: 'Boolean',
      color: 'String'
    },
    outputs: {
      image: 'Image'
    }
  }
};
