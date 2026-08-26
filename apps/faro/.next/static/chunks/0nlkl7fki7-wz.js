(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,530448,e=>{"use strict";var r=e.i(271645);let o=r.forwardRef(function({title:e,titleId:o,...t},i){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":o},t),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"}))});e.s(["default",0,o])},314866,e=>{"use strict";var r=e.i(843476),o=e.i(997053),t=e.i(616918);let i=o.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let r,t;"green"===e.$color&&(r="var(--privy-color-success-dark)",t="var(--privy-color-success-light)"),"red"===e.$color&&(r="var(--privy-color-error)",t="var(--privy-color-error-light)"),"gray"===e.$color&&(r="var(--privy-color-foreground-2)",t="var(--privy-color-background-2)");let i=o.keyframes`
      from, to {
        background-color: ${t};
      }

      50% {
        background-color: rgba(${t}, 0.8);
      }
    `;return o.css`
      color: ${r};
      background-color: ${t};
      ${e.$isPulsing&&o.css`
        animation: ${i} 3s linear infinite;
      `};
    `}}

  ${t.L}
`;e.s(["C",0,({children:e,color:o,isLoading:t,isPulsing:l,...a})=>(0,r.jsx)(i,{$color:o,$isLoading:t,$isPulsing:l,...a,children:e})])},308861,e=>{"use strict";var r=e.i(843476),o=e.i(271645),t=e.i(997053),i=e.i(372299),l=e.i(422749),a=e.i(118364),n=e.i(737577),c=e.i(837008),d=e.i(314866);let s=({value:e,onChange:o})=>(0,r.jsx)("select",{value:e,onChange:o,children:i.countryCodesAndNumbers.map(e=>(0,r.jsxs)("option",{value:e.code,children:[e.code," +",e.callCode]},e.code))}),h=(0,o.forwardRef)((e,t)=>{let h=(0,a.u)(),[v,g]=(0,o.useState)(!1),{accountType:f}=(0,n.h)(),[m,y]=(0,o.useState)(""),[x,b]=(0,o.useState)(e.defaultCountry??h?.intl.defaultCountry??"US"),w=(0,i.validatePhoneNumber)(m,x),k=(0,i.phoneNumberTypingFormatter)(x),C=(0,i.getPlaceholderPhoneNumber)(x),$=(0,l.getCountryCallingCode)(x),j=!w,[z,M]=(0,o.useState)(!1),P=$.length,L=r=>{let o=r.target.value;b(o),y(""),e.onChange&&e.onChange({rawPhoneNumber:m,qualifiedPhoneNumber:(0,i.formatPhoneNumber)(m,o),countryCode:o,isValid:(0,i.validatePhoneNumber)(m,x)})},N=(r,o)=>{try{let t=r.replace(/\D/g,"")===m.replace(/\D/g,"")?r:k.input(r);y(t),e.onChange&&e.onChange({rawPhoneNumber:t,qualifiedPhoneNumber:(0,i.formatPhoneNumber)(r,o),countryCode:o,isValid:(0,i.validatePhoneNumber)(r,o)})}catch(e){console.error("Error processing phone number:",e)}},S=()=>{M(!0);let r=(0,i.formatPhoneNumber)(m,x);e.onSubmit({rawPhoneNumber:m,qualifiedPhoneNumber:r,countryCode:x,isValid:(0,i.validatePhoneNumber)(m,x)}).finally(()=>M(!1))};return(0,o.useEffect)(()=>{if(e.defaultValue){let r=(0,i.getPhoneCountryCodeAndNumber)(e.defaultValue);k.reset(),L({target:{value:r.countryCode}}),N(r.phone,r.countryCode)}},[e.defaultValue]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(u,{children:(0,r.jsxs)(p,{$callingCodeLength:P,$stacked:e.stacked,children:[(0,r.jsx)(s,{value:x,onChange:L}),(0,r.jsx)("input",{ref:t,id:"phone-number-input",className:"login-method-button",type:"tel",placeholder:C,onFocus:()=>g(!0),onChange:e=>{N(e.target.value,x)},onKeyUp:e=>{"Enter"===e.key&&S()},value:m,autoComplete:"tel"}),"phone"!==f||v||e.hideRecent?e.stacked||e.noIncludeSubmitButton?(0,r.jsx)("span",{}):(0,r.jsx)(c.E,{isSubmitting:z,onClick:S,disabled:j,children:"Submit"}):(0,r.jsx)(d.C,{color:"gray",children:"Recent"})]})}),e.stacked&&!e.noIncludeSubmitButton?(0,r.jsx)(c.P,{loading:z,loadingText:null,onClick:S,disabled:j,children:"Submit"}):null]})}),u=t.styled.div`
  width: 100%;
