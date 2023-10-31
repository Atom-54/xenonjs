/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {App} from '../deploy/Library/App/TopLevel/App.js.js';
import {logFactory} from '../deploy/Library/Core/utils.min.js.js';
import {XenComposer} from '../deploy/Library/Dom/Surfaces/Default/XenComposer.js.js';
import {HistoryService} from '../deploy/Library/App/HistoryService.js.js';
import {FirebaseStoragePersistor} from '../deploy/Library/Firebase/FirebaseStoragePersistor.js.js';
import {DeviceUxRecipe} from '../deploy/Library/Media/DeviceUxRecipe.js.js';
import {CameraNode} from '../deploy/Library/GraphsNodes/CameraNode.js.js';

const log = logFactory(true, 'ExtensionApp', 'navy');

const ExtensionRecipe = {
  $stores: {
    html: {
      $tags: ['persisted'],
      $type: 'MultilineString',
      $value: `
<div style="padding: 24px;">
  <h3>Hello World ${Math.random()}</h3>
</div>
        `.trim(),
    }
  },
  echo: {
    $kind: '$library/Echo.js',
    $inputs: ['html']
  }
};

export const ExtensionApp = class extends App {
  constructor(path, root, options) {
    super(path, root, options);
    this.services = {
      HistoryService
    };
    this.persistor = new FirebaseStoragePersistor('user');
    this.userAssembly = [CameraNode, ExtensionRecipe];
    this.composer = new XenComposer(document.body, true);
    this.composer.onevent = (p, e) => this.handle(p, e);
    this.arcs.render = p => this.render(p);
    log('Extension lives!');
  }
  async spinup() {
    await super.spinup();
    setTimeout(() => {
      this.arcs.set('user', 'mediaDevices', {
        videoinput: {
          deviceId: '545b0c354475465dd731e6fe7414319c2d88f4660c6c108ca43528191638406b',
          kind: 'videoinput',
          label: 'HD Pro Webcam C920 (046d:082d)',
          groupId: '6b5db3734e5bd10ecda9de583b7ef3761be03ce1ab1b49c1a91a312fb91f6de2'
        }
      });
    }, 1000);
//     this.arcs.set('user', 'html', `
// <div style="padding: 24px;">
//   <h3>Hello World ${Math.random()}</h3>
// </div>
//     `);
  }
  render(packet) {
    log('render', packet);
    this.composer.render(packet);
  }
  handle(pid, eventlet) {
    // TODO(sjmiles): the composer doesn't know from Arcs or Users, so the PID is all we have
    // we should make the PID into an USERID:ARCID:PARTICLEID ... UAPID? UAP? E[vent]ID?
    const arc = Object.values(this.arcs.user.arcs).find(({hosts}) => hosts[pid]);
    arc?.onevent(pid, eventlet);
  }
};
