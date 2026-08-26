(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,54366,310024,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function({title:e,titleId:r,...i},n){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":r},i),e?t.createElement("title",{id:r},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"}))});e.s(["default",0,r],54366);var i=e.i(997053),n=e.i(843476),o=e.i(33750);let l=i.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 0px 30px;
  @media (max-width: 440px) {
    padding: 10px 10px 20px;
  }
`,s=i.styled.div`
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
`,a=i.styled.div`
  font-size: 0.875rem;

  text-align: center;
`,d=i.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
  padding: 20px 0;
  @media (max-width: 440px) {
    padding: 10px 10px 20px;
  }
`,c=i.styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  padding: 1rem 0rem 0rem;
  flex-grow: 1;
  width: 100%;
`,u=i.styled.div`
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  > svg {
    z-index: 2;
    height: 25px !important;
    width: 25px !important;
    color: var(--privy-color-accent);
  }
`,p=i.styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  line-height: 1rem;
  text-align: left;
`,h=i.styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
`,x=i.styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  padding: 1rem 0rem 0rem;
  flex-grow: 1;
  width: 100%;
`,m=i.styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
`,f=i.styled.button`
  && {
    background-color: transparent;
    color: var(--privy-color-foreground-3);
    margin-left: auto;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    height: 100%;

    > svg {
      z-index: 2;
      height: 20px !important;
      width: 20px !important;
    }
  }

  &&:hover {
    color: var(--privy-color-error);
  }
`,g=i.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > svg {
    z-index: 2;
    height: 20px !important;
    width: 20px !important;
  }
`,v=i.styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400 !important;
  color: ${e=>e.$isAccent?"var(--privy-color-accent)":"var(--privy-color-foreground-3)"};

  > svg {
    z-index: 2;
    height: 18px !important;
    width: 18px !important;
    display: flex !important;
    align-items: flex-end;
  }
`,y=i.styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`,w=i.styled.p`
  text-align: left;
  width: 100%;
  color: var(--privy-color-foreground-3) !important;
`,C=i.styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;

  & {
    width: 100%;
    cursor: pointer;
    border-radius: var(--privy-border-radius-md);

    font-size: 0.875rem;
    line-height: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 137.5% */
    letter-spacing: -0.016px;
  }

  && {
    color: ${e=>"dark"===e.theme?"var(--privy-color-foreground-2)":"var(--privy-color-accent)"};
    background-color: transparent;

    padding: 0.5rem 0px;
  }

  &:hover {
    text-decoration: underline;
  }
