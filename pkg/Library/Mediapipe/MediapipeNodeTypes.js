/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'Mediapipe';

export const MediapipeNodeTypes = {
  // PoseNode: {
  //   category,
  //   types: {
  //     Pose$image: 'Image',
  //     Pose$pose: 'PoseData'
  //   },
  //   type: `$library/Mediapipe/Nodes/PoseNode`
  // },
  FaceMeshNode: {
    category,
    description: 'Recognizes face',
    types: {
      FaceMesh$image: 'Image',
      FaceMesh$data: 'FaceMeshData'
    },
    type: `$library/Mediapipe/Nodes/FaceMeshNode`
  },
  FaceMeshDisplayNode: {
    category,
    description: 'Renders face',
    types: {
      FaceMeshDisplay$image: 'Image',
      FaceMeshDisplay$data: 'FaceMeshData'
    },
    type: `$library/Mediapipe/Nodes/FaceMeshDisplayNode`
  },
  SelfieSegmentationNode: {
    category,
    description: 'Segments selfie image',
    types: {
      SelfieSegmentation$image: 'Image',
      SelfieSegmentation$mask: 'Image'
    },
    type: `$library/Mediapipe/Nodes/SelfieSegmentationNode`
  },
  HolisticNode: {
    category,
    description: 'Uses Mediapipe classifier for pose recognition',
    types: {
      holistic$image: 'Image',
      holistic$mask: 'Image',
      holistic$results: 'HolisticResults'
    },
    type: `$library/Mediapipe/Nodes/HolisticNode`
  },
  FingerPaintNode: {
    category,
    description: 'Paints and/or erases painting following fingers motion.',
    types: {
      FingerPaint$results: 'HolisticResults',
      FingerPaint$image: 'Image',
      FingerPaint$penSize: 'Number',
      FingerPaint$eraserSize: 'Number'
    },
    type: `$library/Mediapipe/Nodes/FingerPaintNode`
  },
  VirtualPointerNode: {
    category,
    description: 'Tracks finger motion',
    types: {
      VirtualPointer$results: 'HolisticResults',
      VirtualPointer$tracking: 'VirtualPointerTracking'
    },
    type: `$library/Mediapipe/Nodes/VirtualPointerNode`
  },
  PointerPomsNode: {
    category,
    description: 'Paints and/or erases according to the given pointer tracking',
    types: {
      PointerPoms$tracking: 'VirtualPointerTracking',  
      PointerPoms$image: 'Image',
      PointerPoms$penSize: 'Number',
      PointerPoms$eraserSize: 'Number',
      PointerPoms$erase: 'Boolean'
    },
    type: `$library/Mediapipe/Nodes/PointerPomsNode`
  }
};