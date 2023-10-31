/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// xenonjs
import {LayoutNodeTypes} from './Layout/LayoutNodeTypes.js';
import {MediaNodeTypes} from './Media/MediaNodeTypes.js';
import {FieldsNodeTypes} from './Fields/FieldsNodeTypes.js';
import {GraphNodeTypes} from './Graph/GraphNodeTypes.js';
import {OpenAINodeTypes} from './OpenAI/OpenAINodeTypes.js';
import {PixabayNodeTypes} from './Pixabay/PixabayNodeTypes.js';
import {PixiJsNodeTypes} from './PixiJs/PixiJsNodeTypes.js';
import {UXNodeTypes} from './UX/UXNodeTypes.js';
import {InspectorNodeTypes} from './Inspector/InspectorNodeTypes.js';
import {ShaderNodeTypes} from './Shader/ShaderNodeTypes.js';
import {DataNodeTypes} from './Data/DataNodeTypes.js';
import {AINodeTypes} from './AI/AINodeTypes.js';
import {JSONataNodeTypes} from './JSONata/JSONataNodeTypes.js';
import {AuthNodeTypes} from './Auth/AuthNodeTypes.js';
import {StorageNodeTypes} from './Storage/StorageNodeTypes.js';
import {DateTimeTypes} from './Time/TimeNodeTypes.js';
import {PolymathNodeTypes} from './Polymath/PolymathNodeTypes.js';
import {CodeMirrorNodeTypes} from './CodeMirror/CodeMirrorNodeTypes.js';
import {MediapipeNodeTypes} from './Mediapipe/MediapipeNodeTypes.js';
import {HuggingFaceNodeTypes} from './HuggingFace/HuggingFaceNodeTypes.js';
import {TensorFlowNodeTypes} from './TensorFlow/TensorFlowNodeTypes.js';
import {GamesNodeTypes} from './Games/GamesNodeTypes.js';
import {LocalStorageNodeTypes} from './LocalStorage/LocalStorageNodeTypes.js';
import {LocaleNodeTypes} from './Locale/LocaleNodeTypes.js';
import {Atom54NodeTypes} from './Atom54/Atom54NodeTypes.js';
import {MailNodeTypes} from './Mail/MailNodeTypes.js';
import {PubSubNodeTypes} from './PubSub/PubSubNodeTypes.js';
import {PeerNodeTypes} from './Peer/PeerNodeTypes.js';
import {CalendarNodeTypes} from './Calendar/CalendarNodeTypes.js';
import {ChromecastNodeTypes} from './Chromecast/ChromecastNodeTypes.js';
import {SpectrumNodeTypes} from './Spectrum/SpectrumNodeTypes.js';

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
  ...Atom54NodeTypes,
  ...GamesNodeTypes,
  ...LocalStorageNodeTypes,
  ...LocaleNodeTypes,
  ...MailNodeTypes,
  ...PubSubNodeTypes,
  ...PeerNodeTypes,
  ...CalendarNodeTypes,
  ...ChromecastNodeTypes,
  ...SpectrumNodeTypes
};

globalThis.nodeTypes = nodeTypes;
export {nodeTypes};