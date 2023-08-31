/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {AuthService} from 'xenonjs/Library/Firebase/Auth/FirebaseAuthService.js';
import {ImageService} from 'xenonjs/Library/Media/ImageService.js';
import {MediaService} from 'xenonjs/Library/Media/MediaService.js';
import {ShaderService} from 'xenonjs/Library/Shader/Services/ShaderService.js';
import {JSONataService} from 'xenonjs/Library/JSONata/JSONataService.js';
import {SelfieSegmentationService} from 'xenonjs/Library/Mediapipe/Services/SelfieSegmentationService.js';
import {FaceMeshService} from 'xenonjs/Library/Mediapipe/Services/FaceMeshService.js';
import {HolisticService} from 'xenonjs/Library/Mediapipe/Services/HolisticService.js';
import {HuggingFaceService} from 'xenonjs/Library/HuggingFace/HuggingFaceService.js';
import {LocalStorageService} from 'xenonjs/Library/LocalStorage/LocalStorageService.js';
import {FirebaseStorageService} from 'xenonjs/Library/Firebase/FirebaseStorageService.js';
import {CocoSsdService} from 'xenonjs/Library/TensorFlow/Services/CocoSsdService.js';
import {GoogleApisService} from 'xenonjs/Library/Locale/Services/GoogleApisService.js';
import {WeatherApiService} from 'xenonjs/Library/Locale/Services/WeatherApiService.js';
import {VisionTasksService} from 'xenonjs/Library/Mediapipe/Services/VisionTasksService.js';
import {POIService} from 'xenonjs/Library/Locale/Services/POIService.js';
import {OpenAIService} from 'xenonjs/Library/OpenAI/OpenAIService.js';
import {GraphService} from 'xenonjs/Library/CoreDesigner/GraphService.js';
import {jsonrepairService} from 'xenonjs/Library/jsonrepair/jsonrepairService.js';
import {SSEPubSubService as PubSubService} from 'xenonjs/Library/PubSub/Services/SSEPubSubService.js';

export const services = {
  AuthService, 
  GraphService, 
  ImageService,
  MediaService, 
  ShaderService, 
  jsonrepairService,
  JSONataService,
  SelfieSegmentationService,
  FaceMeshService,
  HolisticService,
  VisionTasksService,
  HuggingFaceService,
  StorageService: FirebaseStorageService,
  LocalStorageService,
  CocoSsdService,
  GoogleApisService,
  WeatherApiService,
  POIService,
  OpenAIService,
  PubSubService
};