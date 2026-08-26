(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,993556,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});e.s(["default",0,i])},72903,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}))});e.s(["default",0,i])},652038,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"}))});e.s(["default",0,i])},974935,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});e.s(["default",0,i])},518139,e=>{"use strict";var r=e.i(271645);let i=r.forwardRef(function({title:e,titleId:i,...t},o){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":i},t),e?r.createElement("title",{id:i},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"}))});e.s(["default",0,i])},363827,e=>{"use strict";var r=e.i(843476),i=e.i(823209),t=e.i(355982),o=e.i(271645),a=e.i(997053),n=e.i(435232),l=e.i(837008);let s=a.styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`,c=a.styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,d=a.styled.a`
  font-size: 14px;
  color: var(--privy-color-foreground);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;e.s(["A",0,({address:e,showCopyIcon:a,url:p,className:h})=>{let[v,u]=(0,o.useState)(!1);function g(r){r.stopPropagation(),navigator.clipboard.writeText(e).then(()=>u(!0)).catch(console.error)}return(0,o.useEffect)(()=>{if(v){let e=setTimeout(()=>u(!1),3e3);return()=>clearTimeout(e)}},[v]),(0,r.jsxs)(s,p?{children:[(0,r.jsx)(d,{title:e,className:h,href:`${p}/address/${e}`,target:"_blank",children:(0,n.d)(e)}),a&&(0,r.jsx)(l.S,{onClick:g,size:"sm",style:{gap:"0.375rem"},children:(0,r.jsxs)(r.Fragment,v?{children:["Copied",(0,r.jsx)(i.Check,{size:16})]}:{children:["Copy",(0,r.jsx)(t.Copy,{size:16})]})})]}:{children:[(0,r.jsx)(c,{title:e,className:h,children:(0,n.d)(e)}),a&&(0,r.jsx)(l.S,{onClick:g,size:"sm",style:{gap:"0.375rem",fontSize:"14px"},children:(0,r.jsxs)(r.Fragment,v?{children:["Copied",(0,r.jsx)(i.Check,{size:14})]}:{children:["Copy",(0,r.jsx)(t.Copy,{size:14})]})})]})}])},314866,e=>{"use strict";var r=e.i(843476),i=e.i(997053),t=e.i(616918);let o=i.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let r,t;"green"===e.$color&&(r="var(--privy-color-success-dark)",t="var(--privy-color-success-light)"),"red"===e.$color&&(r="var(--privy-color-error)",t="var(--privy-color-error-light)"),"gray"===e.$color&&(r="var(--privy-color-foreground-2)",t="var(--privy-color-background-2)");let o=i.keyframes`
      from, to {
        background-color: ${t};
      }

      50% {
        background-color: rgba(${t}, 0.8);
      }
    `;return i.css`
      color: ${r};
      background-color: ${t};
      ${e.$isPulsing&&i.css`
        animation: ${o} 3s linear infinite;
      `};
    `}}

  ${t.L}
`;e.s(["C",0,({children:e,color:i,isLoading:t,isPulsing:a,...n})=>(0,r.jsx)(o,{$color:i,$isLoading:t,$isPulsing:a,...n,children:e})])},290382,e=>{"use strict";var r=e.i(997053);let i=r.styled.span`
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */

  color: var(--privy-color-error);
`;e.s(["E",0,i])},282975,e=>{"use strict";var r=e.i(843476),i=e.i(346146),t=e.i(837008);e.s(["t",0,function({title:e}){let{currentScreen:o,navigateBack:a,navigate:n,data:l,setModalData:s}=(0,i.u)();return(0,r.jsx)(t.M,{title:e,backFn:"ManualTransferScreen"===o?a:o===l?.funding?.methodScreen?l.funding.comingFromSendTransactionScreen?()=>n("SendTransactionScreen"):void 0:l?.funding?.methodScreen?()=>{let e=l.funding;e.usingDefaultFundingMethod&&(e.usingDefaultFundingMethod=!1),s({funding:e,solanaFundingData:l?.solanaFundingData}),n(e.methodScreen)}:void 0})}])},213444,e=>{"use strict";var r=e.i(843476),i=e.i(518139);e.s(["I",0,({icon:e,name:t})=>"string"==typeof e?(0,r.jsx)("img",{alt:`${t||"wallet"} logo`,src:e,style:{height:24,width:24,borderRadius:4}}):void 0===e?(0,r.jsx)(i.default,{style:{height:24,width:24}}):e?(0,r.jsx)(e,{style:{height:24,width:24}}):null])},339484,e=>{"use strict";var r=e.i(843476),i=e.i(402809),t=e.i(540803);let o=(0,e.i(773524).default)("trash-2",[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]]);var a=e.i(271645),n=e.i(997053),l=e.i(737577),s=e.i(763421),c=e.i(662123),d=e.i(595693),p=e.i(346146),h=e.i(600476),v=e.i(571652),u=e.i(520183);e.i(437206),e.i(123287),e.i(33750);let g=({passkeys:e,name:o,isLoading:a,errorReason:n,success:l,expanded:s,onLinkPasskey:c,onUnlinkPasskey:d,onExpand:p,onBack:h,onClose:v})=>l?(0,r.jsx)(u.S,{title:"Passkeys updated",icon:i.CheckCircle,iconVariant:"success",primaryCta:{label:"Done",onClick:v},onClose:v,watermark:!0}):s?(0,r.jsx)(u.S,{icon:t.FingerprintIcon,title:"Your passkeys",onBack:h,onClose:v,watermark:!0,children:(0,r.jsx)(b,{passkeys:e,expanded:s,onUnlink:d,onExpand:p})}):(0,r.jsxs)(u.S,{icon:t.FingerprintIcon,title:"Set up passkey verification",subtitle:"Verify with passkey",primaryCta:{label:"Add new passkey",onClick:c,loading:a},onClose:v,watermark:!0,helpText:n||void 0,children:[0===e.length?(0,r.jsx)(w,{}):(0,r.jsx)(x,{children:(0,r.jsx)(b,{passkeys:e,expanded:s,onUnlink:d,onExpand:p})}),o?(0,r.jsxs)(f,{children:[(0,r.jsx)(y,{children:"New Passkey Name"}),(0,r.jsx)(m,{children:o})]}):null]}),x=n.styled.div`
  margin-bottom: 0.75rem;
`,f=n.styled.div`
  margin-top: 0.25rem;
