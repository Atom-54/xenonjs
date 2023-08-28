// const localVideo = document.getElementById('localVideo');
// const remoteVideo = document.getElementById('remoteVideo');

let localVideo, remoteVideo;
let pc;
let localStream;
let ready;

const signaling = new BroadcastChannel('webrtc');

signaling.onmessage = e => {
  console.log('received', e.data.type); //, e.data);
  // if (!localStream) {
  //   console.log('not ready yet');
  //   return;
  // }
  switch (e.data.type) {
    case 'offer':
      if (ready) {
        if (pc) {
          hangup();
        }
        handleOffer(e.data);
      }
      break;
    case 'answer':
      handleAnswer(e.data);
      break;
    case 'candidate':
      handleCandidate(e.data);
      break;
    case 'ready':
      // A second tab joined. This tab will initiate a call unless in a call already.
      if (pc) {
        hangup();
        //console.log('already in call, ignoring');
        //return;
      }
      ready = true;
      if (localVideo) {
        //makeCall();
        setTimeout(makeCall, 1000);
      }
      break;
    case 'bye':
      if (pc) {
        hangup();
      }
      break;
    default:
      console.log('unhandled', e);
      break;
  }
};

export const start = async (remoteVideo_, localVideo_) => {
  localVideo = localVideo_;
  remoteVideo = remoteVideo_;
  if (localVideo) {
    localStream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
    localVideo.srcObject = localStream;
  }
  signaling.postMessage({type: 'ready'});
};

export const hangup = async () => {
  _hangup();
  signaling.postMessage({type: 'bye'});
  ready = false;
};

async function _hangup() {
  if (pc) {
    pc.close();
    pc = null;
  }
  // localStream?.getTracks().forEach(track => track.stop());
  // localStream = null;
};

function createPeerConnection() {
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
  pc.ontrack = e => remoteVideo.srcObject = e.streams[0];
  localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));
}

async function makeCall() {
  await createPeerConnection();
  const offer = await pc.createOffer();
  signaling.postMessage({type: 'offer', sdp: offer.sdp});
  await pc.setLocalDescription(offer);
}

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
  if (!pc) {
    console.error('no peerconnection');
    return;
  }
  await pc.setRemoteDescription(answer);
}

async function handleCandidate(candidate) {
  if (!pc) {
    console.error('no peerconnection');
    return;
  }
  if (!candidate.candidate) {
    await pc.addIceCandidate(null);
  } else {
    await pc.addIceCandidate(candidate);
  }
}
