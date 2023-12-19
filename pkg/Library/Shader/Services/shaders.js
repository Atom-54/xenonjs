export const FireShader = `
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rand(vec2 n) {
    return fract(sin(cos(dot(n, vec2(12.9898,12.1414)))) * 83758.5453);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 n) {
    float total = 0.0, amplitude = 1.0;
    for (int i = 0; i <5; i++) {
        total += noise(n) * amplitude;
        n += n*1.7;
        amplitude *= 0.47;
    }
    return total;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    const vec3 c1 = vec3(0.5, 0.0, 0.1);
    const vec3 c2 = vec3(0.9, 0.1, 0.0);
    const vec3 c3 = vec3(0.2, 0.1, 0.7);
    const vec3 c4 = vec3(1.0, 0.9, 0.1);
    const vec3 c5 = vec3(0.1);
    const vec3 c6 = vec3(0.9);

    vec2 speed = vec2(1.2, 0.1);
    float shift = 1.327+sin(iTime*2.0)/2.4;
    float alpha = 1.0;
    
    //change the constant term for all kinds of cool distance versions,
    //make plus/minus to switch between 
    //ground fire and fire rain!
	float dist = 3.5-sin(iTime*0.4)/1.89;
    
    vec2 p = fragCoord.xy * dist / iResolution.xx;
    p.x -= iTime/1.1;
    float q = fbm(p - iTime * 0.01+1.0*sin(iTime)/10.0);
    float qb = fbm(p - iTime * 0.002+0.1*cos(iTime)/5.0);
    float q2 = fbm(p - iTime * 0.44 - 5.0*cos(iTime)/7.0) - 6.0;
    float q3 = fbm(p - iTime * 0.9 - 10.0*cos(iTime)/30.0)-4.0;
    float q4 = fbm(p - iTime * 2.0 - 20.0*sin(iTime)/20.0)+2.0;
    q = (q + qb - .4 * q2 -2.0*q3  + .6*q4)/3.8;
    vec2 r = vec2(fbm(p + q /2.0 + iTime * speed.x - p.x - p.y), fbm(p + q - iTime * speed.y));
    vec3 c = mix(c1, c2, fbm(p + r)) + mix(c3, c4, r.x) - mix(c5, c6, r.y);
    vec3 color = vec3(c * cos(shift * fragCoord.y / iResolution.y));
    color += .05;
    color.r *= .8;
    vec3 hsv = rgb2hsv(color);
    hsv.y *= hsv.z  * 1.1;
    hsv.z *= hsv.y * 1.13;
    hsv.y = (2.2-hsv.z*.9)*1.20;
    color = hsv2rgb(hsv);
    vec4 camColor = texture(iChannel0, fragCoord.xy / iResolution.xy);
    fragColor = camColor * 0.5 + vec4(color.x, color.y, color.z, alpha) * 0.5;
}`

export const WebCamGlitch = `
// Webcam Glitch
// By Leon Denise 08-06-2022
// Simple and handy glitch effect for digital screen

vec3 hash33(vec3 p3) // Dave Hoskins https://www.shadertoy.com/view/4djSRW
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);
}
vec2 hash21(float p)
{
	vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
	p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx+p3.yz)*p3.zy);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    
    // zoom out
    uv = (uv-.5)*1.1+.5;
    
    // animation
    float speed = 10.;
    float t = floor(iTime*speed);
    
    // randomness
    vec2 lod = iResolution.xy/hash21(t)/200.;
    vec2 p = floor(uv*lod);
    vec3 rng = hash33(vec3(p,t));
    
    // displace uv
    vec2 offset = vec2(cos(rng.x*6.283),sin(rng.x*6.283))*rng.y;
    float fade = sin(fract(iTime*speed)*3.14);
    vec2 scale = 50. / iResolution.xy;
    float threshold = step(0.9, rng.z) ;
    uv += offset * threshold * fade * scale;
    
    // chromatic abberation
    vec2 rgb = 10./iResolution.xy * fade * threshold;
    fragColor.r = texture(iChannel0, uv+rgb).r;
    fragColor.g = texture(iChannel0, uv).g;
    fragColor.b = texture(iChannel0, uv-rgb).b;
    fragColor.a = 1.0;
    
    // crop
    fragColor.rgb *= step(0.,uv.x) * step(uv.x,1.) * step(0.,uv.y) * step(uv.y,1.);
    
}`;

