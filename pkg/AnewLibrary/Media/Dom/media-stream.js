/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {Xen} from '../../Dom/Xen/xen-async.js';
import {Resources} from '../../Resources/Resources.js';

const sharedStreams = {};
// const subscribers = {};

export const defaultStreamid = 'default';

// export const subscribeToStream = (streamid, fn) => {
//   if (!subscribers[streamid]) {
//     subscribers[streamid] = [];
//   }
//   subscribers[streamid].push(fn);
//   return sharedStreams[streamid];
// };

// export const unsubscribeFromStream = (streamid, fn) => {
//   const subs = subscribers[streamid];
//   const i = subs?.indexOf?.(fn);
//   if (i >= 0) {
//     subs.splice(i, 1);
//   }
// };

// export const subscribeToDefaultStream = (fn) => {
//   return subscribeToStream(defaultStreamid, fn);
// };

// const notifySubscribers = (streamid) => {
//   const sharedStream = sharedStreams[streamid];
//   if (sharedStream) {
//     subscribers[streamid]?.forEach(fn => fn(sharedStream));
//   }
// };

const log = logf('DOM: media-stream', '#837006');

export class MediaStream extends Xen.Async {
  static get observedAttributes() {
    return ['streamid', 'playingvideo', 'playingaudio', 'videodeviceid', 'audioinputdeviceid'];
  }
  async update(inputs, state) {
    await this.updateInitialState(state);
    this.updatePlayingState(inputs, state);
  }
  async updateInitialState(state) {
    if (!state.init) {
      state.init = true;
      // list devices and check the availability of video and audio input devices.
      Object.assign(state, await this.enumerateDevices());
      navigator.mediaDevices.addEventListener('devicechange', async () => {
        Object.assign(state, await this.enumerateDevices());
        this.invalidate();
      });
    }
  }
  async enumerateDevices() {
    let mediaDevices = await navigator.mediaDevices.enumerateDevices();
    // make mediaDevice objects into POJOs so they are transferable
    // https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects
    const devices = mediaDevices.map(({deviceId, groupId, kind, label}) => ({
      kind,
      deviceId,
      groupId,
      label
    }));
    const hasVideoInput = devices.some(({kind}) => kind === 'videoinput');
    const hasAudioInput = devices.some(({kind}) => kind === 'audioinput');
    log.groupCollapsed('media devices:');
    log(JSON.stringify(devices.map(info => info.label), null, '  '));
    log.groupEnd();
    this.value = devices;
    this.fire('devices');
    return {devices, hasAudioInput, hasVideoInput};
  }
  updatePlayingState({streamid, playingvideo, playingaudio, videodeviceid, audioinputdeviceid}, state) {
    // TODO(jingjin): show warning if user requests audio/video but doesn't
    // have the device.
    playingvideo =
        (playingvideo === '' || Boolean(playingvideo)) && state.hasVideoInput;
    playingaudio =
        (playingaudio === '' || Boolean(playingaudio)) && state.hasAudioInput;
    if (playingvideo !== state.playingvideo ||
        playingaudio !== state.playingaudio ||
        (playingvideo && videodeviceid !== state.videodeviceid) ||
        (playingaudio && audioinputdeviceid !== state.audioinputdeviceid)) {
      state.playingvideo = playingvideo;
      state.playingaudio = playingaudio;
      state.videodeviceid = videodeviceid;
      state.audioinputdeviceid = audioinputdeviceid;
      this.startOrStop(streamid || defaultStreamid, playingvideo, playingaudio, videodeviceid, audioinputdeviceid);
    }
  }
  async startOrStop(streamid, trueToStartVideo, trueToStartAudio, videodeviceid, audioinputdeviceid) {
    log(trueToStartVideo ? 'STARTING VIDEO' : 'stopping video');
    log(trueToStartAudio ? 'STARTING AUDIO' : 'stopping audio');
    this.fire(trueToStartVideo ? 'starting-video' : 'stopping-video');
    this.fire(trueToStartAudio  ? 'starting-audio' : 'stopping-audio');
    this.maybeHaltStreams(streamid, !trueToStartVideo, !trueToStartAudio);
    if (trueToStartVideo || trueToStartAudio) {
      try {
        const streamPromise = this.produceStream(trueToStartVideo, trueToStartAudio, videodeviceid, audioinputdeviceid);
        sharedStreams[streamid] = await streamPromise;
      } catch (e) {
        this.maybeHaltStreams(streamid, true, true);
      }
    }
    Resources.set(streamid, sharedStreams[streamid]);
    this.key = streamid;
    this.fire('stream');
    // if (streamid === defaultStreamid) {
    //   Resources.set(defaultStreamid, sharedStreams[streamid]);
    // }
    //notifySubscribers(streamid);
  }
  async produceStream(enableVideo, enableAudio, videodeviceid, audioinputdeviceid) {
    // these are the droids we are looking for
    const constraints = {
    };
    if (enableVideo) {
      constraints.video = {
        // Prefer the rear-facing camera if available.
        facingMode: "environment",
        // TODO(sjmiles): use my best cam if available
        //deviceId: `545b0c354475465dd731e6fe7414319c2d88f4660c6c108ca43528191638406b`
        //deviceId: '765b8e89f8e6a0630bccbab92cd75323781f9ea796e2fee147abae3c5ad45c07'
      };
      if (videodeviceid) {
        constraints.video.deviceId = {exact: videodeviceid};
      }
    }
    if (enableAudio) {
      constraints.audio = audioinputdeviceid ? {deviceId: {exact: audioinputdeviceid}} : true;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch(x) {
      log(x);
    }
    if (stream && enableVideo) {
      let facingMode = '';
      try {
        facingMode = stream.getVideoTracks()?.pop()?.getSettings().facingMode || '';
        console.log(`live-view::facingMode = "${facingMode}"`);
      } catch(x) {
        // squelch
      }
      this.state = {facingMode};
    }
    return stream;
  }
  maybeHaltStreams(streamid, haltVideoStream, haltAudioStream) {
    const sharedStream = sharedStreams[streamid];
    if (sharedStream) {
      if (haltVideoStream) {
        this.haltStream(sharedStream, 'video');
      }
      if (haltAudioStream) {
        this.haltStream(sharedStream, 'audio');
      }
    }
  }
  haltStream(stream, kind) {
    stream?.getTracks().forEach(track => {
      if (track.kind === kind) {
        track.stop();
      }
    });
  }
  render({}, {show, stopped, facingMode}) {
    return {
      show,
      stopped,
      flipVideo: facingMode === 'user' || facingMode === ''
    };
  }
}

customElements.define('media-stream', MediaStream);
