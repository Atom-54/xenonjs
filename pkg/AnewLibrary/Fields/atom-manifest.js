/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const categories = ['Fields'];

export const Fields= {
  BooleanField: {
    categories,
    displayName: 'Boolean Field',
    description: 'Displays a checkbox field',
    type: '$anewLibrary/Fields/Atoms/BooleanField',
    ligature: 'check_box',
    inputs: {
      label: 'String',
      value: 'Boolean'
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
  Button: {
    categories,
    displayName: 'Button',
    description: 'Displays a button',
    type: '$anewLibrary/Fields/Atoms/Button',
    ligature: 'buttons_alt',
    inputs: {
      label: 'String',
      inverted: 'Boolean',
      action: 'String',
      value: 'String|Pojo'
    },
    outputs: {
      value: 'String|Pojo'
    },
    state: {
      label: 'Button',
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  DataNavigator: {
    categories,
    displayName: 'Data Navigator',
    description: 'UX for navigating a dataset',
    type: '$anewLibrary/Fields/Atoms/DataNavigator',
    ligature: 'source_notes',
    inputs: {
      index: 'Number',
      count: 'Number',
      records: '[Pojo]',
      submittedRecord: 'Pojo'
    },
    outputs: {
      index: 'Number',
      record: 'Pojo',
      records: '[Pojo]'
    },
    state: {
      style: {
        flex: '0 0 auto',
        padding: '0.5em'
      }
    }
  },
  DateField: {
    categories,
    displayName: 'Date Field',
    description: 'Displays a date input field',
    type: '$anewLibrary/Fields/Atoms/DateField',
    ligature: 'calendar_month',
    inputs: {
      label: 'String',
      value: 'String',
      options: '[String]',
      form: 'FormId:String'
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
    categories,
    displayName: 'File Field',
    description: "Uploads a .text file",
    type: '$anewLibrary/Fields/Atoms/FileField',
    ligature: 'upload_file',
    inputs: {
      label: 'String',
      button: 'String',
      accept: 'String'
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
  Form: {
    categories,
    displayName: 'Form',
    description: 'Formulates a form',
    type: '$anewLibrary/Fields/Atoms/Form',
    ligature: 'ballot',
    inputs: {
      inputData: 'Pojo',
      submitTrigger: 'Boolean',
      form: 'FormId:String'
    },
    outputs: {
      form: 'FormId:String',
      schema: '[Pojo]',
      columns: '[Pojo]',
      row: 'Pojo',
      preview: 'Pojo'
    }
  },
  ImageField: {
    categories,
    displayName: 'Image Field',
    description: 'Uploads an image or captures image URL',
    type: '$anewLibrary/Fields/Atoms/ImageField',
    ligature: 'hallway',
    inputs: {
      value: 'String',
      image: 'Image',
      form: 'FormId:String'
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
    categories,
    displayName: 'Ligature Field',
    description: 'An input field for icons',
    type: '$anewLibrary/Fields/Atoms/LigatureField',
    ligature: 'special_character',
    inputs: {
      label: 'String',
      value: 'String',
      options: '[String]',
      form: 'FormId:String'
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
    categories,
    displayName: 'Select Field',
    description: 'Displays a drop down selection field',
    type: '$anewLibrary/Fields/Atoms/SelectField',
    ligature: 'fact_check',
    inputs: {
      label: 'String',
      value: 'String',
      options: 'Pojo',
      multiple: 'Boolean',
      form: 'FormId|String'
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
    categories,
    displayName: 'Static Field',
    description: 'Displays static text',
    type: '$anewLibrary/Fields/Atoms/StaticText',
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
    categories,
    displayName: 'Tag Field',
    description: 'Displays a tag chip',
    type: '$anewLibrary/Fields/Atoms/TagField',
    ligature: 'sell',
    inputs: {
      label: 'String',
      value: 'String|[String]'
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
    categories,
    displayName: 'Text Area',
    description: 'Displays a text area field',
    type: '$anewLibrary/Fields/Atoms/TextArea',
    ligature: 'edit_note',
    inputs: {
      label: 'String',
      text: 'MultilineText'
    },
    outputs: {
      text: 'MultilineText'
    },
    state: {
      label: 'TextArea Field',
      style: {
        padding: '0.5em'
      }
    }
  },
  TextField: {
    categories,
    displayName: 'Text Field',
    description: 'Displays a text input field',
    type: '$anewLibrary/Fields/Atoms/TextField',
    ligature: 'match_word',
    inputs: {
      label: 'String',
      value: 'String',
      options: '[String]',
      form: 'FormId:String'
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
  }
};
