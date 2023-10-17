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
    type: '$library/Fields/Nodes/StaticTextNode',
    ligature: 'notes'
  },
  TextArea: {
    category,
    description: 'Displays a text area field',
    types: {
      field$label: 'String',
      field$text: 'MultilineText'
    },  
    type: '$library/Fields/Nodes/TextAreaNode',
    ligature: 'edit_note'
  },
  TextField: {
    category,
    description: 'Displays a text input field',
    types: {
      field$form: 'FormId:String',
      field$label: 'String',
      field$labelDescription: 'The field label',
      field$value: 'String',
      field$valueDescription: 'The enterable text value',
      field$options: '[String]'
    },
    type: '$library/Fields/Nodes/TextFieldNode',
    ligature: 'match_word'
  },
  LigatureField: {
    category,
    description: 'An input field for icons',
    types: {
      field$form: 'FormId:String',
      field$label: 'String',
      field$labelDescription: 'The field label',
      field$value: 'String',
      //field$value$values: ligatures,
      field$valueDescription: 'The enterable text value',
      field$options: '[String]'
    },
    type: '$library/Fields/Nodes/LigatureFieldNode',
    ligature: 'special_character'
  },
  BooleanField: {
    category,
    description: 'Displays a checkbox field',
    types: {
      field$label: 'String',
      field$value: 'Boolean'
    },
    type: '$library/Fields/Nodes/BooleanFieldNode',
    ligature: 'check_box'
  },
  SelectField: {
    category,
    description: 'Displays a drop down selection field',
    types: {
      field$form: 'FormId:String',
      field$label: 'String',
      field$value: 'String',
      field$options: '[String]',
      field$multiple: 'Boolean',
      field$size: 'Number'
    },
    type: '$library/Fields/Nodes/SelectFieldNode',
    ligature: 'fact_check'
  },
  TagField: {
    category,
    description: 'Displays a tag chip',
    types: {
      field$label: 'String',
      field$value: '[String]'
    },  
    type: '$library/Fields/Nodes/TagFieldNode',
    ligature: 'sell'
  },
  Button: {
    category,
    description: 'Displays a button',
    types: {
      button$label: 'String',
      button$inverted: 'Boolean'
    },  
    type: '$library/Fields/Nodes/ButtonNode',
    ligature: 'buttons_alt'
  },
  ImageField: {
    category,
    description: 'Uploads an image or captures image URL',
    types: {
      field$url: 'String',
      field$image: 'Image'
    },  
    type: '$library/Fields/Nodes/ImageFieldNode',
    ligature: 'hallway'
  },
  Form: {
    category,
    description: 'Formulates a form',
    types: {
      Form$form: 'FormId:String'
    },  
    type: '$library/Fields/Nodes/FormNode',
    ligature: 'ballot'
  },
  DataNavigator: {
    category,
    description: 'UX for navigating a dataset',
    types: {
    },  
    type: '$library/Fields/Nodes/DataNavigatorNode',
    ligature: 'source_notes'
  },
  FileField: {
    category,
    description: "Uploads a .text file",
    types: {
      FileField$label: 'String',
      FileField$button: 'String',
      FileField$accept: 'String'
    },
    type: '$library/Fields/Nodes/FileFieldNode',
    ligature: 'upload_file'
  }
};
