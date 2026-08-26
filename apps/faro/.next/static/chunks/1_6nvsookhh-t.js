(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,993556,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});e.s(["default",0,i])},705630,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"}))});e.s(["default",0,i])},974935,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});e.s(["default",0,i])},363827,e=>{"use strict";var r=e.i(843476),i=e.i(823209),t=e.i(355982),o=e.i(271645),n=e.i(997053),s=e.i(435232),a=e.i(837008);let l=n.styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`,c=n.styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,d=n.styled.a`
  font-size: 14px;
  color: var(--privy-color-foreground);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;e.s(["A",0,({address:e,showCopyIcon:n,url:h,className:p})=>{let[u,x]=(0,o.useState)(!1);function g(r){r.stopPropagation(),navigator.clipboard.writeText(e).then(()=>x(!0)).catch(console.error)}return(0,o.useEffect)(()=>{if(u){let e=setTimeout(()=>x(!1),3e3);return()=>clearTimeout(e)}},[u]),(0,r.jsxs)(l,h?{children:[(0,r.jsx)(d,{title:e,className:p,href:`${h}/address/${e}`,target:"_blank",children:(0,s.d)(e)}),n&&(0,r.jsx)(a.S,{onClick:g,size:"sm",style:{gap:"0.375rem"},children:(0,r.jsxs)(r.Fragment,u?{children:["Copied",(0,r.jsx)(i.Check,{size:16})]}:{children:["Copy",(0,r.jsx)(t.Copy,{size:16})]})})]}:{children:[(0,r.jsx)(c,{title:e,className:p,children:(0,s.d)(e)}),n&&(0,r.jsx)(a.S,{onClick:g,size:"sm",style:{gap:"0.375rem",fontSize:"14px"},children:(0,r.jsxs)(r.Fragment,u?{children:["Copied",(0,r.jsx)(i.Check,{size:14})]}:{children:["Copy",(0,r.jsx)(t.Copy,{size:14})]})})]})}])},330604,851757,e=>{"use strict";var r=e.i(843476),i=e.i(997053);i.styled.label`
  && {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    text-align: left;
    border-radius: 0.5rem;
    border: 1px solid var(--privy-color-foreground-4);
    width: 100%;
  }
`;let t=i.styled.div`
  display: inline-block;
  vertical-align: middle;
`,o=i.styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 3px;
`,n=i.styled.input.attrs({type:"checkbox"})`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`,s=i.styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  transition: all 150ms;
  cursor: pointer;
  border-color: ${e=>e.color};
  border-radius: 3px;
  background: ${e=>e.checked?e.color:"var(--privy-color-background)"};

  && {
    /* This is necessary to override css reset for border width */
    border-width: 1px;
  }

  ${n}:focus + & {
    box-shadow: 0 0 0 1px ${e=>e.color};
  }

  ${o} {
    visibility: ${e=>e.checked?"visible":"hidden"};
  }
`;e.s(["C",0,({className:e,checked:i,color:a="var(--privy-color-accent)",...l})=>(0,r.jsx)("label",{children:(0,r.jsxs)(t,{className:e,children:[(0,r.jsx)(n,{checked:i,...l}),(0,r.jsx)(s,{color:a,checked:i,children:(0,r.jsx)(o,{viewBox:"0 0 24 24",children:(0,r.jsx)("polyline",{points:"20 6 9 17 4 12"})})})]})})],330604);var a=e.i(271645);let l=a.forwardRef(function({title:e,titleId:r,...i},t){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":r},i),e?a.createElement("title",{id:r},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"}))});e.s(["default",0,l],851757)},143416,e=>{"use strict";var r=e.i(843476),i=e.i(705630),t=e.i(997053);let o=t.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-error-bg);
  border: 1px solid var(--privy-color-border-error);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,n=t.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["E",0,({children:e,theme:t,className:s})=>(0,r.jsxs)(o,{$theme:t,className:s,children:[(0,r.jsx)(i.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-error)",strokeWidth:2,style:{flexShrink:0}}),(0,r.jsx)(n,{$theme:t,children:e})]})])},290382,e=>{"use strict";var r=e.i(997053);let i=r.styled.span`
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */

  color: var(--privy-color-error);
`;e.s(["E",0,i])},891029,e=>{"use strict";var r=e.i(843476),i=e.i(997787);let t=(0,e.i(773524).default)("phone",[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]]);var o=e.i(265145),n=e.i(997053),s=e.i(118364),a=e.i(385171),l=e.i(662123),c=e.i(346146),d=e.i(520475),h=e.i(126347),p=e.i(520183);e.i(271645),e.i(123287),e.i(437206),e.i(33750),e.i(610760);let u=({error:e,allowlistConfig:n,onRetry:s,onCaptchaReset:c,onBack:u})=>{let x=((e,n)=>{if(e instanceof d.R)return{title:"Transaction failed",detail:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{children:e.message}),(0,r.jsxs)("span",{children:[" ","Check the"," ",(0,r.jsx)(g,{href:e.relayLink,target:"_blank",children:"refund status"}),"."]})]}),ctaText:"Try again",icon:i.AlertTriangle};if(e instanceof l.P)switch(e.privyErrorCode){case l.a.CLIENT_REQUEST_TIMEOUT:return{title:"Timed out",detail:e.message,ctaText:"Try again",icon:i.AlertTriangle};case l.a.INSUFFICIENT_BALANCE:return{title:"Insufficient balance",detail:e.message,ctaText:"Try again",icon:i.AlertTriangle};case l.a.TRANSACTION_FAILURE:return{title:"Transaction failure",detail:e.message,ctaText:"Try again",icon:i.AlertTriangle};default:return{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:i.AlertTriangle}}if(e instanceof a.P&&"twilio_verification_failed"===e.type)return{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:t};if(!(e instanceof l.b))return e instanceof l.c&&e.status&&[400,422].includes(e.status)?{title:"Something went wrong",detail:e.message,ctaText:"Try again",icon:i.AlertTriangle}:{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:i.AlertTriangle};switch(e.privyErrorCode){case l.a.INVALID_CAPTCHA:return{title:"Something went wrong",detail:"Please try again.",ctaText:"Try again",icon:i.AlertTriangle};case l.a.DISALLOWED_LOGIN_METHOD:return{title:"Not allowed",detail:e.message,ctaText:"Try another method",icon:i.AlertTriangle};case l.a.ALLOWLIST_REJECTED:return{title:n.errorTitle||"You don't have access to this app",detail:n.errorDetail||"Have you been invited?",ctaText:n.errorCtaText||"Try another account",icon:o.Lock};case l.a.CAPTCHA_FAILURE:return{title:"Something went wrong",detail:"You did not pass CAPTCHA. Please try again.",ctaText:"Try again",icon:null};case l.a.CAPTCHA_TIMEOUT:return{title:"Something went wrong",detail:"Something went wrong! Please try again later.",ctaText:"Try again",icon:null};case l.a.LINKED_TO_ANOTHER_USER:return{title:"Authentication failed",detail:"This account has already been linked to another user.",ctaText:"Try again",icon:i.AlertTriangle};case l.a.NOT_SUPPORTED:return{title:"This region is not supported",detail:"SMS authentication from this region is not available",ctaText:"Try another method",icon:i.AlertTriangle};case l.a.TOO_MANY_REQUESTS:return{title:"Request failed",detail:"Too many attempts.",ctaText:"Try again later",icon:i.AlertTriangle};default:return{title:"Something went wrong",detail:"Try again later",ctaText:"Try again",icon:i.AlertTriangle}}})(e,n);return(0,r.jsx)(p.S,{title:x.title,subtitle:x.detail,icon:x.icon,onBack:u,iconVariant:"error",primaryCta:{label:x.ctaText,onClick:()=>{if(e instanceof l.b&&(e.privyErrorCode===l.a.INVALID_CAPTCHA&&c?.(),e.privyErrorCode===l.a.ALLOWLIST_REJECTED)){let e=(0,h.t)(n.errorCtaLink);if(e)return void window.open(e,"_blank","noopener,noreferrer")}s?.()},variant:"error"},watermark:!0})},x={component:()=>{let{navigate:e,data:i,lastScreen:t,currentScreen:o}=(0,c.u)(),n=(0,s.u)(),{reset:l}=(0,a.a)(),d=i?.errorModalData?.previousScreen||(t===o?void 0:t);return(0,r.jsx)(u,{error:i?.errorModalData?.error||Error(),allowlistConfig:n.allowlistConfig,onRetry:()=>{e(d||"LandingScreen",!1)},onCaptchaReset:l})}},g=n.styled.a`
  color: var(--privy-color-accent) !important;
  font-weight: 600;
`;e.s(["ErrorScreen",0,x,"ErrorScreenView",0,u,"default",0,x],891029)},267669,e=>{"use strict";var r=e.i(997053);let i=r.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
`;e.s(["L",0,i])},938921,e=>{"use strict";var r=e.i(997053);let i=r.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,t=r.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`,o=r.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,n=(0,r.styled)(t)`
  padding: 20px 0;
`,s=(0,r.styled)(t)`
  gap: 16px;
`,a=r.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,l=r.styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;r.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;let c=r.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  padding: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  background: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  && h4 {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
    text-decoration: underline;
    font-weight: medium;
  }
  && p {
    color: var(--privy-color-foreground-3);
    font-size: 14px;
  }
`,d=r.styled.div`
  height: 16px;
`,h=r.styled.div`
  height: 12px;
`;r.styled.div`
  position: relative;
`;let p=r.styled.div`
  height: ${e=>e.height??"12"}px;
`;r.styled.div`
  background-color: var(--privy-color-accent);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-color: white;
  border-width: 2px !important;
`,e.s(["B",0,i,"C",0,n,"F",0,a,"H",0,o,"R",0,h,"S",0,c,"a",0,l,"b",0,d,"c",0,s,"d",0,p,"e",0,t])},616918,e=>{"use strict";var r=e.i(997053);let i=r.keyframes`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,t=r.css`
  ${e=>e.$isLoading?r.css`
          width: 35%;
          animation: ${i} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,t])},837008,e=>{"use strict";var r=e.i(843476),i=e.i(997053),t=e.i(118364),o=e.i(737577),n=e.i(993556),s=e.i(974935),a=e.i(271645);let l=a.forwardRef(function({title:e,titleId:r,...i},t){return a.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":r},i),e?a.createElement("title",{id:r},e):null,a.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var c=e.i(595693);function d(e){return(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...e,children:(0,r.jsx)("g",{fill:e.color||"var(--privy-color-foreground)",children:(0,r.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let h=i.styled.span`
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  color: var(--privy-color-foreground-3);
  display: block;

  && > a {
    color: var(--privy-color-accent);
  }
`,p=i.styled.a`
  && {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,u=i.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 8px;
  padding-bottom: 12px;
  gap: 8px;

  font-size: 13px;

  && a {
    padding: 0.5rem 0;

    &:hover {
      text-decoration: none;
    }
  }

  @media all and (display-mode: standalone) {
    padding-bottom: 30px;
  }
`,x=i.styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;

  & {
    width: auto;
    cursor: pointer;
    border-radius: ${({$size:e})=>"sm"===e?"6px":"var(--privy-border-radius-sm)"};

    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    letter-spacing: -0.016px;
  }

  && {
    height: ${({$size:e})=>"sm"===e?"28px":"48px"};
    padding: 0 ${({$size:e})=>"sm"===e?"10px":"16px"};
  }
`,g=({children:e,loading:i,disabled:t,success:n,size:s="lg",loadingText:a="Loading...",as:l,onClick:c,...d})=>{let h="a"===l,p=!(!i&&!t);return(0,r.jsx)(m,{as:l,disabled:h?void 0:p,"aria-disabled":h?p:void 0,$success:n,$size:s,onClick:e=>{h&&p?e.preventDefault():c?.(e)},...d,children:i?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.B,{}),a?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):e})},v=(0,i.styled)(x)`
  position: relative;

  && {
    background-color: var(--privy-color-accent);
    color: var(--privy-color-foreground-accent);

    transition: background-color 200ms ease;
  }

  &:hover {
    background-color: var(--privy-color-accent-dark);
  }

  &:active {
    background-color: var(--privy-color-accent-dark);
  }

  &:disabled,
  &:hover:disabled,
  &:active:disabled {
    cursor: not-allowed;
    color: var(--privy-color-foreground-disabled);
    background-color: var(--privy-color-accent-dark);
  }
`,m=(0,i.styled)(x)`
  position: relative;

  && {
    background-color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
    color: var(--privy-color-foreground-accent);

    transition: background-color 200ms ease;
  }

  &:hover {
    background-color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent-dark)"};
  }

  &:active {
    background-color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent-dark)"};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #949df9;
  }

  &:disabled {
    background-color: var(--privy-color-background-2);
    border: 1px solid var(--privy-color-border-default);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  &:hover:disabled,
  &:active:disabled {
    background-color: var(--privy-color-background-2);
    border: 1px solid var(--privy-color-border-default);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  /* Emulate disabled look for anchors via the prop */
  ${e=>e.disabled&&i.css`
      &&&,
      &&&:hover,
      &&&:active {
        background-color: var(--privy-color-background-2);
        border: 1px solid var(--privy-color-border-default);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,f=({children:e,loading:i,disabled:t,size:n="lg",loadingText:s="Loading...",as:a,onClick:l,...c})=>{let d="a"===a,h=!(!i&&!t);return(0,r.jsx)(j,{as:a,disabled:d?void 0:h,"aria-disabled":d?h:void 0,$size:n,onClick:e=>{d&&h?e.preventDefault():l?.(e)},...c,children:i?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.B,{}),s?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:s}):null]}):e})},y=({children:e,loading:i,disabled:t,size:n="lg",loadingText:s="Loading...",as:a,onClick:l,...c})=>{let d="a"===a,h=!(!i&&!t);return(0,r.jsx)(b,{as:a,disabled:d?void 0:h,"aria-disabled":d?h:void 0,$size:n,onClick:e=>{d&&h?e.preventDefault():l?.(e)},...c,children:i?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.B,{}),s?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:s}):null]}):e})},j=(0,i.styled)(x)`
  && {
    border-width: 1px;
    border-style: solid;
    border-color: ${e=>e.$warn?"var(--privy-color-border-error)":"var(--privy-color-accent)"};
    background-color: var(--privy-color-background);
    color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
    transition:
      border-color 200ms ease,
      color 200ms ease,
      background-color 200ms ease;
  }

  &:hover {
    border-color: ${e=>e.$warn?"var(--privy-color-border-error)":"var(--privy-color-border-interactive-hover)"};
    background-color: ${e=>e.$warn?"var(--privy-color-error-light)":"var(--privy-color-info-bg-hover)"};
    color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
  }

  &:active {
    border-color: ${e=>e.$warn?"var(--privy-color-border-error)":"var(--privy-color-border-interactive)"};
    background-color: ${e=>e.$warn?"var(--privy-color-error-bg-hover)":"var(--privy-color-info-bg)"};
    color: ${e=>e.$warn?"var(--privy-color-error-dark)":"var(--privy-color-accent)"};
  }

  &:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  &:hover:disabled,
  &:active:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  /* Anchor disabled look (prop-driven) */
  ${e=>e.disabled&&i.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,b=(0,i.styled)(x)`
  && {
    border-width: 1px;
    border-style: solid;
    border-color: var(--privy-color-border-default);
    background-color: transparent;
    color: var(--privy-color-text-muted);

    transition:
      border-color 200ms ease,
      color 200ms ease,
      background-color 200ms ease;
  }

  &:hover {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-info-bg-hover);
    color: var(--privy-color-foreground-2);
  }

  &:active {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-info-bg);
    color: var(--privy-color-foreground-2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #949df9;
  }

  &:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  &:hover:disabled,
  &:active:disabled {
    border-color: var(--privy-color-border-default);
    background-color: var(--privy-color-background-2);
    color: var(--privy-color-foreground-disabled);
    cursor: not-allowed;
  }

  /* Anchor disabled look (prop-driven) */
  ${e=>e.disabled&&i.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,w=i.styled.button`
  && {
    padding: 12px 16px;
    font-weight: 500;
    text-align: center;
    color: var(--privy-color-foreground-accent);
    background-color: var(--privy-color-accent);
    border-radius: var(--privy-border-radius-sm);
    min-width: 144px;
    opacity: ${e=>e.invisible?"0":"1"};
    transition:
      opacity 200ms ease,
      background-color 200ms ease,
      color 200ms ease;
    user-select: none;

    ${e=>e.invisible&&i.css`
        pointer-events: none;
      `}

    &:hover {
      background-color: var(--privy-color-accent-dark);
    }
    &:active {
      background-color: var(--privy-color-accent-dark);
    }

    &:hover:disabled,
    &:active:disabled {
      background-color: var(--privy-color-background-2);
      color: var(--privy-color-foreground-disabled);
      cursor: not-allowed;
    }
  }
`;i.styled.div`
  /* Set to match height of SoftCtaButton to avoid reflow if conditionally rendered */
  height: 44px;
`;let k=i.styled.button`
  && {
    color: var(--privy-color-accent);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    cursor: pointer;
    border-radius: 0px var(--privy-border-radius-mdlg) var(--privy-border-radius-mdlg) 0px;
    border: none;
    transition: color 200ms ease;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
    }

    :hover {
      color: var(--privy-color-accent-dark);
    }

    && > :first-child {
      opacity: ${e=>+!e.$isSubmitting};
    }

    && > :last-child {
      position: absolute;
      display: flex;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);

      /** Will map to the opposite of first span */
      opacity: ${e=>+!!e.$isSubmitting};
    }

    :disabled,
    :hover:disabled {
      color: var(--privy-color-foreground-disabled);
      cursor: not-allowed;
    }
  }
`,T=({backFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)(L,{onClick:e,children:(0,r.jsx)(n.default,{height:"16px",width:"16px",strokeWidth:2})})}),A=({infoFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)(S,{"aria-label":"info",onClick:e,children:(0,r.jsx)(s.default,{height:"22px",width:"22px",strokeWidth:2})})}),C=e=>(0,r.jsx)("div",{children:(0,r.jsx)(L,{"aria-label":"close modal",onClick:e.onClose,children:(0,r.jsx)(l,{height:"16px",width:"16px",strokeWidth:2})})}),L=i.styled.button`
  && {
    cursor: pointer;
    display: flex;
    opacity: 0.6;

    background-color: var(--privy-color-background-2);
    border-radius: var(--privy-border-radius-full);
    padding: 4px;

    > svg {
      margin: auto;
      color: var(--privy-color-foreground);
    }

    :hover {
      opacity: 1;
    }
  }
`,S=(0,i.styled)(L)`
  && {
    background-color: transparent;
  }
`,E=i.styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: var(--privy-color-foreground);
  }
