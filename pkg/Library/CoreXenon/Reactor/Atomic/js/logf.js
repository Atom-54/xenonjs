/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// log methods we support
export const logKinds = ['log', 'warn', 'error', 'group', 'groupCollapsed', 'groupEnd', 'debug'];
export const importantKinds = ['debug', 'warn', 'error'];

// invent console.debug
console.debug = console.log.bind(console);

// pretty!
const formatter = (preamble, bg, color) => {
  const style = `background: ${bg || 'gray'}; color: ${color || 'white'}; padding: 1px 6px 2px 7px; border-radius: 6px 0 0 6px;`;
  return [`%c${preamble}`, style];
};

// log storage for the universe
const logs = [];

// log industry
export const createLogFactory = () => {
  // immediate logs only use console if flagged
  const flags = globalThis.config?.logFlags || {};
  // the logfactory instance we will return
  const logf = (preamble, bg, color) => {
    const format = formatter(preamble, bg, color);
    // make a function which can create an immediate log entry
    const make = 
      kind => (...args) => {
        const when = Date.now();
        const vicinity = Error().stack.split('\n').slice(1);
        //const info = [JSON.stringify(vicinity, null, '  ')];
        let spot = vicinity.shift();
        while (spot.includes('xen-async') || spot.includes('xenon-atomic') || spot.includes('logf')) {
          spot = vicinity.shift();
        }
        const where = spot?.split?.('/').pop().split?.(')').shift();
        //console.log(...info, where, preamble, args);
        append(preamble, format, kind, when, where, args, logs);
        consolate(flags, preamble, format, kind, when, where, args);
      };
    // create the logger as a function 
    const log = make('log');
    // stuff log variants on as properties
    logKinds.forEach(k => log[k] = make(k));
    // make flags available
    log.flags = flags;
    log.get = logf.get;
    log.clear = logf.clear;
    log.replay = logf.replay;
    return log; 
  };
  // append an entry to a log and/or output to a console
  const append = (preamble, format, kind, when, where, args) => {
    const o = Object.create(null);
    Object.assign(o, {preamble, format, kind, where, when});
    if (args?.length) {
      o.args = args;
    }
    //logs.push(o);
  };
  const consolate = (flags, preamble, format, kind, when, where, args) => {
    const flag = preamble.split(':').shift();
    if (!flags || flags?.[flag] || flags?.[preamble] || importantKinds.includes(kind)) {
      console[kind].apply(console, [...format, ...(args || []), `\t[${where}]`]);
    }
  };
  logf.flags = flags;
  logf.get = () => logs;
  logf.clear = () => logs.splice(0, -1);
  logf.replay = (customFlags, filter) => {
    //console.group('Replay');
    console.group.apply(console, [...formatter('Logger', 'white', 'gray'), 'Replay']);
    logs.filter(filter ?? (i=>i)).forEach(({preamble, format, kind, when, where, args}) => {
      consolate(customFlags, preamble, format, kind, when, where, args);
    });
    console.groupEnd();
  };
  return logf;
};

if (globalThis.logf) {
  console.warn('attempted global logf overwrite');
} else {
  // create a default factory
  globalThis.logf = createLogFactory();
}

export const logf = globalThis.logf;
