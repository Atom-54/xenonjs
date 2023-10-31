/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'AI';

export const MediapipeNodeTypes = {
  // PoseNode: {
  //   category,
  //   types: {
  //     Pose$image: 'Image',
  //     Pose$pose: 'PoseData'
  //   },
  //   type: `$library/Mediapipe/Nodes/PoseNode`
  // },
  FaceMesh: {
    category,
    description: 'Recognizes face',
    types: {
      FaceMesh$image: 'Image',
      FaceMesh$data: 'FaceMeshData'
    },
    type: `$library/Mediapipe/Nodes/FaceMeshNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'face_5'
  },
  FaceMeshDisplay: {
    category,
    description: 'Renders face',
    types: {
      FaceMeshDisplay$image: 'Image',
      FaceMeshDisplay$data: 'FaceMeshData'
    },
    type: `$library/Mediapipe/Nodes/FaceMeshDisplayNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'face_5'
  },
  SelfieSegmentation: {
    category,
    description: 'Segments selfie image',
    types: {
      SelfieSegmentation$image: 'Image',
      SelfieSegmentation$mask: 'Image'
    },
    type: `$library/Mediapipe/Nodes/SelfieSegmentationNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'background_replace'
  },
  Holistic: {
    category,
    description: 'Uses Mediapipe classifier for pose recognition',
    types: {
      holistic$image: 'Image',
      holistic$mask: 'Image',
      holistic$results: 'HolisticResults'
    },
    type: `$library/Mediapipe/Nodes/HolisticNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'frame_person'
  },
  BodyPoseDisplay: {
    category,
    description: 'Renders face',
    types: {
      BodyPoseDisplay$image: 'Image',
      BodyPoseDisplay$data: 'HolisticResults'
    },
    type: `$library/Mediapipe/Nodes/BodyPoseDisplayNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'hand_bones'
  },
  FingerPaint: {
    category,
    description: 'Paints and/or erases painting following fingers motion.',
    types: {
      FingerPaint$results: 'HolisticResults',
      FingerPaint$image: 'Image',
      FingerPaint$penSize: 'Number',
      FingerPaint$eraserSize: 'Number'
    },
    type: `$library/Mediapipe/Nodes/FingerPaintNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'gesture'
  },
  VirtualPointer: {
    category,
    description: 'Tracks finger motion',
    types: {
      VirtualPointer$results: 'HolisticResults',
      VirtualPointer$tracking: 'VirtualPointerTracking'
    },
    type: `$library/Mediapipe/Nodes/VirtualPointerNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'pan_tool_alt'
  },
  PointerPoms: {
    category,
    description: 'Paints and/or erases according to the given pointer tracking',
    types: {
      PointerPoms$tracking: 'VirtualPointerTracking',  
      PointerPoms$image: 'Image',
      PointerPoms$penSize: 'Number',
      PointerPoms$eraserSize: 'Number',
      PointerPoms$erase: 'Boolean'
    },
    type: `$library/Mediapipe/Nodes/PointerPomsNode`,
    icon: '$library/Assets/nodes/mediapipe-logo.png',
    ligature: 'touch_app'
  }
};