`,$=i.styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`,R=i.styled.div`
  display: flex;
  justify-content: flex-end;
`,I=i.styled.div`
  color: var(--privy-color-foreground);

  font-kerning: none;
  font-feature-settings: 'calt' off;
  /* text-xl/font-semiBold */
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 2rem; /* 160% */

  text-align: left;

  margin-left: 0.5rem;
`,V=i.styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
`;e.s(["B",0,({className:e})=>{let{appearance:i}=(0,t.u)();return(0,r.jsx)(u,{className:e,children:i.footerLogo??(0,r.jsx)(p,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,r.jsx)(d,{color:"currentColor",height:13,width:150})})})},"E",0,({children:e,onClick:i,disabled:t,isSubmitting:n,...s})=>(0,r.jsxs)(k,{$isSubmitting:n,onClick:i,disabled:t,...s,children:[(0,r.jsx)("span",{children:e}),(0,r.jsx)("span",{children:(0,r.jsx)(o.B,{})})]}),"M",0,({backFn:e,infoFn:i,onClose:o,title:n,eyebrow:s,closeable:a=!0,className:l})=>{let{closePrivyModal:d}=(0,c.u)(),h=(0,t.u)();return(0,r.jsxs)(E,{className:l,children:[(0,r.jsxs)($,{children:[e&&(0,r.jsx)(T,{backFn:e}),s&&(0,r.jsx)(V,{children:s}),!s&&n&&(0,r.jsx)(I,{id:"privy-dialog-title",children:n}),(0,r.jsx)("div",{style:{height:24}}),i&&(0,r.jsx)(A,{infoFn:i})]}),(0,r.jsx)(R,{children:!h.render.standalone&&a&&(0,r.jsx)(C,{onClose:o||(()=>d())})})]})},"P",0,g,"S",0,f,"T",0,function({app:{legal:{privacyPolicyUrl:e,termsAndConditionsUrl:i,requireUsersAcceptTerms:t}},alwaysShowImplicitConsent:o}){let n=!(!e||!i);return(!t||o)&&(i||e)?(0,r.jsxs)(h,{children:["By logging in I agree to the"," ",i&&(0,r.jsx)("a",{href:i,target:"_blank",children:n?"Terms":"Terms of Service"}),n&&" & ",e&&(0,r.jsx)("a",{href:e,target:"_blank",children:"Privacy Policy"})]}):(0,r.jsx)(h,{})},"a",0,({variant:e="primary",size:i="lg",children:t,success:o,...n})=>{switch(e){case"secondary":return(0,r.jsx)(f,{size:i,...n,children:t});case"error":return(0,r.jsx)(f,{$warn:!0,size:i,...n,children:t});case"muted":return(0,r.jsx)(y,{size:i,...n,children:t});default:return(0,r.jsx)(g,{size:i,success:o,...n,children:t})}},"b",0,u,"c",0,({children:e,loading:i,disabled:t,...n})=>(0,r.jsx)(v,{disabled:t,...n,children:i?(0,r.jsx)(o.B,{color:"var(--privy-color-foreground-accent)"}):e}),"d",0,w,"e",0,y],837008)},241342,e=>{"use strict";var r=e.i(843476),i=e.i(271645),t=e.i(997053),o=e.i(737577),n=e.i(837008),s=e.i(632964);let a=t.styled.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,l=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) * 1.5);
  width: 100%;
  background: var(--privy-color-background);
  padding: 0 var(--screen-space-lg) var(--screen-space);
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,c=t.styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,d=(0,t.styled)(n.M)`
  margin: 0 -8px;
