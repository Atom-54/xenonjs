/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let remoteVideo, localStream, signaling, ontrack;

export const initWebRtc = (signaling_, localStream_, ontrack_) => {
  remoteVideo = globalThis.remoteVideo;
  localStream = localStream_;
  signaling = signaling_;
  ontrack = ontrack_;
  signaling.onMessage.addListener(onSignal);
};

export const hangup = () => {
  _hangup();
  signaling.postMessage({type: 'bye'});
};

let pc;

export const onSignal = signal => {
  console.log('signal received', signal?.type); 
  switch (signal?.type) {
    case 'ready':
      // an entrant has joined
      if (pc) {
        // full interrupt mode
        hangup();
      }
      // if we are serving a localStream, make the call
      if (localStream) {
        makeCall();
      } else {
        // otherwise, prepare to answer the call
        signaling.postMessage({type: 'ready'});
      }
      break;
    case 'offer':
      if (pc) {
        // full interrupt mode
        hangup();
      }
      handleOffer(signal);
      break;
    case 'answer':
      handleAnswer(signal);
      break;
    case 'candidate':
      handleCandidate(signal);
      break;
    case 'bye':
      hangup();
      break;
    default:
      console.log('unhandled', signal);
      break;
  }
};

function _hangup() {
  if (pc) {
    pc.close();
    pc = null;
  }
  if (remoteVideo) {
    remoteVideo.srcObject = null;
  }
};

function createPeerConnection() {
  console.log('createPeerConnection');
  pc = new RTCPeerConnection({
    //iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]
    iceServers: [
      { url: "stun:stun.l.google.com:19302" },
      { url: "stun:stun1.l.google.com:19302" },
      { url: "stun:stun2.l.google.com:19302" },
      { url: "stun:stun3.l.google.com:19302" },
      { url: "stun:stun4.l.google.com:19302" }
    ]
  });
  pc.onicecandidate = e => {
    const message = {
      type: 'candidate',
      candidate: null,
    };
    if (e.candidate) {
      message.candidate = e.candidate.candidate;
      message.sdpMid = e.candidate.sdpMid;
      message.sdpMLineIndex = e.candidate.sdpMLineIndex;
    }
    signaling.postMessage(message);
  };
  pc.ontrack = e => {
    console.log('[ONAIR] remote tracks have arrived to to PeerConnection', e);
    ontrack(e);
  };
  if (localStream) {
    console.log('adding localStream tracks to PeerConnection');
    const tracks = [...localStream.getTracks()];
    localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));
  }
}

const makeCall = async () => {
  await createPeerConnection();
  const offer = await pc.createOffer();
  signaling.postMessage({type: 'offer', sdp: offer.sdp});
  await pc.setLocalDescription(offer);
};

async function handleOffer(offer) {
  if (pc) {
    console.error('existing peerconnection');
    return;
  }
  await createPeerConnection();
  await pc.setRemoteDescription(offer);
  const answer = await pc.createAnswer();
  signaling.postMessage({type: 'answer', sdp: answer.sdp});
  await pc.setLocalDescription(answer);
}

async function handleAnswer(answer) {
  await pc.setRemoteDescription(answer);
}

async function handleCandidate(candidate) {
  const ice = candidate?.candidate ? candidate : null;
  return pc.addIceCandidate(ice);
}
