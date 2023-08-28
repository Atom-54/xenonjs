/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// standard 
import '../Atomic/js/logf.js';
import {BusTerminal} from '../Bus/BusTerminal.js';
import {configureApi} from './xenon-inside.js';
// natural log
const log = logf('Worker:boot', 'orange', 'black');
logf.flags['worker'] = true;
// bespoke
const {xenon} = await import(globalThis.config.paths.$boot);
// build a BusTerminal for transport to/from here
const terminal = new BusTerminal(globalThis);
log('Worker thread BusTerminal', terminal.bus.id)
// make a transport layer (a Bus)
const transport = configureApi(xenon, terminal);
// signal readiness
transport.ready();
// for console
globalThis.hosts = transport.hosts;
globalThis.xenon = xenon;