`,h=t.styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

  /* Enable scrolling */
  overflow-y: auto;

  /* Hide scrollbar but keep functionality when scrollable */
  /* Add padding for focus outline space, offset with negative margin */
  padding: 3px;
  margin: -3px;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-gutter: stable both-edges;
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* Gradient effect for scroll indication */
  ${({$colorScheme:e})=>"light"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;":"dark"===e?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;":void 0}

  background-repeat: no-repeat;
  background-size:
    100% 32px,
    100% 16px;
  background-attachment: local, scroll;
`,p=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,u=t.styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,x=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,g=t.styled.h3`
  && {
    font-size: 20px;
    line-height: 32px;
    font-weight: 500;
    color: var(--privy-color-foreground);
    margin: 0;
  }
`,v=t.styled.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,m=t.styled.div`
  background: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg, #EAFCEF)";case"warning":return"var(--privy-color-warn, #FEF3C7)";case"error":return"var(--privy-color-error-bg, #FEE2E2)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`,f=t.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    max-height: 90px;
    max-width: 180px;
  }
`,y=t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > :first-child {
    position: relative;
  }

  > div > :last-child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`,j=({children:e,...i})=>(0,r.jsx)(a,{children:(0,r.jsx)(l,{...i,children:e})}),b=t.styled.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,w=(0,t.styled)(n.B)`
  padding: 0;
  && a {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,k=t.styled.div`
  height: 100%;
  width: ${({pct:e})=>e}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,T=({step:e})=>e?(0,r.jsx)(b,{children:(0,r.jsx)(k,{pct:Math.min(100,e.current/e.total*100)})}):null;j.Header=({title:e,subtitle:i,icon:t,iconVariant:o,iconLoadingStatus:n,showBack:s,onBack:a,showInfo:l,onInfo:h,showClose:p,onClose:m,step:f,headerTitle:y,eyebrow:b,...w})=>(0,r.jsxs)(c,{...w,children:[(0,r.jsx)(d,{backFn:s?a:void 0,infoFn:l?h:void 0,onClose:p?m:void 0,title:y,eyebrow:b,closeable:p}),(t||o||e||i)&&(0,r.jsxs)(u,{children:[t||o?(0,r.jsx)(j.Icon,{icon:t,variant:o,loadingStatus:n}):null,!(!e&&!i)&&(0,r.jsxs)(x,{children:[e&&(0,r.jsx)(g,{children:e}),i&&(0,r.jsx)(v,{children:i})]})]}),f&&(0,r.jsx)(T,{step:f})]}),(j.Body=i.default.forwardRef(({children:e,...i},t)=>(0,r.jsx)(h,{ref:t,...i,children:e}))).displayName="Screen.Body",j.Footer=({children:e,...i})=>(0,r.jsx)(p,{id:"privy-content-footer-container",...i,children:e}),j.Actions=({children:e,...i})=>(0,r.jsx)(A,{...i,children:e}),j.HelpText=({children:e,...i})=>(0,r.jsx)(C,{...i,children:e}),j.FooterText=({children:e,...i})=>(0,r.jsx)(L,{...i,children:e}),j.Watermark=()=>(0,r.jsx)(w,{}),j.Icon=({icon:e,variant:t="subtle",loadingStatus:n})=>"logo"===t&&e?(0,r.jsx)(f,"string"==typeof e?{children:(0,r.jsx)("img",{src:e,alt:""})}:i.default.isValidElement(e)?{children:e}:{children:i.default.createElement(e)}):"loading"===t?e?(0,r.jsx)(y,{children:(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,r.jsx)(o.C,{success:n?.success,fail:n?.fail}),"string"==typeof e?(0,r.jsx)("span",{style:{background:`url('${e}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):i.default.isValidElement(e)?i.default.cloneElement(e,{style:{width:"38px",height:"38px"}}):i.default.createElement(e,{style:{width:"38px",height:"38px"}})]})}):(0,r.jsx)(m,{$variant:t,children:(0,r.jsx)(s.N,{size:"64px"})}):(0,r.jsx)(m,{$variant:t,children:e&&("string"==typeof e?(0,r.jsx)("img",{src:e,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):i.default.isValidElement(e)?e:i.default.createElement(e,{width:32,height:32,stroke:(()=>{switch(t){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let A=t.styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,C=t.styled.div`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 13px;
    line-height: 20px;

    & a {
      text-decoration: underline;
    }
  }
`,L=t.styled.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; // 11px
    line-height: 1rem; // 16px
  }
`;e.s(["S",0,j])},520183,e=>{"use strict";var r=e.i(843476),i=e.i(837008),t=e.i(241342);e.s(["S",0,({primaryCta:e,secondaryCta:o,helpText:n,footerText:s,watermark:a=!0,children:l,...c})=>{let d=e||o?(0,r.jsxs)(r.Fragment,{children:[e&&(()=>{let{label:t,...o}=e,n=o.variant||"primary";return(0,r.jsx)(i.a,{...o,variant:n,style:{width:"100%",...o.style},children:t})})(),o&&(()=>{let{label:e,...t}=o,n=t.variant||"secondary";return(0,r.jsx)(i.a,{...t,variant:n,style:{width:"100%",...t.style},children:e})})()]}):null;return(0,r.jsxs)(t.S,{id:c.id,className:c.className,children:[(0,r.jsx)(t.S.Header,{...c}),l?(0,r.jsx)(t.S.Body,{children:l}):null,n||d||a?(0,r.jsxs)(t.S.Footer,{children:[n?(0,r.jsx)(t.S.HelpText,{children:n}):null,d?(0,r.jsx)(t.S.Actions,{children:d}):null,a?(0,r.jsx)(t.S.Watermark,{}):null]}):null,s?(0,r.jsx)(t.S.FooterText,{children:s}):null]})}])},317842,e=>{"use strict";var r=e.i(997053);let i=r.styled.span`
  margin-top: 4px;
  color: var(--privy-color-foreground);
  text-align: center;

  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */

  && a {
    color: var(--privy-color-accent);
  }
`;e.s(["S",0,i])},456842,e=>{"use strict";var r=e.i(997053);let i=r.styled.span`
  color: var(--privy-color-foreground);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.875rem; /* 166.667% */
  text-align: center;
`;e.s(["T",0,i])},704074,e=>{"use strict";var r=e.i(843476),i=e.i(271645);let t=i.forwardRef(function({title:e,titleId:r,...t},o){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":r},t),e?i.createElement("title",{id:r},e):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"}))}),o=i.forwardRef(function({title:e,titleId:r,...t},o){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":r},t),e?i.createElement("title",{id:r},e):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"}))});var n=e.i(393794),n=n,s=e.i(997053),a=e.i(372299),l=e.i(837008),c=e.i(515987),d=e.i(921e3),h=e.i(290382),p=e.i(267669),u=e.i(317842),x=e.i(456842),g=e.i(363827),v=e.i(62842),m=e.i(118364),f=e.i(737577),y=e.i(616918),j=e.i(253082),b=e.i(272313),w=e.i(330604),k=e.i(143416),T=e.i(98341),A=e.i(851757);let C=i.forwardRef(function({title:e,titleId:r,...t},o){return i.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":r},t),e?i.createElement("title",{id:r},e):null,i.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"}))});var L=e.i(705630),S=e.i(868920),E=e.i(595693);let $=(0,s.styled)(c.L)`
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--privy-color-accent);
  svg {
    fill: var(--privy-color-accent);
  }
`;var R=({iconUrl:e,value:i,symbol:t,usdValue:o,nftName:n,nftCount:s,decimals:a,$isLoading:l})=>{if(l)return(0,r.jsx)(I,{$isLoading:l});let c=i&&o&&a?function(e,r,i){let t=parseFloat(e),o=parseFloat(i);if(0===t||0===o||Number.isNaN(t)||Number.isNaN(o))return e;let n=Math.ceil(-Math.log10(.01/(o/t))),s=Math.pow(10,n=Math.max(n=Math.min(n,r),1)),a=+(Math.floor(t*s)/s).toFixed(n).replace(/\.?0+$/,"");return Intl.NumberFormat(void 0,{maximumFractionDigits:r}).format(a)}(i,a,o):i;return(0,r.jsxs)("div",{children:[(0,r.jsxs)(I,{$isLoading:l,children:[e&&(0,r.jsx)(M,{src:e,alt:"Token icon"}),s&&s>1?s+"x":void 0," ",n,c," ",t]}),o&&(0,r.jsxs)(V,{$isLoading:l,children:["$",o]})]})};let I=s.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  /**
   * @NOTE This is a code smell anti-pattern for styling components.
   * We are mixing JSX definitions with styled-components CSS definitions.
   * This is not ideal and should be refactored in the future to separate concerns.
   * This is also hard to read, as it makes it difficult to understand the structure
   * of the component and its styles by viewing the JSX.
   */

  ${y.L}
