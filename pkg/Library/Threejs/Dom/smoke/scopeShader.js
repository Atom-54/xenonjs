// const loader = new THREE.TextureLoader();
// const texture = loader.load('data:image/jpeg;base64,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');
// texture.minFilter = THREE.NearestFilter;
// texture.magFilter = THREE.NearestFilter;
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;

export const uniforms = {
  iResolution: {value: new THREE.Vector3(640, 480, 1)},
  iTime: {value: 0},
  // iTimeDelta: {value: 0},
  // iChannelTime: {value: [0, 0, 0, 0]},
  // iChannelResolution: {value: null},
  // iMouse: {value: null},
  iChannel0: {value: null},
  iChannel1: {value: null},
  iChannel2: {value: null},
  iChannel3: {value: null},
  // iDate: {value: null},
  // iSampleRate: {value: 44100}
};

export const fragmentShader = `

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
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)

// Robin Green, Dec 2016
// Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy;

    // calculate the intensity bucket for this pixel based on column height (padded at the top)
    const float max_value = 270.0;
    const float buckets = 512.0;
    float bucket_min = log( max_value * floor(uv.y * buckets) / buckets );
    float bucket_max = log( max_value * floor((uv.y * buckets) + 1.0) / buckets );

    // count the count the r,g,b and luma in this column that match the bucket
    vec4 count = vec4(0.0, 0.0, 0.0, 0.0);
    for( int i=0; i < 512; ++i ) {
        float j = float(i) / buckets;
        vec4 pixel = texture(iChannel1, vec2(uv.x, j )) * 256.0;

        // calculate the Rec.709 luma for this pixel
        pixel.a = pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722;

        vec4 logpixel = log(pixel);
        if( logpixel.r >= bucket_min && logpixel.r < bucket_max) count.r += 1.0;
        if( logpixel.g >= bucket_min && logpixel.g < bucket_max) count.g += 1.0;
        if( logpixel.b >= bucket_min && logpixel.b < bucket_max) count.b += 1.0;
        if( logpixel.a >= bucket_min && logpixel.a < bucket_max) count.a += 1.0;
    }

    // sum luma into RGB, tweak log intensity for readability
    const float gain = 0.3;
    const float blend = 0.6;
    count.rgb = log( mix(count.rgb, count.aaa, blend) ) * gain;

    // output
    fragColor = count;
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}

`;