export const RainyWindow = `
// shader derived from Heartfelt - by Martijn Steinrucken aka BigWings - 2017
// https://www.shadertoy.com/view/ltffzl
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#define S(a, b, t) smoothstep(a, b, t)
//#define DEBUG
#define size 0.2
#define CAM // uncomment to switch from webcam input to iChannel1 texture


vec3 N13(float p) {
   //  from DAVE HOSKINS
   vec3 p3 = fract(vec3(p) * vec3(.1031,.11369,.13787));
   p3 += dot(p3, p3.yzx + 19.19);
   return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

vec4 N14(float t) {
	return fract(sin(t*vec4(123., 1024., 1456., 264.))*vec4(6547., 345., 8799., 1564.));
}
float N(float t) {
    return fract(sin(t*12345.564)*7658.76);
}

float Saw(float b, float t) {
	return S(0., b, t)*S(1., b, t);
}



vec2 Drops(vec2 uv, float t) {
    
    vec2 UV = uv;
    
    // DEFINE GRID
    uv.y += t*0.8;
    vec2 a = vec2(6., 1.);
    vec2 grid = a*2.;
    vec2 id = floor(uv*grid);
    
    // RANDOM SHIFT Y
    float colShift = N(id.x); 
    uv.y += colShift;
    
    // DEFINE SPACES
    id = floor(uv*grid);
    vec3 n = N13(id.x*35.2+id.y*2376.1);
    vec2 st = fract(uv*grid)-vec2(.5, 0);
    
    // POSITION DROPS
    //clamp(2*x,0,2)+clamp(1-x*.5, -1.5, .5)+1.5-2
    float x = n.x-.5;
    
    float y = UV.y*20.;
    
    float distort = sin(y+sin(y));
    x += distort*(.5-abs(x))*(n.z-.5);
    x *= .7;
    float ti = fract(t+n.z);
    y = (Saw(.85, ti)-.5)*.9+.5;
    vec2 p = vec2(x, y);
    
    // DROPS
    float d = length((st-p)*a.yx);
    
    float dSize = size; 
    
    float Drop = S(dSize, .0, d);
    
    
    float r = sqrt(S(1., y, st.y));
    float cd = abs(st.x-x);
    
    // TRAILS
    float trail = S((dSize*.5+.03)*r, (dSize*.5-.05)*r, cd);
    float trailFront = S(-.02, .02, st.y-y);
    trail *= trailFront;
    
    
    // DROPLETS
    y = UV.y;
    y += N(id.x);
    float trail2 = S(dSize*r, .0, cd);
    float droplets = max(0., (sin(y*(1.-y)*120.)-st.y))*trail2*trailFront*n.z;
    y = fract(y*10.)+(st.y-.5);
    float dd = length(st-vec2(x, y));
    droplets = S(dSize*N(id.x), 0., dd);
    float m = Drop+droplets*r*trailFront;
    #ifdef DEBUG
    m += st.x>a.y*.45 || st.y>a.x*.165 ? 1.2 : 0.; //DEBUG SPACES
    #endif
    
    
    return vec2(m, trail);
}

float StaticDrops(vec2 uv, float t) {
	uv *= 30.;
    
    vec2 id = floor(uv);
    uv = fract(uv)-.5;
    vec3 n = N13(id.x*107.45+id.y*3543.654);
    vec2 p = (n.xy-.5)*0.5;
    float d = length(uv-p);
    
    float fade = Saw(.025, fract(t+n.z));
    float c = S(size, 0., d)*fract(n.z*10.)*fade;

    return c;
}

vec2 Rain(vec2 uv, float t) {
    float s = StaticDrops(uv, t); 
    vec2 r1 = Drops(uv, t);
    vec2 r2 = Drops(uv*1.8, t);
    
    #ifdef DEBUG
    float c = r1.x;
    #else
    float c = s+r1.x+r2.x;
    #endif
    
    c = S(.3, 1., c);
    
    #ifdef DEBUG
    return vec2(c, r1.y);
    #else
    return vec2(c, max(r1.y, r2.y));
    #endif
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord.xy-.5*iResolution.xy) / iResolution.y;
    vec2 UV = fragCoord.xy/iResolution.xy;
    float T = iTime;
    
    
    float t = T*.2;
    
    float rainAmount = 0.8;
    

    
    UV = (UV-.5)*(.9)+.5;
    
    vec2 c = Rain(uv, t);

   	vec2 e = vec2(.001, 0.); //pixel offset
   	float cx = Rain(uv+e, t).x;
   	float cy = Rain(uv+e.yx, t).x;
   	vec2 n = vec2(cx-c.x, cy-c.x); //normals
    
    #ifdef CAM

    // BLUR derived from existical https://www.shadertoy.com/view/Xltfzj
        float Pi = 6.28318530718; // Pi*2
    
        // GAUSSIAN BLUR SETTINGS {{{
        float Directions = 32.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
        float Quality = 8.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
        float Size = 32.0; // BLUR SIZE (Radius)
        // GAUSSIAN BLUR SETTINGS }}}

        vec2 Radius = Size/iResolution.xy;

        vec3 col = texture(iChannel0, UV).rgb;
        // Blur calculations
        for( float d=0.0; d<Pi; d+=Pi/Directions)
        {
            for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality)
            {
                #ifdef DEBUG
                vec3 tex = texture( iChannel0, UV+c+vec2(cos(d),sin(d))*Radius*i).rgb;
                #else
                vec3 tex = texture( iChannel0, UV+n+vec2(cos(d),sin(d))*Radius*i).rgb;
                #endif

                col += tex;            
            }
        }

        col /= Quality * Directions - 0.0;

        vec3 tex = texture( iChannel0, UV+n).rgb;
        c.y = clamp(c.y, 0.0, 1.);

        col -= c.y;
        col += c.y*(tex+.6);

    #else
    vec3 col = textureLod(iChannel1, UV+n, focus).rgb;
    #endif
    
    fragColor = vec4(col, 1.);
}`