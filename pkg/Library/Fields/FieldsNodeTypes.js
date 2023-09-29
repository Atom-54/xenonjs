/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const category = 'UX';

export const FieldsNodeTypes = {
  StaticText: {
    category,
    description: 'Displays static text',
    types: {
      StaticText$text: 'String', // or maybe, 'Multitext'?
    },
    type: '$library/Fields/Nodes/StaticTextNode'
  },
  TextArea: {
    category,
    description: 'Displays a text area field',
    types: {
      field$label: 'String',
      field$text: 'MultilineText'
    },  
    type: '$library/Fields/Nodes/TextAreaNode'
  },
  TextField: {
    category,
    description: 'Displays a text input field',
    types: {
      field$form: 'String:FormId',
      field$label: 'String',
      field$labelDescription: 'The field label',
      field$value: 'String',
      field$valueDescription: 'The enterable text value',
      field$options: '[String]'
    },
    type: '$library/Fields/Nodes/TextFieldNode'
  },
  LigatureField: {
    category,
    description: 'An input field for icons',
    types: {
      field$form: 'String:FormId',
      field$label: 'String',
      field$labelDescription: 'The field label',
      field$value: 'String',
      //field$value$values: ligatures,
      field$valueDescription: 'The enterable text value',
      field$options: '[String]'
    },
    type: '$library/Fields/Nodes/LigatureFieldNode'
  },
  BooleanField: {
    category,
    description: 'Displays a checkbox field',
    types: {
      field$label: 'String',
      field$value: 'Boolean'
    },
    type: '$library/Fields/Nodes/BooleanFieldNode'
  },
  SelectField: {
    category,
    description: 'Displays a drop down selection field',
    types: {
      field$label: 'String',
      field$value: 'String',
      field$options: '[String]',
      field$multiple: 'Boolean',
      field$size: 'Number'
    },
    type: '$library/Fields/Nodes/SelectFieldNode'
  },
  TagField: {
    category,
    description: 'Displays a tag chip',
    types: {
      field$label: 'String',
      field$value: '[String]'
    },  
    type: '$library/Fields/Nodes/TagFieldNode'
  },
  Button: {
    category,
    description: 'Displays a button',
    types: {
      button$label: 'String',
    },  
    type: '$library/Fields/Nodes/ButtonNode'
  },
  ImageField: {
    category,
    description: 'Uploads an image or captures image URL',
    types: {
      field$url: 'String',
      field$image: 'Image'
    },  
    type: '$library/Fields/Nodes/ImageFieldNode'
  },
  Form: {
    category,
    description: 'Formulates a form',
    types: {
      Form$form: 'String:FormId'
    },  
    type: '$library/Fields/Nodes/FormNode'
  },
  DataNavigator: {
    category,
    description: 'UX for navigating a dataset',
    types: {
    },  
    type: '$library/Fields/Nodes/DataNavigatorNode'
  },
  FileField: {
    category,
    description: "Uploads a file (only .txt file supported atm)",
    types: {
      FileField$label: 'String',
      FileField$button: 'String',
      FileField$accept: 'String'
    },
    type: '$library/Fields/Nodes/FileFieldNode'
  }
};
