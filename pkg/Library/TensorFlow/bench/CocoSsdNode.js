export const CocoSsdNode = {
  $meta: {
    id: 'CocoSsdNode',
    displayName: 'CocoSsd',
    description: 'TensorFlow CocoSsd',
    category: 'ML',
    module: `# Detects face and corresponding landmarks.
node {
  calculator: "drishti.xeno.FaceLandmarksGpu"
  input_stream: "IMAGE:input_frames_gpu"
  output_stream: "LANDMARKS:face_landmarks"
  options {
    [drishti.xeno.FaceLandmarksOptions.ext] {
      ssd_model_path: "system/facedetector-front.f16.tflite"
      landmarks_model_path: "system/cocossd-ultralite.f16.tflite"
      gpu_origin: TOP_LEFT
    }
  }
}
node {
  calculator: "ConcatenateNormalizedLandmarkListVectorCalculator"
  input_stream: "face_landmarks"
  output_stream: "multi_face_landmarks"
}
node {
  calculator: "XenoArcadeRawSignalsPackerCalculator"
  input_stream: "MULTI_FACE_LANDMARKS:multi_face_landmarks"
  output_stream: "RAW_SIGNALS:raw_signals"
}`
  },
  $stores: {
    image: {
      $type: 'Image',
      noinspect: true,
      nomonitor: true,
      connection: true
    },
    data: {
      $type: 'Pojo',
      noinspect: true,
      nomonitor: true
    }
  },
  CocoSsd: {
    $kind: 'TensorFlow/CocoSsd',
    $inputs: ['image'],
    $outputs: ['data']
  }
};
