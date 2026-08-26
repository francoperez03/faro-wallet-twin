(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,393794,e=>{"use strict";var t=e.i(271645);let n=t.forwardRef(function({title:e,titleId:n,...a},i){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"}))});e.s(["default",0,n])},705630,e=>{"use strict";var t=e.i(271645);let n=t.forwardRef(function({title:e,titleId:n,...a},i){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":n},a),e?t.createElement("title",{id:n},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"}))});e.s(["default",0,n])},143416,e=>{"use strict";var t=e.i(843476),n=e.i(705630),a=e.i(997053);let i=a.styled.div`
  display: flex;
  gap: 0.5rem;
  background-color: var(--privy-color-error-bg);
  border: 1px solid var(--privy-color-border-error);
  align-items: flex-start;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow: clip;
  width: 100%;
`,s=a.styled.div`
  color: ${e=>"dark"===e.$theme?"var(--privy-color-foreground-2)":"var(--privy-color-foreground)"};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  flex: 1;
  text-align: left;
  font-feature-settings:
    'calt' 0,
    'kern' 0;
`;e.s(["E",0,({children:e,theme:a,className:r})=>(0,t.jsxs)(i,{$theme:a,className:r,children:[(0,t.jsx)(n.default,{width:"16px",height:"16px",color:"var(--privy-color-icon-error)",strokeWidth:2,style:{flexShrink:0}}),(0,t.jsx)(s,{$theme:a,children:e})]})])},492007,e=>{"use strict";var t=e.i(843476),n=e.i(997053);let a=({data:e})=>{let n=e=>"object"==typeof e&&null!==e?(0,t.jsx)(s,{children:Object.entries(e).map(([e,a])=>(0,t.jsxs)("li",{children:[(0,t.jsxs)("strong",{children:[e,":"]})," ",n(a)]},e))}):(0,t.jsx)("span",{children:String(e)});return(0,t.jsx)("div",{children:n(e)})},i=n.styled.div`
  margin-top: 1.5rem;
  background-color: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  padding: 12px;
  text-align: left;
  max-height: 310px;
  overflow: scroll;
  white-space: pre-wrap;
  width: 100%;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
  line-height: 1.5;

  // hide the scrollbars
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`,s=n.styled.ul`
  margin-left: 12px !important;
  white-space: nowrap;

  &:first-child {
    margin-left: 0 !important;
  }

  strong {
    font-weight: 500 !important;
  }
`;e.s(["D",0,({data:e,className:n})=>(0,t.jsx)(i,{className:n,children:(0,t.jsx)(a,{data:e})}),"M",0,i])},921e3,e=>{"use strict";var t=e.i(997053);let n=t.styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
`,a=t.styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 0.5rem;
`;e.s(["R",0,a,"a",0,n])},810977,e=>{"use strict";var t=e.i(843476),n=e.i(997053);let a=({title:e,description:n,children:a,...s})=>(0,t.jsx)(i,{...s,children:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("h3",{children:e}),"string"==typeof n?(0,t.jsx)("p",{children:n}):n,a]})});(0,n.styled)(a)`
  margin-bottom: 24px;
`;let i=n.styled.div`
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
`,s=(0,n.styled)(i)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`;e.s(["C",0,({title:e,description:n,icon:a,children:i,...r})=>(0,t.jsxs)(s,{...r,children:[a||null,(0,t.jsx)("h3",{children:e}),n&&"string"==typeof n?(0,t.jsx)("p",{children:n}):n,i]}),"S",0,a])},816204,e=>{"use strict";var t=e.i(843476),n=e.i(997053),a=e.i(849498),i=e.i(274584),s=e.i(938921),r=e.i(393794),o=e.i(271645),l=e.i(118364);let d=({label:e,children:n,valueStyles:a})=>(0,t.jsxs)(c,{children:[(0,t.jsx)("div",{children:e}),(0,t.jsx)(u,{style:{...a},children:n})]}),c=n.styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > :first-child {
    color: var(--privy-color-foreground-3);
    text-align: left;
  }

  > :last-child {
    color: var(--privy-color-foreground-2);
    text-align: right;
  }
`,u=n.styled.div`
  font-size: 14px;
  line-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-2);
  padding: 4px 8px;
`,p=({gas:e,tokenPrice:n,tokenSymbol:r})=>(0,t.jsxs)(s.F,{style:{paddingBottom:"12px"},children:[(0,t.jsxs)(m,{children:[(0,t.jsx)(h,{children:"Est. Fees"}),(0,t.jsx)("div",{children:(0,t.jsx)(a.P,{weiQuantities:[BigInt(e)],tokenPrice:n,tokenSymbol:r})})]}),n&&(0,t.jsx)(f,{children:`${(0,i.g)(BigInt(e),r)}`})]}),y=({value:e,gas:n,tokenPrice:r,tokenSymbol:o})=>{let l=BigInt(e??0)+BigInt(n);return(0,t.jsxs)(s.F,{children:[(0,t.jsxs)(m,{children:[(0,t.jsx)(h,{children:"Total (including fees)"}),(0,t.jsx)("div",{children:(0,t.jsx)(a.P,{weiQuantities:[BigInt(e||0),BigInt(n)],tokenPrice:r,tokenSymbol:o})})]}),r&&(0,t.jsx)(f,{children:(0,i.g)(l,o)})]})},m=n.styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
`,f=n.styled.div`
  display: flex;
  flex-direction: row;
  height: 12px;

  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
  font-weight: 400;
`,h=n.styled.div`
  font-size: 14px;
  line-height: 22.4px;
  font-weight: 400;
`,g=(0,o.createContext)(void 0),b=(0,o.createContext)(void 0),v=({defaultValue:e,children:n})=>{let[a,i]=(0,o.useState)(e||null);return(0,t.jsx)(g.Provider,{value:{activePanel:a,togglePanel:e=>{i(a===e?null:e)}},children:(0,t.jsx)(I,{children:n})})},x=({value:e,children:n})=>{let{activePanel:a,togglePanel:i}=(0,o.useContext)(g),s=a===e;return(0,t.jsx)(b.Provider,{value:{onToggle:()=>i(e),value:e},children:(0,t.jsx)(P,{isActive:s?"true":"false","data-open":String(s),children:n})})},T=({children:e})=>{let{activePanel:n}=(0,o.useContext)(g),{onToggle:a,value:i}=(0,o.useContext)(b),s=n===i;return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(S,{onClick:a,"data-open":String(s),children:[(0,t.jsx)(E,{children:e}),(0,t.jsx)(M,{isactive:s?"true":"false",children:(0,t.jsx)(r.default,{height:"16px",width:"16px",strokeWidth:"2"})})]}),(0,t.jsx)(j,{})]})},k=({children:e})=>{let{activePanel:n}=(0,o.useContext)(g),{value:a}=(0,o.useContext)(b);return(0,t.jsx)(C,{"data-open":String(n===a),children:(0,t.jsx)(F,{children:e})})},w=({children:e})=>{let{activePanel:n}=(0,o.useContext)(g),{value:a}=(0,o.useContext)(b);return(0,t.jsx)(F,{children:"function"==typeof e?e({isActive:n===a}):e})},I=n.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`,S=n.styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding-bottom: 8px;
`,j=n.styled.div`
  width: 100%;

  && {
    border-top: 1px solid;
    border-color: var(--privy-color-foreground-4);
  }
  padding-bottom: 12px;
`,E=n.styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 19.6px;
  width: 100%;
  padding-right: 8px;
