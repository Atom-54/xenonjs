var S=class{constructor(e){this.cb=e}annotate(e,t,i){return this.notes=t,this.opts=i||0,this.key=this.opts.key||0,t.locator=this._annotateSubtree(e),t}_annotateSubtree(e){let t;for(let i=0,n=e.firstChild,r=null,a;n;i++){let o=this._annotateNode(n);o&&((t=t||{})[i]=o),a=r?r.nextSibling:e.firstChild,a===n?(r=n,n=n.nextSibling):(n=a,i--)}return t}_annotateNode(e){let t=this.key++,i=this.cb(e,t,this.notes,this.opts),n=this._annotateSubtree(e);if(i||n){let r=Object.create(null);return r.key=t,n&&(r.sub=n),r}}},P=function(s,e,t){t=t||[];for(let i in e){let n=e[i];if(n){let r=s.childNodes[i];t[n.key]=r.nodeType===Node.TEXT_NODE?r.parentElement:r,n.sub&&P(r,n.sub,t)}}return t},U=function(s,e,t,i){let n=!1;switch(i.annotator&&i.annotator(s,e,t,i)&&(n=!0),s.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:break;case Node.ELEMENT_NODE:return n||D(s,e,t);case Node.TEXT_NODE:return n||B(s,e,t)}return n},B=function(s,e,t){if(A(s,e,t,"textContent",s.textContent))return s.textContent="",!0},D=function(s,e,t){if(s.hasAttributes()){let i=!1;for(let n=s.attributes,r=n.length-1,a;r>=0&&(a=n[r]);r--)(F(s,e,t,a.name,a.value)||A(s,e,t,a.name,a.value)||L(s,e,t,a.name,a.value))&&(s.removeAttribute(a.name),i=!0);return i}},A=function(s,e,t,i,n){if(n.slice(0,2)==="{{"){i==="class"&&(i="className");let r=n.slice(2,-2),a=n.includes("=")?"=":":",o=r.split(a);return o.length===2&&(i=o[0],r=o[1]),f(t,e,"mustaches",i,r),r[0]==="$"&&f(t,"xlate",r,!0),!0}},F=function(s,e,t,i,n){if(i.slice(0,3)==="on-")return n.slice(0,2)==="{{"&&(n=n.slice(2,-2),console.warn(`Xen: event handler for '${i}' expressed as a mustache, which is not supported. Using literal value '${n}' instead.`)),f(t,e,"events",i.slice(3),n),!0},L=function(s,e,t,i,n){if(i==="xen:forward")return f(t,e,"events","xen:forward",n),!0},f=function(s,e,t,i,n){let r=s[e]||(s[e]=Object.create(null));(r[t]||(r[t]={}))[i]=n},R=new S(U),k=function(s,e,t){return s._notes||(s._notes=R.annotate(s.content,{},e,t))},w=function(s,e,t){for(let i in s){let n=e[i],r=s[i]&&s[i].events;if(n&&r)for(let a in r){let o=a,c=r[o];c.includes("=")&&([o,c]=c.split("=")),t(n,o,c)}}},q=function(s,e,t,i){e.addEventListener(t,function(n){if(s[i])return s[i](n,n.detail);if(s.defaultHandler)return s.defaultHandler(i,n)})},V=function(s,e,t,i){if(t)for(let n in s){let r=e[n];if(r){r.scope=t;let a=s[n].mustaches;for(let o in a){let c=a[o];c in t&&H(r,o,t[c],i)}}}},H=function(s,e,t,i){let n=e.slice(-1);if(e==="style%"||e==="style"||e==="xen:style")typeof t=="string"?s.style.cssText=t:Object.assign(s.style,t);else if(n=="$"){let r=e.slice(0,-1);typeof t=="boolean"||t===void 0||t===null?T(s,r,Boolean(t)):s.setAttribute(r,t)}else if(e==="textContent")if(t?.$template||t?.template||Array.isArray(t)||t?.models)z(s,t,i);else{let r=t!=null&&typeof t!="object"&&typeof t!="function";s.textContent=r?t:""}else e==="unsafe-html"?s.innerHTML=t||"":e==="value"?s.value!==t&&(s.value=t):e==="src"?s.src=t||"":s[e]=t},T=function(s,e,t){s[(t===void 0?!s.hasAttribute(e):t)?"setAttribute":"removeAttribute"](e,"")},z=function(s,e,t){let{template:i,$template:n,models:r}=e;if(Array.isArray(e)&&(r=e),i)i=M(i);else{let a=n||s?.getAttribute("repeat");i=s.getRootNode().querySelector(`template[${a}]`)}W(s,t,i,r)},W=function(s,e,t,i){let n=s.firstElementChild,r;for(t&&i&&i&&i.forEach((a,o)=>{if(r=n&&n.nextElementSibling,!n){let c=C(t).events(e);n=c.root.firstElementChild,n&&(n._subtreeDom=c,s.appendChild(n),!t._shapeWarning&&c.root.firstElementChild&&(t._shapeWarning=!0,console.warn("xen-template: subtemplate has multiple root nodes: only the first is used.",t)))}n&&(n._subtreeDom.set(a),n=r)});n;)r=n.nextElementSibling,n.remove(),n=r},C=function(s,e){s=M(s);let t=k(s,e),i=document.importNode(s.content,!0),n=i.firstElementChild,r=P(i,t.locator);return{root:i,notes:t,map:r,firstElement:n,$(o){return this.root.querySelector(o)},$$(o){return this.root.querySelectorAll(o)},set:function(o){return o&&V(t,r,o,this.controller),this},events:function(o){return o&&typeof o!="function"&&(o=q.bind(this,o)),this.controller=o,o&&w(t,r,o),this},forward:function(){return w(t,r,(o,c,m)=>{o.addEventListener(c,d=>{let _={eventName:c,handlerName:m,detail:d.detail,target:d.target};G(o,"xen:forward",_,{bubbles:!0})})}),this},appendTo:function(o){return this.root?o.appendChild(this.root):console.warn("Xen: cannot appendTo, template stamped no DOM"),this.root=o,this}}},G=(s,e,t,i)=>{let n=i||{};n.detail=t;let r=new CustomEvent(e,n);return s.dispatchEvent(r),r.detail},M=s=>typeof s=="string"?O(s):s,O=s=>Object.assign(document.createElement("template"),{innerHTML:s}),h={createTemplate:O,setBoolAttribute:T,stamp:C,takeNote:f};var u=()=>Object.create(null),v=(s,e,t)=>{if(s&&clearTimeout(s),e&&t)return setTimeout(e,t)},b=s=>class extends(s??class{}){constructor(){super(),this._pendingProps=u(),this._props=this._getInitialProps()||u(),this._lastProps=u(),this._state=this._getInitialState()||u(),this._lastState=u()}_getInitialProps(){}_getInitialState(){}_getProperty(e){return this._pendingProps[e]||this._props[e]}_setProperty(e,t){(this._validator||this._wouldChangeProp(e,t))&&(this._pendingProps[e]=t,this._invalidateProps())}_wouldChangeValue(e,t,i){return e[t]!==i}_wouldChangeProp(e,t){return this._wouldChangeValue(this._props,e,t)}_wouldChangeState(e,t){return this._wouldChangeValue(this._state,e,t)}_setProps(e){Object.assign(this._pendingProps,e),this._invalidateProps()}_invalidateProps(){this._propsInvalid=!0,this._invalidate()}mergeState(e){let t=!1,i=this._state;for(let n in e){let r=e[n];this._wouldChangeState(n,r)&&(t=!0,i[n]=r)}if(t)return this._invalidate(),!0}_setState(e){return this.mergeState(e)}_async(e){return Promise.resolve().then(e.bind(this))}asyncTask(e,t){return setTimeout(t,Number(e)||0)}_invalidate(){this._validator||(this._validator=this._async(this._validate))}_getStateArgs(){return[this._props,this._state,this._lastProps,this._lastState]}_validate(){let e=this._getStateArgs();try{Object.assign(this._props,this._pendingProps),this._propsInvalid&&(this._willReceiveProps(...e),this._propsInvalid=!1),this._shouldUpdate(...e)&&(this._ensureMount(),this._doUpdate(...e))}catch(t){console.error(t)}this._validator=null,this._lastProps=Object.assign(u(),this._props),this._lastState=Object.assign(u(),this._state)}_doUpdate(...e){this._update(...e),this._didUpdate(...e)}_ensureMount(){}_willReceiveProps(){}_shouldUpdate(){return!0}_update(){}_didUpdate(){}_debounce(e,t,i){e=`_debounce_${e}`,this._state[e]=v(this._state[e],t,i??16)}};var g=s=>class extends s{constructor(){super(),this._mounted=!1,this._root=this,this.__configureAccessors(),this.__lazyAcquireProps()}get _class(){return this.constructor._class||this.constructor}__configureAccessors(){let e=Object.getPrototypeOf(this);if(!e.hasOwnProperty("__$xenPropsConfigured")){e.__$xenPropsConfigured=!0;let t=this._class.observedAttributes;t&&t.forEach(i=>{Object.defineProperty(e,i,{get(){return this._getProperty(i)},set(n){this._setProperty(i,n)}})})}}__lazyAcquireProps(){let e=this._class.observedAttributes;e&&e.forEach(t=>{if(t.toLowerCase()!==t&&console.error(`Xen: Mixed-case attributes are not yet supported, "${this.localName}.observedAttributes" contains "${t}".`),this.hasOwnProperty(t)){let i=this[t];delete this[t],this[t]=i}else this.hasAttribute(t)&&this._setValueFromAttribute(t,this.getAttribute(t))})}_setValueFromAttribute(e,t){this[e]=t}connectedCallback(){this._mount()}_mount(){this._mounted||(this._mounted=!0,this._doMount(),this._didMount())}_doMount(){}_didMount(){}_fire(e,t,i,n){let r=n||{};r.detail=t;let a=new CustomEvent(e,r);return(i||this).dispatchEvent(a),a.detail}};var{HTMLElement:J}=globalThis,E=s=>class extends s{get template(){let e=this.constructor.module;return e?e.querySelector("template"):""}get host(){return this.shadowRoot||this.attachShadow({mode:"open"})}_doMount(){this._stamp(),this._invalidate()}_stamp(){this.template&&(this._dom=h.stamp(this.template).events(this._listener.bind(this)).appendTo(this.host))}_listener(e,t,i){e.addEventListener(t,n=>{if(this[i])return this[i](n,n.detail,this._props,this._state)})}_doUpdate(...e){this._update(...e);let t=this._render(...e);this._dom&&(Array.isArray(t)&&(t=t.reduce((i,n)=>Object.assign(i,n),Object.create(null))),this._dom.set(t)),this._didUpdate(...e),this._didRender(...e)}_render(){}_didRender(){}},$=E(g(b(J)));var l=(s,e)=>class extends s{_setProperty(t,i){return l.level>1&&(t in this._pendingProps&&this._pendingProps[t]!==i||this._props[t]!==i)&&e("props",p({[t]:i})),super._setProperty(t,i)}_setState(t){if(typeof t!="object")return console.warn("Xen::_setState argument must be an object"),!1;if(super._setState(t))return l.level>1&&(l.lastFire?e("(fired -->) state",p(t)):e("state",p(t))),!0}_setImmutableState(t,i){e("state [immutable]",{[t]:i}),super._setImmutableState(t,i)}_fire(t,i,n,r){l.lastFire={name:t,detail:p(i),log:e},e("fire",{[l.lastFire.name]:l.lastFire.detail}),super._fire(t,i,n,r),l.lastFire=null}_doUpdate(...t){return l.level>2&&e("updating..."),super._doUpdate(...t)}_invalidate(){l.level>2&&(this._validator||e("invalidating...")),super._invalidate()}},p=(s,e)=>{if(!s||typeof s!="object")return s;let t=Object.create(null);for(let i in s){let n=s[i];e<1&&(n=p(s,(e||0)+1)),t[i]=n}return t};l.level=0;var K=(s,e,t="log")=>console[t].bind(console,`%c${s}`,`background: ${e}; color: white; padding: 1px 6px 2px 7px; border-radius: 6px;`),N=(s,e,t)=>l.level>0?K(s,e,t):()=>{},x=(s,e)=>{let t=e;t||(t={});let i=s||document.body,n=1,r=i.firstElementChild;for(;r;){let a=r.localName;if(customElements.get(a)){let c=r.shadowRoot,m={node:r,props:r._props,state:r._state},d=c?x(c):{};d&&(m.children=d);let _=`${a}${r.id?`#${r.id}`:""} (${n++})`;for(;t[_];)_+="_";t[_]=m}x(r,t),r=r.nextElementSibling}return t};var X=(s,...e)=>(s[0]+e.map((t,i)=>t+s[i+1]).join("")).trim();h.html=(...s)=>h.createTemplate(X(...s));var Q=s=>typeof s=="object"?Object.assign(Object.create(null),s):{},j={State:b,Template:h,Element:g,BaseMixin:E,Base:$,Debug:l,setBoolAttribute:h.setBoolAttribute,html:X,walker:x,logFactory:N,clone:Q,nob:u,debounce:v};globalThis.Xen=j;var y=j;var I=s=>class extends s{set state(e){this._setState(e)}get state(){return this._state}get props(){return this._props}async(e){return this._async(e)}invalidate(e){return this._invalidate(e)}async awaitState(e,t){let i=this._state,n=`_await_${e}`;if(!i[n]){i[n]=!0;let r=await t();this.state={[e]:r,[n]:!1}}}fire(...e){return this._fire(...e)}_getInitialState(){return this.getInitialState&&this.getInitialState()}_update(e,t,i,n){return this.update&&this.update(e,t,i,n)}_render(e,t,i,n){if(this.shouldRender(e,t,i,n))return this.render&&this.render(e,t,i,n)}shouldRender(){return!0}render(e,t){return t}onState(e,t){this._setState({[e.type]:t})}};y.AsyncMixin=I;y.Async=I(y.Base);export{y as Xen,I as XenAsyncMixin};
/**
 * @license
 * Copyright 2019 Google LLC.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