`,V=s.styled.span`
  color: var(--privy-color-foreground-2);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  ${y.L}
`,M=s.styled.img`
  height: 14px;
  width: 14px;
  margin-right: 4px;
  object-fit: contain;
`,z=e=>{let{chain:i,transactionDetails:t,isTokenContractInfoLoading:o,symbol:n}=e,{action:s,functionName:a}=t;return(0,r.jsx)(b.B,{children:(0,r.jsxs)(d.a,{children:["transaction"!==s&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Action"}),(0,r.jsx)(c.V,{children:a})]}),"mint"===a&&"args"in t&&t.args.filter(e=>e).map((e,t)=>(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:`Param ${t}`}),(0,r.jsx)(c.V,{children:"string"==typeof e&&(0,j.isAddress)(e)?(0,r.jsx)(g.A,{address:e,url:i?.blockExplorers?.default?.url,showCopyIcon:!1}):e?.toString()})]},t)),"setApprovalForAll"===a&&t.operator&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Operator"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:t.operator,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),"setApprovalForAll"===a&&void 0!==t.approved&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Set approval to"}),(0,r.jsx)(c.V,{children:t.approved?"true":"false"})]}),"transfer"===a||"transferWithMemo"===a||"transferFrom"===a||"safeTransferFrom"===a||"approve"===a?(0,r.jsxs)(r.Fragment,{children:["formattedAmount"in t&&t.formattedAmount&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount"}),(0,r.jsxs)(c.V,{$isLoading:o,children:[t.formattedAmount," ",n]})]}),"tokenId"in t&&t.tokenId&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token ID"}),(0,r.jsx)(c.V,{children:t.tokenId.toString()})]})]}):null,"safeBatchTransferFrom"===a&&(0,r.jsxs)(r.Fragment,{children:["amounts"in t&&t.amounts&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amounts"}),(0,r.jsx)(c.V,{children:t.amounts.join(", ")})]}),"tokenIds"in t&&t.tokenIds&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token IDs"}),(0,r.jsx)(c.V,{children:t.tokenIds.join(", ")})]})]}),"approve"===a&&t.spender&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Spender"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:t.spender,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),("transferFrom"===a||"safeTransferFrom"===a||"safeBatchTransferFrom"===a)&&t.transferFrom&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Transferring from"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:t.transferFrom,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),("transferFrom"===a||"safeTransferFrom"===a||"safeBatchTransferFrom"===a)&&t.transferTo&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Transferring to"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:t.transferTo,url:i?.blockExplorers?.default?.url,showCopyIcon:!1})})]})]})})},N=({variant:e,setPreventMaliciousTransaction:i,colorScheme:t="light",preventMaliciousTransaction:o})=>"warn"===e?(0,r.jsx)(F,{children:(0,r.jsxs)(T.W,{theme:t,children:[(0,r.jsx)("span",{style:{fontWeight:"500"},children:"Warning: Suspicious transaction"}),(0,r.jsx)("br",{}),"This has been flagged as a potentially deceptive request. Approving could put your assets or funds at risk."]})}):"error"===e?(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)(F,{children:[(0,r.jsx)(k.E,{theme:t,children:(0,r.jsxs)("div",{children:[(0,r.jsx)("strong",{children:"This is a malicious transaction"}),(0,r.jsx)("br",{}),"This transaction transfers tokens to a known malicious address. Proceeding may result in the loss of valuable assets."]})}),(0,r.jsxs)(O,{children:[(0,r.jsx)(w.C,{color:"var(--privy-color-error)",checked:!o,readOnly:!0,onClick:()=>i(!o)}),(0,r.jsx)("span",{children:"I understand and want to proceed anyways."})]})]})}):null,F=s.styled.div`
  margin-top: 1.5rem;
