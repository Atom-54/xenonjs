/**
 * @license
 * Copyright 2023 Atom54 LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const category = 'Shader';

export const Shader = {
  FragmentShader: {
    categories: [category],
    description: 'Applies the shader effect to an image',
    ligature: 'image',
    type: '$anewLibrary/Shader/Atoms/FragmentShader',
    inputs: ['shader', 'image', 'image2', 'image3', 'image4', 'audio', 'defaultShader', 'defaultShaders'],
    outputs: ['outputImage'],
    inputs: {
      shader: 'MultilineText',
      image: 'Image',
      image2: 'Image',
      image3: 'Image',
      image4: 'Image',
      defaultShader: 'DefaultShader:String',
      defaultShaders: 'Pojo'
    },
    outputs: {
      outputImage: 'Image',
    },
    types: {
      DefaultShader: ["Wheatley's Lake", "Fire!", "Heartfelt Rainy Window", "Leon Denise's Glitch", "Raja's Matrix Rain", "Crazy Road"]
    },
    state: {
      defaultShaders: { 
        "Wheatley's Lake": `
  // Webcam 'Giant in a lake' effect by Ben Wheatley - 2018
  // License MIT License
  // Contact: github.com/BenWheatley
  void mainImage(out vec4 y,vec2 v){vec2 i=v.xy/iResolution.xy,t=vec2(1)/iResolution.xy;vec3 l=texture(iChannel0,i).xyz;if(i.y<.3){float z=.3-i.y,e=sin(log(z)*20.+iTime*2.),C=30.*e;C*=z;vec2 m=t*vec2(0,C),n=i+m;n.y=.6-n.y;l=texture(iChannel0,n).xyz;l+=vec3(e*.05);}y=vec4(l,1);}
  `,
  /* */
        "Fire!": `
  vec3 v(vec3 v){vec4 y=vec4(0,-1./3.,2./3.,-1),i=mix(vec4(v.zy,y.wz),vec4(v.yz,y),step(v.z,v.y)),s=mix(vec4(i.xyw,v.x),vec4(v.x,i.yzx),step(i.x,v.x));float c=s.x-min(s.w,s.y);return vec3(abs(s.z+(s.w-s.y)/(6.*c+1e-10)),c/(s.x+1e-10),s);}vec3 x(vec3 v){vec4 i=vec4(1,2./3.,1./3.,3);return v.z*mix(i.xxx,clamp(abs(fract(v.xxx+i.xyz)*6.-i.www)-i.xxx,0.,1.),v.y);}float s(vec2 v){return fract(sin(cos(dot(v,vec2(12.9898,12.1414))))*83758.5453);}float n(vec2 v){const vec2 i=vec2(0,1);vec2 y=floor(v),c=smoothstep(vec2(0),vec2(1),fract(v));return mix(mix(s(y),s(y+i.yx),c.x),mix(s(y+i.xy),s(y+i.yy),c.x),c.y);}float i(vec2 v){float y=0.,c=1.;for(int i=0;i<5;i++)y+=n(v)*c,v+=v*1.7,c*=.47;return y;}void mainImage(out vec4 y,vec2 s){vec2 c=vec2(1.2,.1);float e=1.327+sin(iTime*2.)/2.4,m=3.5-sin(iTime*.4)/1.89;vec2 f=s.xy*m/iResolution.xx;f.x-=iTime/1.1;float r=i(f-iTime*.01+sin(iTime)/10.),w=i(f-iTime*.002+.1*cos(iTime)/5.),C=i(f-iTime*.44-5.*cos(iTime)/7.)-6.,z=i(f-iTime*.9-10.*cos(iTime)/30.)-4.,I=i(f-iTime*2.-20.*sin(iTime)/20.)+2.;r=(r+w-.4*C-2.*z+.6*I)/3.8;vec2 n=vec2(i(f+r/2.+iTime*c.x-f.x-f.y),i(f+r-iTime*c.y));vec3 a=mix(vec3(.5,0,.1),vec3(.9,.1,0),i(f+n))+mix(vec3(.2,.1,.7),vec3(1,.9,.1),n.x)-mix(vec3(.1),vec3(.9),n.y),d=vec3(a*cos(e*s.y/iResolution.y));d+=.05;d.x*=.8;vec3 o=v(d);o.y*=o.z*1.1;o.z*=o.y*1.13;o.y=(2.2-o.z*.9)*1.2;d=x(o);vec4 t=texture(iChannel0,s.xy/iResolution.xy);y=t*.5+vec4(d.xyz,1)*.5;}
  `,
        "Leon Denise's Glitch": `
  // Webcam Glitch
  // By Leon Denise 08-06-2022
  // Simple and handy glitch effect for digital screen
  vec3 t(vec3 v){v=fract(v*vec3(.1031,.103,.0973));v+=dot(v,v.yxz+33.33);return fract((v.xxy+v.yxx)*v.zyx);}vec2 p(float v){vec3 f=fract(vec3(v)*vec3(.1031,.103,.0973));f+=dot(f,f.yzx+33.33);return fract((f.xx+f.yz)*f.zy);}void mainImage(out vec4 v,vec2 f){vec2 x=f/iResolution.xy;x=(x-.5)*1.1+.5;float i=floor(iTime*10.);vec2 s=iResolution.xy/p(i)/2e2,y=floor(x*s);vec3 n=t(vec3(y,i));float e=sin(fract(iTime*10.)*3.14);vec2 z=50./iResolution.xy;float m=step(.9,n.z);x+=vec2(cos(n.x*6.283),sin(n.x*6.283))*n.y*m*e*z;vec2 w=10./iResolution.xy*e*m;v.x=texture(iChannel0,x+w).x;v.y=texture(iChannel0,x).y;v.z=texture(iChannel0,x-w).z;v.w=1.;v.xyz*=step(0.,x.x)*step(x.x,1.)*step(0.,x.y)*step(x.y,1.);}
  `,   
        "Heartfelt Rainy Window": `
  // shader derived from Heartfelt - by Martijn Steinrucken aka BigWings - 2017
  // https://www.shadertoy.com/view/ltffzl
  // License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  #define S(a,b,t)smoothstep(a,b,t)
  #define size 0.2
  vec3 t(float v){vec3 f=fract(vec3(v)*vec3(.1031,.11369,.13787));f+=dot(f,f.yzx+19.19);return fract(vec3((f.x+f.y)*f.z,(f.x+f.z)*f.y,(f.y+f.z)*f.x));}float f(float f){return fract(sin(f*12345.564)*7658.76);}float f(float f,float v){return S(0.,f,v)*S(1.,f,v);}vec2 t(vec2 v,float x){vec2 s=v;v.y+=x*.8;vec2 y=vec2(6,1),z=y*2.,n=floor(v*z);float l=f(n.x);v.y+=l;n=floor(v*z);vec3 a=t(n.x*35.2+n.y*2376.1);vec2 i=fract(v*z)-vec2(.5,0);float r=a.x-.5,b=s.y*20.,m=sin(b+sin(b));r+=m*(.5-abs(r))*(a.z-.5);r*=.7;b=(f(.85,fract(x+a.z))-.5)*.9+.5;vec2 C=vec2(r,b);float e=size,c=S(e,0.,length((i-C)*y.yx)),H=sqrt(S(1.,b,i.y)),G=abs(i.x-r),F=S((e*.5+.03)*H,(e*.5-.05)*H,G),d=S(-.02,.02,i.y-b);F*=d;b=s.y;b+=f(n.x);float D=S(e*H,0.,G),B=max(0.,sin(b*(1.-b)*120.)-i.y)*D*d*a.z;b=i.y-.5+fract(b*10.);float A=length(i-vec2(r,b));B=S(e*f(n.x),0.,A);float o=c+B*H*d;return vec2(o,F);}float s(vec2 v,float x){v*=30.;vec2 n=floor(v);v=fract(v)-.5;vec3 i=t(n.x*107.45+n.y*3543.654);float b=length(v-(i.xy-.5)*.5),z=f(.025,fract(x+i.z));return S(size,0.,b)*fract(i.z*10.)*z;}vec2 v(vec2 v,float f){float x=s(v,f);vec2 n=t(v,f),i=t(v*1.8,f);float b=x+n.x+i.x;b=S(.3,1.,b);return vec2(b,max(n.y,i.y));}void mainImage(out vec4 f,vec2 i){vec2 b=(i.xy-.5*iResolution.xy)/iResolution.y,x=i.xy/iResolution.xy;float s=iTime,z=s*.2;x=(x-.5)*.9+.5;vec2 n=v(b,z),a=vec2(.001,0);float e=v(b+a,z).x,y=v(b+a.yx,z).x;vec2 r=vec2(e-n.x,y-n.x),d=32./iResolution.xy;vec3 o=texture(iChannel0,x).xyz;for(float C=0.;C<2.*acos(-1.);C+=2.*acos(-1.)/32.)for(float t=.125;t<=1.;t+=.125){vec3 l=texture(iChannel0,x+r+vec2(cos(C),sin(C))*d*t).xyz;o+=l;}o/=256.;vec3 C=texture(iChannel0,x+r).xyz;n.y=clamp(n.y,0.,1.);o-=n.y;o+=n.y*(C+.6);f=vec4(o,1);}
  `,
        "Raja's Matrix Rain": `
  #define RAIN_SPEED 1.75
  #define DROP_SIZE 3.0
  float v(vec2 v){return fract(sin(dot(v.xy,vec2(12.9898,78.233)))*43758.5453);}float v(vec2 y,vec2 f,float m){vec2 i=floor(f*4.)+y.y;if(v(vec2(y.y,23))>.98)i+=floor((m+v(vec2(y.y,49)))*3.);return float(v(i)>.5);}void mainImage(out vec4 i,vec2 f){vec2 m=f.xy/iResolution.xy,z=vec2(m);m.x/=iResolution.x/iResolution.y;float y=iTime*RAIN_SPEED,e=DROP_SIZE,t=f.x/(40.*e),D=40.*e*fract(m.x*30.*e);vec4 n;if(D>12.*e)n=vec4(0);else{float x=floor(t),E=m.y*6e2+v(vec2(x,x*3.))*1e5+y*v(vec2(floor(f.x/15.),23))*120.,d=mod(E,15.);if(d>12.*e)n=vec4(0);else{float R=v(vec2(t,floor(E/15.)),vec2(D,d)/12.,y),o=max(mod(-floor(E/15.),24.)-4.,0.)/20.;n=vec4((o<.8?vec3(0,o/.8,0):mix(vec3(0,1,0),vec3(1),(o-.8)/.2))*R,1);}}m.x+=.05;e=DROP_SIZE;t=f.x/(40.*e);D=40.*e*fract(m.x*30.*e);if(D>12.*e)n+=vec4(0);else{float x=floor(t),E=m.y*7e2+v(vec2(x,x*3.))*1e5+y*v(vec2(floor(f.x/12.),23))*120.,d=mod(E,15.);if(d>12.*e)n+=vec4(0);else{float R=v(vec2(t,floor(E/15.)),vec2(D,d)/12.,y),o=max(mod(-floor(E/15.),24.)-4.,0.)/20.;n+=vec4((o<.8?vec3(0,o/.8,0):mix(vec3(0,1,0),vec3(1),(o-.8)/.2))*R,1);}}n=n*length(texture(iChannel0,z).xyz)+.22*vec4(0,texture(iChannel0,z).y,0,1);if(n.z<.5)n.z=n.y*.5;i=n;}
  `,
        "Crazy Road": `
  #define WAVES
  #define BORDER
  #define RAY_STEPS 150
  #define BRIGHTNESS 1.2
  #define GAMMA 1.4
  #define SATURATION.65
  #define detail.001
  #define t iTime*.5
  const vec3 m=vec3(-1,.7,0);float v=0.;mat2 s(float v){return mat2(cos(v),sin(v),-sin(v),cos(v));}vec4 n(vec4 v){v.xz=abs(v.xz+1.)-abs(v.xz-1.)-v.xz;v.y-=.25;v.xy*=s(radians(35.));return v*2./clamp(dot(v.xyz,v.xyz),.2,1.);}float x(vec3 v){
  #ifdef WAVES
  v.y+=sin(v.z-t*6.)*.15;
  #endif
  vec3 z=v;z.z=abs(3.-mod(z.z,6.));vec4 i=vec4(z,1);for(int f=0;f<4;f++)i=n(i);float c=(length(max(vec2(0),i.yz-1.5))-1.)/i.w,f=max(abs(v.x+1.)-.3,v.y-.35);f=max(f,-max(abs(v.x+1.)-.1,v.y-.5));v.z=abs(.25-mod(v.z,.5));f=max(f,-max(abs(v.z)-.2,v.y-.3));f=max(f,-max(abs(v.z)-.01,-v.y+.32));return min(c,f);}vec3 d(float v){v*=1.5;return vec3(sin(v),(1.-sin(v*2.))*.5,-v*5.)*.5;}float z=0.;vec3 p(vec3 y){vec3 m=vec3(0,v*5.,0);float i=x(y-m.yxx),f=x(y+m.yxx),c=x(y-m.xyx),s=x(y+m.xyx),a=x(y-m.xxy),l=x(y+m.xxy),e=x(y);z=abs(e-.5*(f+i))+abs(e-.5*(s+c))+abs(e-.5*(l+a));z=min(1.,pow(z,.55)*15.);return normalize(vec3(i-f,c-s,a-l));}vec4 h(vec2 v){float m=sin(v.x*7.+t*70.)*.08;v.y+=m;v.y*=1.1;vec4 f;f=v.x>0.?vec4(0):0.<v.y&&v.y<1./6.?vec4(255,43,14,255)/255.:1./6.<v.y&&v.y<2./6.?vec4(255,168,6,255)/255.:2./6.<v.y&&v.y<.5?vec4(255,244,0,255)/255.:.5<v.y&&v.y<4./6.?vec4(51,234,5,255)/255.:4./6.<v.y&&v.y<5./6.?vec4(8,163,255,255)/255.:5./6.<v.y&&v.y<1.?vec4(122,85,255,255)/255.:abs(v.y)-.05<1e-4?vec4(0,0,0,1):abs(v.y-1.)-.05<1e-4?vec4(0,0,0,1):vec4(0);f.w*=.8-min(.8,abs(v.x*.08));f.xyz=mix(f.xyz,vec3(length(f.xyz)),.15);return f;}vec4 f(vec2 v){vec2 m=v*vec2(.4,1);float f=iTime*3.;f-=mod(f,.15625);f=mod(f,.9375);float z=mod(iTime*3.,1.);z-=mod(z,.75);z*=-.05;vec4 i=texture(iChannel1,vec2(m.x/3.+.8203125-f+.05,.5-m.y-z));if(m.x<-.3)i.w=0.;if(m.x>.2)i.w=0.;return i;}vec3 d(vec3 m,vec3 i){z=0.;vec3 y,c;float a=1e2,e=0.;for(int r=0;r<RAY_STEPS;r++)if(a>v&&e<25.)y=m+e*i,a=x(y),v=detail*exp(.13*e),e+=a;vec3 r=vec3(0);y-=(v-a)*i;c=p(y);
  #ifdef SHOWONLYEDGES
  r=1.-vec3(z);
  #else
  r=(1.-abs(c))*max(0.,1.-z*.8);
  #endif
  e=clamp(e,0.,26.);i.y-=.02;float l=7.-max(0.,texture(iChannel0,vec2(.6,.2)).x)*5.,w=atan(i.x,i.y)+iTime*1.5,S=pow(clamp(1.-length(i.xy)*l-abs(.2-mod(w,.4)),0.,1.),.1),A=pow(clamp(1.-length(i.xy)*(l-.2)-abs(.2-mod(w,.4)),0.,1.),.1),B=pow(clamp(1.-length(i.xy)*(l-4.5)-.5*abs(.2-mod(w,.4)),0.,1.),3.),C=mix(.45,1.2,pow(smoothstep(0.,1.,.75-i.y),2.))*(1.-A*.5);vec3 d=vec3(.5,0,1)*((1.-S)*(1.-B)*C+(1.-A)*B*vec3(1,.8,.15)*3.);d+=vec3(1,.9,.1)*S;d=max(d,B*vec3(1,.9,.5));r=mix(vec3(1,.9,.3),r,exp(-.004*e*e));if(e>25.)r=d;r=pow(r,vec3(GAMMA))*BRIGHTNESS;r=mix(vec3(length(r)),r,SATURATION);
  #ifdef SHOWONLYEDGES
  r=1.-vec3(length(r));
  #else
  r*=vec3(1,.9,.85);
  #endif
  return r;}vec3 w(inout vec3 v){vec3 m=d(t),i=d(t+.7),f=normalize(i-m);float z=i.x-m.x;z*=min(1.,abs(i.z-m.z))*sign(i.z-m.z)*.7;v.xy*=mat2(cos(z),sin(z),-sin(z),cos(z));z=f.y*1.7;v.yz*=mat2(cos(z),sin(z),-sin(z),cos(z));z=atan(f.x,f.z);v.xz*=mat2(cos(z),sin(z),-sin(z),cos(z));return m;}void mainImage(out vec4 z,vec2 v){vec2 i=v.xy/iResolution.xy*2.-1.,f=i;i.y*=iResolution.y/iResolution.x;vec2 r=(iMouse.xy/iResolution.xy-.5)*3.;if(iMouse.z<1.)r=vec2(0,-.05);float e=.9-max(0.,.7-iTime*.3);vec3 y=normalize(vec3(i*e,1));y.yz*=s(r.y);y.xz*=s(r.x);vec3 c=m+w(y),a=d(c,y);
  #ifdef BORDER
  a=mix(vec3(0),a,pow(max(0.,.95-length(f*f*f*vec2(1.05,1.1))),.3));
  #endif
  z=vec4(a,1);}`
      }  
    }
  }
};