`,p=t.styled.label`
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
`;e.s(["C",0,h])},606223,e=>{"use strict";var r=e.i(843476);e.s(["A",0,e=>(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 210.2",xmlSpace:"preserve",...e,children:(0,r.jsx)("path",{d:"M93.6,27.1C87.6,34.2,78,39.8,68.4,39c-1.2-9.6,3.5-19.8,9-26.1c6-7.3,16.5-12.5,25-12.9  C103.4,10,99.5,19.8,93.6,27.1 M102.3,40.9c-13.9-0.8-25.8,7.9-32.4,7.9c-6.7,0-16.8-7.5-27.8-7.3c-14.3,0.2-27.6,8.3-34.9,21.2  c-15,25.8-3.9,64,10.6,85c7.1,10.4,15.6,21.8,26.8,21.4c10.6-0.4,14.8-6.9,27.6-6.9c12.9,0,16.6,6.9,27.8,6.7  c11.6-0.2,18.9-10.4,26-20.8c8.1-11.8,11.4-23.3,11.6-23.9c-0.2-0.2-22.4-8.7-22.6-34.3c-0.2-21.4,17.5-31.6,18.3-32.2  C123.3,42.9,107.7,41.3,102.3,40.9 M182.6,11.9v155.9h24.2v-53.3h33.5c30.6,0,52.1-21,52.1-51.4c0-30.4-21.1-51.2-51.3-51.2H182.6z   M206.8,32.3h27.9c21,0,33,11.2,33,30.9c0,19.7-12,31-33.1,31h-27.8V32.3z M336.6,169c15.2,0,29.3-7.7,35.7-19.9h0.5v18.7h22.4V90.2  c0-22.5-18-37-45.7-37c-25.7,0-44.7,14.7-45.4,34.9h21.8c1.8-9.6,10.7-15.9,22.9-15.9c14.8,0,23.1,6.9,23.1,19.6v8.6l-30.2,1.8  c-28.1,1.7-43.3,13.2-43.3,33.2C298.4,155.6,314.1,169,336.6,169z M343.1,150.5c-12.9,0-21.1-6.2-21.1-15.7c0-9.8,7.9-15.5,23-16.4  l26.9-1.7v8.8C371.9,140.1,359.5,150.5,343.1,150.5z M425.1,210.2c23.6,0,34.7-9,44.4-36.3L512,54.7h-24.6l-28.5,92.1h-0.5  l-28.5-92.1h-25.3l41,113.5l-2.2,6.9c-3.7,11.7-9.7,16.2-20.4,16.2c-1.9,0-5.6-0.2-7.1-0.4v18.7C417.3,210,423.3,210.2,425.1,210.2z"})}),"G",0,e=>(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 80 38.1",xmlSpace:"preserve",...e,children:[(0,r.jsx)("path",{style:{fill:"#5F6368"},d:"M37.8,19.7V29h-3V6h7.8c1.9,0,3.7,0.7,5.1,2c1.4,1.2,2.1,3,2.1,4.9c0,1.9-0.7,3.6-2.1,4.9c-1.4,1.3-3.1,2-5.1,2  L37.8,19.7L37.8,19.7z M37.8,8.8v8h5c1.1,0,2.2-0.4,2.9-1.2c1.6-1.5,1.6-4,0.1-5.5c0,0-0.1-0.1-0.1-0.1c-0.8-0.8-1.8-1.3-2.9-1.2  L37.8,8.8L37.8,8.8z"}),(0,r.jsx)("path",{style:{fill:"#5F6368"},d:"M56.7,12.8c2.2,0,3.9,0.6,5.2,1.8s1.9,2.8,1.9,4.8V29H61v-2.2h-0.1c-1.2,1.8-2.9,2.7-4.9,2.7  c-1.7,0-3.2-0.5-4.4-1.5c-1.1-1-1.8-2.4-1.8-3.9c0-1.6,0.6-2.9,1.8-3.9c1.2-1,2.9-1.4,4.9-1.4c1.8,0,3.2,0.3,4.3,1v-0.7  c0-1-0.4-2-1.2-2.6c-0.8-0.7-1.8-1.1-2.9-1.1c-1.7,0-3,0.7-3.9,2.1l-2.6-1.6C51.8,13.8,53.9,12.8,56.7,12.8z M52.9,24.2  c0,0.8,0.4,1.5,1,1.9c0.7,0.5,1.5,0.8,2.3,0.8c1.2,0,2.4-0.5,3.3-1.4c1-0.9,1.5-2,1.5-3.2c-0.9-0.7-2.2-1.1-3.9-1.1  c-1.2,0-2.2,0.3-3,0.9C53.3,22.6,52.9,23.3,52.9,24.2z"}),(0,r.jsx)("path",{style:{fill:"#5F6368"},d:"M80,13.3l-9.9,22.7h-3l3.7-7.9l-6.5-14.7h3.2l4.7,11.3h0.1l4.6-11.3H80z"}),(0,r.jsx)("path",{style:{fill:"#4285F4"},d:"M25.9,17.7c0-0.9-0.1-1.8-0.2-2.7H13.2v5.1h7.1c-0.3,1.6-1.2,3.1-2.6,4v3.3H22C24.5,25.1,25.9,21.7,25.9,17.7z"}),(0,r.jsx)("path",{style:{fill:"#34A853"},d:"M13.2,30.6c3.6,0,6.6-1.2,8.8-3.2l-4.3-3.3c-1.2,0.8-2.7,1.3-4.5,1.3c-3.4,0-6.4-2.3-7.4-5.5H1.4v3.4  C3.7,27.8,8.2,30.6,13.2,30.6z"}),(0,r.jsx)("path",{style:{fill:"#FBBC04"},d:"M5.8,19.9c-0.6-1.6-0.6-3.4,0-5.1v-3.4H1.4c-1.9,3.7-1.9,8.1,0,11.9L5.8,19.9z"}),(0,r.jsx)("path",{style:{fill:"#EA4335"},d:"M13.2,9.4c1.9,0,3.7,0.7,5.1,2l0,0l3.8-3.8c-2.4-2.2-5.6-3.5-8.8-3.4c-5,0-9.6,2.8-11.8,7.3l4.4,3.4  C6.8,11.7,9.8,9.4,13.2,9.4z"})]})])},846464,e=>{"use strict";var r=e.i(843476),o=e.i(271645);let t=o.forwardRef(function({title:e,titleId:r,...t},i){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":r},t),e?o.createElement("title",{id:r},e):null,o.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"}))});var i=e.i(997053);let l=i.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-info-bg);
  border: 1px solid var(--privy-color-border-info);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,a=i.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  flex: 1;
  text-align: left;

  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["I",0,({children:e,theme:o,className:i})=>(0,r.jsxs)(l,{$theme:o,className:i,children:[(0,r.jsx)(t,{width:"16px",height:"16px",color:"var(--privy-color-icon-info)",strokeWidth:2,style:{flexShrink:0}}),(0,r.jsx)(a,{$theme:o,children:e})]})],846464)},616918,e=>{"use strict";var r=e.i(997053);let o=r.keyframes`
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
          animation: ${o} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,t])},98341,e=>{"use strict";var r=e.i(843476),o=e.i(530448),t=e.i(997053);let i=t.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-warn-bg);
  border: 1px solid var(--privy-color-border-warning);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,l=t.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["W",0,({children:e,theme:t,className:a})=>(0,r.jsxs)(i,{$theme:t,className:a,children:[(0,r.jsx)(o.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-warning)",strokeWidth:2,style:{flexShrink:0}}),(0,r.jsx)(l,{$theme:t,children:e})]})])},165927,e=>{"use strict";let r=(0,e.i(773524).default)("credit-card",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]]);e.s(["CreditCard",0,r],165927)},265145,e=>{"use strict";let r=(0,e.i(773524).default)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);e.s(["Lock",0,r],265145)},923936,e=>{"use strict";let r=(0,e.i(773524).default)("smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);e.s(["Smartphone",0,r],923936)},131402,e=>{"use strict";let r=(0,e.i(773524).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,r],131402)},738540,e=>{"use strict";let r=(0,e.i(773524).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,r],738540)},793546,e=>{e.v(r=>Promise.all(["static/chunks/0dkf48qcqt6jl.js"].map(r=>e.l(r))).then(()=>r(226276)))}]);