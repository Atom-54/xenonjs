/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// xenonjs
import {LayoutNodeTypes} from 'xenonjs/Library/Layout/LayoutNodeTypes.js';
import {MediaNodeTypes} from 'xenonjs/Library/Media/MediaNodeTypes.js';
import {FieldsNodeTypes} from 'xenonjs/Library/Fields/FieldsNodeTypes.js';
import {GraphNodeTypes} from 'xenonjs/Library/Graph/GraphNodeTypes.js';
import {OpenAINodeTypes} from 'xenonjs/Library/OpenAI/OpenAINodeTypes.js';
import {PixabayNodeTypes} from 'xenonjs/Library/Pixabay/PixabayNodeTypes.js';
import {PixiJsNodeTypes} from 'xenonjs/Library/PixiJs/PixiJsNodeTypes.js';
import {UXNodeTypes} from 'xenonjs/Library/UX/UXNodeTypes.js';
import {InspectorNodeTypes} from 'xenonjs/Library/Inspector/InspectorNodeTypes.js';
import {ShaderNodeTypes} from 'xenonjs/Library/Shader/ShaderNodeTypes.js';
import {DataNodeTypes} from 'xenonjs/Library/Data/DataNodeTypes.js';
import {AINodeTypes} from 'xenonjs/Library/AI/AINodeTypes.js';
import {JSONataNodeTypes} from 'xenonjs/Library/JSONata/JSONataNodeTypes.js';
import {AuthNodeTypes} from 'xenonjs/Library/Auth/AuthNodeTypes.js';
import {StorageNodeTypes} from 'xenonjs/Library/Storage/StorageNodeTypes.js';
import {DateTimeTypes} from 'xenonjs/Library/Time/TimeNodeTypes.js';
import {PolymathNodeTypes} from 'xenonjs/Library/Polymath/PolymathNodeTypes.js';
import {CodeMirrorNodeTypes} from 'xenonjs/Library/CodeMirror/CodeMirrorNodeTypes.js';
import {MediapipeNodeTypes} from 'xenonjs/Library/Mediapipe/MediapipeNodeTypes.js';
import {HuggingFaceNodeTypes} from 'xenonjs/Library/HuggingFace/HuggingFaceNodeTypes.js';
import {TensorFlowNodeTypes} from 'xenonjs/Library/TensorFlow/TensorFlowNodeTypes.js';
import {GamesNodeTypes} from 'xenonjs/Library/Games/GamesNodeTypes.js';
import {LocalStorageNodeTypes} from 'xenonjs/Library/LocalStorage/LocalStorageNodeTypes.js';
import {LocaleNodeTypes} from 'xenonjs/Library/Locale/LocaleNodeTypes.js';
import {NeonFlanNodeTypes} from 'xenonjs/Library/NeonFlan/NeonFlanNodeTypes.js';
import {MailNodeTypes} from 'xenonjs/Library/Mail/MailNodeTypes.js';
import {PubSubNodeTypes} from 'xenonjs/Library/PubSub/PubSubNodeTypes.js';
import {PeerNodeTypes} from 'xenonjs/Library/Peer/PeerNodeTypes.js';
import {CalendarNodeTypes} from 'xenonjs/Library/Calendar/CalendarNodeTypes.js';

const nodeTypes = {
  Echo: {
    description: 'Displays styled html contents',
    types: {
      echo$html: 'MultilineText',
      echo$style: 'MultilineText'
    },
    category: 'Simple',
    type: `$library/EchoNode`
  },
  ...AINodeTypes,
  ...PolymathNodeTypes,
  ...LayoutNodeTypes,
  ...FieldsNodeTypes,
  ...UXNodeTypes,
  ...MediaNodeTypes,
  ...MediapipeNodeTypes,
  ...TensorFlowNodeTypes,
  ...HuggingFaceNodeTypes,
  ...DataNodeTypes,
  ...JSONataNodeTypes,
  ...AuthNodeTypes,
  ...OpenAINodeTypes,
  ...PixabayNodeTypes,
  ...PixiJsNodeTypes,
  ...GraphNodeTypes,
  ...InspectorNodeTypes,
  ...ShaderNodeTypes,
  ...StorageNodeTypes,
  ...DateTimeTypes,
  ...CodeMirrorNodeTypes,
  ...NeonFlanNodeTypes,
  ...GamesNodeTypes,
  ...LocalStorageNodeTypes,
  ...LocaleNodeTypes,
  ...MailNodeTypes,
  ...PubSubNodeTypes,
  ...PeerNodeTypes,
  ...CalendarNodeTypes
};

globalThis.nodeTypes = nodeTypes;
export {nodeTypes};