/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../Resources.js';
import './media-stream.js';

//import {subscribeToStream, unsubscribeFromStream} from './media-stream.js';

const log = logf('DOM: stream-view', 'green');

export class StreamView extends Xen.Async {
  static get observedAttributes() {
    return ['flip', 'src', 'stream', 'frequency', 'version'];
  }
  getInitialState() {
    return {
      //subscriber: this.invalidate.bind(this),
      id: Math.floor(Math.random()*1e3 + 9e2)
    };
  }
  _didMount() {
    this.canvas = Object.assign(this._dom.$('canvas'), {width: 640, height: 480});
    this.video = this._dom.$('video');
  }
  _wouldChangeProp(name, value) {
    return name === 'stream' || super._wouldChangeProp(name, value);
  }
  update({frequency, stream, src}, state) {
    // make output canvas available as a resource id
    Resources.set(state.id, this.canvas);
    // for use in dom operations
    this.value = state.id;
    let realStream;
    if (stream && src) {
      this.video.src = src;
      realStream = this.video.captureStream();
      Resources.set(stream, realStream)
    } else if (stream) {
      realStream = Resources.get(stream);
      if (realStream && this.video.srcObject !== realStream) {
        //state.realStream = realStream;
        this.video.srcObject = realStream;
      }
    }
    if (realStream && frequency) {
      this.doCanvasCadence(Number(frequency));
    } else {
      //log(frequency, stream, src);
    }
  }
  doCanvasCadence(frequency) {
    if (!this.cadencing) {
      this.cadencing = true;
      if (this.video.srcObject.active) {
        const {videoWidth: w, videoHeight: h} = this.video;
        const {width: cw, height: ch} = this.canvas;
        if (w && h) {
          //console.warn(id, 'cadence: ', w, h, cw, ch);
          if (cw !== w || ch !== h) {
            //log(id, 'size: ', w, h, cw, ch);
            Object.assign(this.canvas, {width: w, height: h});
          }
          this.canvas.getContext('2d').drawImage(this.video, 0, 0, w, h);
          this.fire('canvas');
        }
      }
      const msPerFrame = Math.max(1000 * (1 / frequency) ?? 0, 33);
      setTimeout(() => {
        this.cadencing = false;
        this.invalidate();
      }, msPerFrame);
      //console.warn(id, 'cadence: ', msPerFrame);
    }
  }
  render({src, flip, frequency}, {}) {
    return {
      flip,
      canvasNotVideo: Boolean(frequency).toString()
    };
  }
  // onVideoReady() {
  //   this.mergeState({videoReady: true});
  //   this.video.play();
  // }
  // onVideoPlaying() {
  //   this.mergeState({videoPlaying: true});
  // }
  onCanPlay({src}) {
    // if (src) {
    //   realStream = this.video.captureStream();
    //   Resources.set(state.stream, realStream)
    // }
  }
  hasVideoTracks(stream) {
    return stream.getVideoTracks().some(track=>track.readyState !== 'ended');
  }
  get template() {
    return Xen.Template.html`
<style>
  :host {
    display: flex;
    /* min-width: 160px;
    min-height: 120px; */
    font-size: 10px;
    color: black;
    background-color: black;
    position: relative;
  }
  * {
    box-sizing: border-box;
  }
  /* canvas overlays video */
  video {
    position: absolute;
  }
  canvas, video {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  [flip] {
    transform: scaleX(-1);
  }
  [hide=true],[show=false] {
    visibility: hidden;
  }
</style>

<video hide$="{{canvasNotVideo}}" on-canplay="onCanPlay" autoplay playsinline muted flip$="{{flip}}"></video>
<canvas show$="{{canvasNotVideo}}"></canvas>

  `;
  }
}
customElements.define('stream-view', StreamView);
