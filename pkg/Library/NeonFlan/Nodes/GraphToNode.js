import '../../../../Core/Library/CoreReactor/Atomic/js/logf.js';
import {SafeObject} from '../../../../Core/Library/CoreReactor/safe-object.js';
import {Paths} from '../../../../Core/Library/CoreReactor/Atomic/js/utils/paths.js';
import {deepCopy} from '../../../../Core/Library/CoreReactor/Atomic/js/utils/object.js';
import * as Id from '../../../../Core/Library/CoreFramework/Id.js';
import * as Graphs from '../../../../Core/Library/CoreFramework/Graphs.js';
import * as Binder from '../../../../Core/Library/CoreFramework/Binder.js';
import {graph} from './SampleGraph.js';

Paths.add({'$library': '../../../Core/Library'});

const {keys, assign, entries, values, create, map} = SafeObject;
const {connections, meta, nodes, state} = graph;

delete meta.graphRects;
//const atoms = nodes;
//const neo = {...atoms, state};

const glog = (name, obj) => {
  console.groupCollapsed(name);
  console.log(JSON.stringify(obj, null, '  '));
  console.groupEnd();
};

glog('nodes', nodes);
glog('state', state);
glog('connections', connections);

// 'foo' gets a system: {[atom name]: [atom spec]}
const foo = await Graphs.graphToAtomSpecs(graph, '');
glog('system', foo);

const fixId = key => key.slice(1).replace('$','_');

const bindings = Binder.constructBindings(foo);
Binder.addConnections('', connections, bindings.inputBindings);
glog('bindings', bindings);
//const ob = bindings.outputBindings;
//const k0 = Object.keys(ob).shift();
//console.log(k0);

const specTypes = {};
const specs = {};
const qualifiedState = {};

// const layoutKey = 'Main_designer$layout';
// const layout = state[layoutKey];
// if (layout) {
//   const qualifiedLayout = {};
//   map(layout, (key, value) => {
//     qualifiedLayout[key.replace('$', '_')] = value;
//   });
//   state[layoutKey] = qualifiedLayout;
// }
map(state, (key, value) => {
  qualifiedState[key.replace('$', '_')] = value;
});
glog('qualifiedState', qualifiedState);

// const remove = (x, a) => {
//   const i = a?.indexOf(x);
//   if (i >= 0) {
//     a.splice(i, 1);
//   }
//   return a?.length > 0;
// };

const connectionBindings = {};
map(connections, (key, property) => {
  const [id, prop] = key.replace('$', '_').split('$');
  (connectionBindings[id] ??= {})[prop] = property.replace('$', '_');
});
glog('connectionBindings', connectionBindings);
//const ibKeys = keys(bindings.inputBindings);

entries(foo).forEach(([key, atomSpecs]) => {
  const {types, ...spec_} = atomSpecs;
  const id = fixId(key);
  // create a mutable copy of spec
  const spec = deepCopy(spec_);
  //
  // remove output properties from spec if they are internally bound
  // if my output property is bound to some other input, it's internally bound
  // find internally bound properties
  // by searching all bound input keys
  // ibKeys.forEach(ibKey => {
  //   // means ibKey is a binding to some output from the current spec
  //   if (ibKey.startsWith(key)) {
  //     // get consumed property name
  //     const prop = ibKey.split('$').pop();
  //     // process list of things bound here
  //     bindings.inputBindings[ibKey].forEach(({id}) => {
  //       // ignore self-bindings
  //       if (id !== key) {
  //         // we got one!
  //         console.log(key, prop, 'has internal binding');
  //         // remove the output specifier
  //         if (!remove(prop, spec.outputs)) {
  //           delete spec.outputs;
  //         };
  //         // if it was a prop, now it's an input
  //         if (spec.props?.includes(prop)) {
  //           // remove the prop specifier
  //           if (!remove(prop, spec.props)) {
  //             delete spec.props;
  //           }
  //           // union input specifier 
  //           spec.inputs = [...new Set([...spec.inputs, prop])];
  //         }
  //       }
  //       // console.log(id, prop);
  //       // if (id === key) {
  //       //   console.log('squelch', key);
  //       // }
  //     });
  //   }
  // });
  // remove input properties from spec if they are internally bound
  // if my input property is bound to some other input, it's internally bound
  // find internally bound properties
  // by searching all bound input keys
  // ibKeys.forEach(ibKey => {
  //   // means ibKey is a binding to some output from the current spec
  //   if (ibKey.startsWith(key)) {
  //     // get consumed property name
  //     const prop = ibKey.split('$').pop();
  //     // process list of things bound here
  //     bindings.inputBindings[ibKey].forEach(({id}) => {
  //       // ignore self-bindings
  //       if (id !== key) {
  //         // we got one!
  //         console.log(key, prop, 'has internal binding');
  //         // remove the output specifier
  //         if (!remove(prop, spec.outputs)) {
  //           delete spec.outputs;
  //         };
  //         // if it was a prop, now it's an input
  //         if (spec.props?.includes(prop)) {
  //           // remove the prop specifier
  //           if (!remove(prop, spec.props)) {
  //             delete spec.props;
  //           }
  //           // union input specifier 
  //           spec.inputs = [...new Set([...spec.inputs, prop])];
  //         }
  //       }
  //       // console.log(id, prop);
  //       // if (id === key) {
  //       //   console.log('squelch', key);
  //       // }
  //     });
  //   }
  // });
  //
  // not good enough
  Object.assign(specTypes, types);
  //
  if (spec.bindings) {
    const bindings = {};
    const host = id.split('_').shift();
    keys(spec.bindings).forEach(key => {
      //const bound = spec.bindings[key].replace('$', '_');
      bindings[key] = `${host}_${spec.bindings[key]}`;
    });
    spec.bindings = bindings;
  }
  const connections = connectionBindings[id];
  if (connections) {
    spec.bindings = {...spec.bindings, ...connections};
  }
  //
  spec.container = spec.container?.startsWith('$root') ? spec.container : fixId(spec.container);
  specs[id] = spec;
});

const noo = {
  types: specTypes,
  ...specs,
  state: qualifiedState
};

glog('noo', noo);
