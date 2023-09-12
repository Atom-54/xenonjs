/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import * as App from '../../../Library/CoreFramework/App.js';
import * as Composer from '../../../Library/CoreFramework/Composer.js';
import '../../../Library/CodeMirror/Dom/code-mirror.js';
import '../../../Library/PixiJs/PixiJsDom.js';
import '../../../Library/Fields/FieldsDom.js';
/**/
import {graph as baseGraph} from '../../../Graphs/Base.js';
import * as Persist from '../../../Library/CoreFramework/Persist.js';
import {services} from '../../../Apps/services.js';

let xenonResolve;
const XenonPromise = new Promise(resolve => xenonResolve = resolve);

export class GraphElement extends Xen.Async {
  static get observedAttributes() {
    return ['graph'];
  }
  async _didMount() {
    const xenon = await XenonPromise;
    // const buildGraph = {};
    const id = await Persist.restoreValue(`$GraphList$graphAgent$selectedId`);
    const buildGraph = await Persist.restoreValue(`$GraphList$graphAgent$graphs.${id}`);
    buildGraph.state[`Main$designer$disabled`] = true;
    log(buildGraph);
    // new Composers should use these options
    Composer.options.root = this.host;
    // create app with Atom emitter
    const app = await App.createLayer([baseGraph, buildGraph], xenon.emitter, Composer, services);
    //globalThis.app = app;
    await App.initializeData(app);
    log('app is live 🌈');
    this.state = {app, App, xenon};
  }
  update({graph}) {
  }
  get template() {
    return Xen.Template.html`
<style>
  :host {
    /**/
    box-sizing: border-box;
    /**/
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /**/
    font-family: Quicksand, sans-serif;
  }
  #_root_panel {
    flex: 1
  }
  [atom] {
    overflow: hidden;
    border-style: solid;
    border-width: 0;
  }
</style>
    `
  }
}

customElements.define('graph-element', GraphElement);

export const initXenon = async (connectXenon) => {
  try {
    const {xenon/*, terminal*/} = await connectXenon();
    await xenon.industrialize();
    xenonResolve(xenon)
    return xenon;
  } catch(x) {
    console.error(x);
  }
};

// it rolls down stairs, alone or in pairs! it's log!
const log = logf('Main', 'indigo');
logf.flags.Main = true;

// export const main = async (xenon, App, Composer) => {
//   const buildGraph = {};
//   // const buildGraph = await Persist.restoreValue(`$GraphList$graphAgent$graphs.${id}`);
//   // buildGraph.state[`Main$designer$disabled`] = true;
//   // log(buildGraph);
//   // create app with Atom emitter
//   const app = await App.createLayer([baseGraph, buildGraph], xenon.emitter, Composer, services);
//   await App.initializeData(app);
//   log('app is live 🌈');
//   //globalThis.app = app;
//   return app;
// };