`,O=s.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
`,B=({transactionIndex:e,maxIndex:r})=>"number"!=typeof e||0===r?"":` (${e+1} / ${r+1})`,P=(0,s.styled)(v.W)`
  ${e=>e.$useSmallMargins?"margin-top: 0.5rem;":"margin-top: 2rem;"}
`,D=(0,s.styled)(d.a)`
  margin-top: 0.5rem;
  border: 1px solid var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-sm);
  padding: 0.5rem;
`,H="There was an error preparing your transaction. Your transaction request will likely fail.",W=s.styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  max-height: 40px;

  > img {
    object-fit: contain;
    border-radius: var(--privy-border-radius-sm);
  }
`,Z=s.styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`,_=s.styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,U=e=>e?.code===S.PrivyErrorCode.COMPLIANCE_BLOCKED,q=()=>(0,r.jsxs)(Q,{children:[(0,r.jsx)(X,{}),(0,r.jsx)(Y,{})]}),G=s.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,J=s.styled.span`
  color: var(--privy-color-foreground);
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.25rem; /* 111.111% */
  text-align: center;
  margin: 10px;
`,K=s.styled.span`
  margin-top: 4px;
  margin-bottom: 10px;
  color: var(--privy-color-foreground-3);
  text-align: center;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.008px;
`,Q=s.styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`,Y=(0,s.styled)(L.default)`
  position: absolute;
  width: 35px;
  height: 35px;
  color: var(--privy-color-error);
