import * as vc from './virtual-camera.js'

let stream;

const getVirtualMediaStream = async () => {
  startWebRtcReceiver();
  stream = await navigator.mediaDevices.getUserMedia({
    video: {}
  });  
  return stream;
};

let pip;

const ontrack = ({track, streams}) => {
  console.log('ontrack!!!!!', track, streams);
  const stream = streams[0];
  // if (pip) {
    assignStreamTrack(track, stream);
  // } else {
  //   console.log('waiting for body');
  //   setTimeout(() => {
  //     console.log('building pip');
  //     pip = document.body.appendChild(Object.assign(document.createElement('video'), {
  //       autoplay: true,
  //       playsinline: true,
  //       style: 'position: absolute; left: 0; top: 0; z-index: 1000; width: 128px; border: 4px solid orange;'
  //     }));
  //     assignStreamTrack(track, stream);
  //   }, 1000);
  // }
};

const assignStreamTrack = (track, trackStream) => {
  console.log('assigning stream');
  const t0 = (stream.getTracks())[0];
  stream.addTrack(track);
  stream.removeTrack(t0)
  //
  pip && (pip.srcObject = trackStream);
};

// there is no explicit trigger, we just create it
vc.createVirtualCamera(getVirtualMediaStream);

const id = Math.floor((Math.random()*9+1)*1e3);

const startWebRtcReceiver = async () => {
  console.log('starting xenon camera receiver');
  return startWebRtc(`XenonReceiver`);
};

globalThis.sendXenonCameraStream = async stream => {
  console.log('starting xenon camera stream');
  return startWebRtc(`XenonSender`, stream);
};

const startWebRtc = async (nom, localStream) => {
  const {...webRtc} = await import('./webrtc.js');
  const signaling = {
    postMessage: signal => window.postMessage({nom, id, type: 'signal', signal}),
    onMessage: {
      addListener: listener => window.addEventListener('message', e => {
        if (e.data?.id !== id) {
          listener(e.data.signal);
        }
      })
    }
  };
  webRtc.initWebRtc(signaling, localStream, ontrack);
  console.log('ready for webrtc connection');
  window.postMessage({nom, id, type: 'ready'});
  return webRtc;
};
