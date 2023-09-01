/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'HuggingFace';

export const HuggingFaceNodeTypes = {
  HuggingFaceImage: {
    category,
    description: 'Generates an image using one of the HuggingFace models',
    type: `$library/HuggingFace/Nodes/HuggingFaceImageNode`,
    types: {
      HuggingFace$textToImageModel: 'String',
      HuggingFace$textToImageModelValues: [
        'dreamlike-art/dreamlike-photoreal-2.0',
        'stabilityai/stable-diffusion-2',
        'prompthero/openjourney-v4'
      ],
      HuggingFace$image: 'Image',
      HuggingFace$working: 'Boolean'
    }
  },
  HuggingFaceText: {
    category,
    description: 'Generates text using one of the HuggingFace models',
    type: `$library/HuggingFace/Nodes/HuggingFaceTextNode`,
    types: {
      HuggingFace$prompt: 'MultilineString',
      HuggingFace$model: 'String',
      HuggingFace$working: 'Boolean'
    }
  },
  HuggingFaceOcr: {
    category,
    description: 'Recognizes written of printed text form an image using one of the HuggingFace trOCR models (https://huggingface.co/models?other=trocr)',
    type: `$library/HuggingFace/Nodes/HuggingFaceOcrNode`,
    types: {
      // ocr$prompt: 'Image' or 'String',
      ocr$model: 'String',
      ocr$modelValues: [
        'microsoft/trocr-base-handwritten',
        'microsoft/trocr-large-handwritten',
        'microsoft/trocr-base-printed',
        'microsoft/trocr-large-printed',
        'microsoft/trocr-large-str'
        // TODO: add more models:  https://huggingface.co/models?other=trocr
      ],
      ocr$working: 'Boolean',
      ocr$text: 'String'
    }
  },
  HuggingFaceImageToText: {
    category,
    description: 'Generates text using one of the HuggingFace models',
    type: `$library/HuggingFace/Nodes/HuggingFaceImageToTextNode`,
    types: {
      // toText$prompt: 'Image' or 'String',
      toText$model: 'String',
      toText$modelValues: [
        'nlpconnect/vit-gpt2-image-captioning',
        'Salesforce/blip-image-captioning-large',
        'microsoft/git-large-coco'
        // TODO: add more models: https://huggingface.co/models?pipeline_tag=image-to-text&sort=trending
      ],
      toText$customModel: 'String',
      toText$working: 'Boolean',
      toText$text: 'String'
    }
  },
  HuggingFaceImageToImage: {
    category,
    description: 'Generates images from images, using one of the HuggingFace models',
    type: `$library/HuggingFace/Nodes/HuggingFaceImageToImageNode`,
    types: {
      HuggingFace$prompt: 'String',
      HuggingFace$image: 'Image',
      HuggingFace$imageToImageModel: 'String',
      HuggingFace$imageToImageModelValues: [
        'timbrooks/instruct-pix2pix'
        // TODO: add more models: https://huggingface.co/models?pipeline_tag=image-to-image&sort=trending
      ],
      HuggingFace$active: 'Boolean',
      HuggingFace$working: 'Boolean',
      HuggingFace$outputImage: 'Image'
    }
  }
};