`,P=n.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  padding: 12px;

  && {
    border: 1px solid;
    border-color: var(--privy-color-foreground-4);
    border-radius: var(--privy-border-radius-md);
  }
`,C=n.styled.div`
  position: relative;
  overflow: hidden;
  transition: max-height 25ms ease-out;

  &[data-open='true'] {
    max-height: 700px;
  }

  &[data-open='false'] {
    max-height: 0;
  }
`,F=n.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1 1 auto;
  min-height: 1px;
`,M=n.styled.div`
  transform: ${e=>"true"===e.isactive?"rotate(180deg)":"rotate(0deg)"};
`,N=n.styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`,A=n.styled.div`
  flex-shrink: 0;
  padding-left: 8px;
`;e.s(["T",0,({from:e,to:n,txn:i,transactionInfo:s,tokenPrice:r,gas:o,tokenSymbol:c})=>{let u=BigInt(i?.value||0);return(0,t.jsx)(v,{...(0,l.u)().render.standalone?{defaultValue:"details"}:{},children:(0,t.jsxs)(x,{value:"details",children:[(0,t.jsx)(T,{children:(0,t.jsxs)(N,{children:[(0,t.jsx)("div",{children:s?.title||"Details"}),(0,t.jsx)(A,{children:(0,t.jsx)(a.H,{weiQuantities:[u],tokenPrice:r,tokenSymbol:c})})]})}),(0,t.jsxs)(k,{children:[(0,t.jsx)(d,{label:"From",children:(0,t.jsx)(a.W,{walletAddress:e,chainId:i.chainId||l.t,chainType:"ethereum"})}),(0,t.jsx)(d,{label:"To",children:(0,t.jsx)(a.W,{walletAddress:n,chainId:i.chainId||l.t,chainType:"ethereum"})}),s&&s.action&&(0,t.jsx)(d,{label:"Action",children:s.action}),o&&(0,t.jsx)(p,{value:i.value,gas:o,tokenPrice:r,tokenSymbol:c})]}),(0,t.jsx)(w,{children:({isActive:e})=>(0,t.jsx)(y,{value:i.value,displayFee:e,gas:o||"0x0",tokenPrice:r,tokenSymbol:c})})]})})}])},515987,e=>{"use strict";var t=e.i(997053),n=e.i(616918);let a=t.styled.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */
`,i=(0,t.styled)(a)`
  color: var(--privy-color-accent);
`,s=t.styled.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem; /* 157.143% */
  word-break: break-all;
  text-align: right;

  ${n.L}
`;e.s(["L",0,a,"V",0,s,"a",0,i])},849498,e=>{"use strict";var t=e.i(843476),n=e.i(997053),a=e.i(810907),i=e.i(274584),s=e.i(640694),r=e.i(458383),o=e.i(435232);let l=n.styled.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,d=n.styled.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,c=n.styled.span`
  font-size: 10px;
`,u=n.styled.span`
  display: flex;
  align-items: center;
`,p=n.styled.a`
  &:hover {
    text-decoration: underline;
  }
`;e.s(["H",0,({weiQuantities:e,tokenPrice:n,tokenSymbol:a})=>{let s=(0,i.s)(e),r=n?(0,i.a)(s,n):void 0,o=(0,i.g)(s,a);return(0,t.jsx)(l,{children:r||o})},"P",0,({weiQuantities:e,tokenPrice:n,tokenSymbol:a})=>{let s=(0,i.s)(e),r=n?(0,i.a)(s,n):void 0,o=(0,i.g)(s,a);return(0,t.jsx)(l,{children:r?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d,{children:"USD"}),"<$0.01"===r?(0,t.jsxs)(u,{children:[(0,t.jsx)(c,{children:"<"}),"$0.01"]}):r]}):o})},"S",0,({quantities:e,tokenPrice:n,tokenSymbol:i="SOL",tokenDecimals:o=9})=>{let d=e.reduce((e,t)=>e+t,0n),p=n&&"SOL"===i&&9===o?(0,s.g)(d,n):void 0,y="SOL"===i&&9===o?(0,r.g)(d):`${(0,a.formatUnits)(d,o)} ${i}`;return(0,t.jsx)(l,{children:p?(0,t.jsx)(t.Fragment,{children:"<$0.01"===p?(0,t.jsxs)(u,{children:[(0,t.jsx)(c,{children:"<"}),"$0.01"]}):p}):y})},"W",0,e=>{var n,a;return(0,t.jsx)(p,{href:"ethereum"===e.chainType?(0,i.b)(e.chainId,e.walletAddress):(n=e.walletAddress,a=e.chainId,`https://explorer.solana.com/account/${n}?chain=${a}`),target:"_blank",children:(0,o.d)(e.walletAddress)})}])},274584,e=>{"use strict";var t=e.i(742741),n=e.i(595693),a=e.i(435232);let i=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2}),s=(e,n=6,a=!1)=>{let i=parseFloat((0,t.formatEther)(e)).toFixed(n).replace(/0+$/,"").replace(/\.$/,"");return a?i:`${"0"===i?"<0.001":i}`};e.s(["a",0,(e,n)=>{let a,s=(a=n*parseFloat((0,t.formatEther)(e)),i.format(a));return"$0.00"===s?"<$0.01":s},"b",0,(e,t)=>{let{chains:i}=(0,n.u)(),s=`https://etherscan.io/address/${t}`,r=`${(0,a.y)(e,i)}/address/${t}`;try{new URL(r)}catch{return s}return r},"c",0,(e,t)=>{let n,a=(n=t*parseFloat(e),i.format(n));return"$0.00"!==a?a:"<$0.01"},"g",0,(e,t,n=6,a=!1)=>`${s(e,n,a)} ${t}`,"p",0,s,"s",0,e=>e.reduce((e,t)=>e+t,0n)])},792688,e=>{"use strict";let t=2n**256n-1n;e.s(["f",0,({amount:e,decimals:n})=>e===t?"Maximum":Intl.NumberFormat(void 0,{maximumFractionDigits:n}).format(Number(e)/10**n)])},117196,e=>{"use strict";var t=e.i(696942),n=e.i(44979),a=e.i(758356);let i=async({address:e,chain:i,rpcConfig:r,privyAppId:o})=>{try{let l=(0,t.createPublicClient)({chain:i,transport:(0,n.http)((0,a.a)(i,r,o))}),[d,c]=await Promise.all([l.readContract({abi:s,address:e,functionName:"symbol"}),l.readContract({abi:s,address:e,functionName:"decimals"})]);return{decimals:c,symbol:d}}catch(e){return console.log(e),null}},s=[{inputs:[],name:"decimals",outputs:[{internalType:"uint8",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"}];e.s(["g",0,i])},640694,e=>{"use strict";let t=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2});e.s(["A",0,"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","D",0,{"solana:mainnet":{EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{symbol:"USDC",decimals:6,address:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{symbol:"USDT",decimals:6,address:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:devnet":{"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU":{symbol:"USDC",decimals:6,address:"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS:{symbol:"USDT",decimals:6,address:"EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:testnet":{}},"J",0,["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],"L",0,1e9,"R",0,["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C","CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"],"S",0,"11111111111111111111111111111111","T",0,"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","a",0,"TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb","g",0,function(e,n){let a=parseFloat(e.toString())/1e9,i=t.format(n*a);return"$0.00"===i?"<$0.01":i}])},869457,e=>{"use strict";var t=e.i(843476),n=e.i(271645),a=e.i(696942),i=e.i(44979),s=e.i(547104),r=e.i(315027),o=e.i(327696),l=e.i(742741),d=e.i(372299),c=e.i(363827),u=e.i(118364),p=e.i(435232),y=e.i(595693),m=e.i(346146),f=e.i(600476),h=e.i(349893),g=e.i(788728),b=e.i(117196),v=e.i(792688),x=e.i(274584),T=e.i(758356),k=e.i(891029),w=e.i(997053),I=e.i(837008),S=e.i(492007),j=e.i(704074),E=e.i(938921),P=e.i(810977),C=e.i(737577),F=e.i(816204),M=e.i(592552),N=e.i(328708);e.i(123287),e.i(437206),e.i(33750),e.i(610760);let A=[{constant:!0,inputs:[{name:"_owner",type:"address"}],name:"balanceOf",outputs:[{name:"balance",type:"uint256"}],payable:!1,stateMutability:"view",type:"function"}],$=w.styled.div`
  display: flex;
  flex-direction: column;
  min-height: 72px;
`;var _=({onBack:e,details:n})=>(0,t.jsxs)($,{children:[(0,t.jsx)(I.M,{backFn:e}),(0,t.jsx)(S.D,{data:n}),(0,t.jsx)(I.B,{})]});let B=({txn:e,receipt:n,transactionInfo:a,onClose:i,tokenPrice:r,tokenSymbol:o,receiptHeader:l,receiptDescription:d})=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(I.M,{onClose:i}),(0,t.jsx)(P.S,{title:l??"Transaction complete!",description:d??"You're all set."}),(0,t.jsx)(F.T,{tokenPrice:r,from:n.from,to:n.to,gas:(({gasUsed:e,effectiveGasPrice:t})=>{if(e&&t)try{return(0,s.toHex)(e*t)}catch(e){return}})(n),txn:e,transactionInfo:a,tokenSymbol:o}),(0,t.jsx)(C.G,{}),(0,t.jsx)(D,{loading:!1,onClick:i,children:"All Done"}),(0,t.jsx)(E.R,{}),(0,t.jsx)(I.B,{})]}),D=(0,w.styled)(I.P)`
  && {
    margin-top: 24px;
  }
  transition:
    color 350ms ease,
    background-color 350ms ease;
`,L=[{constant:!1,inputs:[{name:"_salt",type:"bytes32"},{name:"_initializer",type:"bytes"}],name:"deployAccount",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],U=[{name:"from",type:"address"},{name:"param2",type:"address"},{name:"param3",type:"bytes"},{name:"param4",type:"tuple",components:[]},{type:"tuple",components:[{name:"param5",type:"address"},{name:"param6",type:"uint256"},{name:"param7",type:"uint256"},{name:"encodedInitData",type:"bytes"}]}],O=[{constant:!1,inputs:[{name:"spender",type:"address"},{name:"value",type:"uint256"}],name:"approve",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],R=[{inputs:[{name:"to",type:"address"},{name:"amount",type:"uint256"},{name:"memo",type:"bytes32"}],name:"transferWithMemo",outputs:[{name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}],q=[{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"mint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"mint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"mint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"mint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"quantity",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"quantity",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"},{internalType:"uint256[]",name:"quantities",type:"uint256[]"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mintBatch",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"},{internalType:"uint256[]",name:"quantities",type:"uint256[]"},{internalType:"bytes",name:"data",type:"bytes"}],name:"mintBatch",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256",name:"quantity",type:"uint256"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"quantity",type:"uint256"}],name:"mint",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"string",name:"uri",type:"string"}],name:"safeMint",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"batchMint",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"amount",type:"uint256"}],name:"batchMint",outputs:[],stateMutability:"payable",type:"function"}],z=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],V=[{constant:!1,inputs:[{name:"_operator",type:"address"},{name:"_approved",type:"bool"}],name:"setApprovalForAll",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],W=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenId",type:"uint256"}],name:"transferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],H=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenIds",type:"uint256[]"},{name:"_amounts",type:"uint256[]"},{name:"_data",type:"bytes"}],name:"safeBatchTransferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],G=[{constant:!1,inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_tokenId",type:"uint256"},{name:"_amount",type:"uint256"},{name:"_data",type:"bytes"}],name:"safeTransferFrom",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],Z=(e,t)=>{let n=J(O,e);if(n)return{action:"approve",functionName:"approve",isErc20Ish:!0,isNFTIsh:!1,spender:n.args[0],amount:n.args[1]};let a=J(M.E,e);if(a)return{action:"transfer",functionName:"transfer",isErc20Ish:!0,isNFTIsh:!1,transferTo:a.args[0],amount:a.args[1]};let i=J(R,e);if(i)return{action:"transfer",functionName:"transferWithMemo",isErc20Ish:!0,isNFTIsh:!1,transferTo:i.args[0],amount:i.args[1]};if(!t)return{action:"transaction",functionName:"",isErc20Ish:!1,isNFTIsh:!1};let s=J(L,e);if(s&&"string"==typeof s.args[1]){let e=Q(s.args[1]);if(e&&e[4].encodedInitData)return Z(e[4].encodedInitData,t)}let r=J(V,e);if(r)return{action:"approve",functionName:"setApprovalForAll",isNFTIsh:!0,isErc20Ish:!1,operator:r.args[0],approved:r.args[1]};let o=J(W,e);if(o)return{action:"transfer",functionName:"transferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:o.args[0],transferTo:o.args[1],tokenId:o.args[2]};let l=J(z,e);if(l)return{action:"transfer",functionName:"safeTransferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:l.args[0],transferTo:l.args[1],tokenId:l.args[2]};let d=J(G,e);if(d)return{action:"transfer",functionName:"safeTransferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:d.args[0],transferTo:d.args[1],tokenId:d.args[2],amount:d.args[3]};let c=J(H,e);if(c)return{action:"batch transfer",functionName:"safeBatchTransferFrom",isNFTIsh:!0,isErc20Ish:!1,transferFrom:c.args[0],transferTo:c.args[1],tokenIds:c.args[2],amounts:c.args[3]};let u=J(q,e);return u?{action:"mint",functionName:u.functionName,isNFTIsh:!0,isErc20Ish:!1,args:u.args}:{action:"transaction",isErc20Ish:!1,isNFTIsh:!1}},J=(e,t)=>{try{let n=(0,r.decodeFunctionData)({abi:e,data:t});return{functionName:n.functionName,args:n.args||[]}}catch(e){return null}},Q=e=>{try{if("string"==typeof e)return(0,o.decodeAbiParameters)(U,`0x${e.slice(10)}`)}catch(e){return null}},Y=e=>`${parseFloat(e).toFixed(2)}`,K=new p.P(new p.z("There was an issue preparing your transaction",d.ProviderErrors.E32603_DEFAULT_INTERNAL_ERROR.eipCode)),X=(e,t)=>e?.sendTransaction?"transactionRequest"in e.sendTransaction?e.sendTransaction.transactionRequest:e.sendTransaction.transactionRequests[t]:void 0,ee={component:()=>{let{data:e,onUserCloseViaDialogOrKeybindRef:s,setModalData:r,navigate:o}=(0,m.u)(),{client:w,rpcConfig:I,chains:S,closePrivyModal:E,walletProxy:P,showFiatPrices:C}=(0,y.u)(),{user:F}=(0,f.u)(),M=(0,u.u)(),[$,D]=(0,n.useState)(0),[L,U]=(0,n.useState)(0),[O,R]=(0,n.useState)(X(e,$)),[q,z]=(0,n.useState)(null),[V,W]=(0,n.useState)(),[H,G]=(0,n.useState)(!1),[J,Q]=(0,n.useState)(null),[ee,et]=(0,n.useState)(null),[en,ea]=(0,n.useState)(null),[ei,es]=(0,n.useState)(void 0),[er,eo]=(0,n.useState)(void 0),[el,ed]=(0,n.useState)(!1),[ec,eu]=(0,n.useState)(!1),[ep,ey]=(0,n.useState)([]),[em,ef]=(0,n.useState)([]),[eh,eg]=(0,n.useState)("uninitiated"),[eb,ev]=(0,n.useState)(void 0);if(!O||!e?.sendTransaction||!e?.sendTransaction)return(0,t.jsx)(k.ErrorScreenView,{error:Error("Invalid transaction request"),allowlistConfig:M.allowlistConfig,onRetry:()=>{e?.sendTransaction?.onFailure(K),E({shouldCallAuthOnSuccess:!1})}});let{transactingWalletAddress:ex}=e.sendTransaction,eT=(0,n.useMemo)(()=>S.find(e=>Number(e.id)===Number(O.chainId)),[O.chainId]),ek=eT?.nativeCurrency.symbol??"ETH",ew=(0,n.useMemo)(()=>Z(O.data,!!M.embeddedWallets.extendedCalldataDecoding),[O.data]),{action:eI,isErc20Ish:eS,isNFTIsh:ej,functionName:eE}=ew,{toAddress:eP,tokenAddress:eC}=(0,n.useMemo)(()=>({toAddress:ew.isErc20Ish?ew.transferTo:O.to??void 0,tokenAddress:ew.isErc20Ish?O.to:void 0}),[ew]);(0,n.useEffect)(()=>{O.to&&eT&&eS&&(0,b.g)({address:O.to,chain:eT,rpcConfig:M.rpcConfig,privyAppId:M.id}).then(z).catch(console.error)},[O.to,eT]);let{tokenPrice:eF,isTokenPriceLoading:eM}=(0,h.u)(O.chainId),{balance:eN}=(0,g.u)({rpcConfig:M.rpcConfig,appId:M.id,address:ex,chain:eT}),eA=function({rpcConfig:e,appId:t,address:s,chain:r,tokenInfo:o}){let{chains:l}=(0,y.u)(),[c,u]=(0,n.useState)(null),[p,m]=(0,n.useState)(!1),f=(0,n.useMemo)(()=>{let n=r||l[0];if(n)return(0,a.createPublicClient)({chain:r,transport:(0,i.http)((0,d.getJsonRpcEndpointFromChain)(n,e,t))})},[r,e,t]),h=(0,n.useCallback)(async()=>{if(s&&f&&o.address)try{return m(!0),await f.readContract({address:o.address,abi:A,functionName:"balanceOf",args:[s]})}catch(e){console.error(e)}finally{m(!1)}},[f,s,o?.address,r]);return(0,n.useEffect)(()=>{h().then(e=>null!=e&&u(e))},[h]),{balance:c,isLoading:p&&null==c,formattedBalance:(0,d.formatTokenAmount)({amount:c??BigInt(0),decimals:o.decimals})}}({rpcConfig:M.rpcConfig,appId:M.id,address:ex,tokenInfo:{address:eC||"",decimals:q?.decimals??18},chain:eT}),e$=(0,n.useMemo)(()=>(0,T.g)(Number(O.chainId),S,I,{appId:M.id}),[O.chainId,I]),e_=((e,t,a,i)=>{let[s,r]=(0,n.useState)(null),{walletProxy:o}=(0,y.u)();return(0,n.useEffect)(()=>{s&&r(null),(async()=>{if(!o||!t)return null;let n=[],s=!0,r=await (0,N.d)(e,a,t,i).catch(t=>(t.message&&t.message.includes("Insufficient balance for transaction")||t.message&&t.message.includes("Insufficient funds for gas * price + value")||t.details&&t.details.includes("insufficient funds")||t.details&&t.details.includes("gas required exceeds allowance")?s=!1:n.push(t),e));return{tx:r,totalGasEstimate:r.gas,hasFunds:s,errors:n}})().then(r)},[e]),s})(O,ex,e$,e?.sendTransaction?.prepareTransactionRequest);(0,n.useEffect)(()=>{R(X(e,$))},[$]),(0,n.useEffect)(()=>{e.sendTransaction?.getIsSponsored?e.sendTransaction.getIsSponsored().then(W).catch(console.error):W(!1)},[e.sendTransaction.getIsSponsored]);let eB=()=>{if(!H)return J?e?.sendTransaction?.onSuccess({hash:J}):en||e_?.errors[0]?e?.sendTransaction?.onFailure(en??e_?.errors[0]??K):e?.sendTransaction?.onFailure(new p.P(new p.z("The user rejected the request",d.ProviderErrors.E4001_USER_REJECTED_REQUEST.eipCode))),E({shouldCallAuthOnSuccess:!1})};s.current=eB;let eD=!!(e.funding&&e.funding.supportedOptions.length>0),eL=(0,x.g)(BigInt(e_?.totalGasEstimate??0n),ek),eU=C&&eF?(0,x.a)(BigInt(e_?.totalGasEstimate??0n),eF):void 0,eO=(0,x.g)(eN??0n,ek,void 0,!0),eR=C&&eF?(0,x.a)(eN??0n,eF):void 0,eq=q&&!eA.isLoading&&eS&&"approve"!==eI?`${eA.formattedBalance} ${q.symbol}`:void 0,ez=e.sendTransaction?.uiOptions?.transactionInfo?.title;ez||(ez="approve"===eI?eS?"Confirm address":"Confirm action":`Approve ${eI}`);let eV=(0,n.useMemo)(()=>{if(e.sendTransaction?.uiOptions?.description)return e.sendTransaction?.uiOptions?.description;if("approve"===eI&&"setApprovalForAll"===eE&&ew.approved){let e=(0,t.jsx)(c.A,{address:ew.operator||"",url:eT?.blockExplorers?.default?.url});return(0,t.jsxs)(t.Fragment,{children:[M.name," would like your permission for ",e," to transfer tokens on your behalf."]})}if("approve"===eI&&"setApprovalForAll"===eE&&!ew.approved){let e=(0,t.jsx)(c.A,{address:ew.operator||"",url:eT?.blockExplorers?.default?.url});return(0,t.jsxs)(t.Fragment,{children:[M.name," would like your permission to revoke permissions of ",e," from transferring tokens on your behalf."]})}return eS&&"approve"===eI||eS&&"approve"===eI?`${M.name} would like your permission for ${(0,p.d)(ew.spender)} to spend tokens on your behalf.`:`${M.name} wants your permission to approve the following transaction.`},[M.name,eS,ew,e.sendTransaction?.uiOptions.description,eE]),eW=e.sendTransaction?.uiOptions?.transactionInfo?.contractInfo?.imgUrl?(0,t.jsx)("img",{src:e.sendTransaction.uiOptions.transactionInfo.contractInfo.imgUrl,alt:e.sendTransaction.uiOptions.transactionInfo.contractInfo.imgAltText}):null,eH=!(!e_||e_.errors[0]||e_.hasFunds||!1!==V),eG=eH&&eD,eZ=eG?"Add funds":e.sendTransaction?.uiOptions?.buttonText||($<L?"Continue":"Approve");if((0,n.useEffect)(()=>{e.sendTransaction?.scanTransaction&&M.embeddedWallets.transactionScanning.enabled&&"uninitiated"===eh&&(eg("in progress"),e.sendTransaction.scanTransaction().then(e=>{(e=>{if(!e)throw Error("Transaction scan failed");if("Success"===e.validation.status&&("Benign"===e.validation.result_type?eo("safe"):"Warning"===e.validation.result_type?eo("warn"):"Malicious"===e.validation.result_type&&(eo("error"),eu(!0))),"Success"!==e.simulation.status)throw Error("Simulation failed");{es(e.simulation.params);let{assetsIn:t,assetsOut:n}=function(e,t){let n=[],a=new Map;if(e){for(let t of e)if(t.in[0]){let e;e="ERC721"===t.asset.type||"approve_for_all"===t.in[0].value?{id:`nft:${t.asset.name}`,nftName:t.asset.name,nftCount:t.in.length}:{id:`token:${t.asset.type}:${t.asset.symbol}:${t.asset.name}`,iconUrl:t.asset.logo_url,value:t.in[0].value,symbol:t.asset.symbol,usdValue:t.in[0].usd_price?Y(t.in[0].usd_price):void 0,decimals:t.asset.decimals},n.push(e)}else if(t.out[0]?.value){let e;e="ERC721"===t.asset.type||"approve_for_all"===t.out[0].value?{id:`nft:${t.asset.name}`,nftName:t.asset.name}:{id:`token:${t.asset.type}:${t.asset.symbol}:${t.asset.name}`,iconUrl:t.asset.logo_url,value:t.out[0].value,symbol:t.asset.symbol,usdValue:t.out[0].usd_price?Y(t.out[0].usd_price):void 0,decimals:t.asset.decimals},a.has(e.id)||a.set(e.id,e)}}for(let e of t)for(let t of Object.keys(e.spenders)){let n;n="ERC721"===e.asset.type||"approve_for_all"===e.spenders[t]?.value?{id:`nft:${e.asset.name}`,nftName:e.asset.name}:{id:`token:${e.asset.type}:${e.asset.symbol}:${e.asset.name}`,iconUrl:e.asset.logo_url,value:e.spenders[t]?.value,symbol:e.asset.symbol,usdValue:e.spenders[t]?.usd_price?Y(e.spenders[t]?.usd_price):void 0,decimals:e.asset.decimals},a.has(n.id)||a.set(n.id,n)}return{assetsIn:n,assetsOut:Array.from(a.values())}}(e.simulation.assets_diffs,e.simulation.exposures);if(0===n.length&&0===t.length)throw Error("No tokens found");ey(n),ef(t)}})(e),eg("completed")}).catch(()=>eg("failed")))},[!!e.sendTransaction?.scanTransaction]),(0,n.useEffect)(()=>{e.sendTransaction?.scanTransaction&&"failed"!==eh||((t,n,a)=>{if(U(e?.sendTransaction?"transactionRequest"in e.sendTransaction?0:e.sendTransaction.transactionRequests.length-1:0),n.isErc20Ish&&n.amount&&a){let e=(0,v.f)({amount:n.amount,decimals:a.decimals});ev(e),ey([{value:e,symbol:a?.symbol,decimals:a?.decimals}])}else if(t.value){let e=BigInt(t.value),n=eF?(0,x.a)(e,eF):void 0;ey(C&&n?[{value:n}]:[{value:(0,x.p)(e),symbol:ek,decimals:18,usdValue:n}])}else ey(C?[{value:"$0"}]:[{value:"0",symbol:ek,decimals:18}])})(e_?.tx??O,ew,q)},[O,e_?.tx,ew,q,eh]),ee)return(0,t.jsx)(B,{txn:e_?.tx??O,onClose:eB,receipt:ee,transactionInfo:e.sendTransaction?.uiOptions.transactionInfo,tokenPrice:eF,tokenSymbol:ek,receiptHeader:e.sendTransaction?.uiOptions.successHeader,receiptDescription:e.sendTransaction?.uiOptions.successDescription});if(en)return(0,t.jsx)(j.T,{transactionError:en,transactionHash:J??void 0,chainType:"ethereum",chainId:e_?.tx.chainId??O.chainId,onClose:eB,onRetry:({resetNonce:e})=>{ea(null);let t={...e_?.tx??O};e&&(t.nonce=void 0),R(t)}});let eJ=0!==L&&"number"==typeof $&&0!==$?()=>{D($-1)}:void 0;return el&&ei?(0,t.jsx)(_,{details:ei,onBack:()=>ed(!1)}):(0,t.jsx)(j.S,{transactionIndex:$,onBack:eJ,maxIndex:L,disabled:eH&&!eD||ec,isSubmitting:H,submitError:en,isPreparing:!e_,isTokenPriceLoading:eM,isTokenContractInfoLoading:!ej&&!q,prepareError:e_?.errors[0],symbol:q?.symbol,chain:eT,img:eW,title:ez,subtitle:eV,txValue:O.value,fee:eU??eL,isSponsored:V,from:ex??"",to:eP,tokenAddress:eC??void 0,network:M.chains.find(e=>e.id===O.chainId)?.name??"",transactionDetails:{...ew,formattedAmount:eb},cta:eZ,missingFunds:eH,action:eI,balance:eq??eR??eO,onClose:eB,onClick:eG?async()=>{if(!ex)return;if(!eD)throw Error("Funding wallet is not enabled");let t="FundingMethodSelectionScreen";r({...e,funding:{...e.funding,methodScreen:t,chainType:"ethereum",amount:(0,l.formatEther)(BigInt(e_?.tx.value??0)+BigInt(e_?.totalGasEstimate?.toString()??0)),chain:eT},solanaFundingData:e?.solanaFundingData}),o(t)}:async()=>{if($<L)D($+1);else{G(!0);try{let t=await w.getAccessToken();if(H||!t||!P||!F)return;let n=await e.sendTransaction.onConfirm({transactionRequest:e_?.tx??O});if(Q(n),e.sendTransaction?.signOnly)return await new Promise(e=>setTimeout(e,u.r)),e?.sendTransaction?.onSuccess({hash:n}),E({shouldCallAuthOnSuccess:!1});let a=await e$.waitForTransactionReceipt({hash:n});if("reverted"===a.status)throw Error("Transaction failed");et(a)}catch(e){console.warn({transaction:e_?.tx??O,error:e}),ea(e)}finally{G(!1)}}},validation:er,hasScanDetails:!!ei,setIsScanDetailsOpen:ed,preventMaliciousTransaction:ec,setPreventMaliciousTransaction:eu,tokensSent:ep,tokensReceived:em,isScanning:"in progress"===eh,isCancellable:e.sendTransaction?.uiOptions?.isCancellable??!1,functionName:eE})}};e.s(["SendTransactionScreen",0,ee,"default",0,ee])},458383,e=>{"use strict";var t=e.i(640694);function n(e,t=6,a=!1,i=!1){let s=(parseFloat(e.toString())/1e9).toFixed(t).replace(/0+$/,"").replace(/\.$/,""),r=i?"":" SOL";return a?`${s}${r}`:`${"0"===s?"<0.001":s}${r}`}e.s(["a",0,function({amount:e,fee:a,tokenPrice:i,isUsdc:s}){let r=BigInt(Math.floor(parseFloat(e)*10**(s?6:9))),o=s?r:r+a;return{fundingAmountInBaseUnit:r,fundingAmountInUsd:i?(0,t.g)(r,i):void 0,totalPriceInUsd:i?(0,t.g)(o,i):void 0,totalPriceInNativeCurrency:n(o),feePriceInNativeCurrency:n(a),feePriceInUsd:i?(0,t.g)(a,i):void 0}},"g",0,n])},592552,e=>{"use strict";e.s(["E",0,[{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],payable:!1,stateMutability:"nonpayable",type:"function"}],"a",0,[{constant:!1,inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],name:"transfer",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"}]])},220242,e=>{"use strict";var t=e.i(271645),n=e.i(595693);e.s(["u",0,({enabled:e=!0}={})=>{let{showFiatPrices:a,getUsdPriceForSol:i}=(0,n.u)(),[s,r]=(0,t.useState)(!0),[o,l]=(0,t.useState)(void 0),[d,c]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{(async()=>{if(a&&e)try{r(!0);let e=await i();e?c(e):l(Error("Unable to fetch SOL price"))}catch(e){l(e)}finally{r(!1)}else r(!1)})()},[]),{solPrice:d,isSolPriceLoading:s,solPriceError:o}}])},349893,e=>{"use strict";var t=e.i(271645),n=e.i(604677),a=e.i(118364),i=e.i(595693),s=e.i(220242);e.s(["u",0,function(e){let{tokenPrice:r,isTokenPriceLoading:o,tokenPriceError:l}=(e=>{let{showFiatPrices:s,getUsdTokenPrice:r,chains:o}=(0,i.u)(),[l,d]=(0,t.useState)(!0),[c,u]=(0,t.useState)(void 0),[p,y]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{e||=a.t;let t=(0,n.addToDefaultChains)(o).find(t=>t.id===Number(e));(async()=>{if(s){if(!t)return d(!1),u(Error(`Unable to fetch token price on chain id ${e}`));try{d(!0);let e=await r(t);e?y(e):u(Error(`Unable to fetch token price on chain id ${t.id}`))}catch(e){u(e)}finally{d(!1)}}else d(!1)})()},[e]),{tokenPrice:p,isTokenPriceLoading:l,tokenPriceError:c}})("solana"===e?-1:e),{solPrice:d,isSolPriceLoading:c,solPriceError:u}=(0,s.u)({enabled:"solana"===e});return"solana"===e?{tokenPrice:d,isTokenPriceLoading:c,tokenPriceError:u}:{tokenPrice:r,isTokenPriceLoading:o,tokenPriceError:l}}])},788728,e=>{"use strict";var t=e.i(271645),n=e.i(696942),a=e.i(44979),i=e.i(758356),s=e.i(595693);e.s(["u",0,function({rpcConfig:e,appId:r,address:o,chain:l}){let{chains:d}=(0,s.u)(),[c,u]=(0,t.useState)(0n),[p,y]=(0,t.useState)(!1),m=(0,t.useMemo)(()=>{let t=l||d[0];if(t)return(0,n.createPublicClient)({chain:l,transport:(0,a.http)((0,i.a)(t,e,r))})},[l,e,r]),f=(0,t.useCallback)(async()=>{if(!o||!m)return;y(!0);let e=await m.getBalance({address:o}).catch(console.error);return e?(u(e),y(!1),e):void 0},[m,o,u]);return(0,t.useEffect)(()=>{f().catch(console.error)},[]),{balance:c,isLoading:p,reloadBalance:f}}])}]);