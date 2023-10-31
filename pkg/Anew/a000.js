/**
 * @license
 * Copyright 2023 Atom54 LLC
 */
// configuration
import './config.js';
// xenon start up
import {start} from 'xenonjs/Library/Common/start.js';
// dependencies
import '../Library/Spectrum/Dom/Spectrum.js';
import * as Composer from '../Library/CoreXenon/Framework/Composer.js';
import * as Core from '../Library/CoreXenon/Reactor/atomic.js';
import {FlanSet, Flan, System} from './simple.js';

const log = logf('Index', 'magenta');

const graphOne = {
  Tabs: {
    type: '$library/Spectrum/Atoms/SpectrumTabs'
  },
  Card: {
    type: '$library/Spectrum/Atoms/SpectrumCard',
    state: {
      heading: 'Cards for Fun',
      subheading: 'just trying stuff..'
    }
  },
  Card2: {
    type: '$library/Spectrum/Atoms/SpectrumCard',
    state: {
      asset: 'file',
      heading: 'File Card',
      subheading: 'somefile.txt',
      horizontal: true
    }
  },
  Card3: {
    type: '$library/Spectrum/Atoms/SpectrumCard',
    state: {
      imageSrc: Core.Paths.resolve('$library/Assets/dogs.png'),
      heading: 'Dogs!'
    }
  }
};

const graphTwo = {
  Button: {
    type: '$library/Spectrum/Atoms/SpectrumButton',
    state: {
      label: 'GraphTwo!'
    }
  },
  System: {
    type: '$library/Anew/Atoms/System',
    state: {
      graphId: 'graphOne'
    }
  }
};

const graphThree = {
  Button: {
    type: '$library/Spectrum/Atoms/SpectrumButton',
    state: {
      label: 'GraphThree!'
    }
  }
};

start(async (xenon) => {
  const flans = globalThis.flans = FlanSet.createFlanSet(xenon, onservice);
  // make flan one
  const one = await FlanSet.createFlan(flans, 'one', {});
  //reifySystem(one, 'main', window.one, graphOne);
  reifySystem(one, 'sub', window.one, graphTwo);
  //
  // make flan two
  const bindings = {
    inputs: {
      'sub$Button$value': 'main$Trigger$value'
    }
  };
  const two = await FlanSet.createFlan(flans, 'two', bindings);
  //reifySystem(two, 'main', window.two, graphOne);
  reifySystem(two, 'sub', window.two, graphTwo);
});

const onservice = (host, request) => {
  const {kind, msg, data} = request;
  switch (kind) {
    case 'SystemService':
      switch (msg) {
        case 'CreateSystem': 
          log.debug('msg', data);
          const {system} = host;
          const {controller: flan} = system;
          const graph = {graphOne, graphTwo, graphTree}[data.id];
          if (graph) {
            reifySystem(flan, host.name, window[flan.name], graph);
          }
          break;
      }
      break;

    default: 
      log.debug('onservice', host, request);
      break;
  }
};

const reifySystem = (flan, name, root, graph) => {
  // as of now, every system needs it's own composer for event-forwarding
  const composer = Composer.createComposer(null, root);
  const main = Flan.createSystem(flan, name, composer);
  System.reify(main,graph);
};