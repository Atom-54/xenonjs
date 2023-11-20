/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'HuggingFace';

export const HuggingFace = {
  HuggingFaceImage: {
    categories: [category, 'AI'],
    displayName: 'Hugging Face Image',
    description: 'Generates an image using one of the HuggingFace models',
    type: '$anewLibrary/HuggingFace/Atoms/HuggingFaceImage',
    ligature: 'image',
    //icon: '$anewLibrary/Assets/nodes/huggingface_logo-noborder.svg',
    inputs: {
      prompt: 'MultilineString',
      textToImageModel: 'String',
      options: '[String]',
      trigger: 'Nonce'
    },
    outputs: {
      image: 'Image',
      working: 'Boolean'
    },
    state: {
      textToImageModel: [
        'dreamlike-art/dreamlike-photoreal-2.0',
        'stabilityai/stable-diffusion-2',
        'prompthero/openjourney-v4'
      ]
    }
  },
  HuggingFaceText: {
    categories: [category, 'AI'],
    displayName: 'Hugging Face Text',
    description: 'Generates text using one of the HuggingFace models',
    type: '$anewLibrary/HuggingFace/Atoms/HuggingFaceText',
    ligature: 'edit_note',
    //icon: '$anewLibrary/Assets/nodes/huggingface_logo-noborder.svg',
    inputs: {
      prompt: 'MultilineString',
      model: 'String',
      options: 'Pojo'
    },
    outputs: {
      result: 'MultilineString',
      working: 'Boolean'
    }
  },
  HuggingFaceOcr: {
    categories: [category, 'AI'],
    displayName: 'Hugging Face OCR',
    description: 'Recognizes written of printed text form an image using one of the HuggingFace trOCR models (https://huggingface.co/models?other=trocr)',
    type: '$anewLibrary/HuggingFace/Atoms/HuggingFaceOcr',
    ligature: 'read_more',
    // icon: '$anewLibrary/Assets/nodes/huggingface_logo-noborder.svg',
    inputs: {
      model: 'String',
      image: 'Image',
      options: 'Pojo'
    },
    outputs: {
      text: 'String',
      result: 'Pojo',
      working: 'Boolean',
    },
    state: {
      model: [
        'microsoft/trocr-base-handwritten',
        'microsoft/trocr-large-handwritten',
        'microsoft/trocr-base-printed',
        'microsoft/trocr-large-printed',
        'microsoft/trocr-large-str'
        // TODO: add more models:  https://huggingface.co/models?other=trocr
      ]
    }
  },
  HuggingFaceImageToText: {
    categories: [category, 'AI'],
    displayName: 'Hugging Face Image to Text',
    description: 'Generates text using one of the HuggingFace models',
    type: '$anewLibrary/HuggingFace/Atoms/HuggingFaceImageToText',
    ligature: 'image',
    icon: '$anewLibrary/Assets/nodes/huggingface_logo-noborder.svg',
    inputs: {
      model: 'String',
      customModel: 'String',
      image: 'Image',
      options: 'Pojo'
    },
    outputs: {
      text: 'String',
      result: 'Pojo',
      working: 'Boolean',
    },
    state: {
      model: [
        'nlpconnect/vit-gpt2-image-captioning',
        'Salesforce/blip-image-captioning-large',
        'microsoft/git-large-coco'
        // TODO: add more models: https://huggingface.co/models?pipeline_tag=image-to-text&sort=trending
      ]
    }
  },
  HuggingFaceImageToImage: {
    categories: [category, 'AI'],
    displayName: 'Hugging Face Image to Image',
    description: 'Generates images from images, using one of the HuggingFace models',
    type: '$anewLibrary/HuggingFace/Atoms/HuggingFaceImageToImage',
    ligature: 'image',
    // icon: '$anewLibrary/Assets/nodes/huggingface_logo-noborder.svg',
    inputs: {
      image: 'Image',
      active: 'Boolean',
      prompt: 'String',
      imageToImageModel: 'String',
      options: 'Pojo'
    },
    outputs: {
      outputImage: 'Image',
      working: 'Boolean'
    },
    state: {
      imageToImageModel: [
        'timbrooks/instruct-pix2pix'
        // TODO: add more models: https://huggingface.co/models?pipeline_tag=image-to-image&sort=trending
      ]
    }
  }
};
