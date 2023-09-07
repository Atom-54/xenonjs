export const atom = (log, resolve) => ({
  /**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
async update({graphs, show}, state, {service}) {
  if (graphs && !state.selectedGraph) {
    state.selectedGraph = graphs?.[0];
    //state.graphText = JSON.stringify(state.selectedGraph, null, '  ');
  }
  if (show === true) {
    state.showTools = true;
    this.refresh(state, service);
  }
},
async refresh(state, service) {
  state.context = await service('SystemService', 'request-context');
  state.kick = Math.random();
},
render({graphs}, {context, showTools, capturedState, kick, /*graphText,*/ selectedTab}) {
  const contextModel = context?.layers;
  // const contextModel = {
  //   design: context?.state,
  //   runtime: context?.fullState
  // };
  const graphJson = JSON.stringify(context?.layers?.base?.$GraphList$graphAgent$graph || 'n/a', null, '  ');
  const graphOptions = !graphs ? [] : graphs.map(({$meta}) => $meta);
  return {
    kick,
    showTools,
    context: contextModel,
    //logs: context?.logs,
    version: Math.random(),
    capturedState,
    graphJson,
    graphOptions,
    selectedTab: {state: 0, logs: 1, atoms: 2, resources: 3, dom: 4}[selectedTab]
  };
},
// map(object, visitor) {
//   const result = {};
//   object && entries(object).map(([name, elt]) => result[name] = visitor(elt));
//   return result;
// },
// renderAllHosts(users) {
//   const mapHosts = xenon => this.map(xenon, arc => this.renderHosts(arc.hosts));
//   return this.map(users, user => mapHosts(user?.xenon));
// },
// renderHosts(hosts) {
//   return this.map(hosts, ({meta, atom: {internal: {state, inputs}}}) => {
//     const filtered = {};
//     keys(state)
//       .filter(key => (key !== 'runtime') && (typeof state[key] !== 'function'))
//       .forEach(key => filtered[key] = state[key])
//       ;
//     return {meta, inputs, state: filtered};
//   });
// },
// renderAllStores(users) {
//   return this.map(users, user => this.renderSimpleStores(user?.stores));
// },
// renderSimpleStores(stores) {
//   const result = {};
//   const mappedStores = this.map(stores, ({data, meta}) => ({value: data, meta}));
//   //const kbSize = value => !isNaN(value) ? `${(value / 1024).toFixed(1)} Kb` : '';
//   entries(mappedStores).forEach(([name, store]) => {
//     // TODO(sjmiles): really slow for big stores
//     //result[`${name} (${kbSize(stores[name]?.save()?.length)})`] = store;
//     result[name] = store;
//   });
//   return result;
// },
// async onTabSelected(inputs, state, {service}) {
//   return this.refresh(state, service);
// },
onPageSelected({eventlet}, state) {
  //log('onTabChange', eventlet);
  state.selectedTab = eventlet.value;
},
async onToggleDevToolsClick(inputs, state, {service}) {
  if (state.showTools = !state.showTools) {
    await this.refresh(state, service);
  }
},
// toggleState(state, name) {
//   return state[name] = !state[name];
// },
async onRefreshClick(inputs, state, {service}) {
  return this.refresh(state, service);
},
async onCaptureState(inputs, state, {service}) {
  const capturedState = await service({kind: 'DevToolsService', msg: 'stateCapture'});
  state.capturedState = {state: capturedState};
},
async onCreateTest(inputs, state, {service}) {
  const capturedState = await service({kind: 'DevToolsService', msg: 'stateCapture'});
  const name = 'auto_captured_state';
  state.capturedState = {[name]: capturedState};
  const put = (url, body) => fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body});
  put(`https://xenonjs-apps.firebaseio.com/test/specs/${name}.json`, JSON.stringify(capturedState));
},
// onSelectGraph({eventlet: {value}, graphs}, state) {
//   state.selectedGraph = graphs?.find(({$meta}) => $meta?.name === value);
//   state.graphText = JSON.stringify(state.selectedGraph, null, '  ');
// },
// onGraphCodeChanges({eventlet: {value}}, state) {
//   state.graphText = value;
// },
// async onAddGraphClick({}, {graphText}, {service}) {
//   const graph = JSON.parse(graphText);
//   if (graph) {
//     return service({msg: 'addGraph', data: {graph}});
//   }
// },
template: html`
<style>
  :host {
    position: absolute;
    flex: 0 !important;
    --xcolor-hi-one: hsl(292deg 83% 31%);
    --xcolor-hi-two: hsl(292deg 83% 71%);
    /* 
    --ui-page-background: #202124;
    --ui-nav-red: #C3291C;
    --ui-bright-red: #E24741;
    --mdc-icon-button-size: 32px;
    --mdc-theme-primary: #ffffff;
    --mdc-tab-text-label-color-default: var(--ui-bright-red); 
    */
    font-family: 'Google Sans', sans-serif;
    font-size: 14px;
  }
  /* 
  wl-tab-group {
    --tab-bg: var(--xcolor-hi-two); */
    /* --tab-bg-filled: var(--xcolor-hi-two);
  } 
  */
  mxc-tab-pages {
    background-color: inherit;
  }
  data-explorer {
    padding: 8px;
  }
  [title] {
    font-size: 1.3em;
  }
  [devtools] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    min-width: min(320px, 100vw);
    max-width: min(100vw, 800px);
    z-index: 10100;
    transform: translateX(120%);
    transition: transform 200ms ease-in;
    box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
    color: lightblue;
    background: #333;
  }
  [devtools][show] {
    transform: translateX(0);
  }
  [toolbar] {
    color: #ececec;
    background-color: var(--xcolor-hi-one);
  }
  [tools-button] {
    position: fixed;
    top: -15px;
    right: -15px;
    width: 32px;
    height: 32px;
    z-index: 9999;
    opacity: 0;
    transition: opacity 1s ease-out;
    border-radius: 50%;
  }
  [tools-button]:hover {
    opacity: 1;
  }
  [tools-button] > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  [services] {
    padding: 12px;
  }
  [services] > img {
    border: 2px solid var(---xcolor-hi-one);
  }
  surface-walker {
    padding: 8px;
  }
  icon {
    font-size: 18px;
    cursor: pointer;
  }
</style>

<!-- devtools button -->
<div tools-button on-click="onToggleDevToolsClick">
  <img src=${resolve('$library/DevTools/Assets/tools.gif')}>
</div>

<!-- devtools flyout -->
<div devtools flex rows show$="{{showTools}}">

  <!-- top toolbar -->
  <div toolbar>
    <icon on-click="onToggleDevToolsClick">close</icon>
    <div flex title>Tools</div>
    <icon on-click="onRefreshClick">refresh</icon>
  </div>

  <!-- tabbed pages -->
  <weightless-pages dark flex on-selected="onPageSelected" tabs="State,Resources,DOM,Graph">
  <!-- <wl-tab-group selectedtab="state" on-change="onTabChange">
    <wl-tab key="state">State</wl-tab>
    <wl-tab key="logs">Logs</wl-tab>
    <wl-tab key="dom">Dom</wl-tab>
    <wl-tab key="resources">Resources</wl-tab>
  </wl-tab-group> -->
  <!-- <mxc-tab-pages dark flex selected="{{selectedTab}}" Xtabs="State,Atoms,Resources,DOM,Graphs,Charts,Tests" Xon-selected="onTabSelected"> -->
    <!-- State -->
    <data-explorer flex scrolling object="{{context}}" expand="2"></data-explorer>
    <!-- Resources -->
    <div services flex scrolling>
      <resource-view version="{{version}}"></resource-view>
    </div>
    <!-- DOM -->
    <surface-walker flex scrolling kick="{{kick}}"></surface-walker>
    <!-- Graph -->
    <div flex scrolling>
      <pre>{{graphJson}}</pre>
    </div>
    <!-- Logs -->
    <!-- <log-viewer flex column logs="{{logs}}"></log-viewer> -->
    <!-- Atoms (by Arc) -->
    <!-- <data-explorer flex scrolling object="{{atoms}}" expand></data-explorer> -->
    <!-- Graphs -->
    <!-- <div flex scrolling>
      <div toolbar>
        <multi-select options="{{graphOptions}}" on-change="onSelectGraph"></multi-select>
        <mwc-icon-button icon="refresh" on-click="onAddGraphClick"></mwc-icon-button>
      </div>
      <code-mirror flex text="{{graphText}}" on-changes="onGraphCodeChanges"></code-mirror>
    </div> -->
    <!-- Diagrams -->
    <!-- <div flex rows>
      <data-graph object="{{context}}" flex x3></data-graph>
    </div> -->
    <!-- Tests -->
    <!-- <div flex rows>
      <div toolbar>
        <input flex value="auto_captured_state">
        <button on-click="onCreateTest">Create</button>
      </div>
      <div toolbar>
        <div flex title>Inputs</div>
      </div>
      <data-explorer flex scrolling object="{{storeBools}}" expand></data-explorer>
      <div toolbar>
        <div flex title>State</div>
        <mwc-icon-button icon="refresh" on-click="onCaptureState"></mwc-icon-button>
      </div>
      <data-explorer flex scrolling object="{{capturedState}}" expand></data-explorer>
    </div> -->
  <!-- </mxc-tab-pages> -->
  </weightless-pages>
</div>
`
});
