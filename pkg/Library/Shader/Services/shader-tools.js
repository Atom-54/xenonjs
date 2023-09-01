export const loadShaderToy = async toy => {
  const code = toy?.Shader?.renderpass[0].code;
  if (code) {
    return fragmentShader(code);
  }
};

export const uniformsFactory = () => ({
  iResolution: {value: new globalThis.THREE.Vector3(640, 480, 1)},
  iTime: {value: 0},
  iTimeDelta: {value: 0},
  iFrame: {value: 0},
  iChannelTime: {value: [0, 0, 0, 0]},
  iChannelResolution: {value: null},
  iChannel0: {value: null},
  iChannel1: {value: null},
  iChannel2: {value: null},
  iChannel3: {value: null},
  iAudioChannel: {value: null},
  // iMouse: {value: null},
  // iDate: {value: null},
  // iSampleRate: {value: 44100}
});

export const fragmentShader = code => `
uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D iChannel0;             // input channel. XX = 2D/Cube
uniform sampler2D iChannel1;             // input channel. XX = 2D/Cube
uniform sampler2D iChannel2;             // input channel. XX = 2D/Cube
uniform sampler2D iChannel3;             // input channel. XX = 2D/Cube
uniform sampler2D iAudioChannel;         // input channel.
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

${code}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`.trim();
