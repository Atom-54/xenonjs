/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Fields';

export const Fields= {
  Button: {
    categories: [category, 'Common', 'Weightless Components'],
    displayName: 'Weightless Button',
    description: 'Displays a button',
    type: '$library/Fields/Atoms/Button',
    ligature: 'buttons_alt',
    inputs: {
      label: 'String',
      inverted: 'Boolean',
      action: 'String',
      value: 'String:Pojo'
    },
    outputs: {
      value: 'Nonce'
    },
    state: {
      label: 'Button',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  BooleanField: {
    categories: [category],
    displayName: 'Boolean Field',
    description: 'Displays a checkbox field',
    type: '$library/Fields/Atoms/BooleanField',
    ligature: 'check_box',
    inputs: {
      label: 'String',
      value: 'Boolean',
      form: 'FormId'
    },
    outputs: {
      value: 'Boolean'
    },
    state: {
      label: 'Boolean Field',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  DateField: {
    categories: [category],
    displayName: 'Date Field',
    description: 'Displays a date input field',
    type: '$library/Fields/Atoms/DateField',
    ligature: 'calendar_month',
    inputs: {
      label: 'String',
      value: 'String',
      options: '[String]',
      form: 'FormId'
    },
    outputs: {
      value: 'String'
    },
    state: {
      label: 'Date Field',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  FileField: {
    categories: [category],
    displayName: 'File Field',
    description: "Uploads a .text file",
    type: '$library/Fields/Atoms/FileField',
    ligature: 'upload_file',
    inputs: {
      label: 'String',
      button: 'String',
      accept: 'String',
      form: 'FormId'
    },
    outputs: {
      content: 'String',
      title: 'String'
    },
    state: {
      label: 'File',
      button: 'Upload',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  ImageField: {
    categories: [category],
    displayName: 'Image Field',
    description: 'Uploads an image or captures image URL',
    type: '$library/Fields/Atoms/ImageField',
    ligature: 'hallway',
    inputs: {
      value: 'String',
      image: 'Image',
      form: 'FormId'
    },
    outputs: {
      value: 'String',
      image: 'Image'
    },
    state: {
      label: 'Image Field',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  LigatureField: {
    categories: [category],
    displayName: 'Ligature Field',
    description: 'An input field for icons',
    type: '$library/Fields/Atoms/LigatureField',
    ligature: 'special_character',
    inputs: {
      label: 'String',
      value: 'String',
      options: '[String]',
      form: 'FormId'
    },
    outputs: {
      value: 'String'
    },
    state: {
      label: 'Ligature Field',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  SelectField: {
    categories: [category],
    displayName: 'Select Field',
    description: 'Displays a drop down selection field',
    type: '$library/Fields/Atoms/SelectField',
    ligature: 'fact_check',
    inputs: {
      label: 'String',
      value: 'String',
      options: 'Pojo',
      multiple: 'Boolean',
      form: 'FormId'
    },
    outputs: {
      value: 'String'
    },
    state: {
      label: 'Select Field',
      options: [
        {key: 1, name: 'Option 1'},
        {separator: true},
        {key: 2, name: 'Option 2'}
      ],
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  StaticText: {
    categories: [category, 'Common'],
    displayName: 'Static Text',
    description: 'Displays static text',
    type: '$library/Fields/Atoms/StaticText',
    ligature: 'notes',
    inputs: {
      text: 'String'
    },
    state: {
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  TagField: {
    categories: [category],
    displayName: 'Tag Field',
    description: 'Displays a tag chip',
    type: '$library/Fields/Atoms/TagField',
    ligature: 'sell',
    inputs: {
      label: 'String',
      value: 'String:[String]',
      form: 'FormId'
    },
    outputs: {
      value: '[String]',
      json: 'String'
    },
    state: {
      label: 'Tag Field',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  TextArea: {
    categories: [category],
    displayName: 'Text Area',
    description: 'Displays a text area field',
    type: '$library/Fields/Atoms/TextArea',
    ligature: 'edit_note',
    inputs: {
      label: 'String',
      value: 'Text',
      form: 'FormId'
    },
    outputs: {
      text: 'Text',
      value: 'Text'
    },
    state: {
      label: 'TextArea Field',
      style: {
        padding: '0.5em'
      }
    }
  },
  TextField: {
    categories: [category, 'Common'],
    displayName: 'Text Field',
    description: 'Displays a text input field',
    type: '$library/Fields/Atoms/TextField',
    ligature: 'match_word',
    inputs: {
      label: 'String',
      value: 'String',
      placeholder: 'String',
      disabled: 'Boolean',
      options: '[String]',
      form: 'FormId'
    },
    outputs: {
      value: 'String'
    },
    state: {
      label: 'Text Field',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  JsonField: {
    categories: [category],
    displayName: 'JSON Field',
    description: 'Displays JSON as editable text',
    type: '$library/Fields/Atoms/JsonField',
    ligature: 'edit_note',
    inputs: {
      label: 'String',
      value: 'Json',
      form: 'FormId'
    },
    outputs: {
      value: 'Json'
    },
    state: {
      label: 'JSON Field',
      style: {
        padding: '0.5em'
      }
    }
  },
  QueryBar: {
    categories: [category],
    displayName: 'Query Bar',
    description: 'Displays a text input field with icon and placeholder text',
    type: '$library/Fields/Atoms/QueryBar',
    ligature: 'match_word',
    inputs: {
      query: 'String',
      placeholder: 'String',
      icon: 'String',
      reactive: 'Boolean'
    },
    outputs: {
      query: 'String'
    }
  }
};