`,X=s.styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--privy-color-error);
  opacity: 0.1;
`,ee=(0,s.styled)(l.P)`
  && {
    margin-top: 24px;
  }
  transition:
    color 350ms ease,
    background-color 350ms ease;
`,er=s.styled.span`
  width: 100%;
  text-align: left;
  font-size: 0.825rem;
  color: var(--privy-color-foreground);
  padding: 4px;
`,ei=s.styled.div`
  width: 100%;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`,et=s.styled.text`
  position: relative;
  width: 100%;
  padding: 5px;
  font-size: 0.8rem;
  color: var(--privy-color-foreground-3);
  text-align: left;
  word-wrap: break-word;
`,eo=s.styled.span`
  position: relative;
  width: 100%;
  background-color: var(--privy-color-background-2);
  padding: 8px 12px;
  border-radius: 10px;
  margin-top: 5px;
  font-size: 14px;
  color: var(--privy-color-foreground-3);
  text-align: left;
  word-wrap: break-word;
  ${e=>e.$clickable&&"cursor: pointer;\n  transition: background-color 0.3s;\n  padding-right: 45px;\n\n  &:hover {\n    background-color: var(--privy-color-foreground-4);\n  }"}
`,en=(0,s.styled)(C)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,es=(0,s.styled)(A.default)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,ea=({clicked:e})=>(0,r.jsx)(e?es:en,{});e.s(["S",0,({img:e,submitError:s,prepareError:a,onClose:p,action:v,title:y,subtitle:j,to:b,tokenAddress:w,network:k,missingFunds:T,fee:A,from:C,cta:L,disabled:S,chain:E,isSubmitting:I,isPreparing:V,isTokenPriceLoading:M,isTokenContractInfoLoading:F,isSponsored:O,symbol:D,balance:U,onClick:q,transactionDetails:G,transactionIndex:J,maxIndex:K,onBack:Q,chainName:Y,validation:X,hasScanDetails:ee,setIsScanDetailsOpen:er,preventMaliciousTransaction:ei,setPreventMaliciousTransaction:et,tokensSent:eo,tokensReceived:en,isScanning:es,isCancellable:ea,functionName:el})=>{let{showTransactionDetails:ec,setShowTransactionDetails:ed,hasMoreDetails:eh,isErc20Ish:ep}=(e=>{let[r,t]=(0,i.useState)(!1),o=!0,n=!1;return(!e||e.isErc20Ish||"transaction"===e.action)&&(o=!1),o&&(n=Object.entries(e||{}).some(([e,r])=>r&&!["action","isErc20Ish","isNFTIsh"].includes(e))),{showTransactionDetails:r,setShowTransactionDetails:t,hasMoreDetails:o&&n,isErc20Ish:e?.isErc20Ish}})(G),eu=(0,m.u)(),ex=ep&&F||V||M||es;return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(l.M,{onClose:p,backFn:Q}),e&&(0,r.jsx)(W,{children:e}),(0,r.jsxs)(x.T,{style:{marginTop:e?"1.5rem":0},children:[y,(0,r.jsx)(B,{maxIndex:K,transactionIndex:J})]}),(0,r.jsx)(u.S,{children:j}),(0,r.jsxs)(d.a,{style:{marginTop:"2rem"},children:[(!!eo[0]||ex)&&(0,r.jsxs)(d.R,{children:[en.length>0?(0,r.jsx)(c.L,{children:"Send"}):(0,r.jsx)(c.L,{children:"approve"===v?"Approval amount":"Amount"}),(0,r.jsx)("div",{className:"flex flex-col",children:eo.map((e,i)=>(0,r.jsx)(R,{iconUrl:e.iconUrl,value:"setApprovalForAll"===el?"All":e.value,usdValue:e.usdValue,symbol:e.symbol,nftName:e.nftName,nftCount:e.nftCount,decimals:e.decimals},i))})]}),en.length>0&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Receive"}),(0,r.jsx)("div",{className:"flex flex-col",children:en.map((e,i)=>(0,r.jsx)(R,{iconUrl:e.iconUrl,value:e.value,usdValue:e.usdValue,symbol:e.symbol,nftName:e.nftName,nftCount:e.nftCount,decimals:e.decimals},i))})]}),G&&"spender"in G&&G?.spender?(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Spender"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:G.spender,url:E?.blockExplorers?.default?.url})})]}):null,b&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"To"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:b,url:E?.blockExplorers?.default?.url,showCopyIcon:!0})})]}),w&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token address"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:w,url:E?.blockExplorers?.default?.url})})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Network"}),(0,r.jsx)(c.V,{children:k})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Estimated fee"}),(0,r.jsx)(c.V,{$isLoading:V||M||void 0===O,children:O?(0,r.jsxs)(Z,{children:[(0,r.jsxs)(_,{children:["Sponsored by ",eu.name]}),(0,r.jsx)(t,{height:16,width:16})]}):A})]}),eh&&!ee&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(d.R,{className:"cursor-pointer",onClick:()=>ed(!ec),children:(0,r.jsxs)(c.a,{className:"flex items-center gap-x-1",children:["Details"," ",(0,r.jsx)(n.default,{style:{width:"0.75rem",marginLeft:"0.25rem",transform:ec?"rotate(180deg)":void 0}})]})}),ec&&G&&(0,r.jsx)(z,{action:v,chain:E,transactionDetails:G,isTokenContractInfoLoading:F,symbol:D})]}),ee&&(0,r.jsx)(d.R,{children:(0,r.jsxs)($,{onClick:()=>er(!0),children:[(0,r.jsx)("span",{className:"text-color-primary",children:"Details"}),(0,r.jsx)(o,{height:"14px",width:"14px",strokeWidth:"2"})]})})]}),(0,r.jsx)(f.G,{}),s?(0,r.jsx)(h.E,{style:{marginTop:"2rem"},children:s.message}):a&&0===J?(0,r.jsx)(h.E,{style:{marginTop:"2rem"},children:a.shortMessage??H}):null,(0,r.jsx)(N,{variant:X,preventMaliciousTransaction:ei,setPreventMaliciousTransaction:et}),(0,r.jsx)(P,{$useSmallMargins:!(!a&&!s&&"warn"!==X&&"error"!==X),address:C,balance:U,errMsg:V||a||s||!T?void 0:`Add funds on ${E?.name??Y} to complete transaction.`}),(0,r.jsx)(l.P,{style:{marginTop:"1rem"},loading:I,disabled:S||V,onClick:q,children:L}),ea&&(0,r.jsx)(l.E,{style:{marginTop:"1rem"},onClick:p,isSubmitting:!1,children:"Not now"}),(0,r.jsx)(l.B,{})]})},"T",0,({transactionError:e,chainId:t,onClose:o,onRetry:n,chainType:s,transactionHash:a})=>{let{chains:c}=(0,E.u)(),[d,h]=(0,i.useState)(!1),{errorCode:p,errorMessage:u}=((e,r)=>{if("ethereum"===r)return U(e)?{errorCode:"Transaction blocked",errorMessage:e.message}:{errorCode:e.details??e.message,errorMessage:e.shortMessage};let i=e.txSignature,t=e?.transactionMessage||"Something went wrong.";if(Array.isArray(e.logs)){let r=e.logs.find(e=>/insufficient (lamports|funds)/gi.test(e));r&&(t=r)}return{transactionHash:i,errorMessage:t}})(e,s),x=U(e),g=(({chains:e,chainId:r,chainType:i,transactionHash:t})=>{var o;return"ethereum"===i?e.find(e=>e.id===r)?.blockExplorers?.default.url??"https://etherscan.io":(o=t||"",`https://explorer.solana.com/tx/${o}?chain=${r}`)})({chains:c,chainId:t,chainType:s,transactionHash:a});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(l.M,{onClose:o}),(0,r.jsxs)(G,{children:[(0,r.jsx)(q,{}),(0,r.jsx)(J,{children:p}),(0,r.jsx)(K,{children:x?"This transaction cannot be completed.":"Please try again."}),(0,r.jsxs)(ei,{children:[(0,r.jsx)(er,{children:"Error message"}),(0,r.jsx)(eo,{$clickable:!1,children:u})]}),a&&(0,r.jsxs)(ei,{children:[(0,r.jsx)(er,{children:"Transaction hash"}),(0,r.jsxs)(et,{children:["Copy this hash to view details about the transaction on a"," ",(0,r.jsx)("u",{children:(0,r.jsx)("a",{href:g,children:"block explorer"})}),"."]}),(0,r.jsxs)(eo,{$clickable:!0,onClick:async()=>{await navigator.clipboard.writeText(a),h(!0)},children:[a,(0,r.jsx)(ea,{clicked:d})]})]}),!x&&(0,r.jsx)(ee,{onClick:()=>n({resetNonce:!!a}),children:"Retry transaction"})]}),(0,r.jsx)(l.b,{})]})},"a",0,({img:e,title:o,subtitle:s,cta:v,instructions:y,network:j,blockExplorerUrl:b,isMissingFunds:w,submitError:k,parseError:T,total:A,swap:C,transactingWalletAddress:L,fee:S,balance:E,disabled:R,isSubmitting:I,isPreparing:V,isTokenPriceLoading:M,onClick:z,onClose:N,onBack:F,isSponsored:O})=>{let B=V||M,[U,q]=(0,i.useState)(!1),G=(0,m.u)();return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(l.M,{onClose:N,backFn:F}),e&&(0,r.jsx)(W,{children:e}),(0,r.jsx)(x.T,{style:{marginTop:e?"1.5rem":0},children:o}),(0,r.jsx)(u.S,{children:s}),(0,r.jsxs)(d.a,{style:{marginTop:"2rem",marginBottom:".5rem"},children:[(A||B)&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount"}),(0,r.jsx)(c.V,{$isLoading:B,children:A})]}),C&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Swap"}),(0,r.jsx)(c.V,{children:C})]}),j&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Network"}),(0,r.jsx)(c.V,{children:j})]}),(S||B||void 0!==O)&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Estimated fee"}),(0,r.jsx)(c.V,{$isLoading:B,children:O&&!B?(0,r.jsxs)(Z,{children:[(0,r.jsxs)(_,{children:["Sponsored by ",G.name]}),(0,r.jsx)(t,{height:16,width:16})]}):S})]})]}),(0,r.jsx)(d.R,{children:(0,r.jsxs)($,{onClick:()=>q(e=>!e),children:[(0,r.jsx)("span",{children:"Advanced"}),(0,r.jsx)(n.default,{height:"16px",width:"16px",strokeWidth:"2",style:{transition:"all 300ms",transform:U?"rotate(180deg)":void 0}})]})}),U&&(0,r.jsx)(r.Fragment,{children:y.map((e,i)=>"sol-transfer"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsxs)(p.L,{children:["Transfer ",e.withSeed?"with seed":""]})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount"}),(0,r.jsxs)(c.V,{children:[(0,a.formatTokenAmount)({amount:e.value,decimals:e.token.decimals})," ",e.token.symbol]})]}),!!e.toAccount&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Destination"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.toAccount,url:b})})]})]},i):"spl-transfer"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsxs)(p.L,{children:["Transfer ",e.token.symbol]})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount"}),(0,r.jsx)(c.V,{children:e.value.toString()})]}),!!e.fromAta&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Source"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.fromAta,url:b})})]}),!!e.toAta&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Destination"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.toAta,url:b})})]}),!!e.token.address&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.token.address,url:b})})]})]},i):"ata-creation"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsx)(p.L,{children:"Create token account"})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Program ID"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.program,url:b})})]}),!!e.owner&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Owner"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.owner,url:b})})]})]},i):"create-account"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsxs)(p.L,{children:["Create account ",e.withSeed?"with seed":""]})}),!!e.account&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Account"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.account,url:b})})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount"}),(0,r.jsxs)(c.V,{children:[(0,a.formatTokenAmount)({amount:e.value,decimals:9})," SOL"]})]})]},i):"spl-init-account"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsx)(p.L,{children:"Initialize token account"})}),!!e.account&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Account"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.account,url:b})})]}),!!e.mint&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Mint"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mint,url:b})})]}),!!e.owner&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Owner"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.owner,url:b})})]})]},i):"spl-close-account"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsx)(p.L,{children:"Close token account"})}),!!e.source&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Source"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.source,url:b})})]}),!!e.destination&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Destination"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.destination,url:b})})]}),!!e.owner&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Owner"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.owner,url:b})})]})]},i):"spl-sync-native"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsx)(p.L,{children:"Sync native"})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Program ID"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.program,url:b})})]})]},i):"raydium-swap-base-input"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsxs)(p.L,{children:["Raydium swap"," ",e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:""]})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount in"}),(0,r.jsx)(c.V,{children:e.amountIn.toString()})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Minimum amount out"}),(0,r.jsx)(c.V,{children:e.minimumAmountOut.toString()})]}),e.mintIn&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token in"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintIn,url:b})})]}),e.mintOut&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token out"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintOut,url:b})})]})]},i):"raydium-swap-base-output"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsxs)(p.L,{children:["Raydium swap"," ",e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:""]})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Max amount in"}),(0,r.jsx)(c.V,{children:e.maxAmountIn.toString()})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount out"}),(0,r.jsx)(c.V,{children:e.amountOut.toString()})]}),e.mintIn&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token in"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintIn,url:b})})]}),e.mintOut&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token out"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintOut,url:b})})]})]},i):"jupiter-swap-shared-accounts-route"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsxs)(p.L,{children:["Jupiter swap"," ",e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:""]})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"In amount"}),(0,r.jsx)(c.V,{children:e.inAmount.toString()})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Quoted out amount"}),(0,r.jsx)(c.V,{children:e.quotedOutAmount.toString()})]}),e.mintIn&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token in"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintIn,url:b})})]}),e.mintOut&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token out"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintOut,url:b})})]})]},i):"jupiter-swap-exact-out-route"===e.type?(0,r.jsxs)(D,{children:[(0,r.jsx)(d.R,{children:(0,r.jsxs)(p.L,{children:["Jupiter swap"," ",e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:""]})}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Quoted in amount"}),(0,r.jsx)(c.V,{children:e.quotedInAmount.toString()})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Amount out"}),(0,r.jsx)(c.V,{children:e.outAmount.toString()})]}),e.mintIn&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token in"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintIn,url:b})})]}),e.mintOut&&(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Token out"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.mintOut,url:b})})]})]},i):(0,r.jsxs)(D,{children:[(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Program ID"}),(0,r.jsx)(c.V,{children:(0,r.jsx)(g.A,{address:e.program,url:b})})]}),(0,r.jsxs)(d.R,{children:[(0,r.jsx)(c.L,{children:"Data"}),(0,r.jsx)(c.V,{children:e.discriminator})]})]},i))}),(0,r.jsx)(f.G,{}),k?(0,r.jsx)(h.E,{style:{marginTop:"2rem"},children:k.message}):T?(0,r.jsx)(h.E,{style:{marginTop:"2rem"},children:H}):null,(0,r.jsx)(P,{$useSmallMargins:!(!T&&!k),title:"",address:L,balance:E,errMsg:V||T||k||!w?void 0:"Add funds on Solana to complete transaction."}),(0,r.jsx)(l.P,{style:{marginTop:"1rem"},loading:I,disabled:R||V,onClick:z,children:v}),(0,r.jsx)(l.B,{})]})}],704074)},62842,e=>{"use strict";var r=e.i(843476),i=e.i(823209),t=e.i(355982),o=e.i(271645),n=e.i(997053),s=e.i(837008),a=e.i(290382),l=e.i(267669),c=e.i(363827),d=e.i(272313);let h=(0,n.styled)(d.B)`
  && {
    padding: 0.75rem;
    height: 56px;
  }