`,y=n.styled.div`
  color: var(--privy-color-foreground-2);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,m=n.styled.div`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  line-height: 1.25rem;
`,b=({passkeys:e,expanded:i,onUnlink:t,onExpand:n})=>{let[s,c]=(0,a.useState)([]),d=i?e.length:2;return(0,r.jsxs)("div",{children:[(0,r.jsx)($,{children:"Your passkeys"}),(0,r.jsxs)(z,{children:[e.slice(0,d).map(e=>(0,r.jsxs)(S,{children:[(0,r.jsxs)("div",{children:[(0,r.jsx)(M,{children:e.authenticatorName?e.createdWithBrowser?`${e.authenticatorName} on ${e.createdWithBrowser}`:e.authenticatorName:e.createdWithBrowser?e.createdWithOs?`${e.createdWithBrowser} on ${e.createdWithOs}`:`${e.createdWithBrowser}`:"Unknown device"}),(0,r.jsxs)(F,{children:["Last used:"," ",(e.latestVerifiedAt??e.firstVerifiedAt)?.toLocaleString()??"N/A"]})]}),(0,r.jsx)(V,{disabled:s.includes(e.credentialId),onClick:()=>(async e=>{c(r=>r.concat([e])),await t(e),c(r=>r.filter(r=>r!==e))})(e.credentialId),children:s.includes(e.credentialId)?(0,r.jsx)(l.B,{}):(0,r.jsx)(o,{size:16})})]},e.credentialId)),e.length>2&&!i&&(0,r.jsx)(L,{onClick:n,children:"View all"})]})]})},w=()=>(0,r.jsxs)(s.T,{style:{color:"var(--privy-color-foreground)"},children:[(0,r.jsx)(s.a,{children:"Verify with Touch ID, Face ID, PIN, or hardware key"}),(0,r.jsx)(s.a,{children:"Takes seconds to set up and use"}),(0,r.jsx)(s.a,{children:"Use your passkey to verify transactions and login to your account"})]}),j={component:()=>{let{user:e}=(0,h.u)(),{unlink:i}=(0,v.l)(),{linkWithPasskey:t,closePrivyModal:o}=(0,d.u)(),{data:n}=(0,p.u)(),l=e?.linkedAccounts.filter(e=>"passkey"===e.type),[s,u]=(0,a.useState)(!1),[x,f]=(0,a.useState)(""),[y,m]=(0,a.useState)(!1),[b,w]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{0===l.length&&w(!1)},[l.length]),(0,r.jsx)(g,{passkeys:l,name:n?.passkeyAuthModalData?.name,isLoading:s,errorReason:x,success:y,expanded:b,onLinkPasskey:()=>{u(!0),t({name:n?.passkeyAuthModalData?.name}).then(()=>m(!0)).catch(e=>{if(e instanceof c.b){if(e.privyErrorCode===c.a.CANNOT_LINK_MORE_OF_TYPE)return void f("Cannot link more passkeys to account.");if(e.privyErrorCode===c.a.PASSKEY_NOT_ALLOWED)return void f("Passkey request timed out or rejected by user.")}f("Unknown error occurred.")}).finally(()=>{u(!1)})},onUnlinkPasskey:async e=>(u(!0),await i({credentialId:e}).then(()=>m(!0)).catch(e=>{e instanceof c.b&&e.privyErrorCode===c.a.MISSING_MFA_CREDENTIALS?f("Cannot unlink a passkey enrolled in MFA"):f("Unknown error occurred.")}).finally(()=>{u(!1)})),onExpand:()=>w(!0),onBack:()=>w(!1),onClose:()=>o()})}},k=n.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 90px;
  border-radius: 50%;
  svg + svg {
    margin-left: 12px;
  }
  > svg {
    z-index: 2;
    color: var(--privy-color-accent) !important;
    stroke: var(--privy-color-accent) !important;
    fill: var(--privy-color-accent) !important;
  }
`,C=n.css`
  && {
    width: 100%;
    font-size: 0.875rem;
    line-height: 1rem;

    /* Tablet and Up */
    @media (min-width: 440px) {
      font-size: 14px;
    }

    display: flex;
    gap: 12px;
    justify-content: center;

    padding: 6px 8px;
    background-color: var(--privy-color-background);
    transition: background-color 200ms ease;
    color: var(--privy-color-accent) !important;

    :focus {
      outline: none;
      box-shadow: none;
    }
  }
`,L=n.styled.button`
  ${C}
`,z=n.styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
  padding: 0.5rem 0rem 0rem;
  flex-grow: 1;
  width: 100%;
`,$=n.styled.div`
  line-height: 20px;
  height: 20px;
  font-size: 1em;
  font-weight: 450;
  display: flex;
  justify-content: flex-beginning;
  width: 100%;
`,M=n.styled.div`
  font-size: 1em;
  line-height: 1.3em;
  font-weight: 500;
  color: var(--privy-color-foreground-2);
  padding: 0.2em 0;
`,F=n.styled.div`
  font-size: 0.875rem;
  line-height: 1rem;
  color: #64668b;
  padding: 0.2em 0;
`,S=n.styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: left;
  border-radius: 8px;
  border: 1px solid #e2e3f0 !important;
  width: 100%;
  height: 5em;
`,E=n.css`
  :focus,
  :hover,
  :active {
    outline: none;
  }
  display: flex;
  width: 2em;
  height: 2em;
  justify-content: center;
  align-items: center;
  svg {
    color: var(--privy-color-error);
  }
  svg:hover {
    color: var(--privy-color-foreground-3);
  }
`,V=n.styled.button`
  ${E}
`;e.s(["DoubleIconWrapper",0,k,"LinkButton",0,L,"LinkPasskeyScreen",0,j,"LinkPasskeyView",0,g,"default",0,j],339484)},616918,e=>{"use strict";var r=e.i(997053);let i=r.keyframes`
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
`;e.s(["L",0,t])},837008,e=>{"use strict";var r=e.i(843476),i=e.i(997053),t=e.i(118364),o=e.i(737577),a=e.i(993556),n=e.i(974935),l=e.i(271645);let s=l.forwardRef(function({title:e,titleId:r,...i},t){return l.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":r},i),e?l.createElement("title",{id:r},e):null,l.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var c=e.i(595693);function d(e){return(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...e,children:(0,r.jsx)("g",{fill:e.color||"var(--privy-color-foreground)",children:(0,r.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let p=i.styled.span`
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  color: var(--privy-color-foreground-3);
  display: block;

  && > a {
    color: var(--privy-color-accent);
  }
