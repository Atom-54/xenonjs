// import {nodeTypes} from 'xenonjs/Library/Common/nodeTypes.js';
// import {services} from 'xenonjs/Library/Common/services.js';
// import 'xenonjs/Library/Common/dom.js';

const nodeTypes = {
  CustomEcho: {
    description: 'Displays styled html contents',
    types: {
      echo$html: 'MultilineText',
      echo$style: 'MultilineText'
    },
    category: 'Simple',
    type: `$library/EchoNode`
  },
};

const services = [];

export {nodeTypes, services};