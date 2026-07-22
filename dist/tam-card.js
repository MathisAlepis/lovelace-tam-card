/*!
Bundled Lit libraries (lit, lit-element, lit-html, @lit/reactive-element)
BSD 3-Clause License — Copyright (c) 2017 Google LLC. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function t(t,e,i,r){var s,o=arguments.length,n=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(o<3?s(n):o>3?s(e,i,n):s(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new o(i,t,r)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",_=g.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&c(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const o=r?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(i)t.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of r){const r=document.createElement("style"),s=e.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=i.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=r;const o=s.fromAttribute(e,t.type);this[r]=o??this._$Ej?.get(r)??o,this._$Em=null}}requestUpdate(t,e,i,r=!1,s){if(void 0!==t){const o=this.constructor;if(!1===r&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??v)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,_?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,A=t=>t,C=$.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,F="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+E,D=`<${k}>`,T=document,R=()=>T.createComment(""),L=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,N="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,q=/-->/g,O=/>/g,j=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,z=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),H=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),G=new WeakMap,W=T.createTreeWalker(T,129);function K(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,r=[];let s,o=2===e?"<svg>":3===e?"<math>":"",n=P;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===P?"!--"===l[1]?n=q:void 0!==l[1]?n=O:void 0!==l[2]?(I.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=j):void 0!==l[3]&&(n=j):n===j?">"===l[0]?(n=s??P,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?j:'"'===l[3]?z:U):n===z||n===U?n=j:n===q||n===O?n=P:(n=j,s=void 0);const h=n===j&&t[e+1].startsWith("/>")?" ":"";o+=n===P?i+D:c>=0?(r.push(a),i.slice(0,c)+F+i.slice(c)+E+h):i+E+(-2===c?e:h)}return[K(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class Z{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let s=0,o=0;const n=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=Z.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=W.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(F)){const e=c[o++],i=r.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?rt:tt}),r.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:s}),r.removeAttribute(t));if(I.test(r.tagName)){const t=r.textContent.split(E),e=t.length-1;if(e>0){r.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],R()),W.nextNode(),a.push({type:2,index:++s});r.append(t[e],R())}}}else if(8===r.nodeType)if(r.data===k)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=r.data.indexOf(E,t+1));)a.push({type:7,index:s}),t+=E.length-1}s++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,r){if(e===H)return e;let s=void 0!==r?i._$Co?.[r]:i._$Cl;const o=L(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=s:i._$Cl=s),void 0!==s&&(e=Y(t,s._$AS(t,e.values),s,r)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??T).importNode(e,!0);W.currentNode=r;let s=W.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(s=W.nextNode(),o++)}return W.currentNode=T,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),L(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==H&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new Q(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Z(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const s of t)r===e.length?e.push(i=new X(this.O(R()),this.O(R()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,s){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,r){const s=this.strings;let o=!1;if(void 0===s)t=Y(this,t,e,0),o=!L(t)||t!==this._$AH&&t!==H,o&&(this._$AH=t);else{const r=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=Y(this,r[i+n],e,n),a===H&&(a=this._$AH[n]),o||=!L(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+s[n+1]),this._$AH[n]=a}o&&!r&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class rt extends tt{constructor(t,e,i,r,s){super(t,e,i,r,s),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??V)===H)return;const i=this._$AH,r=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==V&&(i===V||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const ot=$.litHtmlPolyfillSupport;ot?.(Z,X),($.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let at=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const r=i?.renderBefore??e;let s=r._$litPart$;if(void 0===s){const t=i?.renderBefore??null;r._$litPart$=s=new X(e.insertBefore(R(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const lt=nt.litElementPolyfillSupport;lt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:v},ht=(t=dt,e,i)=>{const{kind:r,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,s,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const s=this[r];e.call(this,i),this.requestUpdate(r,s,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return ut({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=1;let mt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft="important",_t=" !"+ft,yt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends mt{constructor(t){if(super(t),t.type!==gt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const r=t[i];return null==r?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const r=e[t];if(null!=r){this.ft.add(t);const e="string"==typeof r&&r.endsWith(_t);t.includes("-")||e?i.setProperty(t,e?r.slice(0,-11):r,e?ft:""):i[t]=r}}return H}});class bt extends Error{constructor(t,e,i={}){super(e),this.name="HeraultApiError",this.code=t,this.status=i.status,this.retryAfter=i.retryAfter,this.cause=i.cause,Object.setPrototypeOf(this,new.target.prototype)}}const vt="https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/tam_mmm_tpsreel/records",wt=2e4,xt=["stop_name","route_short_name","trip_headsign","direction_id","departure_time","is_theorical","delay_sec","course_sae","stop_coordinates"],$t=t=>`"${t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replaceAll("\0","\\0").replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")}"`,At=(t,e)=>{if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(t))throw new TypeError("Invalid ODSQL field name.");const i=e.trim();return`lower(${t}) = ${$t(i.toLocaleLowerCase("fr-FR"))}`},Ct=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/,St=t=>{const e=t.trim();return Ct.test(e)&&Number.isFinite(Number(e))?e:$t(e)},Ft=t=>"object"==typeof t&&null!==t&&!Array.isArray(t),Et=(t,e=!1)=>{if("string"==typeof t){return t.trim()||void 0}if(e&&"number"==typeof t&&Number.isFinite(t))return String(t)},kt=t=>{if("number"==typeof t)return Number.isFinite(t)?t:void 0;if("string"!=typeof t||!t.trim())return;const e=Number(t);return Number.isFinite(e)?e:void 0},Dt=t=>{const e=kt(t);return 0===e||1===e?e:void 0},Tt=t=>{if("boolean"==typeof t)return t;if("number"==typeof t)return 0!==t;if("string"==typeof t)switch(t.trim().toLowerCase()){case"0":case"false":return!1;default:return!0}return!0},Rt=(t,e)=>{if(!Ft(t))return;const i=Et(t.stop_name),r=Et(t.route_short_name,!0),s=Et(t.trip_headsign),o=kt(t.delay_sec);if(!i||!r||!s||void 0===o||o<0)return;const n={stop_name:i,route_short_name:r,trip_headsign:s,is_theorical:Tt(t.is_theorical),delay_sec:o,predicted_at:e+1e3*o},a=Dt(t.direction_id);void 0!==a&&(n.direction_id=a);const l=Et(t.departure_time,!0);l&&(n.departure_time=l);const c=Et(t.course_sae,!0);c&&(n.course_sae=c);const d=(t=>{let e,i;if(Ft(t)?(e=kt(t.lat??t.latitude),i=kt(t.lon??t.lng??t.longitude)):Array.isArray(t)&&t.length>=2&&(i=kt(t[0]),e=kt(t[1])),void 0!==e&&void 0!==i&&(t=>t>=-90&&t<=90)(e)&&(t=>t>=-180&&t<=180)(i))return{lat:e,lon:i}})(t.stop_coordinates);return d&&(n.stop_coordinates=d),n},Lt=t=>{if(!Ft(t)||!Array.isArray(t.results))throw new bt("invalid-response","La réponse Hérault Data ne contient pas de liste de résultats valide.");return t.results},Mt=(t,e)=>t.localeCompare(e,"fr",{numeric:!0,sensitivity:"base"}),Nt=t=>{const e=new Map;for(const i of t){const t=i.normalize("NFKC").toLocaleUpperCase("fr-FR");e.has(t)||e.set(t,i)}return[...e.values()].sort(Mt)},Pt=t=>[t.stop_name,t.route_short_name,t.trip_headsign,t.direction_id??"",t.departure_time??t.delay_sec].join("\0"),qt=(t,e=5)=>{const i=Number.isFinite(e)?Math.max(1,Math.trunc(e)):5,r=kt(t);return void 0===r?Math.min(2,i):Math.min(i,Math.max(1,Math.trunc(r)))},Ot=(t,e,i,r=5)=>((t,e,i=5)=>{const r=t.filter(t=>Number.isFinite(t.delay_sec)&&t.delay_sec>=0).slice().sort((t,e)=>t.delay_sec-e.delay_sec),s=new Set,o=[];for(const t of r){const r=t.course_sae?`course:${t.course_sae}`:`fallback:${Pt(t)}`;if(!s.has(r)&&(s.add(r),o.push(t),o.length>=qt(e,i)))break}return o})(Lt(t).map(t=>Rt(t,e)).filter(t=>void 0!==t),i,r),jt=(t,e)=>"function"!=typeof globalThis.fetch?Promise.reject(new TypeError("Fetch API is not available.")):globalThis.fetch(t,e),Ut=()=>"undefined"==typeof navigator||!1!==navigator.onLine;const zt=new class{constructor(t={}){this.baseUrl=t.baseUrl??vt,this.timeoutMs=void 0!==t.timeoutMs&&Number.isFinite(t.timeoutMs)&&t.timeoutMs>0?t.timeoutMs:1e4,this.fetchImpl=t.fetch??jt,this.now=t.now??Date.now,this.isOnline=t.isOnline??Ut}async listStops(t={}){return(t=>{const e=Lt(t).map(t=>Ft(t)?Et(t.stop_name):void 0).filter(t=>void 0!==t);return Nt(e)})(await this.request(new URLSearchParams({select:"stop_name",group_by:"stop_name",order_by:"stop_name ASC",limit:String(wt)}),t))}async listLinesForStop(t,e={}){const i=await this.request((t=>new URLSearchParams({select:"route_short_name",where:At("stop_name",t),group_by:"route_short_name",order_by:"route_short_name ASC",limit:String(wt)}))(t),e);return(t=>{const e=Lt(t).map(t=>Ft(t)?Et(t.route_short_name,!0):void 0).filter(t=>void 0!==t);return Nt(e)})(i)}async listJourneysForStop(t,e={}){const i=await this.request((t=>new URLSearchParams({select:"route_short_name,trip_headsign,direction_id",where:At("stop_name",t),group_by:"route_short_name,trip_headsign,direction_id",order_by:"route_short_name ASC,trip_headsign ASC",limit:String(wt)}))(t),e);return(t=>{const e=[],i=new Set;for(const r of Lt(t)){if(!Ft(r))continue;const t=Et(r.route_short_name,!0),s=Et(r.trip_headsign);if(!t||!s)continue;const o=Dt(r.direction_id),n=[t,s,o??""].map(t=>String(t).normalize("NFKC").toLocaleUpperCase("fr-FR")).join("\0");i.has(n)||(i.add(n),e.push({line:t,destination:s,...void 0===o?{}:{direction_id:o}}))}return e.sort((t,e)=>Mt(t.line,e.line)||Mt(t.destination,e.destination)||(t.direction_id??-1)-(e.direction_id??-1))})(i)}async listDestinations(t,e,i={}){const r=await this.request(((t,e)=>new URLSearchParams({select:"trip_headsign,direction_id",where:[At("stop_name",t),`route_short_name = ${St(e)}`].join(" AND "),group_by:"trip_headsign,direction_id",order_by:"trip_headsign ASC",limit:String(wt)}))(t,e),i);return(t=>{const e=[],i=new Set;for(const r of Lt(t)){if(!Ft(r))continue;const t=Et(r.trip_headsign);if(!t)continue;const s=Dt(r.direction_id),o=`${t.normalize("NFKC").toLocaleUpperCase("fr-FR")}\0${s??""}`;i.has(o)||(i.add(o),e.push({destination:t,...void 0===s?{}:{direction_id:s}}))}return e.sort((t,e)=>Mt(t.destination,e.destination)||(t.direction_id??-1)-(e.direction_id??-1))})(r)}async getDepartures(t,e={}){const i=await this.request((t=>{const e=!0===t.all_destinations,i=[At("stop_name",t.stop),`route_short_name = ${St(t.line)}`];return 0!==t.direction_id&&1!==t.direction_id||i.push(`direction_id = ${t.direction_id}`),!e&&t.destination?.trim()&&i.push(At("trip_headsign",t.destination)),i.push("delay_sec >= 0"),new URLSearchParams({select:xt.join(","),where:i.join(" AND "),order_by:"delay_sec ASC",limit:String(e?100:5)})})(t),e),r=!0===t.all_destinations,s=r?100:5;return Ot(i,this.now(),r?s:t.departures,s)}async request(t,e){if(e.signal?.aborted)throw new bt("aborted","La requête a été annulée.");if(!this.isOnline())throw new bt("offline","Le navigateur est actuellement hors connexion.");const i=new AbortController;let r=!1,s=!1;const o=()=>{s=!0,i.abort()};e.signal?.addEventListener("abort",o,{once:!0});const n=globalThis.setTimeout(()=>{r=!0,i.abort()},this.timeoutMs);try{let o;try{o=await this.fetchImpl(((t,e=vt)=>{const i=new URL(e);return i.search=t.toString(),i.toString()})(t,this.baseUrl),{headers:{Accept:"application/json"},signal:i.signal})}catch(t){throw this.classifyTransportError(t,r,s||!0===e.signal?.aborted)}if(429===o.status)throw new bt("rate-limit","Hérault Data limite temporairement le nombre de requêtes.",{status:o.status,retryAfter:o.headers.get("Retry-After")??void 0});if(!o.ok)throw new bt("http",`Hérault Data a répondu avec le statut HTTP ${o.status}.`,{status:o.status});try{return await o.json()}catch(t){if(r||s||e.signal?.aborted)throw this.classifyTransportError(t,r,s||!0===e.signal?.aborted);throw new bt("invalid-json","Hérault Data a renvoyé un document JSON invalide.",{cause:t})}}finally{globalThis.clearTimeout(n),e.signal?.removeEventListener("abort",o)}}classifyTransportError(t,e,i){return e?new bt("timeout",`Hérault Data n'a pas répondu sous ${this.timeoutMs/1e3} secondes.`,{cause:t}):i?new bt("aborted","La requête a été annulée.",{cause:t}):this.isOnline()?new bt("network","Impossible de joindre Hérault Data.",{cause:t}):new bt("offline","Le navigateur est actuellement hors connexion.",{cause:t})}},It="custom:tam-card",Bt=Object.freeze({display_mode:"destination",departures:2,departures_per_destination:1,refresh_interval:60,background_color:"auto",text_color:"auto",show_icon:!0,show_line:!0,show_realtime_badge:!0,show_absolute_time:!1,compact:!1}),Ht=new Set("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent currentcolor inherit initial revert revert-layer unset".split(" ")),Vt=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/,Gt=/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i,Wt=/^var\(\s*--[\w-]+(?:\s*,[\s\S]+)?\)$/,Kt=(t,e,i=100)=>{const r=t.trim();if(r.endsWith("%")){const t=r.slice(0,-1);return Vt.test(t)&&Number(t)>=0&&Number(t)<=i}return Vt.test(r)&&Number(r)>=0&&Number(r)<=e},Jt=t=>Kt(t,1,100),Zt=t=>{const e=t.includes(","),i=t.replace(/\//g,e?",":" ");return(e?i.split(","):i.split(/\s+/)).map(t=>t.trim()).filter(Boolean)},Yt=(t,e)=>{const i=Zt(e);return(3===i.length||4===i.length)&&((t=>{const e=t.replace(/(?:deg|grad|rad|turn)$/i,"");return Vt.test(e)})(i[0])&&i[1].endsWith("%")&&Kt(i[1],100)&&i[2].endsWith("%")&&Kt(i[2],100)&&(void 0===i[3]||Jt(i[3]))&&("hsl"===t||4===i.length))},Qt=t=>{const e=t.trim().toLowerCase();if(!e||/[;{}]/.test(e))return!1;if(Gt.test(e)||Ht.has(e)||Wt.test(e))return!0;const i=/^(rgb|rgba|hsl|hsla)\((.*)\)$/.exec(e);if(!i)return!1;const[,r,s]=i;return r.startsWith("rgb")?((t,e)=>{const i=Zt(e);return(3===i.length||4===i.length)&&i.slice(0,3).every(t=>Kt(t,255))&&(void 0===i[3]||Jt(i[3]))&&("rgb"===t||4===i.length)})(r,s):Yt(r,s)},Xt=(t,e)=>{if("string"!=typeof t||!t.trim())return!1;if(/[;{}]/.test(t))return!1;const i=e??(()=>{if("function"==typeof globalThis.CSS?.supports)return globalThis.CSS.supports.bind(globalThis.CSS)})();if(i)try{return i("color",t.trim())}catch{return!1}return Qt(t)},te=t=>"string"!=typeof t?"":t.trim(),ee=(t,e,i,r)=>{const s="number"==typeof t?t:"string"==typeof t&&t.trim()?Number(t):Number.NaN;return Number.isFinite(s)?Math.min(r,Math.max(i,Math.trunc(s))):e},ie=(t,e)=>"boolean"==typeof t?t:e,re=(t,e,i)=>{if("string"!=typeof t)return e;const r=t.trim();return"auto"===r.toLowerCase()?"auto":Xt(r,i)?r:e},se=(t,e,i)=>{const r=re(t,e,i);return/^(?:currentcolor|inherit|initial|revert|revert-layer|unset)$/i.test(r)?e:r},oe=(t,e={})=>{const i="object"!=typeof(r=t)||null===r||Array.isArray(r)?{}:t;var r;const s=(t=>"all_destinations"===t?"all_destinations":Bt.display_mode)(i.display_mode),o="destination"===s?te(i.destination)||te(i.direction):"",n=i.background_color??i.backgroundColor,a=i.text_color??i.textColor,l={type:It,stop:te(i.stop),display_mode:s,departures:ee(i.departures,Bt.departures,1,5),departures_per_destination:ee(i.departures_per_destination,Bt.departures_per_destination,1,3),refresh_interval:ee(i.refresh_interval,Bt.refresh_interval,30,300),background_color:se(n,Bt.background_color,e.cssSupports),text_color:re(a,Bt.text_color,e.cssSupports),show_icon:ie(i.show_icon,Bt.show_icon),show_line:ie(i.show_line,Bt.show_line),show_realtime_badge:ie(i.show_realtime_badge,Bt.show_realtime_badge),show_absolute_time:ie(i.show_absolute_time,Bt.show_absolute_time),compact:ie(i.compact,Bt.compact)},c=(t=>"number"==typeof t&&Number.isFinite(t)?String(t):te(t)||void 0)(i.line);c&&(l.line=c),o&&(l.destination=o);const d=(t=>0===t||"0"===t?0:1===t||"1"===t?1:void 0)(i.direction_id);return void 0!==d&&(l.direction_id=d),l};class ne extends Error{constructor(t,e=[]){super(t),this.name="TamConfigError",this.issues=e,Object.setPrototypeOf(this,new.target.prototype)}}const ae=(t,e={})=>{const i=oe(t,e),r=[];var s;return"object"!=typeof(s=t)||null===s||Array.isArray(s)?r.push({code:"invalid-config",field:"config",message:"La configuration de TAM Card doit être un objet."}):t.type!==It&&r.push({code:"invalid-type",field:"type",message:`Le type de carte doit être « ${It} ».`}),i.stop||r.push({code:"missing-stop",field:"stop",message:"Sélectionnez un arrêt."}),"all_destinations"!==i.display_mode||i.line||r.push({code:"missing-line",field:"line",message:"Sélectionnez une ligne."}),"destination"!==i.display_mode||i.destination||r.push({code:"missing-destination",field:"destination",message:"Sélectionnez une destination."}),{valid:0===r.length,config:i,errors:r}},le=t=>Boolean("destination"===t.display_mode&&t.stop&&t.destination&&!t.line);class ce extends ne{constructor(t,e,i){super(e),this.name="LineInferenceError",this.code=t,this.candidates=i,Object.setPrototypeOf(this,new.target.prototype)}}const de=(t,e)=>{const i=(t=>{const e=t.map(t=>"number"==typeof t&&Number.isFinite(t)?String(t):"string"==typeof t?t.trim():"").filter(Boolean),i=new Map;for(const t of e){const e=t.normalize("NFKC").toLocaleUpperCase("fr-FR");i.has(e)||i.set(e,t)}return[...i.values()].sort((t,e)=>t.localeCompare(e,"fr",{numeric:!0,sensitivity:"base"}))})(t);if(1===i.length)return i[0];const r=`${e.stop} → ${e.destination??"destination inconnue"}`;if(0===i.length)throw new ce("line-not-found",`Aucune ligne ne correspond à ${r}. Renseignez « line » dans l'éditeur.`,i);throw new ce("ambiguous-line",`Plusieurs lignes (${i.join(", ")}) correspondent à ${r}. Sélectionnez une ligne dans l'éditeur.`,i)},he="custom:tam-card",ue="tam-card",pe="tam-card-editor",ge=864e5,me=3e5;function fe(t){return t.map(t=>{return encodeURIComponent(null==(e=t)?"":String(e).trim());var e}).join("|")}function _e(t,e){return"number"==typeof t&&Number.isFinite(t)&&t>=0?t:e}const ye=new class{constructor(t={}){this.entries=new Map,this.now=t.now??Date.now,this.storage=null===t.storage?void 0:t.storage??function(){try{return void 0===globalThis.localStorage?void 0:globalThis.localStorage}catch{return}}(),this.storagePrefix=t.storagePrefix??"tam-card:catalog",this.storageVersion=t.storageVersion??1,this.maxIdleMs=_e(t.maxIdleMs,18e5),this.nextCleanupAt=this.now()+me}acquire(t,e,i={}){if(!t)throw new TypeError("A cache key is required");const r=this.now();this.cleanupIfNeeded(r);const s=_e(i.ttlMs,25e3),o=i.staleIfError??!0,n=_e(i.maxStaleMs,Number.POSITIVE_INFINITY),a=i.persist??!1,l=this.getOrCreateEntry(t,r);if(l.lastAccessedAt=r,a&&!l.hasValue&&this.restorePersistedValue(t,l,n,r,i.validate),l.inFlight)return this.createLease(t,l,l.inFlight);if(l.hasValue&&!i.forceRefresh&&l.expiresAt>r)return this.createSettledLease(t,this.snapshot(l,!1));const c=l.generation+1;l.generation=c;const d=new AbortController,h={generation:c,controller:d,consumers:new Set,promise:Promise.resolve(void 0)};return h.promise=Promise.resolve().then(()=>e(d.signal)).then(e=>{const i=this.now(),r={value:e,stale:!1,fetchedAt:i,expiresAt:i+s,source:"network"};return l.generation===c&&(l.hasValue=!0,l.value=e,l.fetchedAt=r.fetchedAt,l.expiresAt=r.expiresAt,l.lastAccessedAt=i,l.source="memory",a&&this.persistValue(t,r)),r}).catch(t=>{const e=this.now();l.lastAccessedAt=e;const i=e-l.fetchedAt;if(o&&l.hasValue&&i<=n)return{value:l.value,stale:!0,fetchedAt:l.fetchedAt,expiresAt:l.expiresAt,source:l.source,error:t};throw t}).finally(()=>{l.inFlight===h&&(l.inFlight=void 0)}),l.inFlight=h,this.createLease(t,l,h)}acquireDepartures(t,e,i={}){return this.acquire(function(t){const e=!0===t.all_destinations;return`departures:${fe([e?"all_destinations":"destination",t.stop??t.stop_name,t.line??t.route_short_name,e?"":t.destination??t.trip_headsign,t.direction_id])}`}(t),e,{...i,ttlMs:i.ttlMs??25e3,persist:!1})}acquireCatalog(t,e,i,r={}){return this.acquire(function(t,e=[]){return`catalog:${t}:${fe(e)}`}(t,e),i,{...r,ttlMs:r.ttlMs??ge,maxStaleMs:r.maxStaleMs??2592e6,persist:!0,validate:e=>function(t,e){return!!Array.isArray(e)&&("stops"===t||"lines"===t?e.every(t=>"string"==typeof t):e.every(e=>!("object"!=typeof e||null===e||"journeys"===t&&"string"!=typeof e.line||"string"!=typeof e.destination||void 0!==e.direction_id&&0!==e.direction_id&&1!==e.direction_id)))}(t,e)})}async get(t,e,i={}){const r=this.acquire(t,e,i);try{return await r.promise}finally{r.release()}}async getCatalog(t,e,i,r={}){const s=this.acquireCatalog(t,e,i,r);try{return await s.promise}finally{s.release()}}peek(t){const e=this.entries.get(t);if(!e?.hasValue)return;const i=this.now();return e.lastAccessedAt=i,this.snapshot(e,e.expiresAt<=i)}invalidate(t){const e=this.entries.get(t);e&&(e.expiresAt=0)}get size(){return this.entries.size}cleanup(t=this.now()){let e=0;for(const[i,r]of this.entries)!r.inFlight&&t-r.lastAccessedAt>=this.maxIdleMs&&(this.entries.delete(i),e+=1);return this.nextCleanupAt=t+me,e}clear(){for(const t of this.entries.values())t.generation+=1,t.inFlight?.controller.abort();this.entries.clear()}getOrCreateEntry(t,e){const i=this.entries.get(t);if(i)return i;const r={hasValue:!1,fetchedAt:0,expiresAt:0,lastAccessedAt:e,source:"memory",generation:0};return this.entries.set(t,r),r}createSettledLease(t,e){return{key:t,promise:Promise.resolve(e),release:()=>{}}}createLease(t,e,i){const r=Symbol(t);i.consumers.add(r);let s=!1;return{key:t,promise:i.promise,release:()=>{s||(s=!0,i.consumers.delete(r),0===i.consumers.size&&e.inFlight===i&&(e.inFlight=void 0,e.generation+=1,i.controller.abort()))}}}snapshot(t,e){return{value:t.value,stale:e,fetchedAt:t.fetchedAt,expiresAt:t.expiresAt,source:t.source}}cleanupIfNeeded(t){t>=this.nextCleanupAt&&this.cleanup(t)}storageKey(t){return`${this.storagePrefix}:v${this.storageVersion}:${t}`}restorePersistedValue(t,e,i,r,s){if(!this.storage)return;const o=this.storageKey(t);try{const t=this.storage.getItem(o);if(!t)return;const n=JSON.parse(t);if(n.version!==this.storageVersion||"number"!=typeof n.generatedAt||!Number.isFinite(n.generatedAt)||"number"!=typeof n.expiresAt||!Number.isFinite(n.expiresAt)||!("value"in n)||r-n.generatedAt>i||n.generatedAt>r+3e5||n.expiresAt<n.generatedAt||n.expiresAt-n.generatedAt>867e5||void 0!==s&&!s(n.value))return void this.storage.removeItem(o);e.hasValue=!0,e.value=n.value,e.fetchedAt=n.generatedAt,e.expiresAt=n.expiresAt,e.lastAccessedAt=r,e.source="storage"}catch{try{this.storage.removeItem(o)}catch{}}}persistValue(t,e){if(!this.storage)return;const i={version:this.storageVersion,generatedAt:e.fetchedAt,expiresAt:e.expiresAt,value:e.value};try{this.storage.setItem(this.storageKey(t),JSON.stringify(i))}catch{}}};const be={en:{common:{retry:"Retry",minutes:"min",hour_minutes:"{hours} h {minutes} min"},card:{label:"TaM departures",incomplete_title:"Incomplete configuration",incomplete_detail:"Choose a stop, line and destination in the visual editor.",loading:"Loading departures…",no_departures_title:"No departure announced",no_departures_detail:"The feed may be temporarily empty or service may have ended.",error_title:"Departures unavailable",api_unavailable:"Hérault Data is currently unavailable.",rate_limited:"The public API is limiting requests. A new attempt will be made automatically.",offline:"This device is offline.",stale:"Last known result",stale_detail:"The current refresh failed; these departures may be outdated.",realtime:"Real time",theoretical:"Theoretical",mixed:"Real time + theoretical",approaching:"Approaching",now:"Now",configuration_error:"Configuration error",ambiguous_line:"Several lines ({lines}) match. Open the editor and select a line.",line_not_found:"No line matches this journey. Open the editor and select a line.",line_label:"Line {line}",all_destinations:"All destinations",all_directions:"All directions",direction_label:"Direction {direction}",destination_count_one:"{count} destination",destination_count:"{count} destinations",missing_stop:"Select a stop.",missing_line:"Select a line.",missing_destination:"Select a destination."},editor:{data:"Journey",display:"Display",colors:"Colours",stop:"Stop",line:"Line",destination:"Destination",display_mode:"Display mode",display_mode_destination:"One destination",display_mode_all_destinations:"All destinations",all_destinations_hint:"Upcoming departures are grouped by destination.",direction_id:"Direction",departures:"Number of departures",departures_per_destination:"Departures per destination",refresh_interval:"Refresh interval (seconds)",show_icon:"Show vehicle icon",show_line:"Show line",show_realtime_badge:"Show data source badge",show_absolute_time:"Show scheduled time",compact:"Compact mode",background_color:"Background colour",text_color:"Text colour",auto:"Automatic",color_formats:"Accepts CSS names, #RGB, #RGBA, #RRGGBB, #RRGGBBAA and transparent.",loading_stops:"Loading stops…",loading_lines:"Loading lines…",loading_destinations:"Loading destinations…",catalog_error:"The catalogue could not be loaded. You can retry or enter values manually.",manual_mode:"Manual entry",catalog_mode:"Use catalogue",manual_hint:"Values are matched case-insensitively when possible. Check spelling if no result appears.",select_stop_first:"Choose a stop first.",select_line_first:"Choose a line first.",direction_auto:"Automatic / unspecified",all_directions:"All directions",direction_0:"Direction 0",direction_1:"Direction 1",ambiguous_line:"Several lines ({lines}) match. Select a line."}},fr:{common:{retry:"Réessayer",minutes:"min",hour_minutes:"{hours} h {minutes} min"},card:{label:"Prochains passages TaM",incomplete_title:"Configuration incomplète",incomplete_detail:"Choisissez un arrêt, une ligne et une destination dans l’éditeur visuel.",loading:"Chargement des passages…",no_departures_title:"Aucun passage annoncé",no_departures_detail:"La source peut être momentanément vide ou le service peut être terminé.",error_title:"Passages indisponibles",api_unavailable:"Hérault Data est momentanément indisponible.",rate_limited:"L’API publique limite les requêtes. Un nouvel essai aura lieu automatiquement.",offline:"Cet appareil est hors connexion.",stale:"Dernier résultat connu",stale_detail:"L’actualisation a échoué ; ces passages peuvent être anciens.",realtime:"Temps réel",theoretical:"Théorique",mixed:"Temps réel + théorique",approaching:"À l’approche",now:"À quai",configuration_error:"Erreur de configuration",ambiguous_line:"Plusieurs lignes ({lines}) correspondent. Ouvrez l’éditeur et sélectionnez une ligne.",line_not_found:"Aucune ligne ne correspond à ce trajet. Ouvrez l’éditeur et sélectionnez une ligne.",line_label:"Ligne {line}",all_destinations:"Toutes les destinations",all_directions:"Tous les sens",direction_label:"Sens {direction}",destination_count_one:"{count} destination",destination_count:"{count} destinations",missing_stop:"Sélectionnez un arrêt.",missing_line:"Sélectionnez une ligne.",missing_destination:"Sélectionnez une destination."},editor:{data:"Trajet",display:"Affichage",colors:"Couleurs",stop:"Arrêt",line:"Ligne",destination:"Destination",display_mode:"Mode d’affichage",display_mode_destination:"Une destination",display_mode_all_destinations:"Toutes les destinations",all_destinations_hint:"Les prochains passages sont regroupés par destination.",direction_id:"Sens",departures:"Nombre de passages",departures_per_destination:"Passages par destination",refresh_interval:"Actualisation (secondes)",show_icon:"Afficher l’icône du véhicule",show_line:"Afficher la ligne",show_realtime_badge:"Afficher la nature des données",show_absolute_time:"Afficher l’heure annoncée",compact:"Mode compact",background_color:"Couleur de fond",text_color:"Couleur du texte",auto:"Automatique",color_formats:"Accepte les noms CSS, #RGB, #RGBA, #RRGGBB, #RRGGBBAA et transparent.",loading_stops:"Chargement des arrêts…",loading_lines:"Chargement des lignes…",loading_destinations:"Chargement des destinations…",catalog_error:"Le catalogue n’a pas pu être chargé. Réessayez ou saisissez les valeurs manuellement.",manual_mode:"Saisie manuelle",catalog_mode:"Utiliser le catalogue",manual_hint:"Les valeurs sont rapprochées sans tenir compte de la casse lorsque c’est possible. Vérifiez l’orthographe si aucun résultat n’apparaît.",select_stop_first:"Choisissez d’abord un arrêt.",select_line_first:"Choisissez d’abord une ligne.",direction_auto:"Automatique / non précisé",all_directions:"Tous les sens",direction_0:"Sens 0",direction_1:"Sens 1",ambiguous_line:"Plusieurs lignes ({lines}) correspondent. Sélectionnez une ligne."}}};function ve(t,e){let i=t;for(const t of e.split(".")){if("string"==typeof i||void 0===i)return;i=i[t]}return"string"==typeof i?i:void 0}function we(t,e,i={}){const r=function(t){return t?.toLowerCase().startsWith("en")?"en":"fr"}(e),s=ve(be[r],t)??ve(be.fr,t)??ve(be.en,t)??t;return Object.entries(i).reduce((t,[e,i])=>t.replaceAll(`{${e}}`,String(i)),s)}const xe=n`
  :host {
    display: block;
    min-width: 0;
  }

  ha-card {
    --tam-surface: var(--tam-background, var(--ha-card-background, var(--card-background-color, #fff)));
    --tam-on-surface: var(--tam-text, var(--primary-text-color, #111));
    position: relative;
    overflow: hidden;
    container-type: inline-size;
    color: var(--tam-on-surface);
    background: var(--tam-surface);
    border: var(--ha-card-border-width, 1px) solid var(--tam-border, var(--ha-card-border-color, transparent));
    border-radius: var(--ha-card-border-radius, 12px);
    outline: none;
  }

  ha-card:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color, #03a9f4) 55%, transparent);
  }

  .layout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--tam-gap, 14px);
    min-height: var(--tam-min-height, 64px);
    padding: var(--tam-padding, 10px 16px);
    box-sizing: border-box;
  }

  .layout.without-identity {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  :host([compact]) .layout {
    --tam-gap: 10px;
    --tam-min-height: 52px;
    --tam-padding: 7px 12px;
  }

  .identity {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .mode-icon {
    --mdc-icon-size: 19px;
    flex: 0 0 auto;
    opacity: 0.86;
  }

  .line-badge {
    display: inline-grid;
    place-items: center;
    min-width: 30px;
    height: 30px;
    padding: 0 7px;
    box-sizing: border-box;
    border-radius: 7px;
    color: var(--tam-badge-text, var(--tam-on-surface));
    background: var(--tam-badge-background, color-mix(in srgb, var(--tam-on-surface) 14%, transparent));
    border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
    font-size: 0.95rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    white-space: nowrap;
  }

  .journey {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }

  .stop,
  .destination {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stop {
    font-weight: 700;
  }

  .destination {
    font-weight: 500;
  }

  .arrow {
    flex: 0 0 auto;
    opacity: 0.7;
  }

  .departures {
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    min-width: max-content;
  }

  .departure {
    display: grid;
    align-content: center;
    justify-items: end;
    min-width: 68px;
    padding: 0 12px;
    font-variant-numeric: tabular-nums;
  }

  .departure:first-child {
    padding-left: 0;
  }

  .departure:last-child {
    padding-right: 0;
  }

  .departure + .departure {
    border-left: 2px solid color-mix(in srgb, currentColor 34%, transparent);
  }

  .time {
    font-size: 1rem;
    font-weight: 750;
    line-height: 1.15;
    white-space: nowrap;
  }

  .absolute {
    margin-top: 2px;
    font-size: 0.72rem;
    line-height: 1;
    opacity: 0.74;
  }

  .metadata {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    max-width: 100%;
    margin-top: -3px;
    padding: 0 8px 5px;
    box-sizing: border-box;
  }

  .metadata:empty {
    display: none;
  }

  .status-badge {
    overflow: hidden;
    max-width: 150px;
    padding: 2px 6px;
    border: 1px solid color-mix(in srgb, currentColor 28%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--tam-surface) 78%, transparent);
    font-size: 0.62rem;
    font-weight: 650;
    line-height: 1.15;
    text-overflow: ellipsis;
    white-space: nowrap;
    backdrop-filter: blur(4px);
  }

  .approaching {
    --tam-border: var(--warning-color, #ff9800);
  }

  .approaching::after {
    position: absolute;
    z-index: 2;
    inset: 0;
    box-sizing: border-box;
    border: 3px solid var(--warning-color, #ff9800);
    border-radius: inherit;
    box-shadow: inset 0 0 18px color-mix(in srgb, var(--warning-color, #ff9800) 38%, transparent);
    content: '';
    pointer-events: none;
    animation: tam-approaching-blink 1.2s steps(1, end) infinite;
  }

  .approaching-departure .time,
  .approaching-badge {
    animation: tam-approaching-label-blink 1.2s steps(1, end) infinite;
  }

  .approaching-badge {
    color: #111;
    background: var(--warning-color, #ff9800);
    border-color: var(--warning-color, #ff9800);
  }

  .approaching-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 45%, transparent);
    animation: tam-pulse 1.8s ease-out infinite;
  }

  .overview-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
  }

  .overview-header.without-identity {
    grid-template-columns: minmax(0, 1fr);
  }

  .overview-heading {
    display: grid;
    min-width: 0;
    gap: 2px;
  }

  .overview-summary {
    overflow: hidden;
    font-size: 0.72rem;
    opacity: 0.72;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .destination-list {
    margin: 0;
    padding: 0;
    border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    list-style: none;
  }

  .destination-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    min-height: 45px;
    padding: 7px 16px;
    box-sizing: border-box;
  }

  .destination-row + .destination-row {
    border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  }

  .destination-row.has-approaching {
    background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
  }

  .destination-name {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 8px;
    font-weight: 650;
  }

  .destination-name > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .destination-times {
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    min-width: 0;
  }

  .destination-time {
    display: grid;
    align-content: center;
    justify-items: end;
    min-width: 64px;
    padding: 0 10px;
    font-variant-numeric: tabular-nums;
  }

  .destination-time:first-child {
    padding-left: 0;
  }

  .destination-time:last-child {
    padding-right: 0;
  }

  .destination-time + .destination-time {
    border-left: 1px solid color-mix(in srgb, currentColor 24%, transparent);
  }

  :host([compact]) .overview-header {
    padding: 8px 12px;
  }

  :host([compact]) .destination-row {
    min-height: 38px;
    padding: 5px 12px;
  }

  .message-layout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    min-height: 64px;
    padding: 10px 16px;
    box-sizing: border-box;
  }

  .message-layout ha-icon {
    --mdc-icon-size: 24px;
  }

  .message-title {
    font-weight: 700;
  }

  .message-detail {
    margin-top: 2px;
    font-size: 0.82rem;
    opacity: 0.78;
  }

  .retry {
    margin-top: 7px;
    padding: 5px 9px;
    color: inherit;
    background: color-mix(in srgb, currentColor 8%, transparent);
    border: 1px solid color-mix(in srgb, currentColor 32%, transparent);
    border-radius: 7px;
    font: inherit;
    font-size: 0.78rem;
    cursor: pointer;
  }

  .retry:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .skeleton {
    display: block;
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(
      100deg,
      color-mix(in srgb, currentColor 8%, transparent) 25%,
      color-mix(in srgb, currentColor 18%, transparent) 40%,
      color-mix(in srgb, currentColor 8%, transparent) 55%
    );
    background-size: 220% 100%;
    animation: tam-loading 1.5s linear infinite;
  }

  .skeleton:first-child {
    width: min(210px, 65%);
  }

  .skeleton:last-child {
    width: min(145px, 45%);
    margin-top: 8px;
  }

  @container (max-width: 480px) {
    .layout {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 9px 12px;
    }

    .layout.without-identity {
      grid-template-columns: minmax(0, 1fr);
    }

    .journey {
      align-items: center;
    }

    .departures {
      grid-column: 1 / -1;
      justify-self: stretch;
      justify-content: flex-end;
      min-width: 0;
      border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent);
      padding-top: 8px;
    }

    .departure {
      flex: 1 1 0;
      justify-items: center;
      min-width: 0;
      padding-inline: 6px;
    }

    .time {
      overflow: hidden;
      max-width: 100%;
      font-size: 0.88rem;
      text-overflow: ellipsis;
    }

    .overview-header,
    .destination-row {
      padding-inline: 12px;
    }

    .destination-row {
      grid-template-columns: minmax(0, 1fr);
      gap: 8px;
    }

    .destination-name {
      font-size: 0.88rem;
    }

    .destination-times {
      justify-self: stretch;
    }

    .destination-time {
      flex: 1 1 0;
      justify-items: center;
      min-width: 0;
      padding-inline: 6px;
    }
  }

  @container (max-width: 330px) {
    .mode-icon {
      display: none;
    }

    .journey {
      display: grid;
      gap: 1px;
    }

    .arrow {
      display: none;
    }
  }

  @keyframes tam-pulse {
    70%,
    100% {
      box-shadow: 0 0 0 6px transparent;
    }
  }

  @keyframes tam-approaching-blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.12;
    }
  }

  @keyframes tam-approaching-label-blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0.38;
    }
  }

  @keyframes tam-loading {
    to {
      background-position-x: -220%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .approaching::after,
    .approaching-departure .time,
    .approaching-badge,
    .approaching-dot,
    .skeleton {
      animation: none;
    }
  }
`,$e=n`
  :host {
    display: block;
  }

  .editor {
    display: grid;
    gap: 18px;
    padding: 4px 0 12px;
  }

  .section {
    display: grid;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
  }

  .section:last-child {
    border-bottom: 0;
  }

  h3 {
    margin: 0;
    color: var(--primary-text-color);
    font-size: 1rem;
    font-weight: 600;
  }

  .hint,
  .error {
    margin: 0;
    font-size: 0.84rem;
    line-height: 1.4;
  }

  .hint {
    color: var(--secondary-text-color);
  }

  .error {
    color: var(--error-color, #db4437);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  button {
    min-height: 36px;
    padding: 7px 12px;
    color: var(--primary-text-color);
    background: transparent;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.35));
    border-radius: 8px;
    font: inherit;
    cursor: pointer;
  }

  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  ha-selector {
    display: block;
  }
`,Ae=t=>"string"==typeof t?t.trim():"",Ce=(t,e)=>0===t.localeCompare(e,"fr",{sensitivity:"base"}),Se=t=>"auto"===t.toLowerCase()||(t.startsWith("#")?Qt(t):Xt(t));let Fe=class extends at{constructor(){super(...arguments),this.stops=[],this.lines=[],this.destinations=[],this.manual=!1,this.colorDrafts={background_color:"auto",text_color:"auto"},this.generation=0,this.changeStop=t=>{if(!this.config)return;const e=++this.generation,i=Ae(t.detail.value);this.config={...this.config,stop:i},delete this.config.line,delete this.config.destination,delete this.config.direction_id,this.lines=[],this.destinations=[],this.emitConfig(),i?this.loadLines(i,e):this.loading=void 0},this.changeDisplayMode=t=>{if(!this.config)return;const e="all_destinations"===Ae(t.detail.value)?"all_destinations":"destination";if(e===this.config.display_mode)return;const i=++this.generation;this.loading=void 0,this.catalogError=void 0,this.config={...this.config,display_mode:e},delete this.config.destination,delete this.config.direction_id,this.emitConfig(),this.manual||this.loadInitialCatalog(i)},this.changeLine=t=>{if(!this.config)return;const e=++this.generation,i=Ae(t.detail.value);this.config={...this.config,...i?{line:i}:{}},i||delete this.config.line,delete this.config.destination,delete this.config.direction_id,this.destinations=[],this.emitConfig(),this.config.stop&&i?this.loadDestinations(this.config.stop,i,e):this.loading=void 0},this.changeDestination=t=>{if(!this.config)return;const e=Ae(t.detail.value),i=this.destinations.find(t=>this.destinationKey(t.destination,t.direction_id)===e);if(i)this.config={...this.config,destination:i.destination},void 0===i.direction_id?delete this.config.direction_id:this.config.direction_id=i.direction_id;else{const[t,i]=e.split("\0");this.config={...this.config,destination:t},"0"===i||"1"===i?this.config.direction_id=Number(i):delete this.config.direction_id}this.emitConfig()},this.changeDirection=t=>{if(!this.config)return;const e=Ae(t.detail.value);"0"===e||"1"===e?this.config={...this.config,direction_id:Number(e)}:(this.config={...this.config},delete this.config.direction_id),this.emitConfig()}}setConfig(t){const e=function(t){return{...oe(t),type:he}}(t);this.config=e,this.colorDrafts={background_color:Se(this.colorDrafts.background_color)?e.background_color??"auto":this.colorDrafts.background_color,text_color:Se(this.colorDrafts.text_color)?e.text_color??"auto":this.colorDrafts.text_color};const i=++this.generation;this.loadInitialCatalog(i)}render(){return this.config?B`
      <div class="editor">
        <section class="section" aria-labelledby="tam-editor-data">
          <h3 id="tam-editor-data">${we("editor.data",this.language)}</h3>
          ${this.selector(we("editor.display_mode",this.language),{select:{options:[{value:"destination",label:we("editor.display_mode_destination",this.language)},{value:"all_destinations",label:we("editor.display_mode_all_destinations",this.language)}],mode:"dropdown"}},this.config.display_mode??"destination",this.changeDisplayMode)}
          ${this.renderCatalogFeedback()}
          <div class="actions">
            <button type="button" @click=${this.toggleManual}>
              ${we(this.manual?"editor.catalog_mode":"editor.manual_mode",this.language)}
            </button>
            ${this.catalogError?B`<button type="button" @click=${this.retryCatalog}>
                    ${we("common.retry",this.language)}
                  </button>`:V}
          </div>
          ${this.manual?this.renderManualJourney():this.renderCatalogJourney()}
        </section>

        <section class="section" aria-labelledby="tam-editor-display">
          <h3 id="tam-editor-display">${we("editor.display",this.language)}</h3>
          ${this.isAllDestinations?B`
                  <p class="hint">${we("editor.all_destinations_hint",this.language)}</p>
                  ${this.selector(we("editor.departures_per_destination",this.language),{number:{min:1,max:3,step:1,mode:"box"}},this.config.departures_per_destination??1,t=>this.changeNumber("departures_per_destination",t,1,3))}
                `:this.selector(we("editor.departures",this.language),{number:{min:1,max:5,step:1,mode:"box"}},this.config.departures??2,t=>this.changeNumber("departures",t,1,5))}
          ${this.selector(we("editor.refresh_interval",this.language),{number:{min:30,max:300,step:30,mode:"box",unit_of_measurement:"s"}},this.config.refresh_interval??60,t=>this.changeNumber("refresh_interval",t,30,300))}
          ${this.booleanSelector("show_icon")}${this.booleanSelector("show_line")}
          ${this.booleanSelector("show_realtime_badge")}
          ${this.booleanSelector("show_absolute_time")}${this.booleanSelector("compact")}
        </section>

        <section class="section" aria-labelledby="tam-editor-colors">
          <h3 id="tam-editor-colors">${we("editor.colors",this.language)}</h3>
          ${this.selector(we("editor.background_color",this.language),{text:{type:"text"}},this.colorDrafts.background_color,t=>this.changeColor("background_color",t),()=>this.restoreIncompleteColor("background_color"))}
          ${this.selector(we("editor.text_color",this.language),{text:{type:"text"}},this.colorDrafts.text_color,t=>this.changeColor("text_color",t),()=>this.restoreIncompleteColor("text_color"))}
          <p class="hint">${we("editor.auto",this.language)} : <code>auto</code></p>
          <p class="hint">${we("editor.color_formats",this.language)}</p>
        </section>
      </div>
    `:B`<p>${we("card.loading",this.language)}</p>`}get language(){return this.hass?.language}get isAllDestinations(){return"all_destinations"===this.config?.display_mode}renderCatalogFeedback(){if(this.loading){const t="stops"===this.loading?"editor.loading_stops":"lines"===this.loading?"editor.loading_lines":"editor.loading_destinations";return B`<p class="hint" role="status">${we(t,this.language)}</p>`}return this.catalogError?B`<p class="error" role="alert">${this.catalogError}</p>`:V}renderCatalogJourney(){if(!this.stops.length&&!this.loading)return this.renderManualJourney();const t=this.selectedDestinationKey();return B`
      ${this.selector(we("editor.stop",this.language),{select:{options:this.stops,custom_value:!0,mode:"dropdown"}},this.config?.stop??"",this.changeStop)}
      ${this.config?.stop?this.selector(we("editor.line",this.language),{select:{options:this.lines.map(t=>({value:t,label:t})),mode:"dropdown"}},this.config.line??"",this.changeLine):B`<p class="hint">${we("editor.select_stop_first",this.language)}</p>`}
      ${this.config?.stop&&this.config.line?this.isAllDestinations?this.renderDirectionSelector(!0,!0):this.selector(we("editor.destination",this.language),{select:{options:this.destinationOptions(),mode:"dropdown"}},t,this.changeDestination):B`<p class="hint">${we("editor.select_line_first",this.language)}</p>`}
    `}renderManualJourney(){return B`
      <p class="hint">${we("editor.manual_hint",this.language)}</p>
      ${this.selector(we("editor.stop",this.language),{text:{type:"text"}},this.config?.stop??"",t=>this.changeText("stop",t,["line","destination","direction_id"]))}
      ${this.selector(we("editor.line",this.language),{text:{type:"text"}},this.config?.line??"",t=>this.changeText("line",t,["destination","direction_id"]))}
      ${this.isAllDestinations?V:this.selector(we("editor.destination",this.language),{text:{type:"text"}},this.config?.destination??"",t=>this.changeText("destination",t))}
      ${this.renderDirectionSelector(this.isAllDestinations)}
    `}renderDirectionSelector(t,e=!1){return this.selector(we("editor.direction_id",this.language),{select:{options:this.directionOptions(t,e),mode:"dropdown"}},void 0===this.config?.direction_id?"auto":String(this.config.direction_id),this.changeDirection)}directionOptions(t,e){const i=[...new Set(this.destinations.map(t=>t.direction_id).filter(t=>void 0!==t))].sort((t,e)=>t-e),r=e&&i.length>0?i:[0,1];return[{value:"auto",label:we(t?"editor.all_directions":"editor.direction_auto",this.language)},...r.map(e=>{const i=[...new Set(this.destinations.filter(t=>t.direction_id===e).map(t=>t.destination))],r=we(`editor.direction_${e}`,this.language);return{value:String(e),label:t&&i.length>0?`${r} — ${i.join(", ")}`:r}})]}selector(t,e,i,r,s){return B`
      <ha-selector
        .hass=${this.hass}
        .selector=${e}
        .value=${i}
        .label=${t}
        @value-changed=${r}
        @focusout=${s}
      ></ha-selector>
    `}booleanSelector(t){return this.selector(we(`editor.${t}`,this.language),{boolean:{}},this.config?.[t]??!1,e=>{this.config&&(this.config={...this.config,[t]:Boolean(e.detail.value)},this.emitConfig())})}changeText(t,e,i=[]){if(!this.config)return;i.length>0&&(this.generation+=1,this.loading=void 0);const r=Ae(e.detail.value);this.config={...this.config,[t]:r},r||delete this.config[t];for(const t of i)delete this.config[t];i.includes("line")&&(this.lines=[]),i.includes("destination")&&(this.destinations=[]),this.emitConfig()}changeColor(t,e){if(!this.config)return;const i=Ae(e.detail.value);if(this.colorDrafts={...this.colorDrafts,[t]:i},!Se(i))return;const r="auto"===i.toLowerCase()?"auto":i;this.config={...this.config,[t]:r},this.emitConfig()}restoreIncompleteColor(t){this.config&&!Se(this.colorDrafts[t])&&(this.colorDrafts={...this.colorDrafts,[t]:this.config[t]??"auto"})}changeNumber(t,e,i,r){if(!this.config)return;const s=Number(e.detail.value);Number.isFinite(s)&&(this.config={...this.config,[t]:Math.min(r,Math.max(i,Math.round(s)))},this.emitConfig())}toggleManual(){this.manual=!this.manual,this.manual||this.loadInitialCatalog(++this.generation)}retryCatalog(){this.catalogError=void 0,this.manual=!1;const t=++this.generation;this.loadInitialCatalog(t,!0)}async loadInitialCatalog(t,e=!1){this.loading="stops",this.catalogError=void 0;try{const i=await ye.getCatalog("stops",[],t=>zt.listStops({signal:t}),{forceRefresh:e});if(t!==this.generation)return;if(this.stops=i.value,!this.config?.stop)return;const r=this.stops.find(t=>Ce(t,this.config?.stop??""));r&&(this.config={...this.config,stop:r}),await this.loadLines(this.config.stop,t,e,!0)}catch{if(t!==this.generation)return;this.catalogError=we("editor.catalog_error",this.language),this.manual=!0}finally{t===this.generation&&(this.loading=void 0)}}async loadLines(t,e,i=!1,r=!1){this.loading="lines",this.catalogError=void 0;try{const s=await ye.getCatalog("lines",[t],e=>zt.listLinesForStop(t,{signal:e}),{forceRefresh:i});if(e!==this.generation)return;if(this.lines=s.value,this.config?.line){const r=this.lines.find(t=>Ce(t,this.config?.line??""));r&&(this.config={...this.config,line:r}),await this.loadDestinations(t,this.config.line,e,i)}else r&&this.config?.destination&&await this.inferLine(t,this.config.destination,e,i)}catch{if(e!==this.generation)return;this.catalogError=we("editor.catalog_error",this.language),this.manual=!0}finally{e===this.generation&&(this.loading=void 0)}}async loadDestinations(t,e,i,r=!1){this.loading="destinations",this.catalogError=void 0;try{const s=await ye.getCatalog("destinations",[t,e],i=>zt.listDestinations(t,e,{signal:i}),{forceRefresh:r});if(i!==this.generation)return;if(this.destinations=s.value,this.config?.destination){const t=this.destinations.find(t=>Ce(t.destination,this.config?.destination??"")&&(void 0===this.config?.direction_id||t.direction_id===this.config.direction_id));t&&(this.config={...this.config,destination:t.destination})}}catch{if(i!==this.generation)return;this.catalogError=we("editor.catalog_error",this.language),this.manual=!0}finally{i===this.generation&&(this.loading=void 0)}}async inferLine(t,e,i,r){const s=await ye.getCatalog("journeys",[t],e=>zt.listJourneysForStop(t,{signal:e}),{forceRefresh:r}),o=s.value.filter(t=>Ce(t.destination,e)&&(void 0===this.config?.direction_id||t.direction_id===this.config.direction_id));if(i!==this.generation||!this.config)return;const n=[...new Set(o.map(t=>t.line))];if(1===n.length){const[t]=n,e=o[0];return this.config={...this.config,line:t,destination:e.destination},void 0!==this.config.direction_id&&void 0!==e.direction_id&&(this.config.direction_id=e.direction_id),this.destinations=s.value.filter(e=>Ce(e.line,t)).map(({destination:t,direction_id:e})=>({destination:t,...void 0===e?{}:{direction_id:e}})),void this.emitConfig()}n.length>1&&(this.catalogError=we("editor.ambiguous_line",this.language,{lines:n.join(", ")}))}destinationKey(t,e){return t?`${t}\0${e??""}`:""}selectedDestinationKey(){const t=this.config?.destination;if(!t)return"";if(void 0!==this.config?.direction_id)return this.destinationKey(t,this.config.direction_id);const e=this.destinations.filter(e=>Ce(e.destination,t));return 1===e.length?this.destinationKey(e[0].destination,e[0].direction_id):this.destinationKey(t)}destinationOptions(){const t=[],e=new Set;for(const i of this.destinations){const r=i.destination.normalize("NFKC").toLocaleUpperCase("fr-FR");this.destinations.filter(t=>Ce(t.destination,i.destination)).length>1&&!e.has(r)&&(e.add(r),t.push({value:this.destinationKey(i.destination),label:`${i.destination} — ${we("editor.all_directions",this.language)}`})),t.push({value:this.destinationKey(i.destination,i.direction_id),label:this.destinationLabel(i)})}return t}destinationLabel(t){return this.destinations.filter(e=>Ce(e.destination,t.destination)).length>1&&void 0!==t.direction_id?`${t.destination} — ${we(`editor.direction_${t.direction_id}`,this.language)}`:t.destination}emitConfig(){if(!this.config)return;const t={...this.config,type:he};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}static{this.styles=$e}};t([ut({attribute:!1})],Fe.prototype,"hass",void 0),t([pt()],Fe.prototype,"config",void 0),t([pt()],Fe.prototype,"stops",void 0),t([pt()],Fe.prototype,"lines",void 0),t([pt()],Fe.prototype,"destinations",void 0),t([pt()],Fe.prototype,"loading",void 0),t([pt()],Fe.prototype,"catalogError",void 0),t([pt()],Fe.prototype,"manual",void 0),t([pt()],Fe.prototype,"colorDrafts",void 0),Fe=t([ct(pe)],Fe);const Ee=/^#[\dA-F]{6}$/,ke=t=>"object"==typeof t&&null!==t&&!Array.isArray(t);function De(t){if(!ke(t)||1!==t.version||!ke(t.routes))return!1;const e=Object.entries(t.routes);return!(0===e.length||e.length>500)&&e.every(([t,e])=>t.length>0&&t.length<=64&&t===t.trim().toUpperCase()&&"__PROTO__"!==t&&"CONSTRUCTOR"!==t&&"PROTOTYPE"!==t&&function(t){return!!ke(t)&&"string"==typeof t.route_color&&Ee.test(t.route_color)&&"string"==typeof t.route_text_color&&Ee.test(t.route_text_color)&&Number.isSafeInteger(t.route_type)&&Number(t.route_type)>=0&&Number(t.route_type)<=1e4}(e))}async function Te(t,e={}){const i=e.fetch??globalThis.fetch;if("function"!=typeof i)throw new TypeError("fetch est indisponible dans ce navigateur.");const r=new AbortController,s=()=>r.abort();t.aborted?r.abort():t.addEventListener("abort",s,{once:!0});const o=globalThis.setTimeout(()=>r.abort(),e.timeoutMs??15e3);try{const t=await i(e.url??"https://raw.githubusercontent.com/MathisAlepis/lovelace-tam-card/main/route-styles.json",{headers:{Accept:"application/json"},signal:r.signal});if(!t.ok)throw new Error(`Catalogue des lignes indisponible (HTTP ${t.status}).`);return function(t){if(!De(t))throw new TypeError("Le catalogue distant des lignes TaM est invalide.");const e=Object.create(null);for(const[i,r]of Object.entries(t.routes))e[i]={route_color:r.route_color,route_text_color:r.route_text_color,route_type:r.route_type};return{version:1,routes:e}}(await t.json())}finally{globalThis.clearTimeout(o),t.removeEventListener("abort",s)}}const Re=36e5;class Le{constructor(t,e={}){this.connected=!1,this.host=t,this.cache=e.cache??ye,this.loader=e.loader??(t=>Te(t)),this.now=e.now??Date.now,t.addController(this)}get styles(){return this.stylesValue}hostConnected(){this.connected||(this.connected=!0,this.refresh())}hostDisconnected(){this.connected=!1,this.clearTimer(),this.lease?.release(),this.lease=void 0,this.request=void 0}refresh(){if(!this.connected)return Promise.resolve();if(this.request)return this.request;const t=this.cache.acquire("route-styles:github:v1",this.loader,{ttlMs:6048e5,staleIfError:!0,maxStaleMs:15552e6,persist:!0,validate:De});this.lease=t;const e=t.promise.then(e=>{if(!this.connected||this.lease!==t)return;this.stylesValue=e.value.routes,this.host.requestUpdate();const i=e.stale?this.now()+Re:Math.max(this.now()+1e3,e.expiresAt);this.scheduleRefresh(i)}).catch(()=>{this.connected&&this.lease===t&&this.scheduleRefresh(this.now()+Re)}).finally(()=>{t.release(),this.lease===t&&(this.lease=void 0),this.request===e&&(this.request=void 0)});return this.request=e,e}scheduleRefresh(t){this.clearTimer(),this.connected&&(this.refreshTimer=setTimeout(()=>{this.refreshTimer=void 0,this.refresh()},Math.max(1e3,t-this.now())))}clearTimer(){void 0!==this.refreshTimer&&(clearTimeout(this.refreshTimer),this.refreshTimer=void 0)}}const Me={1:{route_color:"#005CA9",route_text_color:"#FFFFFF",route_type:0},2:{route_color:"#EF7D00",route_text_color:"#000000",route_type:0},3:{route_color:"#C8D400",route_text_color:"#000000",route_type:0},4:{route_color:"#4B2A0E",route_text_color:"#FFFFFF",route_type:0},5:{route_color:"#287431",route_text_color:"#FFFFFF",route_type:0},6:{route_color:"#E94190",route_text_color:"#000000",route_type:3},7:{route_color:"#A777B1",route_text_color:"#000000",route_type:3},8:{route_color:"#FFDC00",route_text_color:"#000000",route_type:3},9:{route_color:"#00A14C",route_text_color:"#FFFFFF",route_type:3},10:{route_color:"#FFB900",route_text_color:"#000000",route_type:3},11:{route_color:"#5FC3E1",route_text_color:"#000000",route_type:3},12:{route_color:"#29417C",route_text_color:"#FFFFFF",route_type:3},13:{route_color:"#941B80",route_text_color:"#FFFFFF",route_type:3},14:{route_color:"#F3A08C",route_text_color:"#000000",route_type:3},15:{route_color:"#BF0D0D",route_text_color:"#FFFFFF",route_type:3},16:{route_color:"#009EE2",route_text_color:"#000000",route_type:3},17:{route_color:"#DCC900",route_text_color:"#000000",route_type:3},18:{route_color:"#E84E24",route_text_color:"#000000",route_type:3},19:{route_color:"#FFD400",route_text_color:"#000000",route_type:3},20:{route_color:"#009EE2",route_text_color:"#000000",route_type:3},21:{route_color:"#FFE500",route_text_color:"#000000",route_type:3},22:{route_color:"#81CFF4",route_text_color:"#000000",route_type:3},23:{route_color:"#F29100",route_text_color:"#000000",route_type:3},24:{route_color:"#A61680",route_text_color:"#FFFFFF",route_type:3},25:{route_color:"#904E00",route_text_color:"#FFFFFF",route_type:3},26:{route_color:"#306980",route_text_color:"#FFFFFF",route_type:3},27:{route_color:"#E20613",route_text_color:"#FFFFFF",route_type:3},28:{route_color:"#F29100",route_text_color:"#000000",route_type:3},30:{route_color:"#F4B4D2",route_text_color:"#000000",route_type:3},31:{route_color:"#A9B400",route_text_color:"#000000",route_type:3},32:{route_color:"#008288",route_text_color:"#000000",route_type:3},33:{route_color:"#C7D300",route_text_color:"#000000",route_type:3},34:{route_color:"#729957",route_text_color:"#000000",route_type:3},35:{route_color:"#164193",route_text_color:"#FFFFFF",route_type:3},36:{route_color:"#E20613",route_text_color:"#FFFFFF",route_type:3},38:{route_color:"#8C004C",route_text_color:"#FFFFFF",route_type:3},40:{route_color:"#FFDC00",route_text_color:"#000000",route_type:3},41:{route_color:"#74B859",route_text_color:"#000000",route_type:3},42:{route_color:"#E5007E",route_text_color:"#000000",route_type:3},43:{route_color:"#FABC43",route_text_color:"#000000",route_type:3},44:{route_color:"#E95296",route_text_color:"#000000",route_type:3},46:{route_color:"#7A1C79",route_text_color:"#FFFFFF",route_type:3},47:{route_color:"#B6C952",route_text_color:"#000000",route_type:3},50:{route_color:"#0059A1",route_text_color:"#FFFFFF",route_type:3},51:{route_color:"#E95296",route_text_color:"#000000",route_type:3},52:{route_color:"#FFE500",route_text_color:"#000000",route_type:3},53:{route_color:"#95C11F",route_text_color:"#000000",route_type:3},81:{route_color:"#3362F7",route_text_color:"#FFFFFF",route_type:3},91:{route_color:"#E75294",route_text_color:"#000000",route_type:3},92:{route_color:"#E75294",route_text_color:"#000000",route_type:3},93:{route_color:"#E75294",route_text_color:"#000000",route_type:3},94:{route_color:"#E75294",route_text_color:"#000000",route_type:3},95:{route_color:"#E75294",route_text_color:"#000000",route_type:3},96:{route_color:"#1C3C6E",route_text_color:"#FFFFFF",route_type:3},A:{route_color:"#841931",route_text_color:"#FFFFFF",route_type:3}},Ne={aqua:[0,255,255],black:[0,0,0],blue:[0,0,255],fuchsia:[255,0,255],gray:[128,128,128],green:[0,128,0],lime:[0,255,0],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],purple:[128,0,128],red:[255,0,0],silver:[192,192,192],teal:[0,128,128],white:[255,255,255],yellow:[255,255,0]},Pe=new Map,qe=(t,e,i)=>Math.min(i,Math.max(e,t));function Oe(t){const e=t.trim(),i=Number(e.endsWith("%")?e.slice(0,-1):e);if(Number.isFinite(i))return qe(e.endsWith("%")?i/100*255:i,0,255)}function je(t){if(!t.trim().endsWith("%"))return;const e=Number(t.trim().slice(0,-1));return Number.isFinite(e)?qe(e/100,0,1):void 0}function Ue(t,e,i){const r=(t%360+360)%360,s=(1-Math.abs(2*i-1))*e,o=r/60,n=s*(1-Math.abs(o%2-1)),[a,l,c]=o<1?[s,n,0]:o<2?[n,s,0]:o<3?[0,s,n]:o<4?[0,n,s]:o<5?[n,0,s]:[s,0,n],d=i-s/2;return[a,l,c].map(t=>Math.round(255*(t+d)))}function ze(t,e=!0){const i=t.trim(),r=i.toLowerCase();if("transparent"===r)return{rgb:[0,0,0],alpha:0};const s=Ne[r];if(s)return{rgb:s,alpha:1};const o=/^#([\da-f])([\da-f])([\da-f])$/i.exec(i);if(o)return{rgb:o.slice(1).map(t=>Number.parseInt(`${t}${t}`,16)),alpha:1};const n=/^#([\da-f])([\da-f])([\da-f])([\da-f])$/i.exec(i);if(n)return{rgb:n.slice(1,4).map(t=>Number.parseInt(`${t}${t}`,16)),alpha:Number.parseInt(`${n[4]}${n[4]}`,16)/255};const a=/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i.exec(i);if(a)return{rgb:a.slice(1,4).map(t=>Number.parseInt(t,16)),alpha:a[4]?Number.parseInt(a[4],16)/255:1};const l=/^(rgb|rgba|hsl|hsla)\((.*)\)$/i.exec(i);if(l){const{components:t,alpha:e}=function(t){if(t.includes(",")){const e=t.replace(/\s*\/\s*/,",").split(",").map(t=>t.trim()).filter(Boolean);return 4===e.length?{components:e.slice(0,3),alpha:e[3]}:{components:e}}const[e,i]=t.split("/").map(t=>t.trim());return{components:e.split(/\s+/).filter(Boolean),...i?{alpha:i}:{}}}(l[2]),i=function(t){if(void 0===t)return 1;const e=t.trim(),i=Number(e.endsWith("%")?e.slice(0,-1):e);return Number.isFinite(i)?qe(e.endsWith("%")?i/100:i,0,1):void 0}(e);if(3!==t.length||void 0===i)return;if(l[1].toLowerCase().startsWith("rgb")){const e=t.map(Oe);if(e.some(t=>void 0===t))return;return{rgb:e,alpha:i}}const r=function(t){const e=t.trim().toLowerCase(),i=Number(e.replace(/(?:deg|grad|rad|turn)$/,""));if(Number.isFinite(i))return e.endsWith("turn")?360*i:e.endsWith("grad")?.9*i:e.endsWith("rad")?180*i/Math.PI:i}(t[0]),s=je(t[1]),o=je(t[2]);if(void 0===r||void 0===s||void 0===o)return;return{rgb:Ue(r,s,o),alpha:i}}return/^(?:currentcolor|inherit|initial|revert|revert-layer|unset)$/i.test(i)?void 0:e?function(t){const e=t.trim().toLowerCase();if(/^var\(/i.test(e))return;if(Pe.has(e))return Pe.get(e);if("undefined"==typeof document||"function"!=typeof getComputedStyle||!document.documentElement)return;const i=document.createElement("span");if(i.style.color=t,!i.style.color)return;i.hidden=!0,document.documentElement.append(i);const r=getComputedStyle(i).color;i.remove();const s=r&&r.toLowerCase()!==e?ze(r,!1):void 0;if(Pe.size>=64){const t=Pe.keys().next().value;void 0!==t&&Pe.delete(t)}return Pe.set(e,s),s}(i):void 0}function Ie(t){const e=t/255;return e<=.04045?e/12.92:((e+.055)/1.055)**2.4}function Be(t,e="var(--primary-text-color, #111111)"){const i=ze(t);if(!i||i.alpha<.999)return e;const{rgb:r}=i,s=.2126*Ie(r[0])+.7152*Ie(r[1])+.0722*Ie(r[2]);return 1.05/(s+.05)>=(s+.05)/.05?"#FFFFFF":"#000000"}function He(t){return 0===t?"mdi:tram":3===t?"mdi:bus":"mdi:transit-connection-variant"}function Ve(t,e="#03A9F4",i){const r=t.trim().toUpperCase(),s=i?.[r]??Me[r];return s?{background:s.route_color,text:s.route_text_color||Be(s.route_color),icon:He(s.route_type),routeType:s.route_type,known:!0}:{background:`var(--primary-color, ${e})`,text:Be(e),icon:He(),known:!1}}const Ge=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Paris",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}),We={status:"idle",departures:[],isLoading:!1,isStale:!1};function Ke(t,e,i){return Number.isFinite(t)?Math.min(i,Math.max(e,Math.round(t))):e}function Je(t){const e=t?.trim();return e||void 0}function Ze(t,e){return Math.max(0,Math.floor(t/6e4)-Math.floor(e/6e4))}function Ye(t,e,i){const r=function(t){const e=/^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(t.trim());if(!e)return;const i=Number(e[1]),r=Number(e[2]),s=Number(e[3]??0);return i>23||r>59||s>59?void 0:60*i*60+60*r+s}(t),s=function(t){const e=new Map(Ge.formatToParts(new Date(t)).map(t=>[t.type,Number(t.value)])),i=e.get("hour"),r=e.get("minute"),s=e.get("second");if(void 0===i||void 0===r||void 0===s)return;return 60*i*60+60*r+s+(t%1e3+1e3)%1e3/1e3}(e);if(void 0===r||void 0===s)return;const o=r-s;return e+1e3*[o-86400,o,o+86400].reduce((t,e)=>Math.abs(e-i)<Math.abs(t-i)?e:t)}class Qe{constructor(t,e,i={}){this.signature="",this.connected=!1,this.stateValue=We,this.rawDepartures=[],this.aliveDepartureCount=0,this.earlyRefreshRequested=!1,this.lastEarlyRefreshFingerprint="",this.retryNotBefore=0,this.requestGeneration=0,this.visibilityChanged=()=>{if(this.connected)return this.isDocumentHidden()?(this.stopTimers(),this.cancelActiveRequest(),void(this.stateValue.isLoading&&this.updateState({...this.stateValue,isLoading:!1}))):void this.startCycle(!0)},this.host=t,this.client=e,this.cache=i.cache??ye,this.now=i.now??Date.now,this.visibilitySource=null===i.visibilitySource?void 0:i.visibilitySource??("undefined"==typeof document?void 0:document),t.addController(this)}get state(){return this.stateValue}get isConfigured(){return Boolean(this.config?.stop&&this.config.line&&("all_destinations"===this.config.display_mode||this.config.destination))}setConfig(t){const e=t?function(t){return{stop:t.stop.trim(),display_mode:t.display_mode,line:Je(t.line),destination:"destination"===t.display_mode?Je(t.destination):void 0,direction_id:t.direction_id,departures:Ke(t.departures,1,5),departures_per_destination:Ke(t.departures_per_destination,1,3),refresh_interval:Ke(t.refresh_interval,30,300)}}(t):void 0,i=function(t){return t?JSON.stringify([t.stop,t.display_mode,t.line??"",t.destination??"",t.direction_id??"",t.departures,t.departures_per_destination,t.refresh_interval]):""}(e);i!==this.signature&&(this.signature=i,this.config=e,this.stopTimers(),this.cancelActiveRequest(),this.rawDepartures=[],this.aliveDepartureCount=0,this.earlyRefreshRequested=!1,this.lastEarlyRefreshFingerprint="",this.retryNotBefore=0,this.updateState(We),this.connected&&!this.isDocumentHidden()&&this.startCycle())}configure(t){this.setConfig(t)}hostConnected(){this.connected||(this.connected=!0,this.visibilitySource?.addEventListener("visibilitychange",this.visibilityChanged),this.isDocumentHidden()||this.startCycle())}hostDisconnected(){this.connected&&(this.connected=!1,this.visibilitySource?.removeEventListener("visibilitychange",this.visibilityChanged),this.stopTimers(),this.cancelActiveRequest(),this.stateValue.isLoading&&this.updateState({...this.stateValue,isLoading:!1}))}refresh(t={}){if(!this.canRun())return Promise.resolve();if(this.requestPromise)return this.requestPromise;const e=this.config,i={stop:e.stop,line:e.line,destination:e.destination,direction_id:e.direction_id,all_destinations:"all_destinations"===e.display_mode,departures:5},r=this.requestGeneration+1;this.requestGeneration=r;const s=this.cache.acquireDepartures(i,t=>this.client.getDepartures(i,{signal:t}),{forceRefresh:t.force??!1});this.requestLease=s,0===this.stateValue.departures.length?this.updateState({...this.stateValue,status:"loading",isLoading:!0,error:void 0}):this.updateState({...this.stateValue,isLoading:!0});const o=s.promise.then(t=>{this.isCurrentRequest(r)&&this.applySnapshot(t)}).catch(t=>{this.isCurrentRequest(r)&&this.applyError(t)}).finally(()=>{s.release(),this.requestLease===s&&(this.requestLease=void 0),this.requestGeneration===r&&(this.requestPromise=void 0,this.earlyRefreshRequested&&this.canRun()&&(this.earlyRefreshRequested=!1,queueMicrotask(()=>{this.refresh({force:!0})})))});return this.requestPromise=o,o}startCycle(t=!1){this.stopTimers(),this.canRun()&&(this.tickTimer=setInterval(()=>this.tick(),1e3),this.tick(),this.scheduleRefresh(),this.refresh({force:t}))}scheduleRefresh(){if(!this.canRun()||!this.config)return;void 0!==this.refreshTimer&&clearTimeout(this.refreshTimer);const t=Math.max(0,this.retryNotBefore-this.now()),e=Math.max(1e3*this.config.refresh_interval,t);this.refreshTimer=setTimeout(()=>{this.refreshTimer=void 0,this.refresh().finally(()=>this.scheduleRefresh())},e)}stopTimers(){void 0!==this.refreshTimer&&(clearTimeout(this.refreshTimer),this.refreshTimer=void 0),void 0!==this.tickTimer&&(clearInterval(this.tickTimer),this.tickTimer=void 0)}cancelActiveRequest(){this.requestGeneration+=1,this.requestLease?.release(),this.requestLease=void 0,this.requestPromise=void 0}applySnapshot(t){this.rawDepartures=t.value.map(e=>this.normalizePrediction(e,t.fetchedAt)).filter(t=>void 0!==t).sort((t,e)=>t.predicted_at-e.predicted_at).slice(0,"all_destinations"===this.config?.display_mode?100:5),this.aliveDepartureCount=this.countActiveRows(this.now()),this.earlyRefreshRequested=!1,t.stale?this.applyRetryAfter(t.error):(this.retryNotBefore=0,this.scheduleRefresh()),this.rawDepartures.length>0&&0===this.aliveDepartureCount?this.requestEarlyRefresh():this.aliveDepartureCount>0&&(this.lastEarlyRefreshFingerprint="");const e=this.liveDepartures(this.now());this.updateState({status:e.length>0?"ready":"empty",departures:e,isLoading:!1,isStale:t.stale,error:t.error,fetchedAt:t.fetchedAt,expiresAt:t.expiresAt})}applyError(t){this.earlyRefreshRequested=!1,this.applyRetryAfter(t),this.rawDepartures.length>0?this.updateState({...this.stateValue,status:this.stateValue.departures.length>0?"ready":"empty",isLoading:!1,isStale:!0,error:t}):this.updateState({status:"error",departures:[],isLoading:!1,isStale:!1,error:t})}tick(){if(!this.canRun())return;const t=this.now(),e=this.countActiveRows(t),i=e<this.aliveDepartureCount;if(this.aliveDepartureCount=e,this.rawDepartures.length>0){const e=this.liveDepartures(t);this.updateState({...this.stateValue,status:e.length>0?"ready":"empty",departures:e})}i&&this.requestEarlyRefresh()}requestEarlyRefresh(){if(this.retryNotBefore>this.now())return;const t=this.rawDepartures.map(t=>t.course_sae??[t.route_short_name,t.trip_headsign,t.direction_id??"",t.departure_time??""].join("\0")).join("");t&&t!==this.lastEarlyRefreshFingerprint&&(this.lastEarlyRefreshFingerprint=t,this.earlyRefreshRequested=!0,this.requestPromise||this.refresh({force:!0}))}applyRetryAfter(t){if(!(t instanceof bt&&"rate-limit"===t.code&&t.retryAfter))return;const e=Number(t.retryAfter),i=Number.isFinite(e)?this.now()+1e3*Math.max(0,e):Date.parse(t.retryAfter);Number.isFinite(i)&&(this.retryNotBefore=Math.max(this.retryNotBefore,i),this.scheduleRefresh())}normalizePrediction(t,e){const i=Number(t.delay_sec),r=Number(t.predicted_at),s=(t.departure_time?Ye(t.departure_time,e,i):void 0)??(Number.isFinite(r)?r:e+1e3*i);if(Number.isFinite(i)&&!(i<0)&&Number.isFinite(s))return{...t,delay_sec:i,predicted_at:s}}liveDepartures(t){const e=this.rawDepartures.filter(e=>e.predicted_at>t);return("all_destinations"===this.config?.display_mode?this.departuresPerDestination(e,this.config.departures_per_destination):e.slice(0,this.config?.departures??0)).map(e=>{const i=Math.ceil((e.predicted_at-t)/1e3);return{...e,remainingSeconds:i,remainingMinutes:Ze(e.predicted_at,t),isApproaching:i<=120}})}departuresPerDestination(t,e){const i=new Map,r=[];for(const s of t){const t=s.trip_headsign.normalize("NFKC").toLocaleUpperCase("fr-FR"),o=i.get(t)??0;o>=e||(i.set(t,o+1),r.push(s))}return r}countActiveRows(t){const e=this.rawDepartures.filter(e=>e.predicted_at>t);return"all_destinations"===this.config?.display_mode?this.departuresPerDestination(e,this.config.departures_per_destination).length:e.length}canRun(){return this.connected&&this.isConfigured&&!this.isDocumentHidden()}isCurrentRequest(t){return this.canRun()&&this.requestGeneration===t}isDocumentHidden(){return Boolean(this.visibilitySource?.hidden||"hidden"===this.visibilitySource?.visibilityState)}updateState(t){this.stateValue=t,this.host.requestUpdate()}}function Xe(t,e){const i="auto"===t.background_color?e?.background:t.background_color,r="auto"===t.text_color?"auto"===t.background_color?e?.text:i?Be(i):void 0:t.text_color,s={};return i&&(s["--tam-background"]=i),r&&(s["--tam-text"]=r),i&&r&&!function(t){const e=ze(t);return void 0!==e&&e.alpha<.999}(i)&&(s["--tam-badge-background"]=r,s["--tam-badge-text"]=i),s}const ti=(t,e)=>0===t.localeCompare(e,"fr",{sensitivity:"base"});let ei=class extends at{constructor(){super(...arguments),this.configIssues=[],this.resolvingLine=!1,this.language="fr",this.data=new Qe(this,zt),this.routeStyles=new Le(this),this.themeSignature="",this.themePrimaryColor="#03A9F4",this.resolutionGeneration=0,this.retry=()=>{this.data.refresh({force:!0})}}static getConfigElement(){return document.createElement(pe)}static getStubConfig(){return{}}get hass(){return this.hassValue}set hass(t){this.hassValue=t;const e=t,i=e?.language??"fr",r=JSON.stringify([e?.themes?.theme??"",e?.themes?.darkMode??!1]);i!==this.language&&(this.language=i),r!==this.themeSignature&&(this.themeSignature=r,queueMicrotask(()=>this.updateThemeColor()))}setConfig(t){const e=ae(t),i=e.errors.filter(t=>"invalid-config"===t.code||"invalid-type"===t.code);if(i.length)throw new ne(i.map(t=>t.message).join(" "),i);var r;this.cancelLineResolution(),this.config=e.config,this.configError=void 0,this.configIssues=e.errors.map(t=>t.code),this.resolvingLine=!1,this.toggleAttribute("compact",e.config.compact),r=e.config,Boolean(r.stop&&r.line&&("all_destinations"===r.display_mode||r.destination))?this.data.setConfig(e.config):(this.data.setConfig(null),le(e.config)&&this.isConnected&&this.resolveLegacyLine(e.config))}connectedCallback(){super.connectedCallback(),this.updateThemeColor(),this.config&&le(this.config)&&this.resolveLegacyLine(this.config)}disconnectedCallback(){this.cancelLineResolution(),super.disconnectedCallback()}getCardSize(){return"all_destinations"===this.config?.display_mode?Math.max(3,2+this.groupDeparturesByDestination(this.data.state.departures).length):2}getGridOptions(){return{columns:12,min_columns:"all_destinations"===this.config?.display_mode?6:3}}render(){if(!this.config||!this.config.stop||"destination"===this.config.display_mode&&!this.config.destination)return this.renderMessage("mdi:tune-variant",we("card.incomplete_title",this.language),this.incompleteConfigurationDetail());if(this.resolvingLine)return this.renderLoading(we("editor.loading_lines",this.language));if(this.configError)return this.renderMessage("mdi:alert-circle-outline",we("card.configuration_error",this.language),this.configurationErrorDetail(this.configError));if(!this.config.line)return this.renderMessage("mdi:tune-variant",we("card.incomplete_title",this.language),this.incompleteConfigurationDetail());const t=this.data.state;return"idle"===t.status||"loading"===t.status&&0===t.departures.length?this.renderLoading(we("card.loading",this.language)):"error"===t.status?this.renderDataError(t.error):"empty"===t.status||0===t.departures.length?t.isStale?this.renderMessage("mdi:clock-alert-outline",we("card.stale",this.language),we("card.stale_detail",this.language)):this.renderMessage("mdi:clock-outline",we("card.no_departures_title",this.language),we("card.no_departures_detail",this.language)):this.renderDepartures(t.departures,t.isStale,t.isLoading)}renderDepartures(t,e,i){return"all_destinations"===this.config?.display_mode?this.renderAllDestinations(t,e,i):this.renderDestinationDepartures(t,e,i)}renderDestinationDepartures(t,e,i){const r=this.config,s=Ve(r.line,this.themePrimaryColor,this.routeStyles.styles),o=t[0]?.isApproaching??!1,n=this.departureSourceLabel(t),a=[n,...e?[we("card.stale",this.language)]:[],...o?[we("card.approaching",this.language)]:[]].join(". "),l=we("card.line_label",this.language,{line:r.line}),c=t.map(t=>this.departureAccessibilityLabel(t)).join(", "),d=Xe(r,s),h=r.show_icon||r.show_line;return B`
      <ha-card
        class=${o?"approaching":""}
        style=${yt(d)}
        tabindex="0"
        aria-label=${`${we("card.label",this.language)}. ${l}. ${r.stop} → ${r.destination}. ${c}. ${a}`}
      >
        <div class=${h?"layout":"layout without-identity"}>
          ${h?B`
                  <div class="identity" aria-label=${l}>
                    ${r.show_icon?B`<ha-icon class="mode-icon" .icon=${s.icon} aria-hidden="true"></ha-icon>`:V}
                    ${r.show_line?B`<span class="line-badge">${r.line}</span>`:V}
                  </div>
                `:V}

          <div class="journey" title=${`${r.stop} → ${r.destination}`}>
            <span class="stop">${r.stop}</span>
            <span class="arrow" aria-hidden="true">→</span>
            <span class="destination">${r.destination}</span>
          </div>

          <div class="departures" aria-label=${we("card.label",this.language)}>
            ${t.map(t=>this.renderDeparture(t))}
          </div>
        </div>

        <div class="metadata" aria-hidden="true">
          ${o?B`<span class="approaching-dot"></span>`:V}
          ${o?B`<span class="status-badge approaching-badge">${we("card.approaching",this.language)}</span>`:V}
          ${e?B`<span class="status-badge">${we("card.stale",this.language)}</span>`:V}
          ${i?B`<span class="status-badge">↻</span>`:V}
          ${r.show_realtime_badge?B`<span class="status-badge">${n}</span>`:V}
        </div>
      </ha-card>
    `}renderAllDestinations(t,e,i){const r=this.config,s=Ve(r.line,this.themePrimaryColor,this.routeStyles.styles),o=t.some(t=>t.isApproaching),n=this.groupDeparturesByDestination(t),a=this.departureSourceLabel(t),l=we("card.line_label",this.language,{line:r.line}),c=void 0===r.direction_id?we("card.all_directions",this.language):we("card.direction_label",this.language,{direction:r.direction_id}),d=we(1===n.length?"card.destination_count_one":"card.destination_count",this.language,{count:n.length}),h=n.map(t=>`${t.destination}, ${t.departures.map(t=>this.departureAccessibilityLabel(t)).join(", ")}`).join(". "),u=[a,...e?[we("card.stale",this.language)]:[],...o?[we("card.approaching",this.language)]:[]].join(". "),p=Xe(r,s),g=r.show_icon||r.show_line;return B`
      <ha-card
        class=${o?"overview-card approaching":"overview-card"}
        style=${yt(p)}
        tabindex="0"
        aria-label=${`${we("card.label",this.language)}. ${l}. ${r.stop}. ${d}. ${c}. ${h}. ${u}`}
      >
        <div class=${g?"overview-header":"overview-header without-identity"}>
          ${g?B`
                  <div class="identity" aria-label=${l}>
                    ${r.show_icon?B`<ha-icon class="mode-icon" .icon=${s.icon} aria-hidden="true"></ha-icon>`:V}
                    ${r.show_line?B`<span class="line-badge">${r.line}</span>`:V}
                  </div>
                `:V}
          <div class="overview-heading">
            <span class="stop">${r.stop}</span>
            <span class="overview-summary">
              ${we("card.all_destinations",this.language)} · ${c}
            </span>
          </div>
        </div>

        <ul class="destination-list" role="list">
          ${n.map(t=>this.renderDestinationRow(t))}
        </ul>

        <div class="metadata" aria-hidden="true">
          ${o?B`<span class="approaching-dot"></span>`:V}
          ${o?B`<span class="status-badge approaching-badge">${we("card.approaching",this.language)}</span>`:V}
          ${e?B`<span class="status-badge">${we("card.stale",this.language)}</span>`:V}
          ${i?B`<span class="status-badge">↻</span>`:V}
          ${r.show_realtime_badge?B`<span class="status-badge">${a}</span>`:V}
        </div>
      </ha-card>
    `}renderDestinationRow(t){const e=t.departures.some(t=>t.isApproaching);return B`
      <li class=${e?"destination-row has-approaching":"destination-row"}>
        <span class="destination-name" title=${t.destination}>
          <span class="arrow" aria-hidden="true">→</span>
          <span>${t.destination}</span>
        </span>
        <span class="destination-times">
          ${t.departures.map(t=>this.renderDestinationTime(t))}
        </span>
      </li>
    `}renderDestinationTime(t){return B`
      <span class=${t.isApproaching?"destination-time approaching-departure":"destination-time"}>
        <span class="time">${this.departureTimeLabel(t)}</span>
        ${this.config?.show_absolute_time&&t.departure_time?B`<span class="absolute">${this.formatAbsoluteTime(t.departure_time)}</span>`:V}
      </span>
    `}groupDeparturesByDestination(t){const e=new Map;for(const i of t){const t=i.trip_headsign.normalize("NFKC").toLocaleUpperCase("fr-FR"),r=e.get(t);r?r.departures.push(i):e.set(t,{destination:i.trip_headsign,departures:[i]})}return[...e.values()]}renderDeparture(t){const e=this.departureTimeLabel(t);return B`
      <div class=${t.isApproaching?"departure approaching-departure":"departure"}>
        <span class="time">${e}</span>
        ${this.config?.show_absolute_time&&t.departure_time?B`<span class="absolute">${this.formatAbsoluteTime(t.departure_time)}</span>`:V}
      </div>
    `}departureTimeLabel(t){return t.isApproaching?we("card.approaching",this.language):this.formatRemainingTime(t.remainingMinutes)}departureAccessibilityLabel(t){const e=this.departureTimeLabel(t);return this.config?.show_absolute_time&&t.departure_time?`${e}, ${this.formatAbsoluteTime(t.departure_time)}`:e}renderLoading(t){return B`
      <ha-card style=${yt(this.currentColorVariables())} aria-label=${t} aria-busy="true">
        <div class="message-layout">
          <ha-icon icon="mdi:tram" aria-hidden="true"></ha-icon>
          <div>
            <span class="skeleton"></span>
            <span class="skeleton"></span>
          </div>
        </div>
      </ha-card>
    `}renderDataError(t){let e=we("card.api_unavailable",this.language),i="mdi:cloud-alert-outline";return t instanceof bt&&("rate-limit"===t.code&&(e=we("card.rate_limited",this.language)),"offline"===t.code&&(e=we("card.offline",this.language),i="mdi:wifi-off")),this.renderMessage(i,we("card.error_title",this.language),e,!0)}renderMessage(t,e,i,r=!1){return B`
      <ha-card style=${yt(this.currentColorVariables())} tabindex="0" aria-label=${`${e}. ${i}`}>
        <div class="message-layout">
          <ha-icon .icon=${t} aria-hidden="true"></ha-icon>
          <div>
            <div class="message-title">${e}</div>
            <div class="message-detail">${i}</div>
            ${r?B`<button class="retry" type="button" @click=${this.retry}>
                    ${we("common.retry",this.language)}
                  </button>`:V}
          </div>
        </div>
      </ha-card>
    `}currentColorVariables(){if(!this.config)return{};const t=this.config.line?Ve(this.config.line,this.themePrimaryColor,this.routeStyles.styles):void 0;return Xe(this.config,t)}departureSourceLabel(t){const e=t.filter(t=>t.is_theorical).length;return 0===e?we("card.realtime",this.language):e===t.length?we("card.theoretical",this.language):we("card.mixed",this.language)}configurationErrorDetail(t){return t instanceof ce?we("ambiguous-line"===t.code?"card.ambiguous_line":"card.line_not_found",this.language,{lines:t.candidates.join(", ")}):t instanceof bt?we("editor.catalog_error",this.language):t.message}incompleteConfigurationDetail(){const t=this.configIssues.map(t=>we("missing-stop"===t?"card.missing_stop":"missing-line"===t?"card.missing_line":"missing-destination"===t?"card.missing_destination":"card.incomplete_detail",this.language));return[...new Set(t)].join(" ")||we("card.incomplete_detail",this.language)}formatRemainingTime(t){if(t<=0)return we("card.now",this.language);if(t<60)return`${t} ${we("common.minutes",this.language)}`;const e=Math.floor(t/60);return we("common.hour_minutes",this.language,{hours:e,minutes:t%60})}formatAbsoluteTime(t){const e=/^(\d{1,2}):(\d{2})/.exec(t.trim());return e?`${e[1].padStart(2,"0")}:${e[2]}`:t}async resolveLegacyLine(t){if(!t.stop||!t.destination||t.line)return;this.cancelLineResolution();const e=this.resolutionGeneration;this.resolvingLine=!0,this.configError=void 0,this.requestUpdate();const i=ye.acquireCatalog("journeys",[t.stop],e=>zt.listJourneysForStop(t.stop,{signal:e}));this.lineResolutionLease=i;try{const r=(await i.promise).value.filter(e=>ti(e.destination,t.destination??"")&&(void 0===t.direction_id||e.direction_id===t.direction_id));if(e!==this.resolutionGeneration||!this.isConnected)return;const s=((t,e)=>t.line?t:{...t,line:de(e,t)})(t,r.map(t=>t.line)),o=r.find(t=>ti(t.line,s.line??""));this.config={...s,...o?{destination:o.destination}:{},...void 0===t.direction_id||void 0===o?.direction_id?{}:{direction_id:o.direction_id}},this.configIssues=[],this.data.setConfig(this.config)}catch(t){if(e!==this.resolutionGeneration||!this.isConnected)return;this.data.setConfig(null),this.configError=t instanceof Error?t:new ce("line-not-found",String(t),[])}finally{i.release(),this.lineResolutionLease===i&&(this.lineResolutionLease=void 0),e===this.resolutionGeneration&&(this.resolvingLine=!1,this.requestUpdate())}}cancelLineResolution(){this.resolutionGeneration+=1,this.lineResolutionLease?.release(),this.lineResolutionLease=void 0}updateThemeColor(){if(!this.isConnected||"function"!=typeof getComputedStyle)return;const t=getComputedStyle(this).getPropertyValue("--primary-color").trim();t&&t!==this.themePrimaryColor&&(this.themePrimaryColor=t,this.requestUpdate())}static{this.styles=xe}};t([pt()],ei.prototype,"config",void 0),t([pt()],ei.prototype,"configError",void 0),t([pt()],ei.prototype,"configIssues",void 0),t([pt()],ei.prototype,"resolvingLine",void 0),t([pt()],ei.prototype,"language",void 0),ei=t([ct(ue)],ei),window.customCards=window.customCards??[],window.customCards.some(t=>t.type===ue)||window.customCards.push({type:ue,name:"TAM Card",description:"Prochains passages TaM à Montpellier via Hérault Data",documentationURL:"https://github.com/MathisAlepis/lovelace-tam-card",preview:!0}),console.info("%c TAM Card %c v4.1.0 ","color:#fff;background:#005ca9;font-weight:700;border-radius:3px 0 0 3px;padding:2px 5px","color:#005ca9;background:#eef6fb;border-radius:0 3px 3px 0;padding:2px 5px");export{ei as TamCard};
