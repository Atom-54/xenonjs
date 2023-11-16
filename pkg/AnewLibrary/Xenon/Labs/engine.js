import * as Reactor from './reactor.js';
import {resolve} from '../Utils/Paths.js';

const log = (...args) => console.log('[engine]', ...args);

const switchboard = {
  output: output => log('[output]', output),
  render: packet => log('[render]', packet),
  service: request => log('[service]', request)
};
Reactor.initialize(switchboard, log, resolve);

const atom = await Reactor.createAtom('./atom.js');
atom.inputs = {bar: 42};