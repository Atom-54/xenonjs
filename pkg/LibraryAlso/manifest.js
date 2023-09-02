// import {nodeTypes} from 'xenonjs/Apps/common/nodeTypes.js';
// import {services} from 'xenonjs/Apps/common/services.js';
// import 'xenonjs/Apps/common/dom.js';

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