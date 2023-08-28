import {Peer} from './Peer.js';
import {logFactory} from '../Core/utils.js';

const log = logFactory(logFactory.flags.rtc, 'WebRtc', 'cyan', '#444');

export const Myself = class {
  constructor() {
    this.name = '';
    this.mediaStream = null;
    this.calls = {};
    this.mediaConnections = {};
    this.me = this.createMe();
    this.ready = new Promise(resolve => this.resolveReady = resolve);
  }
  createMe() {
    const me = new Peer();
    // when connection to PeerServer is established, we receive our peerid
    me.on('open', id => this.onopen(id));
    // error events
    me.on('error', err => this.onerror(err));
    // when a call comes in, answer it
    me.on('call', mediaConnection => this.oncall(mediaConnection));
    return me;
  }
  onopen(id) {
    log('My peer ID is: ' + id);
    this.peerId = id;
    // when a connection opens, resolve the ready promise
    this.resolveReady();
  }
  onerror(err) {
    console.error(err);
  }
  oncall(media) {
    // extract info from metadata
    const metadata = media.metadata;
    const {id: name, call: peerId} = metadata;
    const meta = this.mediaConnections[peerId] = {metadata};
    // announce important happening
    log('ANSWERING <---', name, peerId);
    // huh?
    media.answer(this.mediaStream);
    // here comes a stream from the caller
    media.on('stream', stream => {
      meta.stream = stream;
      log('media:onstream', stream);
      this.onstream(stream, media.metadata);
    });
    media.on('close', () => {
      log('media:close');
    });
  }
  onstream(stream, metadata) {
    // abstract!
  }
  // the mediaStream that represents me
  // somebody else has to set it
  get mediaStream() {
    return this._mediaStream;
  }
  set mediaStream(stream) {
    this._mediaStream = stream;
    if (stream && !stream.active) {
      this.endStreamCall(stream);
    }
  }
  shouldCall(them) {
    if (!this.mediaStream) {
      //console.warn('no media stream to call about');
      return false;
    }
    return !this.calls[them];
  }
  doCall(them) {
    const metadata = {
      id: this.name,
      call: this.peerId
    };
    const call = this.me.call(them, this.mediaStream, {metadata});
    // answered calls invoke me.oncall, which invokes 'answerCall'
    if (!call) {
      log('failed to place call');
    } else {
      //console.log(call);
      this.calls[them] = call;
      call.on('error', error => log.warn(error));
      call.on('close', () => log('call:close'));
    }
  }
  endCall(them) {
    if (them) {
      log('.........END CALL', them);
      const call = this.calls[them];
      call?.close?.();
      this.calls[them] = null;
      //setTimeout(this.calls[them] = null, 500);
    }
  }
  endStreamCall(stream) {
    this.endCall(this.mediaConnections[stream]?.metadata?.call);
  }
};

// const connections = {};

// export const Connector = {
//   get me() {
//     return me;
//   },
//   get peerId() {
//     return peerId;
//   },
//   // look for folks who want to connect
//   async handshake(onxxx) {
//     myself.onxxx = onxxx;
//     if (myself.peerId) {
//       const strangers = await tryst.meetStrangers(myself.peerId);
//       strangers.forAll(pid => pid && myself.maybeConnect(pid, onxxx));
//       this.onstrangers?.(strangers);
//     }
//   },
//   maybeConnect: (them, onstream) => {
//     if (myself.shouldConnect(them)) {
//       myself.doConnect(them, onstream);
//     }
//   },
//   shouldConnect: (them) => {
//     return !connections[them];
//   },
//   doConnect(them, onxxx) {
//     console.log('---> CALLING', them);
//     const call = me.call(them, myself.mediaStream, {metadata: {id: myself.metadata.name, call: myself.peerId}});
//     if (call) {
//       calls[them] = call;
//       call.on('error', error => console.warn(error));
//       call.on('close', () => {
//         console.log('call:close');
//       });
//     }
//   },
//   answerCall: media => {
//     console.log('ANSWERING <---',  media.metadata);
//     //
//     const id = media.metadata.id;
//     const meta = mediaConnections[id] = {metadata: media.metadata};
//     //
//     media.answer(myself.mediaStream);
//     media.on('stream', stream => {
//       meta.stream = stream;
//       console.log('media:onstream', stream);
//       myself.onstream(stream, media.metadata);
//     });
//     media.on('close', () => {
//       console.log('media:close');
//     });
//   },
//   endCall: them => {
//     if (them) {
//       console.log('.........END CALL', them);
//       const call = calls[them];
//       calls[them] = null;
//       //call?.close?.();
//       setTimeout(calls[them] = null, 500);
//     }
//   },
//   endStreamCall: stream => {
//     myself.endCall(mediaConnections[stream]?.metadata?.call);
//   }
// };