`,h=i.styled.a`
  && {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,v=i.styled.div`
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
`,u=i.styled.button`
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
`,g=({children:e,loading:i,disabled:t,success:a,size:n="lg",loadingText:l="Loading...",as:s,onClick:c,...d})=>{let p="a"===s,h=!(!i&&!t);return(0,r.jsx)(f,{as:s,disabled:p?void 0:h,"aria-disabled":p?h:void 0,$success:a,$size:n,onClick:e=>{p&&h?e.preventDefault():c?.(e)},...d,children:i?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.B,{}),l?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:l}):null]}):e})},x=(0,i.styled)(u)`
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
`,f=(0,i.styled)(u)`
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
`,y=({children:e,loading:i,disabled:t,size:a="lg",loadingText:n="Loading...",as:l,onClick:s,...c})=>{let d="a"===l,p=!(!i&&!t);return(0,r.jsx)(b,{as:l,disabled:d?void 0:p,"aria-disabled":d?p:void 0,$size:a,onClick:e=>{d&&p?e.preventDefault():s?.(e)},...c,children:i?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.B,{}),n?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:n}):null]}):e})},m=({children:e,loading:i,disabled:t,size:a="lg",loadingText:n="Loading...",as:l,onClick:s,...c})=>{let d="a"===l,p=!(!i&&!t);return(0,r.jsx)(w,{as:l,disabled:d?void 0:p,"aria-disabled":d?p:void 0,$size:a,onClick:e=>{d&&p?e.preventDefault():s?.(e)},...c,children:i?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.B,{}),n?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:n}):null]}):e})},b=(0,i.styled)(u)`
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
`,w=(0,i.styled)(u)`
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
`,j=i.styled.button`
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
`,C=({backFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)($,{onClick:e,children:(0,r.jsx)(a.default,{height:"16px",width:"16px",strokeWidth:2})})}),L=({infoFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)(M,{"aria-label":"info",onClick:e,children:(0,r.jsx)(n.default,{height:"22px",width:"22px",strokeWidth:2})})}),z=e=>(0,r.jsx)("div",{children:(0,r.jsx)($,{"aria-label":"close modal",onClick:e.onClose,children:(0,r.jsx)(s,{height:"16px",width:"16px",strokeWidth:2})})}),$=i.styled.button`
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
`,M=(0,i.styled)($)`
  && {
    background-color: transparent;
  }
`,F=i.styled.div`
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
`,S=i.styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`,E=i.styled.div`
  display: flex;
  justify-content: flex-end;
`,V=i.styled.div`
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
`,A=i.styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
`;e.s(["B",0,({className:e})=>{let{appearance:i}=(0,t.u)();return(0,r.jsx)(v,{className:e,children:i.footerLogo??(0,r.jsx)(h,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,r.jsx)(d,{color:"currentColor",height:13,width:150})})})},"E",0,({children:e,onClick:i,disabled:t,isSubmitting:a,...n})=>(0,r.jsxs)(k,{$isSubmitting:a,onClick:i,disabled:t,...n,children:[(0,r.jsx)("span",{children:e}),(0,r.jsx)("span",{children:(0,r.jsx)(o.B,{})})]}),"M",0,({backFn:e,infoFn:i,onClose:o,title:a,eyebrow:n,closeable:l=!0,className:s})=>{let{closePrivyModal:d}=(0,c.u)(),p=(0,t.u)();return(0,r.jsxs)(F,{className:s,children:[(0,r.jsxs)(S,{children:[e&&(0,r.jsx)(C,{backFn:e}),n&&(0,r.jsx)(A,{children:n}),!n&&a&&(0,r.jsx)(V,{id:"privy-dialog-title",children:a}),(0,r.jsx)("div",{style:{height:24}}),i&&(0,r.jsx)(L,{infoFn:i})]}),(0,r.jsx)(E,{children:!p.render.standalone&&l&&(0,r.jsx)(z,{onClose:o||(()=>d())})})]})},"P",0,g,"S",0,y,"T",0,function({app:{legal:{privacyPolicyUrl:e,termsAndConditionsUrl:i,requireUsersAcceptTerms:t}},alwaysShowImplicitConsent:o}){let a=!(!e||!i);return(!t||o)&&(i||e)?(0,r.jsxs)(p,{children:["By logging in I agree to the"," ",i&&(0,r.jsx)("a",{href:i,target:"_blank",children:a?"Terms":"Terms of Service"}),a&&" & ",e&&(0,r.jsx)("a",{href:e,target:"_blank",children:"Privacy Policy"})]}):(0,r.jsx)(p,{})},"a",0,({variant:e="primary",size:i="lg",children:t,success:o,...a})=>{switch(e){case"secondary":return(0,r.jsx)(y,{size:i,...a,children:t});case"error":return(0,r.jsx)(y,{$warn:!0,size:i,...a,children:t});case"muted":return(0,r.jsx)(m,{size:i,...a,children:t});default:return(0,r.jsx)(g,{size:i,success:o,...a,children:t})}},"b",0,v,"c",0,({children:e,loading:i,disabled:t,...a})=>(0,r.jsx)(x,{disabled:t,...a,children:i?(0,r.jsx)(o.B,{color:"var(--privy-color-foreground-accent)"}):e}),"d",0,j,"e",0,m],837008)},921e3,e=>{"use strict";var r=e.i(997053);let i=r.styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`,t=r.styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
`;e.s(["R",0,t,"a",0,i])},241342,e=>{"use strict";var r=e.i(843476),i=e.i(271645),t=e.i(997053),o=e.i(737577),a=e.i(837008),n=e.i(632964);let l=t.styled.div`
  /* spacing tokens */
  --screen-space: 16px; /* base 1x = 16 */
  --screen-space-lg: calc(var(--screen-space) * 1.5); /* 24px */

  position: relative;
  overflow: hidden;
  margin: 0 calc(-1 * var(--screen-space)); /* extends over modal padding */
  height: 100%;
  border-radius: var(--privy-border-radius-lg);
`,s=t.styled.div`
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
`,d=(0,t.styled)(a.M)`
  margin: 0 -8px;
`,p=t.styled.div`
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
`,h=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--screen-space-lg);
  margin-top: 1.5rem;