`,p=n.styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,u=n.styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`,x=n.styled.div`
  font-size: 12px;
  line-height: 1rem;
  color: var(--privy-color-foreground-3);
`,g=(0,n.styled)(l.L)`
  text-align: left;
  margin-bottom: 0.5rem;
`,v=(0,n.styled)(a.E)`
  margin-top: 0.25rem;
`,m=(0,n.styled)(s.S)`
  && {
    gap: 0.375rem;
    font-size: 14px;
  }
`;e.s(["W",0,({errMsg:e,balance:n,address:s,className:a,title:l,showCopyButton:d=!1})=>{let[f,y]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{if(f){let e=setTimeout(()=>y(!1),3e3);return()=>clearTimeout(e)}},[f]),(0,r.jsxs)("div",{children:[l&&(0,r.jsx)(g,{children:l}),(0,r.jsx)(h,{className:a,$state:e?"error":void 0,children:(0,r.jsxs)(p,{children:[(0,r.jsxs)(u,{children:[(0,r.jsx)(c.A,{address:s,showCopyIcon:!1}),void 0!==n&&(0,r.jsx)(x,{children:n})]}),d&&(0,r.jsx)(m,{onClick:function(e){e.stopPropagation(),navigator.clipboard.writeText(s).then(()=>y(!0)).catch(console.error)},size:"sm",children:(0,r.jsxs)(r.Fragment,f?{children:["Copied",(0,r.jsx)(i.Check,{size:14})]}:{children:["Copy",(0,r.jsx)(t.Copy,{size:14})]})})]})}),e&&(0,r.jsx)(v,{children:e})]})}])},98341,e=>{"use strict";var r=e.i(843476),i=e.i(530448),t=e.i(997053);let o=t.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-warn-bg);
  border: 1px solid var(--privy-color-border-warning);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,n=t.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["W",0,({children:e,theme:t,className:s})=>(0,r.jsxs)(o,{$theme:t,className:s,children:[(0,r.jsx)(i.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-warning)",strokeWidth:2,style:{flexShrink:0}}),(0,r.jsx)(n,{$theme:t,children:e})]})])},632964,e=>{"use strict";var r=e.i(843476),i=e.i(997053);let t=i.styled.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,o=i.styled.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,n=i.styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg,
  img {
    width: calc(var(--spinner-size) * 0.4);
    height: calc(var(--spinner-size) * 0.4);
    border-radius: var(--privy-border-radius-full);
  }
`,s=i.styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);

  && {
    border: 4px solid var(--privy-color-border-default);
    border-radius: 50%;
  }
`,a=i.styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: var(--spinner-size);
  height: var(--spinner-size);
  animation: spin 1200ms linear infinite;

  && {
    border: 4px solid;
    border-color: var(--privy-color-icon-subtle) transparent transparent transparent;
    border-radius: 50%;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;e.s(["N",0,({size:e,centerIcon:i})=>(0,r.jsx)(t,{$size:e,children:(0,r.jsxs)(o,{children:[(0,r.jsx)(s,{}),(0,r.jsx)(a,{}),i?(0,r.jsx)(n,{children:i}):null]})})])},520475,e=>{"use strict";var r=e.i(271645),i=e.i(662123);let t="0x0000000000000000000000000000000000000000",o="https://api.relay.link",n="https://api.testnets.relay.link",s=async({input:e,isTestnet:r})=>{let i=await fetch((r?n:o)+"/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),t=await i.json();if(!(i.ok||"string"==typeof t.message&&t.message.startsWith("Invalid address")))throw console.error("Relay error:",t),Error(t.message??"Error fetching quote from relay");return t};async function a({transactionHash:e,isTestnet:r}){let i=await fetch((r?n:o)+"/requests/v2?hash="+e),t=await i.json();if(!i.ok){if("message"in t&&"string"==typeof t.message)throw Error(t.message);throw Error("Error fetching request from relay")}return t.requests.at(0)?.status??"pending"}class l extends i.P{constructor(e,r){super("We were unable to complete the bridging transaction. Funds will be refunded on your wallet.",void 0,i.a.TRANSACTION_FAILURE),this.relayLink=r?`https://testnets.relay.link/transaction/${e}`:`https://relay.link/transaction/${e}`}}e.s(["R",0,l,"a",0,e=>{let r=e.steps[0]?.items?.[0];if(r)return{from:r.data.from,to:r.data.to,value:Number(r.data.value),chainId:Number(r.data.chainId),data:r.data.data}},"b",0,"11111111111111111111111111111111","c",0,0x2f3fb341,"d",0,e=>e.steps.flatMap(e=>e.items?.filter(e=>"incomplete"===e.status)??[]).map(e=>({from:e.data.from,to:e.data.to,value:Number(e.data.value),chainId:Number(e.data.chainId),data:e.data.data})),"e",0,"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","g",0,s,"t",0,({appId:e,originCurrency:r,destinationCurrency:i,...o})=>({tradeType:"EXPECTED_OUTPUT",originCurrency:r??t,destinationCurrency:i??t,referrer:`privy|${e}`,...o}),"u",0,function({transactionHash:e,isTestnet:i,bridgingStatus:t,setBridgingStatus:o,onSuccess:n,onFailure:s}){(0,r.useEffect)(()=>{if(e&&t){if(["delayed","waiting","pending"].includes(t)){let r=setInterval(async()=>{try{let r=await a({transactionHash:e,isTestnet:i});o(r)}catch(e){console.error(e)}},1e3);return()=>clearInterval(r)}"success"===t?n({transactionHash:e}):["refund","failure"].includes(t)&&s({error:new l(e,i)})}},[t,e,i])}])},126347,e=>{"use strict";let r=new Set(["https:","mailto:"]);e.s(["t",0,function(e){if(!e)return null;try{if(r.has(new URL(e).protocol))return e}catch{}return null}])},272313,e=>{"use strict";var r=e.i(997053);let i=r.css`
  && {
    border-width: 1px;
    padding: 0.5rem 1rem;
  }

  width: 100%;
  text-align: left;
  border: solid 1px var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${e=>"error"===e.$state?"\n        border-color: var(--privy-color-error);\n        background: var(--privy-color-error-bg);\n      ":""}
`,t=r.styled.div`
  ${i}
`;e.s(["B",0,t,"a",0,i])},773524,e=>{"use strict";var r=e.i(271645);let i=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,i)=>i?i.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},t=(...e)=>e.filter((e,r,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===r).join(" ").trim();var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let n=(0,r.forwardRef)(({color:e="currentColor",size:i=24,strokeWidth:n=2,absoluteStrokeWidth:s,className:a="",children:l,iconNode:c,...d},h)=>(0,r.createElement)("svg",{ref:h,...o,width:i,height:i,stroke:e,strokeWidth:s?24*Number(n)/Number(i):n,className:t("lucide",a),...!l&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(d)&&{"aria-hidden":"true"},...d},[...c.map(([e,i])=>(0,r.createElement)(e,i)),...Array.isArray(l)?l:[l]]));e.s(["default",0,(e,o)=>{let s=(0,r.forwardRef)(({className:s,...a},l)=>(0,r.createElement)(n,{ref:l,iconNode:o,className:t(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,s),...a}));return s.displayName=i(e),s}],773524)},823209,e=>{"use strict";let r=(0,e.i(773524).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",0,r],823209)},355982,e=>{"use strict";let r=(0,e.i(773524).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",0,r],355982)},265145,e=>{"use strict";let r=(0,e.i(773524).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",0,r],265145)},997787,e=>{"use strict";let r=(0,e.i(773524).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,r],997787)}]);