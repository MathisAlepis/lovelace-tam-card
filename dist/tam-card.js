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
function e(e,t,i,r){var o,s=arguments.length,n=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(n=(s<3?o(n):s>3?o(t,i,n):o(t,i))||n);return s>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=o.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new s(i,e,r)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,r))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:u,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",_=g.reactiveElementPolyfillSupport,y=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},v=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&c(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const s=r?.call(this);o?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...u(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,r)=>{if(i)e.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of r){const r=document.createElement("style"),o=t.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=i.cssText,e.appendChild(r)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=r;const s=o.fromAttribute(t,e.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(e,t,i,r=!1,o){if(void 0!==e){const s=this.constructor;if(!1===r&&(o=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??v)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:o},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==o||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,_?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=e=>e,C=w.trustedTypes,S=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,F="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+E,L=`<${k}>`,M=document,N=()=>M.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,D="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,q=/-->/g,O=/>/g,U=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,z=/"/g,I=/^(?:script|style|textarea|title)$/i,H=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),V=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),W=new WeakMap,K=M.createTreeWalker(M,129);function J(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,r=[];let o,s=2===t?"<svg>":3===t?"<math>":"",n=P;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===P?"!--"===l[1]?n=q:void 0!==l[1]?n=O:void 0!==l[2]?(I.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=o??P,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?U:'"'===l[3]?z:j):n===z||n===j?n=U:n===q||n===O?n=P:(n=U,o=void 0);const u=n===U&&e[t+1].startsWith("/>")?" ":"";s+=n===P?i+L:c>=0?(r.push(a),i.slice(0,c)+F+i.slice(c)+E+u):i+E+(-2===c?t:u)}return[J(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class Z{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let o=0,s=0;const n=e.length-1,a=this.parts,[l,c]=G(e,t);if(this.el=Z.createElement(l,i),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=K.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(F)){const t=c[s++],i=r.getAttribute(e).split(E),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?te:"?"===n[1]?ie:"@"===n[1]?re:ee}),r.removeAttribute(e)}else e.startsWith(E)&&(a.push({type:6,index:o}),r.removeAttribute(e));if(I.test(r.tagName)){const e=r.textContent.split(E),t=e.length-1;if(t>0){r.textContent=C?C.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],N()),K.nextNode(),a.push({type:2,index:++o});r.append(e[t],N())}}}else if(8===r.nodeType)if(r.data===k)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=r.data.indexOf(E,e+1));)a.push({type:7,index:o}),e+=E.length-1}o++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,r){if(t===V)return t;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const s=R(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(e),o._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(t=Y(e,o._$AS(e,t.values),o,r)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??M).importNode(t,!0);K.currentNode=r;let o=K.nextNode(),s=0,n=0,a=i[0];for(;void 0!==a;){if(s===a.index){let t;2===a.type?t=new X(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new oe(o,this,e)),this._$AV.push(t),a=i[++n]}s!==a?.index&&(o=K.nextNode(),s++)}return K.currentNode=M,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),R(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Z.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new Q(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Z(e)),t}k(e){T(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const o of e)r===t.length?t.push(i=new X(this.O(N()),this.O(N()),this,this.options)):i=t[r],i._$AI(o),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(e,t=this,i,r){const o=this.strings;let s=!1;if(void 0===o)e=Y(this,e,t,0),s=!R(e)||e!==this._$AH&&e!==V,s&&(this._$AH=e);else{const r=e;let n,a;for(e=o[0],n=0;n<o.length-1;n++)a=Y(this,r[i+n],t,n),a===V&&(a=this._$AH[n]),s||=!R(a)||a!==this._$AH[n],a===B?e=B:e!==B&&(e+=(a??"")+o[n+1]),this._$AH[n]=a}s&&!r&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class re extends ee{constructor(e,t,i,r,o){super(e,t,i,r,o),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??B)===V)return;const i=this._$AH,r=e===B&&i!==B||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==B&&(i===B||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const se=w.litHtmlPolyfillSupport;se?.(Z,X),(w.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ae=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let o=r._$litPart$;if(void 0===o){const e=i?.renderBefore??null;r._$litPart$=o=new X(t.insertBefore(N(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};ae._$litElement$=!0,ae.finalized=!0,ne.litElementHydrateSupport?.({LitElement:ae});const le=ne.litElementPolyfillSupport;le?.({LitElement:ae}),(ne.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},de={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:v},ue=(e=de,t,i)=>{const{kind:r,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===r){const{name:r}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(r,o,e,!0,i)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=i;return function(i){const o=this[r];t.call(this,i),this.requestUpdate(r,o,e,!0,i)}}throw Error("Unsupported decorator location: "+r)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function he(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const r=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),r?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pe(e){return he({...e,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ge=1;let me=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const fe="important",_e=" !"+fe,ye=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends me{constructor(e){if(super(e),e.type!==ge||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const r=e[i];return null==r?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const r=t[e];if(null!=r){this.ft.add(e);const t="string"==typeof r&&r.endsWith(_e);e.includes("-")||t?i.setProperty(e,t?r.slice(0,-11):r,t?fe:""):i[e]=r}}return V}});class be extends Error{constructor(e,t,i={}){super(t),this.name="HeraultApiError",this.code=e,this.status=i.status,this.retryAfter=i.retryAfter,this.cause=i.cause,Object.setPrototypeOf(this,new.target.prototype)}}const ve="https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/tam_mmm_tpsreel/records",$e=2e4,xe=["stop_name","route_short_name","trip_headsign","direction_id","departure_time","is_theorical","delay_sec","course_sae","stop_coordinates"],we=e=>`"${e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replaceAll("\0","\\0").replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")}"`,Ae=(e,t)=>{if(!/^[A-Za-z_][A-Za-z0-9_]*$/.test(e))throw new TypeError("Invalid ODSQL field name.");const i=t.trim();return`lower(${e}) = ${we(i.toLocaleLowerCase("fr-FR"))}`},Ce=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/,Se=e=>{const t=e.trim();return Ce.test(t)&&Number.isFinite(Number(t))?t:we(t)},Fe=e=>"object"==typeof e&&null!==e&&!Array.isArray(e),Ee=(e,t=!1)=>{if("string"==typeof e){return e.trim()||void 0}if(t&&"number"==typeof e&&Number.isFinite(e))return String(e)},ke=e=>{if("number"==typeof e)return Number.isFinite(e)?e:void 0;if("string"!=typeof e||!e.trim())return;const t=Number(e);return Number.isFinite(t)?t:void 0},Le=e=>{const t=ke(e);return 0===t||1===t?t:void 0},Me=e=>{if("boolean"==typeof e)return e;if("number"==typeof e)return 0!==e;if("string"==typeof e)switch(e.trim().toLowerCase()){case"0":case"false":return!1;default:return!0}return!0},Ne=(e,t)=>{if(!Fe(e))return;const i=Ee(e.stop_name),r=Ee(e.route_short_name,!0),o=Ee(e.trip_headsign),s=ke(e.delay_sec);if(!i||!r||!o||void 0===s||s<0)return;const n={stop_name:i,route_short_name:r,trip_headsign:o,is_theorical:Me(e.is_theorical),delay_sec:s,predicted_at:t+1e3*s},a=Le(e.direction_id);void 0!==a&&(n.direction_id=a);const l=Ee(e.departure_time,!0);l&&(n.departure_time=l);const c=Ee(e.course_sae,!0);c&&(n.course_sae=c);const d=(e=>{let t,i;if(Fe(e)?(t=ke(e.lat??e.latitude),i=ke(e.lon??e.lng??e.longitude)):Array.isArray(e)&&e.length>=2&&(i=ke(e[0]),t=ke(e[1])),void 0!==t&&void 0!==i&&(e=>e>=-90&&e<=90)(t)&&(e=>e>=-180&&e<=180)(i))return{lat:t,lon:i}})(e.stop_coordinates);return d&&(n.stop_coordinates=d),n},Re=e=>{if(!Fe(e)||!Array.isArray(e.results))throw new be("invalid-response","La réponse Hérault Data ne contient pas de liste de résultats valide.");return e.results},Te=(e,t)=>e.localeCompare(t,"fr",{numeric:!0,sensitivity:"base"}),De=e=>{const t=new Map;for(const i of e){const e=i.normalize("NFKC").toLocaleUpperCase("fr-FR");t.has(e)||t.set(e,i)}return[...t.values()].sort(Te)},Pe=e=>[e.stop_name,e.route_short_name,e.trip_headsign,e.direction_id??"",e.departure_time??e.delay_sec].join("\0"),qe=e=>{const t=ke(e);return void 0===t?2:Math.min(5,Math.max(1,Math.trunc(t)))},Oe=(e,t,i)=>((e,t)=>{const i=e.filter(e=>Number.isFinite(e.delay_sec)&&e.delay_sec>=0).slice().sort((e,t)=>e.delay_sec-t.delay_sec),r=new Set,o=[];for(const e of i){const i=e.course_sae?`course:${e.course_sae}`:`fallback:${Pe(e)}`;if(!r.has(i)&&(r.add(i),o.push(e),o.length>=qe(t)))break}return o})(Re(e).map(e=>Ne(e,t)).filter(e=>void 0!==e),i),Ue=(e,t)=>"function"!=typeof globalThis.fetch?Promise.reject(new TypeError("Fetch API is not available.")):globalThis.fetch(e,t),je=()=>"undefined"==typeof navigator||!1!==navigator.onLine;const ze=new class{constructor(e={}){this.baseUrl=e.baseUrl??ve,this.timeoutMs=void 0!==e.timeoutMs&&Number.isFinite(e.timeoutMs)&&e.timeoutMs>0?e.timeoutMs:1e4,this.fetchImpl=e.fetch??Ue,this.now=e.now??Date.now,this.isOnline=e.isOnline??je}async listStops(e={}){return(e=>{const t=Re(e).map(e=>Fe(e)?Ee(e.stop_name):void 0).filter(e=>void 0!==e);return De(t)})(await this.request(new URLSearchParams({select:"stop_name",group_by:"stop_name",order_by:"stop_name ASC",limit:String($e)}),e))}async listLinesForStop(e,t={}){const i=await this.request((e=>new URLSearchParams({select:"route_short_name",where:Ae("stop_name",e),group_by:"route_short_name",order_by:"route_short_name ASC",limit:String($e)}))(e),t);return(e=>{const t=Re(e).map(e=>Fe(e)?Ee(e.route_short_name,!0):void 0).filter(e=>void 0!==e);return De(t)})(i)}async listJourneysForStop(e,t={}){const i=await this.request((e=>new URLSearchParams({select:"route_short_name,trip_headsign,direction_id",where:Ae("stop_name",e),group_by:"route_short_name,trip_headsign,direction_id",order_by:"route_short_name ASC,trip_headsign ASC",limit:String($e)}))(e),t);return(e=>{const t=[],i=new Set;for(const r of Re(e)){if(!Fe(r))continue;const e=Ee(r.route_short_name,!0),o=Ee(r.trip_headsign);if(!e||!o)continue;const s=Le(r.direction_id),n=[e,o,s??""].map(e=>String(e).normalize("NFKC").toLocaleUpperCase("fr-FR")).join("\0");i.has(n)||(i.add(n),t.push({line:e,destination:o,...void 0===s?{}:{direction_id:s}}))}return t.sort((e,t)=>Te(e.line,t.line)||Te(e.destination,t.destination)||(e.direction_id??-1)-(t.direction_id??-1))})(i)}async listDestinations(e,t,i={}){const r=await this.request(((e,t)=>new URLSearchParams({select:"trip_headsign,direction_id",where:[Ae("stop_name",e),`route_short_name = ${Se(t)}`].join(" AND "),group_by:"trip_headsign,direction_id",order_by:"trip_headsign ASC",limit:String($e)}))(e,t),i);return(e=>{const t=[],i=new Set;for(const r of Re(e)){if(!Fe(r))continue;const e=Ee(r.trip_headsign);if(!e)continue;const o=Le(r.direction_id),s=`${e.normalize("NFKC").toLocaleUpperCase("fr-FR")}\0${o??""}`;i.has(s)||(i.add(s),t.push({destination:e,...void 0===o?{}:{direction_id:o}}))}return t.sort((e,t)=>Te(e.destination,t.destination)||(e.direction_id??-1)-(t.direction_id??-1))})(r)}async getDepartures(e,t={}){const i=await this.request((e=>{const t=[Ae("stop_name",e.stop),`route_short_name = ${Se(e.line)}`];return 0!==e.direction_id&&1!==e.direction_id||t.push(`direction_id = ${e.direction_id}`),e.destination?.trim()&&t.push(Ae("trip_headsign",e.destination)),t.push("delay_sec >= 0"),new URLSearchParams({select:xe.join(","),where:t.join(" AND "),order_by:"delay_sec ASC",limit:String(5)})})(e),t);return Oe(i,this.now(),e.departures)}async request(e,t){if(t.signal?.aborted)throw new be("aborted","La requête a été annulée.");if(!this.isOnline())throw new be("offline","Le navigateur est actuellement hors connexion.");const i=new AbortController;let r=!1,o=!1;const s=()=>{o=!0,i.abort()};t.signal?.addEventListener("abort",s,{once:!0});const n=globalThis.setTimeout(()=>{r=!0,i.abort()},this.timeoutMs);try{let s;try{s=await this.fetchImpl(((e,t=ve)=>{const i=new URL(t);return i.search=e.toString(),i.toString()})(e,this.baseUrl),{headers:{Accept:"application/json"},signal:i.signal})}catch(e){throw this.classifyTransportError(e,r,o||!0===t.signal?.aborted)}if(429===s.status)throw new be("rate-limit","Hérault Data limite temporairement le nombre de requêtes.",{status:s.status,retryAfter:s.headers.get("Retry-After")??void 0});if(!s.ok)throw new be("http",`Hérault Data a répondu avec le statut HTTP ${s.status}.`,{status:s.status});try{return await s.json()}catch(e){if(r||o||t.signal?.aborted)throw this.classifyTransportError(e,r,o||!0===t.signal?.aborted);throw new be("invalid-json","Hérault Data a renvoyé un document JSON invalide.",{cause:e})}}finally{globalThis.clearTimeout(n),t.signal?.removeEventListener("abort",s)}}classifyTransportError(e,t,i){return t?new be("timeout",`Hérault Data n'a pas répondu sous ${this.timeoutMs/1e3} secondes.`,{cause:e}):i?new be("aborted","La requête a été annulée.",{cause:e}):this.isOnline()?new be("network","Impossible de joindre Hérault Data.",{cause:e}):new be("offline","Le navigateur est actuellement hors connexion.",{cause:e})}},Ie="custom:tam-card",He=Object.freeze({departures:2,refresh_interval:60,background_color:"auto",text_color:"auto",show_line:!0,show_realtime_badge:!0,show_absolute_time:!1,compact:!1}),Ve=new Set("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent currentcolor inherit initial revert revert-layer unset".split(" ")),Be=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/,We=/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i,Ke=/^var\(\s*--[\w-]+(?:\s*,[\s\S]+)?\)$/,Je=(e,t,i=100)=>{const r=e.trim();if(r.endsWith("%")){const e=r.slice(0,-1);return Be.test(e)&&Number(e)>=0&&Number(e)<=i}return Be.test(r)&&Number(r)>=0&&Number(r)<=t},Ge=e=>Je(e,1,100),Ze=e=>{const t=e.includes(","),i=e.replace(/\//g,t?",":" ");return(t?i.split(","):i.split(/\s+/)).map(e=>e.trim()).filter(Boolean)},Ye=(e,t)=>{const i=Ze(t);return(3===i.length||4===i.length)&&((e=>{const t=e.replace(/(?:deg|grad|rad|turn)$/i,"");return Be.test(t)})(i[0])&&i[1].endsWith("%")&&Je(i[1],100)&&i[2].endsWith("%")&&Je(i[2],100)&&(void 0===i[3]||Ge(i[3]))&&("hsl"===e||4===i.length))},Qe=e=>{const t=e.trim().toLowerCase();if(!t||/[;{}]/.test(t))return!1;if(We.test(t)||Ve.has(t)||Ke.test(t))return!0;const i=/^(rgb|rgba|hsl|hsla)\((.*)\)$/.exec(t);if(!i)return!1;const[,r,o]=i;return r.startsWith("rgb")?((e,t)=>{const i=Ze(t);return(3===i.length||4===i.length)&&i.slice(0,3).every(e=>Je(e,255))&&(void 0===i[3]||Ge(i[3]))&&("rgb"===e||4===i.length)})(r,o):Ye(r,o)},Xe=(e,t)=>{if("string"!=typeof e||!e.trim())return!1;if(/[;{}]/.test(e))return!1;const i=t??(()=>{if("function"==typeof globalThis.CSS?.supports)return globalThis.CSS.supports.bind(globalThis.CSS)})();if(i)try{return i("color",e.trim())}catch{return!1}return Qe(e)},et=e=>"string"!=typeof e?"":e.trim(),tt=(e,t,i,r)=>{const o="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):Number.NaN;return Number.isFinite(o)?Math.min(r,Math.max(i,Math.trunc(o))):t},it=(e,t)=>"boolean"==typeof e?e:t,rt=(e,t,i)=>{if("string"!=typeof e)return t;const r=e.trim();return"auto"===r.toLowerCase()?"auto":Xe(r,i)?r:t},ot=(e,t,i)=>{const r=rt(e,t,i);return/^(?:currentcolor|inherit|initial|revert|revert-layer|unset)$/i.test(r)?t:r},st=(e,t={})=>{const i="object"!=typeof(r=e)||null===r||Array.isArray(r)?{}:e;var r;const o=et(i.destination)||et(i.direction),s=i.background_color??i.backgroundColor,n=i.text_color??i.textColor,a={type:Ie,stop:et(i.stop),departures:tt(i.departures,He.departures,1,5),refresh_interval:tt(i.refresh_interval,He.refresh_interval,30,300),background_color:ot(s,He.background_color,t.cssSupports),text_color:rt(n,He.text_color,t.cssSupports),show_line:it(i.show_line,He.show_line),show_realtime_badge:it(i.show_realtime_badge,He.show_realtime_badge),show_absolute_time:it(i.show_absolute_time,He.show_absolute_time),compact:it(i.compact,He.compact)},l=(e=>"number"==typeof e&&Number.isFinite(e)?String(e):et(e)||void 0)(i.line);l&&(a.line=l),o&&(a.destination=o);const c=(e=>0===e||"0"===e?0:1===e||"1"===e?1:void 0)(i.direction_id);return void 0!==c&&(a.direction_id=c),a};class nt extends Error{constructor(e,t=[]){super(e),this.name="TamConfigError",this.issues=t,Object.setPrototypeOf(this,new.target.prototype)}}const at=(e,t={})=>{const i=st(e,t),r=[];var o;return"object"!=typeof(o=e)||null===o||Array.isArray(o)?r.push({code:"invalid-config",field:"config",message:"La configuration de TAM Card doit être un objet."}):e.type!==Ie&&r.push({code:"invalid-type",field:"type",message:`Le type de carte doit être « ${Ie} ».`}),i.stop||r.push({code:"missing-stop",field:"stop",message:"Sélectionnez un arrêt."}),i.destination||r.push({code:"missing-destination",field:"destination",message:"Sélectionnez une destination."}),{valid:0===r.length,config:i,errors:r}},lt=e=>Boolean(e.stop&&e.destination&&!e.line);class ct extends nt{constructor(e,t,i){super(t),this.name="LineInferenceError",this.code=e,this.candidates=i,Object.setPrototypeOf(this,new.target.prototype)}}const dt=(e,t)=>{const i=(e=>{const t=e.map(e=>"number"==typeof e&&Number.isFinite(e)?String(e):"string"==typeof e?e.trim():"").filter(Boolean),i=new Map;for(const e of t){const t=e.normalize("NFKC").toLocaleUpperCase("fr-FR");i.has(t)||i.set(t,e)}return[...i.values()].sort((e,t)=>e.localeCompare(t,"fr",{numeric:!0,sensitivity:"base"}))})(e);if(1===i.length)return i[0];const r=`${t.stop} → ${t.destination??"destination inconnue"}`;if(0===i.length)throw new ct("line-not-found",`Aucune ligne ne correspond à ${r}. Renseignez « line » dans l'éditeur.`,i);throw new ct("ambiguous-line",`Plusieurs lignes (${i.join(", ")}) correspondent à ${r}. Sélectionnez une ligne dans l'éditeur.`,i)},ut="custom:tam-card",ht="tam-card",pt="tam-card-editor",gt=864e5,mt=3e5;function ft(e){return e.map(e=>{return encodeURIComponent(null==(t=e)?"":String(t).trim());var t}).join("|")}function _t(e,t){return"number"==typeof e&&Number.isFinite(e)&&e>=0?e:t}const yt=new class{constructor(e={}){this.entries=new Map,this.now=e.now??Date.now,this.storage=null===e.storage?void 0:e.storage??function(){try{return void 0===globalThis.localStorage?void 0:globalThis.localStorage}catch{return}}(),this.storagePrefix=e.storagePrefix??"tam-card:catalog",this.storageVersion=e.storageVersion??1,this.maxIdleMs=_t(e.maxIdleMs,18e5),this.nextCleanupAt=this.now()+mt}acquire(e,t,i={}){if(!e)throw new TypeError("A cache key is required");const r=this.now();this.cleanupIfNeeded(r);const o=_t(i.ttlMs,25e3),s=i.staleIfError??!0,n=_t(i.maxStaleMs,Number.POSITIVE_INFINITY),a=i.persist??!1,l=this.getOrCreateEntry(e,r);if(l.lastAccessedAt=r,a&&!l.hasValue&&this.restorePersistedValue(e,l,n,r,i.validate),l.inFlight)return this.createLease(e,l,l.inFlight);if(l.hasValue&&!i.forceRefresh&&l.expiresAt>r)return this.createSettledLease(e,this.snapshot(l,!1));const c=l.generation+1;l.generation=c;const d=new AbortController,u={generation:c,controller:d,consumers:new Set,promise:Promise.resolve(void 0)};return u.promise=Promise.resolve().then(()=>t(d.signal)).then(t=>{const i=this.now(),r={value:t,stale:!1,fetchedAt:i,expiresAt:i+o,source:"network"};return l.generation===c&&(l.hasValue=!0,l.value=t,l.fetchedAt=r.fetchedAt,l.expiresAt=r.expiresAt,l.lastAccessedAt=i,l.source="memory",a&&this.persistValue(e,r)),r}).catch(e=>{const t=this.now();l.lastAccessedAt=t;const i=t-l.fetchedAt;if(s&&l.hasValue&&i<=n)return{value:l.value,stale:!0,fetchedAt:l.fetchedAt,expiresAt:l.expiresAt,source:l.source,error:e};throw e}).finally(()=>{l.inFlight===u&&(l.inFlight=void 0)}),l.inFlight=u,this.createLease(e,l,u)}acquireDepartures(e,t,i={}){return this.acquire(function(e){return`departures:${ft([e.stop??e.stop_name,e.line??e.route_short_name,e.destination??e.trip_headsign,e.direction_id])}`}(e),t,{...i,ttlMs:i.ttlMs??25e3,persist:!1})}acquireCatalog(e,t,i,r={}){return this.acquire(function(e,t=[]){return`catalog:${e}:${ft(t)}`}(e,t),i,{...r,ttlMs:r.ttlMs??gt,maxStaleMs:r.maxStaleMs??2592e6,persist:!0,validate:t=>function(e,t){return!!Array.isArray(t)&&("stops"===e||"lines"===e?t.every(e=>"string"==typeof e):t.every(t=>!("object"!=typeof t||null===t||"journeys"===e&&"string"!=typeof t.line||"string"!=typeof t.destination||void 0!==t.direction_id&&0!==t.direction_id&&1!==t.direction_id)))}(e,t)})}async get(e,t,i={}){const r=this.acquire(e,t,i);try{return await r.promise}finally{r.release()}}async getCatalog(e,t,i,r={}){const o=this.acquireCatalog(e,t,i,r);try{return await o.promise}finally{o.release()}}peek(e){const t=this.entries.get(e);if(!t?.hasValue)return;const i=this.now();return t.lastAccessedAt=i,this.snapshot(t,t.expiresAt<=i)}invalidate(e){const t=this.entries.get(e);t&&(t.expiresAt=0)}get size(){return this.entries.size}cleanup(e=this.now()){let t=0;for(const[i,r]of this.entries)!r.inFlight&&e-r.lastAccessedAt>=this.maxIdleMs&&(this.entries.delete(i),t+=1);return this.nextCleanupAt=e+mt,t}clear(){for(const e of this.entries.values())e.generation+=1,e.inFlight?.controller.abort();this.entries.clear()}getOrCreateEntry(e,t){const i=this.entries.get(e);if(i)return i;const r={hasValue:!1,fetchedAt:0,expiresAt:0,lastAccessedAt:t,source:"memory",generation:0};return this.entries.set(e,r),r}createSettledLease(e,t){return{key:e,promise:Promise.resolve(t),release:()=>{}}}createLease(e,t,i){const r=Symbol(e);i.consumers.add(r);let o=!1;return{key:e,promise:i.promise,release:()=>{o||(o=!0,i.consumers.delete(r),0===i.consumers.size&&t.inFlight===i&&(t.inFlight=void 0,t.generation+=1,i.controller.abort()))}}}snapshot(e,t){return{value:e.value,stale:t,fetchedAt:e.fetchedAt,expiresAt:e.expiresAt,source:e.source}}cleanupIfNeeded(e){e>=this.nextCleanupAt&&this.cleanup(e)}storageKey(e){return`${this.storagePrefix}:v${this.storageVersion}:${e}`}restorePersistedValue(e,t,i,r,o){if(!this.storage)return;const s=this.storageKey(e);try{const e=this.storage.getItem(s);if(!e)return;const n=JSON.parse(e);if(n.version!==this.storageVersion||"number"!=typeof n.generatedAt||!Number.isFinite(n.generatedAt)||"number"!=typeof n.expiresAt||!Number.isFinite(n.expiresAt)||!("value"in n)||r-n.generatedAt>i||n.generatedAt>r+3e5||n.expiresAt<n.generatedAt||n.expiresAt-n.generatedAt>867e5||void 0!==o&&!o(n.value))return void this.storage.removeItem(s);t.hasValue=!0,t.value=n.value,t.fetchedAt=n.generatedAt,t.expiresAt=n.expiresAt,t.lastAccessedAt=r,t.source="storage"}catch{try{this.storage.removeItem(s)}catch{}}}persistValue(e,t){if(!this.storage)return;const i={version:this.storageVersion,generatedAt:t.fetchedAt,expiresAt:t.expiresAt,value:t.value};try{this.storage.setItem(this.storageKey(e),JSON.stringify(i))}catch{}}};const bt={en:{common:{retry:"Retry",minutes:"min",hour_minutes:"{hours} h {minutes} min"},card:{label:"TaM departures",incomplete_title:"Incomplete configuration",incomplete_detail:"Choose a stop, line and destination in the visual editor.",loading:"Loading departures…",no_departures_title:"No departure announced",no_departures_detail:"The feed may be temporarily empty or service may have ended.",error_title:"Departures unavailable",api_unavailable:"Hérault Data is currently unavailable.",rate_limited:"The public API is limiting requests. A new attempt will be made automatically.",offline:"This device is offline.",stale:"Last known result",stale_detail:"The current refresh failed; these departures may be outdated.",realtime:"Real time",theoretical:"Theoretical",mixed:"Real time + theoretical",approaching:"Approaching",now:"Now",configuration_error:"Configuration error",ambiguous_line:"Several lines ({lines}) match. Open the editor and select a line.",line_not_found:"No line matches this journey. Open the editor and select a line.",line_label:"Line {line}",missing_stop:"Select a stop.",missing_destination:"Select a destination."},editor:{data:"Journey",display:"Display",colors:"Colours",stop:"Stop",line:"Line",destination:"Destination",direction_id:"Direction",departures:"Number of departures",refresh_interval:"Refresh interval (seconds)",show_line:"Show line",show_realtime_badge:"Show data source badge",show_absolute_time:"Show scheduled time",compact:"Compact mode",background_color:"Background colour",text_color:"Text colour",auto:"Automatic",loading_stops:"Loading stops…",loading_lines:"Loading lines…",loading_destinations:"Loading destinations…",catalog_error:"The catalogue could not be loaded. You can retry or enter values manually.",manual_mode:"Manual entry",catalog_mode:"Use catalogue",manual_hint:"Values are matched case-insensitively when possible. Check spelling if no result appears.",select_stop_first:"Choose a stop first.",select_line_first:"Choose a line first.",direction_auto:"Automatic / unspecified",all_directions:"All directions",direction_0:"Direction 0",direction_1:"Direction 1",ambiguous_line:"Several lines ({lines}) match. Select a line."}},fr:{common:{retry:"Réessayer",minutes:"min",hour_minutes:"{hours} h {minutes} min"},card:{label:"Prochains passages TaM",incomplete_title:"Configuration incomplète",incomplete_detail:"Choisissez un arrêt, une ligne et une destination dans l’éditeur visuel.",loading:"Chargement des passages…",no_departures_title:"Aucun passage annoncé",no_departures_detail:"La source peut être momentanément vide ou le service peut être terminé.",error_title:"Passages indisponibles",api_unavailable:"Hérault Data est momentanément indisponible.",rate_limited:"L’API publique limite les requêtes. Un nouvel essai aura lieu automatiquement.",offline:"Cet appareil est hors connexion.",stale:"Dernier résultat connu",stale_detail:"L’actualisation a échoué ; ces passages peuvent être anciens.",realtime:"Temps réel",theoretical:"Théorique",mixed:"Temps réel + théorique",approaching:"À l’approche",now:"À quai",configuration_error:"Erreur de configuration",ambiguous_line:"Plusieurs lignes ({lines}) correspondent. Ouvrez l’éditeur et sélectionnez une ligne.",line_not_found:"Aucune ligne ne correspond à ce trajet. Ouvrez l’éditeur et sélectionnez une ligne.",line_label:"Ligne {line}",missing_stop:"Sélectionnez un arrêt.",missing_destination:"Sélectionnez une destination."},editor:{data:"Trajet",display:"Affichage",colors:"Couleurs",stop:"Arrêt",line:"Ligne",destination:"Destination",direction_id:"Sens",departures:"Nombre de passages",refresh_interval:"Actualisation (secondes)",show_line:"Afficher la ligne",show_realtime_badge:"Afficher la nature des données",show_absolute_time:"Afficher l’heure annoncée",compact:"Mode compact",background_color:"Couleur de fond",text_color:"Couleur du texte",auto:"Automatique",loading_stops:"Chargement des arrêts…",loading_lines:"Chargement des lignes…",loading_destinations:"Chargement des destinations…",catalog_error:"Le catalogue n’a pas pu être chargé. Réessayez ou saisissez les valeurs manuellement.",manual_mode:"Saisie manuelle",catalog_mode:"Utiliser le catalogue",manual_hint:"Les valeurs sont rapprochées sans tenir compte de la casse lorsque c’est possible. Vérifiez l’orthographe si aucun résultat n’apparaît.",select_stop_first:"Choisissez d’abord un arrêt.",select_line_first:"Choisissez d’abord une ligne.",direction_auto:"Automatique / non précisé",all_directions:"Tous les sens",direction_0:"Sens 0",direction_1:"Sens 1",ambiguous_line:"Plusieurs lignes ({lines}) correspondent. Sélectionnez une ligne."}}};function vt(e,t){let i=e;for(const e of t.split(".")){if("string"==typeof i||void 0===i)return;i=i[e]}return"string"==typeof i?i:void 0}function $t(e,t,i={}){const r=function(e){return e?.toLowerCase().startsWith("en")?"en":"fr"}(t),o=vt(bt[r],e)??vt(bt.fr,e)??vt(bt.en,e)??e;return Object.entries(i).reduce((e,[t,i])=>e.replaceAll(`{${t}}`,String(i)),o)}const xt=n`
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
    --tam-border: color-mix(in srgb, currentColor 62%, transparent);
  }

  .approaching-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 0 color-mix(in srgb, currentColor 45%, transparent);
    animation: tam-pulse 1.8s ease-out infinite;
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

  @keyframes tam-loading {
    to {
      background-position-x: -220%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .approaching-dot,
    .skeleton {
      animation: none;
    }
  }
`,wt=n`
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
`,At=e=>"string"==typeof e?e.trim():"",Ct=(e,t)=>0===e.localeCompare(t,"fr",{sensitivity:"base"});let St=class extends ae{constructor(){super(...arguments),this.stops=[],this.lines=[],this.destinations=[],this.manual=!1,this.generation=0,this.changeStop=e=>{if(!this.config)return;const t=++this.generation,i=At(e.detail.value);this.config={...this.config,stop:i},delete this.config.line,delete this.config.destination,delete this.config.direction_id,this.lines=[],this.destinations=[],this.emitConfig(),i?this.loadLines(i,t):this.loading=void 0},this.changeLine=e=>{if(!this.config)return;const t=++this.generation,i=At(e.detail.value);this.config={...this.config,...i?{line:i}:{}},i||delete this.config.line,delete this.config.destination,delete this.config.direction_id,this.destinations=[],this.emitConfig(),this.config.stop&&i?this.loadDestinations(this.config.stop,i,t):this.loading=void 0},this.changeDestination=e=>{if(!this.config)return;const t=At(e.detail.value),i=this.destinations.find(e=>this.destinationKey(e.destination,e.direction_id)===t);if(i)this.config={...this.config,destination:i.destination},void 0===i.direction_id?delete this.config.direction_id:this.config.direction_id=i.direction_id;else{const[e,i]=t.split("\0");this.config={...this.config,destination:e},"0"===i||"1"===i?this.config.direction_id=Number(i):delete this.config.direction_id}this.emitConfig()},this.changeDirection=e=>{if(!this.config)return;const t=At(e.detail.value);"0"===t||"1"===t?this.config={...this.config,direction_id:Number(t)}:(this.config={...this.config},delete this.config.direction_id),this.emitConfig()}}setConfig(e){this.config=function(e){return{...st(e),type:ut}}(e);const t=++this.generation;this.loadInitialCatalog(t)}render(){return this.config?H`
      <div class="editor">
        <section class="section" aria-labelledby="tam-editor-data">
          <h3 id="tam-editor-data">${$t("editor.data",this.language)}</h3>
          ${this.renderCatalogFeedback()}
          <div class="actions">
            <button type="button" @click=${this.toggleManual}>
              ${$t(this.manual?"editor.catalog_mode":"editor.manual_mode",this.language)}
            </button>
            ${this.catalogError?H`<button type="button" @click=${this.retryCatalog}>
                    ${$t("common.retry",this.language)}
                  </button>`:B}
          </div>
          ${this.manual?this.renderManualJourney():this.renderCatalogJourney()}
        </section>

        <section class="section" aria-labelledby="tam-editor-display">
          <h3 id="tam-editor-display">${$t("editor.display",this.language)}</h3>
          ${this.selector($t("editor.departures",this.language),{number:{min:1,max:5,step:1,mode:"box"}},this.config.departures??2,e=>this.changeNumber("departures",e,1,5))}
          ${this.selector($t("editor.refresh_interval",this.language),{number:{min:30,max:300,step:30,mode:"box",unit_of_measurement:"s"}},this.config.refresh_interval??60,e=>this.changeNumber("refresh_interval",e,30,300))}
          ${this.booleanSelector("show_line")}${this.booleanSelector("show_realtime_badge")}
          ${this.booleanSelector("show_absolute_time")}${this.booleanSelector("compact")}
        </section>

        <section class="section" aria-labelledby="tam-editor-colors">
          <h3 id="tam-editor-colors">${$t("editor.colors",this.language)}</h3>
          ${this.selector($t("editor.background_color",this.language),{text:{type:"text"}},this.config.background_color??"auto",e=>this.changeText("background_color",e))}
          ${this.selector($t("editor.text_color",this.language),{text:{type:"text"}},this.config.text_color??"auto",e=>this.changeText("text_color",e))}
          <p class="hint">${$t("editor.auto",this.language)} : <code>auto</code></p>
        </section>
      </div>
    `:H`<p>${$t("card.loading",this.language)}</p>`}get language(){return this.hass?.language}renderCatalogFeedback(){if(this.loading){const e="stops"===this.loading?"editor.loading_stops":"lines"===this.loading?"editor.loading_lines":"editor.loading_destinations";return H`<p class="hint" role="status">${$t(e,this.language)}</p>`}return this.catalogError?H`<p class="error" role="alert">${this.catalogError}</p>`:B}renderCatalogJourney(){if(!this.stops.length&&!this.loading)return this.renderManualJourney();const e=this.selectedDestinationKey();return H`
      ${this.selector($t("editor.stop",this.language),{select:{options:this.stops,custom_value:!0,mode:"dropdown"}},this.config?.stop??"",this.changeStop)}
      ${this.config?.stop?this.selector($t("editor.line",this.language),{select:{options:this.lines.map(e=>({value:e,label:e})),mode:"dropdown"}},this.config.line??"",this.changeLine):H`<p class="hint">${$t("editor.select_stop_first",this.language)}</p>`}
      ${this.config?.stop&&this.config.line?this.selector($t("editor.destination",this.language),{select:{options:this.destinationOptions(),mode:"dropdown"}},e,this.changeDestination):H`<p class="hint">${$t("editor.select_line_first",this.language)}</p>`}
    `}renderManualJourney(){return H`
      <p class="hint">${$t("editor.manual_hint",this.language)}</p>
      ${this.selector($t("editor.stop",this.language),{text:{type:"text"}},this.config?.stop??"",e=>this.changeText("stop",e,["line","destination","direction_id"]))}
      ${this.selector($t("editor.line",this.language),{text:{type:"text"}},this.config?.line??"",e=>this.changeText("line",e,["destination","direction_id"]))}
      ${this.selector($t("editor.destination",this.language),{text:{type:"text"}},this.config?.destination??"",e=>this.changeText("destination",e))}
      ${this.selector($t("editor.direction_id",this.language),{select:{options:[{value:"auto",label:$t("editor.direction_auto",this.language)},{value:"0",label:$t("editor.direction_0",this.language)},{value:"1",label:$t("editor.direction_1",this.language)}],mode:"dropdown"}},void 0===this.config?.direction_id?"auto":String(this.config.direction_id),this.changeDirection)}
    `}selector(e,t,i,r){return H`
      <ha-selector
        .hass=${this.hass}
        .selector=${t}
        .value=${i}
        .label=${e}
        @value-changed=${r}
      ></ha-selector>
    `}booleanSelector(e){return this.selector($t(`editor.${e}`,this.language),{boolean:{}},this.config?.[e]??!1,t=>{this.config&&(this.config={...this.config,[e]:Boolean(t.detail.value)},this.emitConfig())})}changeText(e,t,i=[]){if(!this.config)return;i.length>0&&(this.generation+=1,this.loading=void 0);const r=At(t.detail.value);this.config={...this.config,[e]:r},r||"background_color"===e||"text_color"===e||delete this.config[e];for(const e of i)delete this.config[e];i.includes("line")&&(this.lines=[]),i.includes("destination")&&(this.destinations=[]),this.emitConfig()}changeNumber(e,t,i,r){if(!this.config)return;const o=Number(t.detail.value);Number.isFinite(o)&&(this.config={...this.config,[e]:Math.min(r,Math.max(i,Math.round(o)))},this.emitConfig())}toggleManual(){this.manual=!this.manual,this.manual||this.loadInitialCatalog(++this.generation)}retryCatalog(){this.catalogError=void 0,this.manual=!1;const e=++this.generation;this.loadInitialCatalog(e,!0)}async loadInitialCatalog(e,t=!1){this.loading="stops",this.catalogError=void 0;try{const i=await yt.getCatalog("stops",[],e=>ze.listStops({signal:e}),{forceRefresh:t});if(e!==this.generation)return;if(this.stops=i.value,!this.config?.stop)return;const r=this.stops.find(e=>Ct(e,this.config?.stop??""));r&&(this.config={...this.config,stop:r}),await this.loadLines(this.config.stop,e,t,!0)}catch{if(e!==this.generation)return;this.catalogError=$t("editor.catalog_error",this.language),this.manual=!0}finally{e===this.generation&&(this.loading=void 0)}}async loadLines(e,t,i=!1,r=!1){this.loading="lines",this.catalogError=void 0;try{const o=await yt.getCatalog("lines",[e],t=>ze.listLinesForStop(e,{signal:t}),{forceRefresh:i});if(t!==this.generation)return;if(this.lines=o.value,this.config?.line){const r=this.lines.find(e=>Ct(e,this.config?.line??""));r&&(this.config={...this.config,line:r}),await this.loadDestinations(e,this.config.line,t,i)}else r&&this.config?.destination&&await this.inferLine(e,this.config.destination,t,i)}catch{if(t!==this.generation)return;this.catalogError=$t("editor.catalog_error",this.language),this.manual=!0}finally{t===this.generation&&(this.loading=void 0)}}async loadDestinations(e,t,i,r=!1){this.loading="destinations",this.catalogError=void 0;try{const o=await yt.getCatalog("destinations",[e,t],i=>ze.listDestinations(e,t,{signal:i}),{forceRefresh:r});if(i!==this.generation)return;if(this.destinations=o.value,this.config?.destination){const e=this.destinations.find(e=>Ct(e.destination,this.config?.destination??"")&&(void 0===this.config?.direction_id||e.direction_id===this.config.direction_id));e&&(this.config={...this.config,destination:e.destination})}}catch{if(i!==this.generation)return;this.catalogError=$t("editor.catalog_error",this.language),this.manual=!0}finally{i===this.generation&&(this.loading=void 0)}}async inferLine(e,t,i,r){const o=await yt.getCatalog("journeys",[e],t=>ze.listJourneysForStop(e,{signal:t}),{forceRefresh:r}),s=o.value.filter(e=>Ct(e.destination,t)&&(void 0===this.config?.direction_id||e.direction_id===this.config.direction_id));if(i!==this.generation||!this.config)return;const n=[...new Set(s.map(e=>e.line))];if(1===n.length){const[e]=n,t=s[0];return this.config={...this.config,line:e,destination:t.destination},void 0!==this.config.direction_id&&void 0!==t.direction_id&&(this.config.direction_id=t.direction_id),this.destinations=o.value.filter(t=>Ct(t.line,e)).map(({destination:e,direction_id:t})=>({destination:e,...void 0===t?{}:{direction_id:t}})),void this.emitConfig()}n.length>1&&(this.catalogError=$t("editor.ambiguous_line",this.language,{lines:n.join(", ")}))}destinationKey(e,t){return e?`${e}\0${t??""}`:""}selectedDestinationKey(){const e=this.config?.destination;if(!e)return"";if(void 0!==this.config?.direction_id)return this.destinationKey(e,this.config.direction_id);const t=this.destinations.filter(t=>Ct(t.destination,e));return 1===t.length?this.destinationKey(t[0].destination,t[0].direction_id):this.destinationKey(e)}destinationOptions(){const e=[],t=new Set;for(const i of this.destinations){const r=i.destination.normalize("NFKC").toLocaleUpperCase("fr-FR");this.destinations.filter(e=>Ct(e.destination,i.destination)).length>1&&!t.has(r)&&(t.add(r),e.push({value:this.destinationKey(i.destination),label:`${i.destination} — ${$t("editor.all_directions",this.language)}`})),e.push({value:this.destinationKey(i.destination,i.direction_id),label:this.destinationLabel(i)})}return e}destinationLabel(e){return this.destinations.filter(t=>Ct(t.destination,e.destination)).length>1&&void 0!==e.direction_id?`${e.destination} — ${$t(`editor.direction_${e.direction_id}`,this.language)}`:e.destination}emitConfig(){if(!this.config)return;const e={...this.config,type:ut};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}static{this.styles=wt}};e([he({attribute:!1})],St.prototype,"hass",void 0),e([pe()],St.prototype,"config",void 0),e([pe()],St.prototype,"stops",void 0),e([pe()],St.prototype,"lines",void 0),e([pe()],St.prototype,"destinations",void 0),e([pe()],St.prototype,"loading",void 0),e([pe()],St.prototype,"catalogError",void 0),e([pe()],St.prototype,"manual",void 0),St=e([ce(pt)],St);const Ft={1:{route_color:"#005CA9",route_text_color:"#FFFFFF",route_type:0},2:{route_color:"#EF7D00",route_text_color:"#000000",route_type:0},3:{route_color:"#C8D400",route_text_color:"#000000",route_type:0},4:{route_color:"#4B2A0E",route_text_color:"#FFFFFF",route_type:0},5:{route_color:"#287431",route_text_color:"#FFFFFF",route_type:0},6:{route_color:"#E94190",route_text_color:"#000000",route_type:3},7:{route_color:"#A777B1",route_text_color:"#000000",route_type:3},8:{route_color:"#FFDC00",route_text_color:"#000000",route_type:3},9:{route_color:"#00A14C",route_text_color:"#FFFFFF",route_type:3},10:{route_color:"#FFB900",route_text_color:"#000000",route_type:3},11:{route_color:"#5FC3E1",route_text_color:"#000000",route_type:3},12:{route_color:"#29417C",route_text_color:"#FFFFFF",route_type:3},13:{route_color:"#941B80",route_text_color:"#FFFFFF",route_type:3},14:{route_color:"#F3A08C",route_text_color:"#000000",route_type:3},15:{route_color:"#BF0D0D",route_text_color:"#FFFFFF",route_type:3},16:{route_color:"#009EE2",route_text_color:"#000000",route_type:3},17:{route_color:"#DCC900",route_text_color:"#000000",route_type:3},18:{route_color:"#E84E24",route_text_color:"#000000",route_type:3},19:{route_color:"#FFD400",route_text_color:"#000000",route_type:3},20:{route_color:"#009EE2",route_text_color:"#000000",route_type:3},21:{route_color:"#FFE500",route_text_color:"#000000",route_type:3},22:{route_color:"#81CFF4",route_text_color:"#000000",route_type:3},23:{route_color:"#F29100",route_text_color:"#000000",route_type:3},24:{route_color:"#A61680",route_text_color:"#FFFFFF",route_type:3},25:{route_color:"#904E00",route_text_color:"#FFFFFF",route_type:3},26:{route_color:"#306980",route_text_color:"#FFFFFF",route_type:3},27:{route_color:"#E20613",route_text_color:"#FFFFFF",route_type:3},28:{route_color:"#F29100",route_text_color:"#000000",route_type:3},30:{route_color:"#F4B4D2",route_text_color:"#000000",route_type:3},31:{route_color:"#A9B400",route_text_color:"#000000",route_type:3},32:{route_color:"#008288",route_text_color:"#000000",route_type:3},33:{route_color:"#C7D300",route_text_color:"#000000",route_type:3},34:{route_color:"#729957",route_text_color:"#000000",route_type:3},35:{route_color:"#164193",route_text_color:"#FFFFFF",route_type:3},36:{route_color:"#E20613",route_text_color:"#FFFFFF",route_type:3},38:{route_color:"#8C004C",route_text_color:"#FFFFFF",route_type:3},40:{route_color:"#FFDC00",route_text_color:"#000000",route_type:3},41:{route_color:"#74B859",route_text_color:"#000000",route_type:3},42:{route_color:"#E5007E",route_text_color:"#000000",route_type:3},43:{route_color:"#FABC43",route_text_color:"#000000",route_type:3},44:{route_color:"#E95296",route_text_color:"#000000",route_type:3},46:{route_color:"#7A1C79",route_text_color:"#FFFFFF",route_type:3},47:{route_color:"#B6C952",route_text_color:"#000000",route_type:3},50:{route_color:"#0059A1",route_text_color:"#FFFFFF",route_type:3},51:{route_color:"#E95296",route_text_color:"#000000",route_type:3},52:{route_color:"#FFE500",route_text_color:"#000000",route_type:3},53:{route_color:"#95C11F",route_text_color:"#000000",route_type:3},81:{route_color:"#3362F7",route_text_color:"#FFFFFF",route_type:3},91:{route_color:"#E75294",route_text_color:"#000000",route_type:3},92:{route_color:"#E75294",route_text_color:"#000000",route_type:3},93:{route_color:"#E75294",route_text_color:"#000000",route_type:3},94:{route_color:"#E75294",route_text_color:"#000000",route_type:3},95:{route_color:"#E75294",route_text_color:"#000000",route_type:3},96:{route_color:"#1C3C6E",route_text_color:"#FFFFFF",route_type:3},A:{route_color:"#841931",route_text_color:"#FFFFFF",route_type:3}},Et={aqua:[0,255,255],black:[0,0,0],blue:[0,0,255],fuchsia:[255,0,255],gray:[128,128,128],green:[0,128,0],lime:[0,255,0],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],purple:[128,0,128],red:[255,0,0],silver:[192,192,192],teal:[0,128,128],white:[255,255,255],yellow:[255,255,0]},kt=new Map,Lt=(e,t,i)=>Math.min(i,Math.max(t,e));function Mt(e){const t=e.trim(),i=Number(t.endsWith("%")?t.slice(0,-1):t);if(Number.isFinite(i))return Lt(t.endsWith("%")?i/100*255:i,0,255)}function Nt(e){if(!e.trim().endsWith("%"))return;const t=Number(e.trim().slice(0,-1));return Number.isFinite(t)?Lt(t/100,0,1):void 0}function Rt(e,t,i){const r=(e%360+360)%360,o=(1-Math.abs(2*i-1))*t,s=r/60,n=o*(1-Math.abs(s%2-1)),[a,l,c]=s<1?[o,n,0]:s<2?[n,o,0]:s<3?[0,o,n]:s<4?[0,n,o]:s<5?[n,0,o]:[o,0,n],d=i-o/2;return[a,l,c].map(e=>Math.round(255*(e+d)))}function Tt(e,t=!0){const i=e.trim(),r=i.toLowerCase();if("transparent"===r)return{rgb:[0,0,0],alpha:0};const o=Et[r];if(o)return{rgb:o,alpha:1};const s=/^#([\da-f])([\da-f])([\da-f])$/i.exec(i);if(s)return{rgb:s.slice(1).map(e=>Number.parseInt(`${e}${e}`,16)),alpha:1};const n=/^#([\da-f])([\da-f])([\da-f])([\da-f])$/i.exec(i);if(n)return{rgb:n.slice(1,4).map(e=>Number.parseInt(`${e}${e}`,16)),alpha:Number.parseInt(`${n[4]}${n[4]}`,16)/255};const a=/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i.exec(i);if(a)return{rgb:a.slice(1,4).map(e=>Number.parseInt(e,16)),alpha:a[4]?Number.parseInt(a[4],16)/255:1};const l=/^(rgb|rgba|hsl|hsla)\((.*)\)$/i.exec(i);if(l){const{components:e,alpha:t}=function(e){if(e.includes(",")){const t=e.replace(/\s*\/\s*/,",").split(",").map(e=>e.trim()).filter(Boolean);return 4===t.length?{components:t.slice(0,3),alpha:t[3]}:{components:t}}const[t,i]=e.split("/").map(e=>e.trim());return{components:t.split(/\s+/).filter(Boolean),...i?{alpha:i}:{}}}(l[2]),i=function(e){if(void 0===e)return 1;const t=e.trim(),i=Number(t.endsWith("%")?t.slice(0,-1):t);return Number.isFinite(i)?Lt(t.endsWith("%")?i/100:i,0,1):void 0}(t);if(3!==e.length||void 0===i)return;if(l[1].toLowerCase().startsWith("rgb")){const t=e.map(Mt);if(t.some(e=>void 0===e))return;return{rgb:t,alpha:i}}const r=function(e){const t=e.trim().toLowerCase(),i=Number(t.replace(/(?:deg|grad|rad|turn)$/,""));if(Number.isFinite(i))return t.endsWith("turn")?360*i:t.endsWith("grad")?.9*i:t.endsWith("rad")?180*i/Math.PI:i}(e[0]),o=Nt(e[1]),s=Nt(e[2]);if(void 0===r||void 0===o||void 0===s)return;return{rgb:Rt(r,o,s),alpha:i}}return/^(?:currentcolor|inherit|initial|revert|revert-layer|unset)$/i.test(i)?void 0:t?function(e){const t=e.trim().toLowerCase();if(/^var\(/i.test(t))return;if(kt.has(t))return kt.get(t);if("undefined"==typeof document||"function"!=typeof getComputedStyle||!document.documentElement)return;const i=document.createElement("span");if(i.style.color=e,!i.style.color)return;i.hidden=!0,document.documentElement.append(i);const r=getComputedStyle(i).color;i.remove();const o=r&&r.toLowerCase()!==t?Tt(r,!1):void 0;if(kt.size>=64){const e=kt.keys().next().value;void 0!==e&&kt.delete(e)}return kt.set(t,o),o}(i):void 0}function Dt(e){const t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4}function Pt(e,t="var(--primary-text-color, #111111)"){const i=Tt(e);if(!i||i.alpha<.999)return t;const{rgb:r}=i,o=.2126*Dt(r[0])+.7152*Dt(r[1])+.0722*Dt(r[2]);return 1.05/(o+.05)>=(o+.05)/.05?"#FFFFFF":"#000000"}function qt(e){return 0===e?"mdi:tram":3===e?"mdi:bus":"mdi:transit-connection-variant"}function Ot(e,t="#03A9F4"){const i=e.trim().toUpperCase(),r=Ft[i];return r?{background:r.route_color,text:r.route_text_color||Pt(r.route_color),icon:qt(r.route_type),routeType:r.route_type,known:!0}:{background:`var(--primary-color, ${t})`,text:Pt(t),icon:qt(),known:!1}}const Ut=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Paris",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}),jt={status:"idle",departures:[],isLoading:!1,isStale:!1};function zt(e,t,i){return Number.isFinite(e)?Math.min(i,Math.max(t,Math.round(e))):t}function It(e){const t=e?.trim();return t||void 0}function Ht(e,t){return Math.max(0,Math.floor(e/6e4)-Math.floor(t/6e4))}function Vt(e,t,i){const r=function(e){const t=/^(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(e.trim());if(!t)return;const i=Number(t[1]),r=Number(t[2]),o=Number(t[3]??0);return i>23||r>59||o>59?void 0:60*i*60+60*r+o}(e),o=function(e){const t=new Map(Ut.formatToParts(new Date(e)).map(e=>[e.type,Number(e.value)])),i=t.get("hour"),r=t.get("minute"),o=t.get("second");if(void 0===i||void 0===r||void 0===o)return;return 60*i*60+60*r+o+(e%1e3+1e3)%1e3/1e3}(t);if(void 0===r||void 0===o)return;const s=r-o;return t+1e3*[s-86400,s,s+86400].reduce((e,t)=>Math.abs(t-i)<Math.abs(e-i)?t:e)}class Bt{constructor(e,t,i={}){this.signature="",this.connected=!1,this.stateValue=jt,this.rawDepartures=[],this.aliveDepartureCount=0,this.earlyRefreshRequested=!1,this.lastEarlyRefreshFingerprint="",this.retryNotBefore=0,this.requestGeneration=0,this.visibilityChanged=()=>{if(this.connected)return this.isDocumentHidden()?(this.stopTimers(),this.cancelActiveRequest(),void(this.stateValue.isLoading&&this.updateState({...this.stateValue,isLoading:!1}))):void this.startCycle(!0)},this.host=e,this.client=t,this.cache=i.cache??yt,this.now=i.now??Date.now,this.visibilitySource=null===i.visibilitySource?void 0:i.visibilitySource??("undefined"==typeof document?void 0:document),e.addController(this)}get state(){return this.stateValue}get isConfigured(){return Boolean(this.config?.stop&&this.config.line)}setConfig(e){const t=e?function(e){return{stop:e.stop.trim(),line:It(e.line),destination:It(e.destination),direction_id:e.direction_id,departures:zt(e.departures,1,5),refresh_interval:zt(e.refresh_interval,30,300)}}(e):void 0,i=function(e){return e?JSON.stringify([e.stop,e.line??"",e.destination??"",e.direction_id??"",e.departures,e.refresh_interval]):""}(t);i!==this.signature&&(this.signature=i,this.config=t,this.stopTimers(),this.cancelActiveRequest(),this.rawDepartures=[],this.aliveDepartureCount=0,this.earlyRefreshRequested=!1,this.lastEarlyRefreshFingerprint="",this.retryNotBefore=0,this.updateState(jt),this.connected&&!this.isDocumentHidden()&&this.startCycle())}configure(e){this.setConfig(e)}hostConnected(){this.connected||(this.connected=!0,this.visibilitySource?.addEventListener("visibilitychange",this.visibilityChanged),this.isDocumentHidden()||this.startCycle())}hostDisconnected(){this.connected&&(this.connected=!1,this.visibilitySource?.removeEventListener("visibilitychange",this.visibilityChanged),this.stopTimers(),this.cancelActiveRequest(),this.stateValue.isLoading&&this.updateState({...this.stateValue,isLoading:!1}))}refresh(e={}){if(!this.canRun())return Promise.resolve();if(this.requestPromise)return this.requestPromise;const t=this.config,i={stop:t.stop,line:t.line,destination:t.destination,direction_id:t.direction_id,departures:5},r=this.requestGeneration+1;this.requestGeneration=r;const o=this.cache.acquireDepartures(i,e=>this.client.getDepartures(i,{signal:e}),{forceRefresh:e.force??!1});this.requestLease=o,0===this.stateValue.departures.length?this.updateState({...this.stateValue,status:"loading",isLoading:!0,error:void 0}):this.updateState({...this.stateValue,isLoading:!0});const s=o.promise.then(e=>{this.isCurrentRequest(r)&&this.applySnapshot(e)}).catch(e=>{this.isCurrentRequest(r)&&this.applyError(e)}).finally(()=>{o.release(),this.requestLease===o&&(this.requestLease=void 0),this.requestGeneration===r&&(this.requestPromise=void 0,this.earlyRefreshRequested&&this.canRun()&&(this.earlyRefreshRequested=!1,queueMicrotask(()=>{this.refresh({force:!0})})))});return this.requestPromise=s,s}startCycle(e=!1){this.stopTimers(),this.canRun()&&(this.tickTimer=setInterval(()=>this.tick(),1e3),this.tick(),this.scheduleRefresh(),this.refresh({force:e}))}scheduleRefresh(){if(!this.canRun()||!this.config)return;void 0!==this.refreshTimer&&clearTimeout(this.refreshTimer);const e=Math.max(0,this.retryNotBefore-this.now()),t=Math.max(1e3*this.config.refresh_interval,e);this.refreshTimer=setTimeout(()=>{this.refreshTimer=void 0,this.refresh().finally(()=>this.scheduleRefresh())},t)}stopTimers(){void 0!==this.refreshTimer&&(clearTimeout(this.refreshTimer),this.refreshTimer=void 0),void 0!==this.tickTimer&&(clearInterval(this.tickTimer),this.tickTimer=void 0)}cancelActiveRequest(){this.requestGeneration+=1,this.requestLease?.release(),this.requestLease=void 0,this.requestPromise=void 0}applySnapshot(e){this.rawDepartures=e.value.map(t=>this.normalizePrediction(t,e.fetchedAt)).filter(e=>void 0!==e).sort((e,t)=>e.predicted_at-t.predicted_at).slice(0,5),this.aliveDepartureCount=this.countAlive(this.now()),this.earlyRefreshRequested=!1,e.stale?this.applyRetryAfter(e.error):(this.retryNotBefore=0,this.scheduleRefresh()),this.rawDepartures.length>0&&0===this.aliveDepartureCount?this.requestEarlyRefresh():this.aliveDepartureCount>0&&(this.lastEarlyRefreshFingerprint="");const t=this.liveDepartures(this.now());this.updateState({status:t.length>0?"ready":"empty",departures:t,isLoading:!1,isStale:e.stale,error:e.error,fetchedAt:e.fetchedAt,expiresAt:e.expiresAt})}applyError(e){this.earlyRefreshRequested=!1,this.applyRetryAfter(e),this.rawDepartures.length>0?this.updateState({...this.stateValue,status:this.stateValue.departures.length>0?"ready":"empty",isLoading:!1,isStale:!0,error:e}):this.updateState({status:"error",departures:[],isLoading:!1,isStale:!1,error:e})}tick(){if(!this.canRun())return;const e=this.now(),t=this.countAlive(e),i=t<this.aliveDepartureCount;if(this.aliveDepartureCount=t,this.rawDepartures.length>0){const t=this.liveDepartures(e);this.updateState({...this.stateValue,status:t.length>0?"ready":"empty",departures:t})}i&&this.requestEarlyRefresh()}requestEarlyRefresh(){if(this.retryNotBefore>this.now())return;const e=this.rawDepartures.map(e=>e.course_sae??[e.route_short_name,e.trip_headsign,e.direction_id??"",e.departure_time??""].join("\0")).join("");e&&e!==this.lastEarlyRefreshFingerprint&&(this.lastEarlyRefreshFingerprint=e,this.earlyRefreshRequested=!0,this.requestPromise||this.refresh({force:!0}))}applyRetryAfter(e){if(!(e instanceof be&&"rate-limit"===e.code&&e.retryAfter))return;const t=Number(e.retryAfter),i=Number.isFinite(t)?this.now()+1e3*Math.max(0,t):Date.parse(e.retryAfter);Number.isFinite(i)&&(this.retryNotBefore=Math.max(this.retryNotBefore,i),this.scheduleRefresh())}normalizePrediction(e,t){const i=Number(e.delay_sec),r=Number(e.predicted_at),o=(e.departure_time?Vt(e.departure_time,t,i):void 0)??(Number.isFinite(r)?r:t+1e3*i);if(Number.isFinite(i)&&!(i<0)&&Number.isFinite(o))return{...e,delay_sec:i,predicted_at:o}}liveDepartures(e){const t=this.config?.departures??0;return this.rawDepartures.filter(t=>t.predicted_at>e).slice(0,t).map(t=>{const i=Math.ceil((t.predicted_at-e)/1e3);return{...t,remainingSeconds:i,remainingMinutes:Ht(t.predicted_at,e),isApproaching:i<=120}})}countAlive(e){return this.rawDepartures.reduce((t,i)=>t+(i.predicted_at>e?1:0),0)}canRun(){return this.connected&&this.isConfigured&&!this.isDocumentHidden()}isCurrentRequest(e){return this.canRun()&&this.requestGeneration===e}isDocumentHidden(){return Boolean(this.visibilitySource?.hidden||"hidden"===this.visibilitySource?.visibilityState)}updateState(e){this.stateValue=e,this.host.requestUpdate()}}const Wt=(e,t)=>0===e.localeCompare(t,"fr",{sensitivity:"base"});let Kt=class extends ae{constructor(){super(...arguments),this.configIssues=[],this.resolvingLine=!1,this.language="fr",this.data=new Bt(this,ze),this.themeSignature="",this.themePrimaryColor="#03A9F4",this.resolutionGeneration=0,this.retry=()=>{this.data.refresh({force:!0})}}static getConfigElement(){return document.createElement(pt)}static getStubConfig(){return{}}get hass(){return this.hassValue}set hass(e){this.hassValue=e;const t=e,i=t?.language??"fr",r=JSON.stringify([t?.themes?.theme??"",t?.themes?.darkMode??!1]);i!==this.language&&(this.language=i),r!==this.themeSignature&&(this.themeSignature=r,queueMicrotask(()=>this.updateThemeColor()))}setConfig(e){const t=at(e),i=t.errors.filter(e=>"invalid-config"===e.code||"invalid-type"===e.code);if(i.length)throw new nt(i.map(e=>e.message).join(" "),i);var r;this.cancelLineResolution(),this.config=t.config,this.configError=void 0,this.configIssues=t.errors.map(e=>e.code),this.resolvingLine=!1,this.toggleAttribute("compact",t.config.compact),r=t.config,Boolean(r.stop&&r.line&&r.destination)?this.data.setConfig(t.config):(this.data.setConfig(null),lt(t.config)&&this.isConnected&&this.resolveLegacyLine(t.config))}connectedCallback(){super.connectedCallback(),this.updateThemeColor(),this.config&&lt(this.config)&&this.resolveLegacyLine(this.config)}disconnectedCallback(){this.cancelLineResolution(),super.disconnectedCallback()}getCardSize(){return 2}getGridOptions(){return{columns:12,min_columns:3}}render(){if(!this.config||!this.config.stop||!this.config.destination)return this.renderMessage("mdi:tune-variant",$t("card.incomplete_title",this.language),this.incompleteConfigurationDetail());if(this.resolvingLine)return this.renderLoading($t("editor.loading_lines",this.language));if(this.configError)return this.renderMessage("mdi:alert-circle-outline",$t("card.configuration_error",this.language),this.configurationErrorDetail(this.configError));if(!this.config.line)return this.renderMessage("mdi:tune-variant",$t("card.incomplete_title",this.language),$t("card.incomplete_detail",this.language));const e=this.data.state;return"idle"===e.status||"loading"===e.status&&0===e.departures.length?this.renderLoading($t("card.loading",this.language)):"error"===e.status?this.renderDataError(e.error):"empty"===e.status||0===e.departures.length?e.isStale?this.renderMessage("mdi:clock-alert-outline",$t("card.stale",this.language),$t("card.stale_detail",this.language),!0):this.renderMessage("mdi:clock-outline",$t("card.no_departures_title",this.language),$t("card.no_departures_detail",this.language),!0):this.renderDepartures(e.departures,e.isStale,e.isLoading)}renderDepartures(e,t,i){const r=this.config,o=Ot(r.line,this.themePrimaryColor),s="auto"===r.background_color?o.background:r.background_color,n="auto"===r.text_color?"auto"===r.background_color?o.text:Pt(s):r.text_color,a=e[0]?.isApproaching??!1,l=this.departureSourceLabel(e),c=[l,...t?[$t("card.stale",this.language)]:[],...a?[$t("card.approaching",this.language)]:[]].join(". "),d=$t("card.line_label",this.language,{line:r.line}),u=e.map(e=>this.departureAccessibilityLabel(e)).join(", ");return H`
      <ha-card
        class=${a?"approaching":""}
        style=${ye({"--tam-background":s,"--tam-text":n,"--tam-badge-background":n,"--tam-badge-text":s})}
        tabindex="0"
        aria-label=${`${$t("card.label",this.language)}. ${d}. ${r.stop} → ${r.destination}. ${u}. ${c}`}
      >
        <div class="layout">
          <div class="identity" aria-label=${d}>
            <ha-icon class="mode-icon" .icon=${o.icon} aria-hidden="true"></ha-icon>
            ${r.show_line?H`<span class="line-badge">${r.line}</span>`:B}
          </div>

          <div class="journey" title=${`${r.stop} → ${r.destination}`}>
            <span class="stop">${r.stop}</span>
            <span class="arrow" aria-hidden="true">→</span>
            <span class="destination">${r.destination}</span>
          </div>

          <div class="departures" aria-label=${$t("card.label",this.language)}>
            ${e.map(e=>this.renderDeparture(e))}
          </div>
        </div>

        <div class="metadata" aria-hidden="true">
          ${a?H`<span class="approaching-dot"></span>`:B}
          ${a?H`<span class="status-badge">${$t("card.approaching",this.language)}</span>`:B}
          ${t?H`<span class="status-badge">${$t("card.stale",this.language)}</span>`:B}
          ${i?H`<span class="status-badge">↻</span>`:B}
          ${r.show_realtime_badge?H`<span class="status-badge">${l}</span>`:B}
        </div>
      </ha-card>
    `}renderDeparture(e){const t=this.departureTimeLabel(e);return H`
      <div class="departure">
        <span class="time">${t}</span>
        ${this.config?.show_absolute_time&&e.departure_time?H`<span class="absolute">${this.formatAbsoluteTime(e.departure_time)}</span>`:B}
      </div>
    `}departureTimeLabel(e){return e.isApproaching?$t("card.approaching",this.language):this.formatRemainingTime(e.remainingMinutes)}departureAccessibilityLabel(e){const t=this.departureTimeLabel(e);return this.config?.show_absolute_time&&e.departure_time?`${t}, ${this.formatAbsoluteTime(e.departure_time)}`:t}renderLoading(e){return H`
      <ha-card aria-label=${e} aria-busy="true">
        <div class="message-layout">
          <ha-icon icon="mdi:tram" aria-hidden="true"></ha-icon>
          <div>
            <span class="skeleton"></span>
            <span class="skeleton"></span>
          </div>
        </div>
      </ha-card>
    `}renderDataError(e){let t=$t("card.api_unavailable",this.language),i="mdi:cloud-alert-outline";return e instanceof be&&("rate-limit"===e.code&&(t=$t("card.rate_limited",this.language)),"offline"===e.code&&(t=$t("card.offline",this.language),i="mdi:wifi-off")),this.renderMessage(i,$t("card.error_title",this.language),t,!0,!0)}renderMessage(e,t,i,r=!1,o=!1){const s=this.config?.line?Ot(this.config.line,this.themePrimaryColor):void 0,n=r&&s?{"--tam-background":s.background,"--tam-text":s.text}:{};return H`
      <ha-card style=${ye(n)} tabindex="0" aria-label=${`${t}. ${i}`}>
        <div class="message-layout">
          <ha-icon .icon=${e} aria-hidden="true"></ha-icon>
          <div>
            <div class="message-title">${t}</div>
            <div class="message-detail">${i}</div>
            ${o?H`<button class="retry" type="button" @click=${this.retry}>
                    ${$t("common.retry",this.language)}
                  </button>`:B}
          </div>
        </div>
      </ha-card>
    `}departureSourceLabel(e){const t=e.filter(e=>e.is_theorical).length;return 0===t?$t("card.realtime",this.language):t===e.length?$t("card.theoretical",this.language):$t("card.mixed",this.language)}configurationErrorDetail(e){return e instanceof ct?$t("ambiguous-line"===e.code?"card.ambiguous_line":"card.line_not_found",this.language,{lines:e.candidates.join(", ")}):e instanceof be?$t("editor.catalog_error",this.language):e.message}incompleteConfigurationDetail(){const e=this.configIssues.map(e=>$t("missing-stop"===e?"card.missing_stop":"missing-destination"===e?"card.missing_destination":"card.incomplete_detail",this.language));return[...new Set(e)].join(" ")||$t("card.incomplete_detail",this.language)}formatRemainingTime(e){if(e<=0)return $t("card.now",this.language);if(e<60)return`${e} ${$t("common.minutes",this.language)}`;const t=Math.floor(e/60);return $t("common.hour_minutes",this.language,{hours:t,minutes:e%60})}formatAbsoluteTime(e){const t=/^(\d{1,2}):(\d{2})/.exec(e.trim());return t?`${t[1].padStart(2,"0")}:${t[2]}`:e}async resolveLegacyLine(e){if(!e.stop||!e.destination||e.line)return;this.cancelLineResolution();const t=this.resolutionGeneration;this.resolvingLine=!0,this.configError=void 0,this.requestUpdate();const i=yt.acquireCatalog("journeys",[e.stop],t=>ze.listJourneysForStop(e.stop,{signal:t}));this.lineResolutionLease=i;try{const r=(await i.promise).value.filter(t=>Wt(t.destination,e.destination??"")&&(void 0===e.direction_id||t.direction_id===e.direction_id));if(t!==this.resolutionGeneration||!this.isConnected)return;const o=((e,t)=>e.line?e:{...e,line:dt(t,e)})(e,r.map(e=>e.line)),s=r.find(e=>Wt(e.line,o.line??""));this.config={...o,...s?{destination:s.destination}:{},...void 0===e.direction_id||void 0===s?.direction_id?{}:{direction_id:s.direction_id}},this.configIssues=[],this.data.setConfig(this.config)}catch(e){if(t!==this.resolutionGeneration||!this.isConnected)return;this.data.setConfig(null),this.configError=e instanceof Error?e:new ct("line-not-found",String(e),[])}finally{i.release(),this.lineResolutionLease===i&&(this.lineResolutionLease=void 0),t===this.resolutionGeneration&&(this.resolvingLine=!1,this.requestUpdate())}}cancelLineResolution(){this.resolutionGeneration+=1,this.lineResolutionLease?.release(),this.lineResolutionLease=void 0}updateThemeColor(){if(!this.isConnected||"function"!=typeof getComputedStyle)return;const e=getComputedStyle(this).getPropertyValue("--primary-color").trim();e&&e!==this.themePrimaryColor&&(this.themePrimaryColor=e,this.requestUpdate())}static{this.styles=xt}};e([pe()],Kt.prototype,"config",void 0),e([pe()],Kt.prototype,"configError",void 0),e([pe()],Kt.prototype,"configIssues",void 0),e([pe()],Kt.prototype,"resolvingLine",void 0),e([pe()],Kt.prototype,"language",void 0),Kt=e([ce(ht)],Kt),window.customCards=window.customCards??[],window.customCards.some(e=>e.type===ht)||window.customCards.push({type:ht,name:"TAM Card",description:"Prochains passages TaM à Montpellier via Hérault Data",documentationURL:"https://github.com/MathisAlepis/lovelace-tam-card",preview:!0}),console.info("%c TAM Card %c v4.0.0 ","color:#fff;background:#005ca9;font-weight:700;border-radius:3px 0 0 3px;padding:2px 5px","color:#005ca9;background:#eef6fb;border-radius:0 3px 3px 0;padding:2px 5px");export{Kt as TamCard};