`,v=t.styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,u=t.styled.div`
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
`,x=t.styled.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,f=t.styled.div`
  background: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg, #EAFCEF)";case"warning":return"var(--privy-color-warn, #FEF3C7)";case"error":return"var(--privy-color-error-bg, #FEE2E2)";case"loading":case"logo":return"transparent";default:return"var(--privy-color-background-2)"}}};

  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`,y=t.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  svg {
    max-height: 90px;
    max-width: 180px;
  }
`,m=t.styled.div`
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
`,b=({children:e,...i})=>(0,r.jsx)(l,{children:(0,r.jsx)(s,{...i,children:e})}),w=t.styled.div`
  position: absolute;
  top: 0;
  left: calc(-1 * var(--screen-space-lg));
  width: calc(100% + calc(var(--screen-space-lg) * 2));
  height: 4px;
  background: var(--privy-color-background-2);
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  overflow: hidden;
`,j=(0,t.styled)(a.B)`
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
`,C=({step:e})=>e?(0,r.jsx)(w,{children:(0,r.jsx)(k,{pct:Math.min(100,e.current/e.total*100)})}):null;b.Header=({title:e,subtitle:i,icon:t,iconVariant:o,iconLoadingStatus:a,showBack:n,onBack:l,showInfo:s,onInfo:p,showClose:h,onClose:f,step:y,headerTitle:m,eyebrow:w,...j})=>(0,r.jsxs)(c,{...j,children:[(0,r.jsx)(d,{backFn:n?l:void 0,infoFn:s?p:void 0,onClose:h?f:void 0,title:m,eyebrow:w,closeable:h}),(t||o||e||i)&&(0,r.jsxs)(v,{children:[t||o?(0,r.jsx)(b.Icon,{icon:t,variant:o,loadingStatus:a}):null,!(!e&&!i)&&(0,r.jsxs)(u,{children:[e&&(0,r.jsx)(g,{children:e}),i&&(0,r.jsx)(x,{children:i})]})]}),y&&(0,r.jsx)(C,{step:y})]}),(b.Body=i.default.forwardRef(({children:e,...i},t)=>(0,r.jsx)(p,{ref:t,...i,children:e}))).displayName="Screen.Body",b.Footer=({children:e,...i})=>(0,r.jsx)(h,{id:"privy-content-footer-container",...i,children:e}),b.Actions=({children:e,...i})=>(0,r.jsx)(L,{...i,children:e}),b.HelpText=({children:e,...i})=>(0,r.jsx)(z,{...i,children:e}),b.FooterText=({children:e,...i})=>(0,r.jsx)($,{...i,children:e}),b.Watermark=()=>(0,r.jsx)(j,{}),b.Icon=({icon:e,variant:t="subtle",loadingStatus:a})=>"logo"===t&&e?(0,r.jsx)(y,"string"==typeof e?{children:(0,r.jsx)("img",{src:e,alt:""})}:i.default.isValidElement(e)?{children:e}:{children:i.default.createElement(e)}):"loading"===t?e?(0,r.jsx)(m,{children:(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,r.jsx)(o.C,{success:a?.success,fail:a?.fail}),"string"==typeof e?(0,r.jsx)("span",{style:{background:`url('${e}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):i.default.isValidElement(e)?i.default.cloneElement(e,{style:{width:"38px",height:"38px"}}):i.default.createElement(e,{style:{width:"38px",height:"38px"}})]})}):(0,r.jsx)(f,{$variant:t,children:(0,r.jsx)(n.N,{size:"64px"})}):(0,r.jsx)(f,{$variant:t,children:e&&("string"==typeof e?(0,r.jsx)("img",{src:e,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):i.default.isValidElement(e)?e:i.default.createElement(e,{width:32,height:32,stroke:(()=>{switch(t){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let L=t.styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,z=t.styled.div`
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
`,$=t.styled.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; // 11px
    line-height: 1rem; // 16px
  }
`;e.s(["S",0,b])},810977,e=>{"use strict";var r=e.i(843476),i=e.i(997053);let t=({title:e,description:i,children:t,...a})=>(0,r.jsx)(o,{...a,children:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("h3",{children:e}),"string"==typeof i?(0,r.jsx)("p",{children:i}):i,t]})});(0,i.styled)(t)`
  margin-bottom: 24px;
`;let o=i.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  width: 100%;
  margin-bottom: 24px;

  && h3 {
    font-size: 17px;
    color: var(--privy-color-foreground);
  }

  /* Sugar assuming children are paragraphs. Otherwise, handling styling on your own */
  && p {
    color: var(--privy-color-foreground-2);
    font-size: 14px;
  }
`,a=(0,i.styled)(o)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`;e.s(["C",0,({title:e,description:i,icon:t,children:o,...n})=>(0,r.jsxs)(a,{...n,children:[t||null,(0,r.jsx)("h3",{children:e}),i&&"string"==typeof i?(0,r.jsx)("p",{children:i}):i,o]}),"S",0,t])},520183,e=>{"use strict";var r=e.i(843476),i=e.i(837008),t=e.i(241342);e.s(["S",0,({primaryCta:e,secondaryCta:o,helpText:a,footerText:n,watermark:l=!0,children:s,...c})=>{let d=e||o?(0,r.jsxs)(r.Fragment,{children:[e&&(()=>{let{label:t,...o}=e,a=o.variant||"primary";return(0,r.jsx)(i.a,{...o,variant:a,style:{width:"100%",...o.style},children:t})})(),o&&(()=>{let{label:e,...t}=o,a=t.variant||"secondary";return(0,r.jsx)(i.a,{...t,variant:a,style:{width:"100%",...t.style},children:e})})()]}):null;return(0,r.jsxs)(t.S,{id:c.id,className:c.className,children:[(0,r.jsx)(t.S.Header,{...c}),s?(0,r.jsx)(t.S.Body,{children:s}):null,a||d||l?(0,r.jsxs)(t.S.Footer,{children:[a?(0,r.jsx)(t.S.HelpText,{children:a}):null,d?(0,r.jsx)(t.S.Actions,{children:d}):null,l?(0,r.jsx)(t.S.Watermark,{}):null]}):null,n?(0,r.jsx)(t.S.FooterText,{children:n}):null]})}])},317842,e=>{"use strict";var r=e.i(997053);let i=r.styled.span`
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
`;e.s(["T",0,i])},763421,e=>{"use strict";var r=e.i(843476),i=e.i(738540),t=e.i(823209),o=e.i(271645),a=e.i(997053);let n=a.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px; /* 10px gap between items */
  padding-left: 8px; /* 8px indentation container */
`;a.styled.div`
  &&& {
    margin-left: 6px; /* Center the line under the checkbox (12px/2) */
    border-left: 2px solid var(--privy-color-foreground-4);
    height: 10px; /* 10px H padding between paragraphs */
    margin-top: 0;
    margin-bottom: 0;
  }
`;let l=a.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({$variant:e})=>{switch(e){case"success":return"var(--privy-color-success-bg, #EAFCEF)";case"error":return"var(--privy-color-error-bg, #FEE2E2)";default:return"var(--privy-color-background-2)"}}};
  flex-shrink: 0;
`,s=a.styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start; /* Align all elements to the top */
  text-align: left;
  gap: 8px;

  && {
    a {
      color: var(--privy-color-accent);
    }
  }
`;e.s(["T",0,n,"a",0,({children:e,variant:a="default",icon:n})=>{let c=()=>{switch(a){case"success":return"var(--privy-color-icon-success)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}};return(0,r.jsxs)(s,{children:[(0,r.jsx)(l,{$variant:a,"data-variant":a,children:(()=>{if(n)return o.default.isValidElement(n)?o.default.cloneElement(n,{stroke:c(),strokeWidth:2}):n;switch(a){case"success":default:return(0,r.jsx)(t.Check,{size:12,stroke:c(),strokeWidth:3});case"error":return(0,r.jsx)(i.X,{size:12,stroke:c(),strokeWidth:3})}})()}),e]})}])},438317,626730,e=>{"use strict";var r=e.i(843476),i=e.i(997053),t=e.i(938921),o=e.i(837008),a=e.i(810977),n=e.i(282975),l=e.i(213444),s=e.i(632964),c=e.i(921e3),d=e.i(515987),p=e.i(363827),h=e.i(652038),v=e.i(604677);let u=e=>(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",version:"1.1",id:"Layer_1",x:"0px",y:"0px",viewBox:"0 0 397.7 311.7",enableBackground:"new 0 0 397.7 311.7",xmlSpace:"preserve",...e,children:[(0,r.jsxs)("linearGradient",{id:"SVGID_1_",gradientUnits:"userSpaceOnUse",x1:"360.8791",y1:"351.4553",x2:"141.213",y2:"-69.2936",gradientTransform:"matrix(1 0 0 -1 0 314)",children:[(0,r.jsx)("stop",{offset:"0",stopColor:"#00FFA3"}),(0,r.jsx)("stop",{offset:"1",stopColor:"#DC1FFF"})]}),(0,r.jsx)("path",{d:"M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5  c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z",fill:"url(#SVGID_1_)"}),(0,r.jsxs)("linearGradient",{id:"SVGID_2_",gradientUnits:"userSpaceOnUse",x1:"264.8291",y1:"401.6014",x2:"45.163",y2:"-19.1475",gradientTransform:"matrix(1 0 0 -1 0 314)",children:[(0,r.jsx)("stop",{offset:"0",stopColor:"#00FFA3"}),(0,r.jsx)("stop",{offset:"1",stopColor:"#DC1FFF"})]}),(0,r.jsx)("path",{d:"M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5  c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z",fill:"url(#SVGID_2_)"}),(0,r.jsxs)("linearGradient",{id:"SVGID_3_",gradientUnits:"userSpaceOnUse",x1:"312.5484",y1:"376.688",x2:"92.8822",y2:"-44.061",gradientTransform:"matrix(1 0 0 -1 0 314)",children:[(0,r.jsx)("stop",{offset:"0",stopColor:"#00FFA3"}),(0,r.jsx)("stop",{offset:"1",stopColor:"#DC1FFF"})]}),(0,r.jsx)("path",{d:"M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4  c5.8,0,8.7-7,4.6-11.1L333.1,120.1z",fill:"url(#SVGID_3_)"})]}),g={[v.arbitrum.id]:e=>(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",id:"Layer_1",x:"0px",y:"0px",viewBox:"0 0 2500 2500",xmlSpace:"preserve",...e,children:(0,r.jsx)("g",{id:"Layer_x0020_1",children:(0,r.jsxs)("g",{id:"_2405588477232",children:[(0,r.jsx)("rect",{fill:"none",width:"2500",height:"2500"}),(0,r.jsx)("g",{children:(0,r.jsxs)("g",{children:[(0,r.jsx)("path",{fill:"#213147",d:"M226,760v980c0,63,33,120,88,152l849,490c54,31,121,31,175,0l849-490c54-31,88-89,88-152V760      c0-63-33-120-88-152l-849-490c-54-31-121-31-175,0L314,608c-54,31-87,89-87,152H226z"}),(0,r.jsx)("g",{children:(0,r.jsxs)("g",{children:[(0,r.jsx)("g",{children:(0,r.jsx)("path",{fill:"#12AAFF",d:"M1435,1440l-121,332c-3,9-3,19,0,29l208,571l241-139l-289-793C1467,1422,1442,1422,1435,1440z"})}),(0,r.jsx)("g",{children:(0,r.jsx)("path",{fill:"#12AAFF",d:"M1678,882c-7-18-32-18-39,0l-121,332c-3,9-3,19,0,29l341,935l241-139L1678,883V882z"})})]})}),(0,r.jsx)("g",{children:(0,r.jsx)("path",{fill:"#9DCCED",d:"M1250,155c6,0,12,2,17,5l918,530c11,6,17,18,17,30v1060c0,12-7,24-17,30l-918,530c-5,3-11,5-17,5       s-12-2-17-5l-918-530c-11-6-17-18-17-30V719c0-12,7-24,17-30l918-530c5-3,11-5,17-5l0,0V155z M1250,0c-33,0-65,8-95,25L237,555       c-59,34-95,96-95,164v1060c0,68,36,130,95,164l918,530c29,17,62,25,95,25s65-8,95-25l918-530c59-34,95-96,95-164V719       c0-68-36-130-95-164L1344,25c-29-17-62-25-95-25l0,0H1250z"})}),(0,r.jsx)("polygon",{fill:"#213147",points:"642,2179 727,1947 897,2088 738,2234     "}),(0,r.jsxs)("g",{children:[(0,r.jsx)("path",{fill:"#FFFFFF",d:"M1172,644H939c-17,0-33,11-39,27L401,2039l241,139l550-1507c5-14-5-28-19-28L1172,644z"}),(0,r.jsx)("path",{fill:"#FFFFFF",d:"M1580,644h-233c-17,0-33,11-39,27L738,2233l241,139l620-1701c5-14-5-28-19-28V644z"})]})]})})]})})}),[v.avalanche.id]:e=>(0,r.jsxs)("svg",{width:"1503",height:"1504",viewBox:"0 0 1503 1504",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,r.jsx)("rect",{x:"287",y:"258",width:"928",height:"844",fill:"white"}),(0,r.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M1502.5 752C1502.5 1166.77 1166.27 1503 751.5 1503C336.734 1503 0.5 1166.77 0.5 752C0.5 337.234 336.734 1 751.5 1C1166.27 1 1502.5 337.234 1502.5 752ZM538.688 1050.86H392.94C362.314 1050.86 347.186 1050.86 337.962 1044.96C327.999 1038.5 321.911 1027.8 321.173 1015.99C320.619 1005.11 328.184 991.822 343.312 965.255L703.182 330.935C718.495 303.999 726.243 290.531 736.021 285.55C746.537 280.2 759.083 280.2 769.599 285.55C779.377 290.531 787.126 303.999 802.438 330.935L876.42 460.079L876.797 460.738C893.336 489.635 901.723 504.289 905.385 519.669C909.443 536.458 909.443 554.169 905.385 570.958C901.695 586.455 893.393 601.215 876.604 630.549L687.573 964.702L687.084 965.558C670.436 994.693 661.999 1009.46 650.306 1020.6C637.576 1032.78 622.263 1041.63 605.474 1046.62C590.161 1050.86 573.004 1050.86 538.688 1050.86ZM906.75 1050.86H1115.59C1146.4 1050.86 1161.9 1050.86 1171.13 1044.78C1181.09 1038.32 1187.36 1027.43 1187.92 1015.63C1188.45 1005.1 1181.05 992.33 1166.55 967.307C1166.05 966.455 1165.55 965.588 1165.04 964.706L1060.43 785.75L1059.24 783.735C1044.54 758.877 1037.12 746.324 1027.59 741.472C1017.08 736.121 1004.71 736.121 994.199 741.472C984.605 746.453 976.857 759.552 961.544 785.934L857.306 964.891L856.949 965.507C841.69 991.847 834.064 1005.01 834.614 1015.81C835.352 1027.62 841.44 1038.5 851.402 1044.96C860.443 1050.86 875.94 1050.86 906.75 1050.86Z",fill:"#E84142"})]}),[v.base.id]:e=>(0,r.jsx)("svg",{width:"146",height:"146",viewBox:"0 0 1280 1280",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,r.jsx)("path",{d:"M0,101.12c0-34.64,0-51.95,6.53-65.28,6.25-12.76,16.56-23.07,29.32-29.32C49.17,0,66.48,0,101.12,0h1077.76c34.63,0,51.96,0,65.28,6.53,12.75,6.25,23.06,16.56,29.32,29.32,6.52,13.32,6.52,30.64,6.52,65.28v1077.76c0,34.63,0,51.96-6.52,65.28-6.26,12.75-16.57,23.06-29.32,29.32-13.32,6.52-30.65,6.52-65.28,6.52H101.12c-34.64,0-51.95,0-65.28-6.52-12.76-6.26-23.07-16.57-29.32-29.32-6.53-13.32-6.53-30.65-6.53-65.28V101.12Z",fill:"#0000FF"})}),[v.celo.id]:e=>(0,r.jsxs)("svg",{fill:"none",height:"400",viewBox:"0 0 400 400",width:"400",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,r.jsx)("path",{d:"m0 0h400v400h-400z",fill:"#fcff52"}),(0,r.jsx)("path",{d:"m300 100h-200v200h199.996v-69.813h-33.191c-11.442 25.468-37.194 43.206-66.665 43.206-40.63 0-73.533-33.187-73.533-73.533s32.903-73.249 73.533-73.249c30.043 0 55.795 18.313 67.24 44.349h32.62z",fill:"#000"})]}),[v.linea.id]:e=>(0,r.jsxs)("svg",{width:"200",height:"208",viewBox:"0 0 200 208",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,r.jsx)("rect",{width:"199.4",height:"207.623",fill:"#121212"}),(0,r.jsxs)("g",{"clip-path":"url(#clip0_2303_643)",children:[(0,r.jsx)("path",{d:"M132.369 155.99H49.7001V68.8854H68.6148V139.109H132.369V155.981V155.99Z",fill:"white"}),(0,r.jsx)("path",{d:"M132.369 85.7575C141.687 85.7575 149.241 78.2036 149.241 68.8855C149.241 59.5673 141.687 52.0134 132.369 52.0134C123.05 52.0134 115.497 59.5673 115.497 68.8855C115.497 78.2036 123.05 85.7575 132.369 85.7575Z",fill:"white"})]}),(0,r.jsx)("defs",{children:(0,r.jsx)("clipPath",{id:"clip0_2303_643",children:(0,r.jsx)("rect",{width:"99.5407",height:"103.977",fill:"white",transform:"translate(49.7001 52.0134)"})})})]}),[v.mainnet.id]:e=>(0,r.jsxs)("svg",{version:"1.1",id:"Layer_1",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",x:"0px",y:"0px",viewBox:"0 0 327.5 533.3",enableBackground:"new 0 0 327.5 533.3;",xmlSpace:"preserve",...e,children:[(0,r.jsx)("path",{fill:"#8492B2",d:"M163.7,197.2V0L0,271.6L163.7,197.2z"}),(0,r.jsx)("path",{fill:"#62688F",d:"M163.7,368.4V197.2L0,271.6L163.7,368.4z M163.7,197.2l163.7,74.4L163.7,0V197.2z"}),(0,r.jsx)("path",{fill:"#454A75",d:"M163.7,197.2v171.2l163.7-96.8L163.7,197.2z"}),(0,r.jsx)("path",{fill:"#8492B2",d:"M163.7,399.4L0,302.7l163.7,230.7V399.4z"}),(0,r.jsx)("path",{fill:"#62688F",d:"M327.5,302.7l-163.8,96.7v134L327.5,302.7z"})]}),[v.optimism.id]:e=>(0,r.jsxs)("svg",{width:"500",height:"500",viewBox:"0 0 500 500",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,r.jsx)("circle",{cx:"250",cy:"250",r:"250",fill:"#FF0420"}),(0,r.jsx)("path",{d:"M177.133 316.446C162.247 316.446 150.051 312.943 140.544 305.938C131.162 298.808 126.471 288.676 126.471 275.541C126.471 272.789 126.784 269.411 127.409 265.408C129.036 256.402 131.35 245.581 134.352 232.947C142.858 198.547 164.812 181.347 200.213 181.347C209.845 181.347 218.476 182.973 226.107 186.225C233.738 189.352 239.742 194.106 244.12 200.486C248.498 206.74 250.688 214.246 250.688 223.002C250.688 225.629 250.375 228.944 249.749 232.947C247.873 244.08 245.621 254.901 242.994 265.408C238.616 282.546 231.048 295.368 220.29 303.874C209.532 312.255 195.147 316.446 177.133 316.446ZM179.76 289.426C186.766 289.426 192.707 287.362 197.586 283.234C202.59 279.106 206.155 272.789 208.281 264.283C211.158 252.524 213.348 242.266 214.849 233.51C215.349 230.883 215.599 228.194 215.599 225.441C215.599 214.058 209.657 208.366 197.774 208.366C190.768 208.366 184.764 210.43 179.76 214.558C174.882 218.687 171.379 225.004 169.253 233.51C167.001 241.891 164.749 252.149 162.498 264.283C161.997 266.784 161.747 269.411 161.747 272.163C161.747 283.672 167.752 289.426 179.76 289.426Z",fill:"white"}),(0,r.jsx)("path",{d:"M259.303 314.57C257.927 314.57 256.863 314.132 256.113 313.256C255.487 312.255 255.3 311.13 255.55 309.879L281.444 187.914C281.694 186.538 282.382 185.412 283.508 184.536C284.634 183.661 285.822 183.223 287.073 183.223H336.985C350.87 183.223 362.003 186.1 370.384 191.854C378.891 197.609 383.144 205.927 383.144 216.81C383.144 219.937 382.769 223.19 382.018 226.567C378.891 240.953 372.574 251.586 363.067 258.466C353.685 265.346 340.8 268.786 324.413 268.786H299.082L290.451 309.879C290.2 311.255 289.512 312.38 288.387 313.256C287.261 314.132 286.072 314.57 284.822 314.57H259.303ZM325.727 242.892C330.98 242.892 335.546 241.453 339.424 238.576C343.427 235.699 346.054 231.571 347.305 226.192C347.68 224.065 347.868 222.189 347.868 220.563C347.868 216.935 346.805 214.183 344.678 212.307C342.551 210.305 338.924 209.305 333.795 209.305H311.278L304.148 242.892H325.727Z",fill:"white"})]}),[v.polygon.id]:e=>(0,r.jsxs)("svg",{width:"360",height:"360",viewBox:"0 0 360 360",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:[(0,r.jsx)("rect",{width:"360",height:"360",rx:"180",fill:"#6C00F6"}),(0,r.jsx)("path",{d:"M157.743 154.241L141.052 144.58L90.9766 173.561V231.519L141.052 260.5L191.13 231.519V141.359L218.948 125.26L246.77 141.359V173.561L218.948 189.66L202.257 180.002V205.759L218.948 215.42L269.024 186.439V128.481L218.948 99.5L168.873 128.481V218.641L141.052 234.74L113.233 218.641V186.439L141.052 170.34L157.743 179.998V154.241Z",fill:"white"})]}),[v.zora.id]:e=>(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",viewBox:"0 0 30 30",fill:"none",...e,children:[(0,r.jsx)("g",{clipPath:"url(#clip0)",children:(0,r.jsx)("g",{clipPath:"url(#clip1)",children:(0,r.jsx)("path",{d:"M14.9188 29.8373C6.67944 29.8373 0.00012207 23.1581 0.00012207 14.9187C0.00012207 6.67931 6.67944 0 14.9188 0C23.1581 0 29.8373 6.67931 29.8373 14.9187C29.8373 23.1581 23.1581 29.8373 14.9188 29.8373Z",fill:"url(#paint0)"})})}),(0,r.jsxs)("defs",{children:[(0,r.jsxs)("radialGradient",{id:"paint0",cx:"0",cy:"0",r:"1",gradientUnits:"userSpaceOnUse",gradientTransform:"translate(21.6921 8.02215) rotate(180) scale(25.2008)",children:[(0,r.jsx)("stop",{offset:"0.00682297",stopColor:"#F2CEFE"}),(0,r.jsx)("stop",{offset:"0.1913",stopColor:"#AFBAF1"}),(0,r.jsx)("stop",{offset:"0.4982",stopColor:"#4281D3"}),(0,r.jsx)("stop",{offset:"0.666667",stopColor:"#2E427D"}),(0,r.jsx)("stop",{offset:"0.822917",stopColor:"#230101"}),(0,r.jsx)("stop",{offset:"1",stopColor:"#8F6B40"})]}),(0,r.jsx)("clipPath",{id:"clip0",children:(0,r.jsx)("rect",{width:"30",height:"30",fill:"white"})}),(0,r.jsx)("clipPath",{id:"clip1",children:(0,r.jsx)("rect",{width:"30",height:"30",fill:"white"})})]})]})},x=({chainId:e,...i})=>{if("solana"===e)return(0,r.jsx)(u,{...i});let t=g[e];return(0,r.jsx)(t||h.default,{...i})};e.s(["N",0,x],626730);var f=e.i(200314);let y=i.styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;e.s(["T",0,({walletClientType:e,displayName:i,addressToFund:h,chainId:v,chainName:u,isBridging:g,isErc20Flow:m,totalPriceInNativeCurrency:b,totalPriceInUsd:w,gasPriceInNativeCurrency:j,gasPriceInUsd:k})=>{let C=(0,f.k)(e);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.t,{}),(0,r.jsx)(s.N,{centerIcon:(0,r.jsx)(l.I,{icon:C?.image_url?.md,name:e})}),(0,r.jsx)(a.C,{style:{marginTop:"8px",marginBottom:"12px"},title:`${g?"Bridging":"Confirming"} with ${i}`}),!g&&!m&&(0,r.jsxs)(c.a,{children:[(0,r.jsxs)(c.R,{children:[(0,r.jsx)(d.L,{children:"Total"}),(0,r.jsx)(d.V,{children:w||b})]}),(0,r.jsxs)(c.R,{children:[(0,r.jsx)(d.L,{children:"To"}),(0,r.jsx)(d.V,{children:(0,r.jsx)(p.A,{address:h,showCopyIcon:!1})})]}),(0,r.jsxs)(c.R,{children:[(0,r.jsx)(d.L,{children:"Network"}),(0,r.jsx)(d.V,{children:(0,r.jsxs)(y,{children:[(0,r.jsx)(x,{chainId:v,height:16,width:16})," ",u]})})]}),j&&(0,r.jsxs)(c.R,{children:[(0,r.jsx)(d.L,{children:"Estimated fee"}),(0,r.jsx)(d.V,{children:k||j})]})]}),(0,r.jsx)(t.d,{height:24}),(0,r.jsx)(o.B,{})]})}],438317)},515987,e=>{"use strict";var r=e.i(997053),i=e.i(616918);let t=r.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`,o=(0,r.styled)(t)`
  color: var(--privy-color-accent);
`,a=r.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem; /* 157.143% */
  word-break: break-all;
  text-align: right;

  ${i.L}
`;e.s(["L",0,t,"V",0,a,"a",0,o])},377799,e=>{"use strict";e.s(["O",0,"sdk_fiat_on_ramp_completed_with_status"])},792688,e=>{"use strict";let r=2n**256n-1n;e.s(["f",0,({amount:e,decimals:i})=>e===r?"Maximum":Intl.NumberFormat(void 0,{maximumFractionDigits:i}).format(Number(e)/10**i)])},223606,e=>{"use strict";e.s(["g",0,function(e){switch(e){case"solana:mainnet":return"Solana";case"solana:devnet":return"Devnet";case"solana:testnet":return"Testnet"}}])},422347,e=>{"use strict";var r=e.i(696942),i=e.i(44979),t=e.i(758356);let o=async({chain:e,address:o,appId:n,rpcConfig:l,erc20Address:s})=>{let c=(0,r.createPublicClient)({chain:e,transport:(0,i.http)((0,t.a)(e,l,n))});return{balance:await c.readContract({address:s,abi:a,functionName:"balanceOf",args:[o]}).catch(()=>0n),chain:e}},a=[{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"balanceOf",outputs:[{name:"balance",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"}];e.s(["g",0,o])},632964,e=>{"use strict";var r=e.i(843476),i=e.i(997053);let t=i.styled.div`
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
`,a=i.styled.div`
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
`,n=i.styled.div`
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
`,l=i.styled.div`
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
`;e.s(["N",0,({size:e,centerIcon:i})=>(0,r.jsx)(t,{$size:e,children:(0,r.jsxs)(o,{children:[(0,r.jsx)(n,{}),(0,r.jsx)(l,{}),i?(0,r.jsx)(a,{children:i}):null]})})])},520475,e=>{"use strict";var r=e.i(271645),i=e.i(662123);let t="0x0000000000000000000000000000000000000000",o="https://api.relay.link",a="https://api.testnets.relay.link",n=async({input:e,isTestnet:r})=>{let i=await fetch((r?a:o)+"/quote",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),t=await i.json();if(!(i.ok||"string"==typeof t.message&&t.message.startsWith("Invalid address")))throw console.error("Relay error:",t),Error(t.message??"Error fetching quote from relay");return t};async function l({transactionHash:e,isTestnet:r}){let i=await fetch((r?a:o)+"/requests/v2?hash="+e),t=await i.json();if(!i.ok){if("message"in t&&"string"==typeof t.message)throw Error(t.message);throw Error("Error fetching request from relay")}return t.requests.at(0)?.status??"pending"}class s extends i.P{constructor(e,r){super("We were unable to complete the bridging transaction. Funds will be refunded on your wallet.",void 0,i.a.TRANSACTION_FAILURE),this.relayLink=r?`https://testnets.relay.link/transaction/${e}`:`https://relay.link/transaction/${e}`}}e.s(["R",0,s,"a",0,e=>{let r=e.steps[0]?.items?.[0];if(r)return{from:r.data.from,to:r.data.to,value:Number(r.data.value),chainId:Number(r.data.chainId),data:r.data.data}},"b",0,"11111111111111111111111111111111","c",0,0x2f3fb341,"d",0,e=>e.steps.flatMap(e=>e.items?.filter(e=>"incomplete"===e.status)??[]).map(e=>({from:e.data.from,to:e.data.to,value:Number(e.data.value),chainId:Number(e.data.chainId),data:e.data.data})),"e",0,"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","g",0,n,"t",0,({appId:e,originCurrency:r,destinationCurrency:i,...o})=>({tradeType:"EXPECTED_OUTPUT",originCurrency:r??t,destinationCurrency:i??t,referrer:`privy|${e}`,...o}),"u",0,function({transactionHash:e,isTestnet:i,bridgingStatus:t,setBridgingStatus:o,onSuccess:a,onFailure:n}){(0,r.useEffect)(()=>{if(e&&t){if(["delayed","waiting","pending"].includes(t)){let r=setInterval(async()=>{try{let r=await l({transactionHash:e,isTestnet:i});o(r)}catch(e){console.error(e)}},1e3);return()=>clearInterval(r)}"success"===t?a({transactionHash:e}):["refund","failure"].includes(t)&&n({error:new s(e,i)})}},[t,e,i])}])},272313,e=>{"use strict";var r=e.i(997053);let i=r.css`
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
`;e.s(["B",0,t,"a",0,i])},103853,e=>{"use strict";var r=e.i(997053),i=e.i(837008),t=e.i(339484);let o=r.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,a=r.styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    border-radius: var(--privy-border-radius-sm);
  }
`,n=r.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`,l=r.styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 0 16px;
  border-width: 1px !important;
  border-radius: 12px;
  cursor: text;

  &:focus-within {
    border-color: var(--privy-color-accent);
  }
`;r.styled.div`
  font-size: 42px !important;
`;let s=r.styled.input`
  background-color: var(--privy-color-background);
  width: 100%;

  &:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  && {
    font-size: 26px;
  }
`,c=(0,r.styled)(s)`
  && {
    font-size: 42px;
  }
`;r.styled.button`
  cursor: pointer;
  padding-left: 4px;
`;let d=r.styled.div`
  font-size: 18px;
`,p=r.styled.div`
  font-size: 12px;
  color: var(--privy-color-foreground-3);
  // we need this container to maintain a static height if there's no content
  height: 20px;
`;r.styled.div`
  display: flex;
  flex-direction: row;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  svg {
    margin-right: 6px;
    margin: auto;
  }
`,(0,r.styled)(t.LinkButton)`
  margin-top: 16px;
`;let h=r.keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;(0,r.styled)(i.d)`
  border-radius: var(--privy-border-radius-md) !important;
  animation: ${h} 0.3s ease-in-out;
`;let v=r.styled.div``,u=r.styled.a`
  && {
    color: var(--privy-color-accent);
  }

  cursor: pointer;
`;e.s(["F",0,n,"I",0,a,"a",0,l,"b",0,s,"c",0,d,"d",0,p,"e",0,o,"f",0,v,"g",0,u,"h",0,c])},773524,e=>{"use strict";var r=e.i(271645);let i=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,i)=>i?i.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},t=(...e)=>e.filter((e,r,i)=>!!e&&""!==e.trim()&&i.indexOf(e)===r).join(" ").trim();var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let a=(0,r.forwardRef)(({color:e="currentColor",size:i=24,strokeWidth:a=2,absoluteStrokeWidth:n,className:l="",children:s,iconNode:c,...d},p)=>(0,r.createElement)("svg",{ref:p,...o,width:i,height:i,stroke:e,strokeWidth:n?24*Number(a)/Number(i):a,className:t("lucide",l),...!s&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(d)&&{"aria-hidden":"true"},...d},[...c.map(([e,i])=>(0,r.createElement)(e,i)),...Array.isArray(s)?s:[s]]));e.s(["default",0,(e,o)=>{let n=(0,r.forwardRef)(({className:n,...l},s)=>(0,r.createElement)(a,{ref:s,iconNode:o,className:t(`lucide-${i(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,n),...l}));return n.displayName=i(e),n}],773524)},823209,e=>{"use strict";let r=(0,e.i(773524).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",0,r],823209)},402809,e=>{"use strict";let r=(0,e.i(773524).default)("circle-check-big",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",0,r],402809)},355982,e=>{"use strict";let r=(0,e.i(773524).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",0,r],355982)},540803,e=>{"use strict";let r=(0,e.i(773524).default)("fingerprint-pattern",[["path",{d:"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4",key:"1nerag"}],["path",{d:"M14 13.12c0 2.38 0 6.38-1 8.88",key:"o46ks0"}],["path",{d:"M17.29 21.02c.12-.6.43-2.3.5-3.02",key:"ptglia"}],["path",{d:"M2 12a10 10 0 0 1 18-6",key:"ydlgp0"}],["path",{d:"M2 16h.01",key:"1gqxmh"}],["path",{d:"M21.8 16c.2-2 .131-5.354 0-6",key:"drycrb"}],["path",{d:"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2",key:"1tidbn"}],["path",{d:"M8.65 22c.21-.66.45-1.32.57-2",key:"13wd9y"}],["path",{d:"M9 6.8a6 6 0 0 1 9 5.2v2",key:"1fr1j5"}]]);e.s(["FingerprintIcon",0,r],540803)},738540,e=>{"use strict";let r=(0,e.i(773524).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,r],738540)}]);