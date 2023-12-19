export const atom = (log, resolve) => ({
  /**
 * @license
 * Copyright 2023 Atom54 LLC
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
  const dom = this.simpleDom();
  const contextModel = context?.layers;
  const graphJson = JSON.stringify(contextModel?.base?.GraphList$graphAgent$graph || 'n/a', null, '  ');
  const graphOptions = !graphs ? [] : graphs.map(({$meta}) => $meta);
  // if (contextModel?.design) {
  //   delete contextModel.base;
  // }
  const formattedModel = {};
  map(contextModel, (key, value) => {
    const layerModel = formattedModel[key] = {};
    map(value, (key, value) => {
      key = key.split('$')/*.slice(1)*/.join('∙');
      layerModel[key] = value;
    });
  });
  return {
    dom,
    kick,
    showTools,
    context: formattedModel,
    //logs: context?.logs,
    version: Math.random(),
    capturedState,
    graphJson,
    graphOptions,
    selectedTab: {state: 0, logs: 1, atoms: 2, resources: 3, dom: 4}[selectedTab]
  };
},
onPageSelected({eventlet}, state) {
  state.selectedTab = eventlet.value;
},
async onToggleDevToolsClick(inputs, state, {service}) {
  if (state.showTools = !state.showTools) {
    await this.refresh(state, service);
  }
},
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
simpleDom() {
  const root = {};
  const walk = (dom, root) => {
    [...dom.children || []].forEach(child => {
      let branch = child.id ? root[child.id] = {} : root;
      walk(child, branch);
    });
  };
  walk(document.body, root);
  return root;
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
    font-family: 'Google Sans', sans-serif;
    font-size: 12px;
  }
  mxc-tab-pages {
    background-color: inherit;
  }
  data-explorer {
    padding: 8px;
  }
  [title] {
    font-size: 1.2em;
  }
  [devtools] {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    min-width: min(320px, 100vw);
    max-width: min(100vw, 800px);
    z-index: 110100;
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
    <!-- State -->
    <data-explorer flex scrolling object="{{context}}" expand="2"></data-explorer>
    <!-- Resources -->
    <div services flex scrolling>
      <resource-view version="{{version}}"></resource-view>
    </div>
    <!-- DOM -->
    <data-explorer flex scrolling object="{{dom}}" expand="20"></data-explorer>
    <!-- <surface-walker flex scrolling kick="{{kick}}"></surface-walker> -->
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