`,j=i.styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--privy-color-accent);
  width: 100%;

  > svg {
    z-index: 2;
    width: 3rem;
    height: 3rem;
  }
`,b=i.styled.div`
  color: var(--privy-color-error);
`,k=Array(6).fill("");var E,S=((E=S||{})[E.RESET_AFTER_DELAY=0]="RESET_AFTER_DELAY",E[E.CLEAR_ON_NEXT_VALID_INPUT=1]="CLEAR_ON_NEXT_VALID_INPUT",E);function M(e){return/^[0-9]{1}$/.test(e)}function T(e){return 6===e.length&&e.every(M)}let A=i.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;

  @media (max-width: 440px) {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  > div:nth-child(1) {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    border-radius: var(--privy-border-radius-md);

    > input {
      border: 1px solid var(--privy-color-foreground-4);
      background: var(--privy-color-background);
      border-radius: var(--privy-border-radius-md);
      padding: 8px 10px;
      height: 58px;
      width: 46px;
      text-align: center;
      font-size: 18px;
    }

    > input:disabled {
      /* Use light-theme-bg-2 instead of disabled-bg for consistency with
      the callout bubble */
      background: var(--privy-color-background-2);
    }

    > input:focus {
      border: 1px solid var(--privy-color-accent);
    }

    > input:invalid {
      border: 1px solid var(--privy-color-error);
    }

    > input.success {
      border: 1px solid var(--privy-color-success);
    }

    > input.fail {
      border: 1px solid var(--privy-color-error);
      animation: shake 180ms;
      animation-iteration-count: 2;
    }
  }

  @keyframes shake {
    0% {
      transform: translate(1px, 0px);
    }
    33% {
      transform: translate(-1px, 0px);
    }
    67% {
      transform: translate(-1px, 0px);
    }
    100% {
      transform: translate(1px, 0px);
    }
  }
`,V=i.styled.div`
  line-height: 20px;
  font-size: 13px;
  display: flex;
  justify-content: flex-start;
  width: 100%;

  color: ${e=>e.$fail?"var(--privy-color-error)":"var(--privy-color-foreground-3)"};
`;e.s(["A",0,l,"B",0,h,"C",0,d,"E",0,b,"F",0,({style:e,...t})=>(0,n.jsx)("svg",{x:0,y:0,width:"65",height:"64",viewBox:"0 0 65 64",style:{height:"64px",width:"65px",...e},fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",...t,children:(0,n.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3.71369 17.5625V10.375C3.71369 6.44625 6.85845 3.25 10.7238 3.25H17.7953C18.6783 3.25 19.3941 2.52244 19.3941 1.625C19.3941 0.727562 18.6783 0 17.7953 0H10.7238C5.09529 0 0.516113 4.65419 0.516113 10.375V17.5625C0.516113 18.4599 1.23194 19.1875 2.1149 19.1875C2.99787 19.1875 3.71369 18.4599 3.71369 17.5625ZM17.7953 60.7501C18.6783 60.7501 19.3941 61.4777 19.3941 62.3751C19.3941 63.2726 18.6783 64.0001 17.7953 64.0001H10.7238C5.09529 64.0001 0.516113 59.3459 0.516113 53.6251V46.4376C0.516113 45.5402 1.23194 44.8126 2.1149 44.8126C2.99787 44.8126 3.71369 45.5402 3.71369 46.4376V53.6251C3.71369 57.5538 6.85845 60.7501 10.7238 60.7501H17.7953ZM63.4839 46.4376V53.6251C63.4839 59.3459 58.9048 64.0001 53.2763 64.0001H46.2047C45.3217 64.0001 44.6059 63.2726 44.6059 62.3751C44.6059 61.4777 45.3217 60.7501 46.2047 60.7501H53.2763C57.1416 60.7501 60.2864 57.5538 60.2864 53.6251V46.4376C60.2864 45.5402 61.0022 44.8126 61.8851 44.8126C62.7681 44.8126 63.4839 45.5402 63.4839 46.4376ZM63.4839 10.375V17.5625C63.4839 18.4599 62.7681 19.1875 61.8851 19.1875C61.0022 19.1875 60.2864 18.4599 60.2864 17.5625V10.375C60.2864 6.44625 57.1416 3.25 53.2763 3.25H46.2047C45.3217 3.25 44.6059 2.52244 44.6059 1.625C44.6059 0.727562 45.3217 0 46.2047 0H53.2763C58.9048 0 63.4839 4.65419 63.4839 10.375ZM43.0331 47.3022C43.7067 46.6698 43.7483 45.6022 43.1262 44.9176C42.5039 44.233 41.4536 44.1906 40.78 44.823C38.3832 47.0732 35.265 48.3125 31.9997 48.3125C28.7344 48.3125 25.6162 47.0732 23.2194 44.823C22.5457 44.1906 21.4955 44.233 20.8732 44.9176C20.251 45.6022 20.2927 46.6698 20.9663 47.3022C23.9784 50.1301 27.8968 51.6875 31.9997 51.6875C36.1026 51.6875 40.021 50.1301 43.0331 47.3022ZM35.3207 24.1249V36.1249C35.3207 38.5029 33.4173 40.4374 31.0777 40.4374H29.7249C28.8079 40.4374 28.0646 39.6819 28.0646 38.7499C28.0646 37.8179 28.8079 37.0624 29.7249 37.0624H31.0777C31.5863 37.0624 32.0001 36.6419 32.0001 36.1249V24.1249C32.0001 23.1929 32.7434 22.4374 33.6604 22.4374C34.5774 22.4374 35.3207 23.1929 35.3207 24.1249ZM46.7581 28.8437V24.0312C46.7581 23.151 46.056 22.4374 45.19 22.4374C44.324 22.4374 43.622 23.151 43.622 24.0312V28.8437C43.622 29.7239 44.324 30.4374 45.19 30.4374C46.056 30.4374 46.7581 29.7239 46.7581 28.8437ZM17.6109 28.8437C17.6109 29.7239 18.313 30.4374 19.1789 30.4374C20.0449 30.4374 20.747 29.7239 20.747 28.8437V24.0312C20.747 23.151 20.0449 22.4374 19.1789 22.4374C18.313 22.4374 17.6109 23.151 17.6109 24.0312V28.8437Z"})}),"I",0,j,"L",0,c,"M",0,x,"N",0,({onChange:e,disabled:r,errorReasonOverride:i,success:l})=>{let[s,a]=(0,t.useState)(k),[d,c]=(0,t.useState)(null),[u,p]=(0,t.useState)(null),h=async t=>{t.preventDefault();let r=t.currentTarget.value.replace(/\s+/g,"");if(""===r)return;let i=s.reduce((e,t)=>e+Number(M(t)),0),n=r.split(""),o=!n.every(M),l=n.length+i>6;if(o)return c("Passcode can only be numbers"),void p(1);if(l)return c("Passcode must be exactly 6 numbers"),void p(1);c(null),p(null);let d=Number(t.currentTarget.name?.charAt(4)),u=[...r||[""]].slice(0,6-d),h=[...s.slice(0,d),...u,...s.slice(d+u.length)];a(h);let x=Math.min(Math.max(d+u.length,0),5),m=document.querySelector(`input[name=pin-${x}]`);if(m?.focus({preventScroll:!0}),T(h))try{await e(h.join(""));let t=document.querySelector(`input[name=pin-${x}]`);t?.blur()}catch(e){p(1),c(e.message)}else try{await e(null)}catch(e){p(1),c(e.message)}},x=l?"success":i||d?"fail":"";return(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)(A,{children:[(0,n.jsx)("div",{children:s.map((t,i)=>(0,n.jsx)("input",{name:`pin-${i}`,type:"text",value:s[i],onChange:h,onKeyUp:t=>{"Backspace"===t.key&&(t=>{1===u&&(c(null),p(null));let r=[...s.slice(0,t),"",...s.slice(t+1)];if(a(r),t>0){let e=document.querySelector(`input[name=pin-${t-1}]`);e?.focus({preventScroll:!0})}T(r)?e(r.join("")):e(null)})(i)},inputMode:"numeric",autoFocus:0===i,pattern:"[0-9]",className:x,autoComplete:o.isMobile?"one-time-code":"off",disabled:r},i))}),(0,n.jsx)("div",{children:(0,n.jsx)(V,{$fail:!!i||!!d,children:i||d})})]})})},"P",0,C,"R",0,f,"S",0,a,"T",0,s,"a",0,p,"b",0,u,"c",0,w,"d",0,m,"e",0,y,"f",0,g,"g",0,v],310024)},530448,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function({title:e,titleId:r,...i},n){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":r},i),e?t.createElement("title",{id:r},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))});e.s(["default",0,r])},296368,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function({title:e,titleId:r,...i},n){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":r},i),e?t.createElement("title",{id:r},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"}))});e.s(["default",0,r])},846455,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function({title:e,titleId:r,...i},n){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":r},i),e?t.createElement("title",{id:r},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"}))});e.s(["default",0,r])},337025,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function({title:e,titleId:r,...i},n){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":r},i),e?t.createElement("title",{id:r},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"}))});e.s(["default",0,r])},971613,e=>{"use strict";var t=e.i(843476),r=e.i(271645),i=e.i(118364),n=e.i(600476),o=e.i(385171),l=e.i(872841);e.i(123287),e.i(437206),e.i(33750),e.i(610760);let s=({onClose:e})=>{let{user:s}=(0,n.u)(),a=(0,i.u)(),d=(0,r.useMemo)(()=>s?.mfaMethods.filter(e=>"passkey"!==e||!a.globalDisablePasskeys)??[],[s?.mfaMethods,a.globalDisablePasskeys]),[c,u]=(0,r.useState)(d[0]??null),{init:p,cancel:h,submit:x}=(0,o.u)(),[m,f]=(0,r.useState)(!1),[g,v]=(0,r.useState)(null),[y,w]=(0,r.useState)();(0,r.useEffect)(()=>{u(d[0]??null)},[d]);let C=(0,r.useRef)(!1);async function j(t){w(void 0);try{if(!t||!c)return;await x(c,t),f(!0),w(void 0),e()}catch(e){throw(0,l.t)(e).error}}async function b(t){if("passkey"!==t)try{u(t),await p(t)}catch(e){console.error(e)}else try{u(t);let r=await p(t);if(!r)throw Error("something went wrong");v(r),await x(t,r),f(!0),w(void 0),e()}catch(e){w((0,l.t)(e))}}(0,r.useEffect)(()=>{!C.current&&c&&(C.current=!0,b(c).finally(()=>{C.current=!1}))},[]);let k=()=>{u(null),w(void 0),h(),e()};return s?"passkey"===c?(0,t.jsx)(l.V,{account:s.linkedAccounts.filter(e=>"passkey"===e.type&&e.enrolledInMfa).sort((e,t)=>t.firstVerifiedAt.valueOf()-e.firstVerifiedAt.valueOf())[0],submitSuccess:m,hasBlockingError:y?.isBlocking??!1,error:y?.error,onClose:k,onBack:()=>{u(null),w(void 0)},handleSubmit:()=>j(g).catch(w)}):c?(0,t.jsx)(l.a,{submitSuccess:m,hasBlockingError:y?.isBlocking??!1,handleSubmitCode:j,selectedMethod:c,onClose:k,onBack:d.length>1?()=>u(null):void 0}):(0,t.jsx)(l.b,{mfaMethods:d,onSelect:b,handleClose:k}):null};e.s(["MfaVerifyFlowScreen",0,s,"default",0,s])},617318,e=>{"use strict";var t=e.i(997053);let r=t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 82px;

  > div {
    position: relative;
  }

  > div > span {
    position: absolute;
    left: -41px;
    top: -41px;
  }

  > div > :last-child {
    position: absolute;
    left: -19px;
    top: -19px;
  }
`;e.s(["e",0,r])},872841,e=>{"use strict";var t=e.i(843476),r=e.i(54366),i=e.i(296368),n=e.i(846455),o=e.i(337025),l=e.i(837008),s=e.i(520183),a=e.i(737577),d=e.i(310024),c=e.i(271645);let u=c.forwardRef(function({title:e,titleId:t,...r},i){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"}))});var p=e.i(530448),h=e.i(617318),x=e.i(595693),m=e.i(997053),f=e.i(547104),g=e.i(349893),v=e.i(999863),y=e.i(328708),w=e.i(758356),C=e.i(816204),j=e.i(118364),b=e.i(385171);let k=({pendingTransaction:e})=>{let{wallets:r}=(0,v.u)(),{walletProxy:i,rpcConfig:n,chains:o,appId:l,nativeTokenSymbolForChainId:s}=(0,x.u)(),[a,d]=(0,c.useState)(null),[u,p]=(0,c.useState)(e),{tokenPrice:h}=(0,g.u)(u.chainId),m=s(e.chainId)||"ETH",j=(0,c.useMemo)(()=>r.find(e=>"privy"===e.walletClientType),[r]);return(0,c.useEffect)(()=>{(async function(){if(!i||!j)return u;let e=(0,w.g)(u.chainId,o,n,{appId:l}),t=await (0,y.d)(u,e,j.address);return d((0,f.toHex)(BigInt(t.gas??0))),t})().then(p).catch(console.error)},[i]),j?(0,t.jsx)(E,{children:(0,t.jsx)(C.T,{from:j.address,to:u.to,txn:u,gas:a??void 0,tokenPrice:h,tokenSymbol:m})}):null},E=m.styled.div`
  width: 100%;
  padding: 1rem 0;
`;e.s(["V",0,({hasBlockingError:e,error:r,onClose:i,onBack:n,handleSubmit:s,account:c,submitSuccess:m})=>{let{pendingTransaction:f}=(0,x.u)();return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.M,{onClose:i},"header"),(0,t.jsx)(h.e,{children:(0,t.jsxs)("div",{children:[(0,t.jsx)(a.C,{success:m,fail:!!r}),(0,t.jsx)(r?p.default:d.F,{style:{width:"38px",height:"38px"}})]})}),(0,t.jsx)(d.T,{style:{marginTop:"1rem"},children:"Verifying with passkey"}),(0,t.jsxs)(d.L,{children:[(0,t.jsxs)(d.a,{children:[(0,t.jsx)(d.b,{children:(0,t.jsx)(o.default,{})}),"Approve this action using your touch, face, PIN, or hardware key."]}),(0,t.jsxs)(d.a,{children:[(0,t.jsx)(d.b,{children:(0,t.jsx)(u,{})}),"You last added a passkey on"," ",c?.firstVerifiedAt?.toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),"."]})]}),f&&(0,t.jsx)(d.C,{children:(0,t.jsx)(k,{pendingTransaction:f})}),r&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.E,{style:{marginTop:"1.25rem"},children:r.message}),(0,t.jsx)(l.P,{disabled:e,onClick:s,style:{margin:"1.25rem auto 0"},children:"Try again"})]}),n&&(0,t.jsx)(d.P,{style:{marginTop:"1rem"},onClick:n,children:"Choose another method"}),(0,t.jsx)(l.b,{})]})},"a",0,({selectedMethod:e,submitSuccess:i,hasBlockingError:o,onClose:s,onBack:a,handleSubmitCode:c})=>{let u=(0,j.u)(),{pendingTransaction:p}=(0,x.u)();switch(e){case"sms":return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.M,{onClose:s},"header"),(0,t.jsx)(d.I,{style:{marginBottom:"1.5rem"},children:(0,t.jsx)(n.default,{})}),(0,t.jsx)(d.T,{children:"Enter verification code"}),(0,t.jsxs)(d.C,{children:[(0,t.jsx)(d.N,{success:i,disabled:o,onChange:c}),(0,t.jsxs)(d.S,{children:["To continue, please enter the 6-digit code sent to your ",(0,t.jsx)("strong",{children:"mobile device"})]}),p&&(0,t.jsx)(k,{pendingTransaction:p})]}),a&&(0,t.jsx)(d.P,{theme:u?.appearance.palette.colorScheme,onClick:a,children:"Choose another method"}),(0,t.jsx)(l.S,{onClick:s,children:"Cancel"}),(0,t.jsx)(l.b,{})]});case"totp":return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(l.M,{onClose:s},"header"),(0,t.jsx)(d.I,{style:{marginBottom:"1.5rem"},children:(0,t.jsx)(r.default,{})}),(0,t.jsx)(d.T,{children:"Enter verification code"}),(0,t.jsxs)(d.C,{children:[(0,t.jsx)(d.N,{success:i,disabled:o,onChange:c}),(0,t.jsxs)(d.S,{children:["To continue, please enter the 6-digit code generated from your"," ",(0,t.jsx)("strong",{children:"authenticator app"})]}),p&&(0,t.jsx)(k,{pendingTransaction:p})]}),a&&(0,t.jsx)(d.P,{theme:u?.appearance.palette.colorScheme,onClick:a,children:"Choose another method"}),(0,t.jsx)(l.S,{onClick:s,children:"Cancel"}),(0,t.jsx)(l.b,{})]});default:return null}},"b",0,({handleClose:e,mfaMethods:c,onSelect:u})=>(0,t.jsxs)(s.S,{title:"Verify your identity",subtitle:"Choose a verification method",icon:o.default,iconVariant:"subtle",onClose:e,showClose:!0,watermark:!0,children:[(0,t.jsxs)(d.M,{children:[c.includes("totp")&&(0,t.jsxs)(a.m,{onClick:()=>u("totp"),children:[(0,t.jsx)(a.n,{children:(0,t.jsx)(r.default,{})}),"Authenticator app"]},"totp"),c.includes("sms")&&(0,t.jsxs)(a.m,{onClick:()=>u("sms"),children:[(0,t.jsx)(a.n,{children:(0,t.jsx)(n.default,{})}),"SMS"]},"sms"),c.includes("passkey")&&(0,t.jsxs)(a.m,{onClick:()=>u("passkey"),children:[(0,t.jsx)(a.n,{children:(0,t.jsx)(i.default,{})}),"Passkey"]},"passkey")]}),(0,t.jsx)(l.b,{})]}),"t",0,e=>(0,b.c)(e)?{isBlocking:!0,error:Error("You have exceeded the maximum number of attempts. Please close this window and try again in 10 seconds.")}:(0,b.d)(e)?{isBlocking:!1,error:Error("The code you entered is not valid")}:(0,b.f)(e)?{isBlocking:!0,error:Error("You have exceeded the time limit for code entry. Please try again in 30 seconds.")}:(console.error(e),{isBlocking:!1,error:Error("Something went wrong.")})],872841)}]);