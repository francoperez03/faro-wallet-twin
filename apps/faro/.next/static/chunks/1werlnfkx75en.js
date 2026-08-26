(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72903,e=>{"use strict";var o=e.i(271645);let n=o.forwardRef(function({title:e,titleId:n,...r},t){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":n},r),e?o.createElement("title",{id:n},e):null,o.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}))});e.s(["default",0,n])},314866,e=>{"use strict";var o=e.i(843476),n=e.i(997053),r=e.i(616918);let t=n.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let o,r;"green"===e.$color&&(o="var(--privy-color-success-dark)",r="var(--privy-color-success-light)"),"red"===e.$color&&(o="var(--privy-color-error)",r="var(--privy-color-error-light)"),"gray"===e.$color&&(o="var(--privy-color-foreground-2)",r="var(--privy-color-background-2)");let t=n.keyframes`
      from, to {
        background-color: ${r};
      }

      50% {
        background-color: rgba(${r}, 0.8);
      }
    `;return n.css`
      color: ${o};
      background-color: ${r};
      ${e.$isPulsing&&n.css`
        animation: ${t} 3s linear infinite;
      `};
    `}}

  ${r.L}
`;e.s(["C",0,({children:e,color:n,isLoading:r,isPulsing:i,...l})=>(0,o.jsx)(t,{$color:n,$isLoading:r,$isPulsing:i,...l,children:e})])},308861,e=>{"use strict";var o=e.i(843476),n=e.i(271645),r=e.i(997053),t=e.i(372299),i=e.i(422749),l=e.i(118364),a=e.i(737577),s=e.i(837008),c=e.i(314866);let d=({value:e,onChange:n})=>(0,o.jsx)("select",{value:e,onChange:n,children:t.countryCodesAndNumbers.map(e=>(0,o.jsxs)("option",{value:e.code,children:[e.code," +",e.callCode]},e.code))}),u=(0,n.forwardRef)((e,r)=>{let u=(0,l.u)(),[p,x]=(0,n.useState)(!1),{accountType:f}=(0,a.h)(),[y,g]=(0,n.useState)(""),[v,b]=(0,n.useState)(e.defaultCountry??u?.intl.defaultCountry??"US"),j=(0,t.validatePhoneNumber)(y,v),w=(0,t.phoneNumberTypingFormatter)(v),C=(0,t.getPlaceholderPhoneNumber)(v),k=(0,i.getCountryCallingCode)(v),S=!j,[M,P]=(0,n.useState)(!1),E=k.length,$=o=>{let n=o.target.value;b(n),g(""),e.onChange&&e.onChange({rawPhoneNumber:y,qualifiedPhoneNumber:(0,t.formatPhoneNumber)(y,n),countryCode:n,isValid:(0,t.validatePhoneNumber)(y,v)})},F=(o,n)=>{try{let r=o.replace(/\D/g,"")===y.replace(/\D/g,"")?o:w.input(o);g(r),e.onChange&&e.onChange({rawPhoneNumber:r,qualifiedPhoneNumber:(0,t.formatPhoneNumber)(o,n),countryCode:n,isValid:(0,t.validatePhoneNumber)(o,n)})}catch(e){console.error("Error processing phone number:",e)}},R=()=>{P(!0);let o=(0,t.formatPhoneNumber)(y,v);e.onSubmit({rawPhoneNumber:y,qualifiedPhoneNumber:o,countryCode:v,isValid:(0,t.validatePhoneNumber)(y,v)}).finally(()=>P(!1))};return(0,n.useEffect)(()=>{if(e.defaultValue){let o=(0,t.getPhoneCountryCodeAndNumber)(e.defaultValue);w.reset(),$({target:{value:o.countryCode}}),F(o.phone,o.countryCode)}},[e.defaultValue]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(h,{children:(0,o.jsxs)(m,{$callingCodeLength:E,$stacked:e.stacked,children:[(0,o.jsx)(d,{value:v,onChange:$}),(0,o.jsx)("input",{ref:r,id:"phone-number-input",className:"login-method-button",type:"tel",placeholder:C,onFocus:()=>x(!0),onChange:e=>{F(e.target.value,v)},onKeyUp:e=>{"Enter"===e.key&&R()},value:y,autoComplete:"tel"}),"phone"!==f||p||e.hideRecent?e.stacked||e.noIncludeSubmitButton?(0,o.jsx)("span",{}):(0,o.jsx)(s.E,{isSubmitting:M,onClick:R,disabled:S,children:"Submit"}):(0,o.jsx)(c.C,{color:"gray",children:"Recent"})]})}),e.stacked&&!e.noIncludeSubmitButton?(0,o.jsx)(s.P,{loading:M,loadingText:null,onClick:R,disabled:S,children:"Submit"}):null]})}),h=r.styled.div`
  width: 100%;
`,m=r.styled.label`
  --country-code-dropdown-width: calc(54px + calc(12 * ${e=>e.$callingCodeLength}px));
  --phone-input-extra-padding-left: calc(12px + calc(3 * ${e=>e.$callingCodeLength}px));
  display: block;
  position: relative;
  width: 100%;

  /* Tablet and Up */
  @media (min-width: 441px) {
    --country-code-dropdown-width: calc(52px + calc(10 * ${e=>e.$callingCodeLength}px));
  }

  && > select {
    font-size: 16px;
    height: 24px;
    position: absolute;
    margin: 13px calc(var(--country-code-dropdown-width) / 4);
    line-height: 24px;
    width: var(--country-code-dropdown-width);
    background-color: var(--privy-color-background);
    background-size: auto;
    background-position-x: right;
    cursor: pointer;

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      width: var(--country-code-dropdown-width);
    }

    :focus {
      outline: none;
      box-shadow: none;
    }
  }

  && > input {
    font-size: 16px;
    line-height: 24px;
    color: var(--privy-color-foreground);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    width: calc(100% - var(--country-code-dropdown-width));

    padding: 12px 88px 12px
      calc(var(--country-code-dropdown-width) + var(--phone-input-extra-padding-left));
    padding-right: ${e=>e.$stacked?"16px":"88px"};
    flex-grow: 1;
    background: var(--privy-color-background);
    border: 1px solid var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
    width: 100%;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }

    :autofill,
    :-webkit-autofill {
      background: var(--privy-color-background);
    }

    /* Tablet and Up */
    @media (min-width: 441px) {
      font-size: 14px;
      padding-right: 78px;
    }
  }

  && > :last-child {
    right: 16px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
  }

  && > button:last-child {
    right: 0px;
    line-height: 24px;
    padding: 13px 17px;

    :focus {
      outline: none;
      border-color: var(--privy-color-accent);
    }
  }

  && > input::placeholder {
    color: var(--privy-color-foreground-3);
  }
`;e.s(["C",0,u])},616918,e=>{"use strict";var o=e.i(997053);let n=o.keyframes`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,r=o.css`
  ${e=>e.$isLoading?o.css`
          width: 35%;
          animation: ${n} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,r])},127920,e=>{"use strict";var o=e.i(843476),n=e.i(974935),r=e.i(337025),t=e.i(271645);let i=t.forwardRef(function({title:e,titleId:o,...n},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":o},n),e?t.createElement("title",{id:o},e):null,t.createElement("path",{fillRule:"evenodd",d:"M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z",clipRule:"evenodd"}))}),l=t.forwardRef(function({title:e,titleId:o,...n},r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:r,"aria-labelledby":o},n),e?t.createElement("title",{id:o},e):null,t.createElement("path",{fillRule:"evenodd",d:"M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z",clipRule:"evenodd"}))});var a=e.i(837008),s=e.i(737577),c=e.i(118364),d=e.i(595693),u=e.i(346146),h=e.i(600476),m=e.i(385171),p=e.i(660877),x=e.i(72903),f=e.i(846455),y=e.i(372299),g=e.i(308861),v=e.i(310024),b=e.i(891029);e.i(437206),e.i(33750),e.i(123287),e.i(610760),e.i(973134);let j=({appName:e,onComplete:n,onReset:r,onClose:i})=>{let[l,s]=(0,t.useState)(""),[d,h]=(0,t.useState)(!1),[p,j]=(0,t.useState)(null),[w,C]=(0,t.useState)("enroll"),{initEnrollmentWithSms:k,submitEnrollmentWithSms:S}=(0,m.h)(),{data:M}=(0,u.u)(),P=(0,c.u)();function E(){M?.mfaEnrollmentFlow?.onSuccess(),n()}return p?(0,o.jsx)(b.ErrorScreenView,{allowlistConfig:P.allowlistConfig,error:p,onBack:()=>j(null),onRetry:()=>j(null)}):(0,o.jsxs)(o.Fragment,"enroll"===w?{children:[(0,o.jsx)(a.M,{backFn:r,onClose:i},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(f.default,{})}),(0,o.jsx)(v.T,{children:"Set up SMS verification"}),(0,o.jsxs)(v.S,{children:["We'll text a verification code to this mobile device whenever you use your ",e," ","wallet."]}),(0,o.jsxs)(v.C,{children:[(0,o.jsx)(g.C,{onSubmit:async function({qualifiedPhoneNumber:e}){try{await k({phoneNumber:e}),s(e),C("verify")}catch(e){j(e)}},hideRecent:!0}),(0,o.jsxs)(v.c,{children:["By providing your mobile number, you agree to receive text messages from ",P?.name,". Some carrier charges may apply"]})]}),(0,o.jsx)(a.b,{})]}:d?{children:[(0,o.jsx)(a.M,{onClose:E},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(x.default,{})}),(0,o.jsx)(v.T,{children:"SMS verification added"}),(0,o.jsxs)(v.S,{children:["From now on, you'll enter the verification code sent to your mobile device whenever you use your ",e," wallet."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(a.P,{onClick:E,children:"Done"})}),(0,o.jsx)(a.b,{})]}:{children:[(0,o.jsx)(a.M,{backFn:function(){"verify"===w?C("enroll"):r()},onClose:i},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(f.default,{})}),(0,o.jsx)(v.T,{children:"Enter enrollment code"}),(0,o.jsxs)(v.C,{children:[(0,o.jsx)(v.N,{onChange:async function(e){try{if(!e)return;await S({phoneNumber:l,mfaCode:e}),h(!0)}catch(e){if((0,m.i)(e))throw Error("You have exceeded the maximum number of attempts. Please close this window and try again in 10 seconds.");if((0,m.d)(e))throw Error("The code you entered is not valid");if((0,m.f)(e))throw Error("You have exceeded the time limit for code entry. Please try again in 30 seconds.");throw(0,m.j)(e)?Error("Verification canceled"):Error("Unknown error")}}}),(0,o.jsxs)(v.S,{children:["To continue, enter the 6-digit code sent to ",(0,o.jsx)("strong",{children:(0,y.lastFourDigits)(l)})]})]}),(0,o.jsx)(a.b,{})]})},w={component:()=>{let{user:e,enrollInMfa:x,ready:f}=(0,h.u)(),[y,g]=(0,t.useState)(null),{unenrollWithSms:b,unenrollWithTotp:w,unenrollWithPasskey:C,submitEnrollmentWithTotp:k,initEnrollmentWithPasskey:S,submitEnrollmentWithPasskey:M,initEnrollmentWithTotp:P}=(0,m.h)(),{data:E,onUserCloseViaDialogOrKeybindRef:$}=(0,u.u)(),F=(0,c.u)(),{closePrivyModal:R}=(0,d.u)(),{promptMfa:T}=(0,m.u)(),[N,B]=(0,t.useState)(!1),[L,A]=(0,t.useState)(null),[I,U]=(0,t.useState)(null),W=()=>{R({shouldCallAuthOnSuccess:!0}),x(!1),setTimeout(()=>{g(null),A(null)},500)},[O,V]=(0,t.useState)(!1),[Z,z]=(0,t.useState)();$.current=W;let D=e?.mfaMethods.includes("sms"),q=!!e?.phone,H=e?.mfaMethods.includes("totp"),K=e?.mfaMethods.includes("passkey"),Y=D||H||K,G=e?.linkedAccounts.filter(e=>"passkey"===e.type).map(e=>e.credentialId)??[];function J(){g(null),A(null)}async function Q(e=G){V(!0);try{return await S(),await M({credentialIds:e},{removeForLogin:E?.mfaEnrollmentFlow?.shouldUnlinkOnUnenrollMfa}),E?.mfaEnrollmentFlow?.onSuccess(),W()}catch(e){z(e)}finally{V(!1)}}if((0,t.useEffect)(()=>{Y&&B(!0)},[Y]),!f||!e||!F)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.M,{onClose:W},"header"),(0,o.jsx)(v.A,{children:(0,o.jsx)(p.M,{})}),(0,o.jsx)(v.C,{children:(0,o.jsx)(s.L,{})}),(0,o.jsx)(a.b,{})]});if("sms"===y)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.M,{backFn:J,onClose:W},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(n.default,{})}),(0,o.jsx)(v.T,{children:"Remove SMS verification?"}),(0,o.jsxs)(v.S,{children:["MFA adds an extra layer of security to your ",F?.name," account. Make sure you have other methods to secure your account."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(a.P,{$warn:!0,onClick:async function(){g(null);try{await b()}catch(e){g(null)}},children:"Remove"})}),(0,o.jsx)(a.b,{})]});if("totp"===y)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.M,{backFn:J,onClose:W},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(n.default,{})}),(0,o.jsx)(v.T,{children:"Remove authenticator app verification?"}),(0,o.jsxs)(v.S,{children:["MFA adds an extra layer of security to your ",F?.name," account. Make sure you have other methods to secure your account."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(a.P,{$warn:!0,onClick:async function(){g(null);try{await w()}catch(e){g(null)}},children:"Remove"})}),(0,o.jsx)(a.b,{})]});if("passkey"===y){let e=E?.mfaEnrollmentFlow?.shouldUnlinkOnUnenrollMfa??!0;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.M,{backFn:J,onClose:W},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(n.default,{})}),(0,o.jsx)(v.T,{children:"Are you sure you want to remove this passkey?"}),(0,o.jsx)(v.S,{children:e?"Removing your passkey will remove as both a verification method and a login method.":"Removing your passkey will remove as a verification method."}),(0,o.jsx)(v.B,{children:(0,o.jsx)(a.P,{$warn:!0,onClick:async function(){g(null);try{await C({removeForLogin:E?.mfaEnrollmentFlow?.shouldUnlinkOnUnenrollMfa})}catch(e){g(null)}},children:"Remove"})}),(0,o.jsx)(a.b,{})]})}if(0===E.mfaEnrollmentFlow.mfaMethods.length&&!Y)return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.M,{onClose:W},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(r.default,{})}),(0,o.jsx)(v.T,{children:"Add more security"}),(0,o.jsxs)(v.S,{children:[F?.name," does not have any verification methods enabled."]}),(0,o.jsx)(v.B,{children:(0,o.jsx)(a.P,{onClick:W,children:"Close"})}),(0,o.jsx)(a.b,{})]});let X=!Y&&!N;return X?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.M,{onClose:W},"header"),(0,o.jsx)(v.I,{style:{marginBottom:"1.5rem"},children:(0,o.jsx)(r.default,{})}),(0,o.jsx)(v.T,{children:"Transaction Protection"}),(0,o.jsx)(v.S,{children:"Set up transaction protection to add an extra layer of security to your account"}),(0,o.jsxs)(v.L,{children:[(0,o.jsxs)(v.a,{children:[(0,o.jsx)(v.b,{children:(0,o.jsx)(i,{})}),"Enable 2-Step verification for your ",F?.name," wallet."]}),(0,o.jsxs)(v.a,{children:[(0,o.jsx)(v.b,{children:(0,o.jsx)(l,{})}),"You'll be prompted to authenticate to complete transactions."]})]}),(0,o.jsxs)(v.B,{children:[(0,o.jsx)(a.P,{onClick:()=>B(!0),children:"Continue"}),(0,o.jsx)(a.S,{onClick:W,children:"Not now"})]}),(0,o.jsx)(a.b,{})]}):"sms"===L?(0,o.jsx)(j,{appName:F?.name||"Privy",onComplete:W,onReset:J,onClose:W}):"totp"===L&&I?(0,o.jsx)(p.E,{onClose:W,onReset:J,submitEnrollmentWithTotp:({mfaCode:e})=>(async function(e){try{return z(void 0),await k({mfaCode:e}),E?.mfaEnrollmentFlow?.onSuccess(),W()}catch(e){z(e)}finally{g(null)}})(e),totpInfo:{...I,appName:F?.name||"Privy"}}):"passkey"===L?(0,o.jsx)(p.a,{onReset:J,onClose:W,submitEnrollmentWithPasskey:Q}):(0,o.jsx)(p.b,{showIntro:X,userMfaMethods:e.mfaMethods,appMfaMethods:F.mfa.methods,userHasAuthSms:q,backFn:function(){B(!1)},handleSelectMethod:async function(e){try{await T()}catch(e){return void z(e)}return"totp"===e?(A(e),U(null),void P().then(e=>{U(e)}).catch(()=>{U(null),J()})):"passkey"===e&&1===G.length?await Q():void A(e)},isTotpLoading:"totp"===L&&!I,isPasskeyLoading:O,error:Z,onClose:W,setRemovingMfaMethod:async e=>{try{await T()}catch(e){return void z(e)}g(e)}})}};e.s(["MfaEnrollmentFlowScreen",0,w,"default",0,w],127920)}]);