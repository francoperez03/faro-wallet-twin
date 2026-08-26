(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,993556,e=>{"use strict";var r=e.i(271645);let o=r.forwardRef(function({title:e,titleId:o,...t},i){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":o},t),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"}))});e.s(["default",0,o])},974935,e=>{"use strict";var r=e.i(271645);let o=r.forwardRef(function({title:e,titleId:o,...t},i){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:i,"aria-labelledby":o},t),e?r.createElement("title",{id:o},e):null,r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"}))});e.s(["default",0,o])},952573,e=>{"use strict";var r=e.i(843476),o=e.i(823209),t=e.i(355982),i=e.i(271645),n=e.i(997053);let a=n.styled.button`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;

  && {
    color: var(--privy-color-foreground);
    font-weight: 500;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`,s=n.styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--privy-color-foreground-2);
`,l=(0,n.styled)(o.Check)`
  color: var(--privy-color-icon-success);
  flex-shrink: 0;
`,d=(0,n.styled)(t.Copy)`
  color: var(--privy-color-icon-muted);
  flex-shrink: 0;
`;e.s(["C",0,function({children:e,iconOnly:o,value:t,hideCopyIcon:n,onCopy:c,iconSize:u=14,...p}){let[h,v]=(0,i.useState)(!1);return(0,r.jsxs)(a,{...p,onClick:()=>{navigator.clipboard.writeText(t||("string"==typeof e?e:"")).then(()=>c?.()).catch(console.error),v(!0),setTimeout(()=>v(!1),1500)},children:[e," ",h?(0,r.jsxs)(s,{children:[(0,r.jsx)(l,{size:u})," ",!o&&"Copied"]}):!n&&(0,r.jsx)(d,{size:u})]})},"a",0,({value:e,includeChildren:o,children:t,...n})=>{let[c,u]=(0,i.useState)(!1),p=()=>{navigator.clipboard.writeText(e).catch(console.error),u(!0),setTimeout(()=>u(!1),1500)};return(0,r.jsxs)(r.Fragment,{children:[o?(0,r.jsx)(a,{...n,onClick:p,children:t}):(0,r.jsx)(r.Fragment,{children:t}),(0,r.jsx)(a,{...n,onClick:p,children:c?(0,r.jsx)(s,{children:(0,r.jsx)(l,{})}):(0,r.jsx)(d,{})})]})}])},245199,e=>{"use strict";var r=e.i(843476),o=e.i(271645),t=e.i(346146),i=e.i(361150),n=e.i(823209),a=e.i(997787),s=e.i(429136),l=e.i(376879),d=e.i(773524);let c=(0,d.default)("undo-2",[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]]),u=(0,d.default)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);var p=e.i(442633);let h=(0,d.default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);var v=e.i(639038),g=e.i(997053),m=e.i(520183),y=e.i(520159),f=e.i(372299),b=e.i(200441),x=e.i(595693),k=e.i(737577),w=e.i(837008),j=e.i(844332),C=e.i(543489),_=e.i(953760),E=e.i(258950),S=e.i(952573),T=e.i(435232);e.i(123287),e.i(33750),e.i(973134),e.i(437206);class N extends o.Component{static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(e,r){this.props.onError(e)}componentDidUpdate(e){e.resetKey!==this.props.resetKey&&this.state.hasError&&this.setState({hasError:!1})}render(){return this.state.hasError?null:this.props.children}constructor(...e){super(...e),this.state={hasError:!1}}}function A(e){return e>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Math.round(e)):e>=100?new Intl.NumberFormat("en-US",{maximumFractionDigits:1}).format(e):e>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(e):new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(e)}function $(e,r){let o=Number(e);if(!Number.isFinite(o)||0===o)return e;let t=null!=r?o/10**r:o;return t>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(t):t>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(t):t>=1e-4?new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(t):new Intl.NumberFormat("en-US",{maximumSignificantDigits:4}).format(t)}function U({address:e,caip2:r,config:o}){for(let t of o.currencies){let o=t.chains.find(o=>o.caip2===r&&o.address.toLowerCase()===e.toLowerCase());if(o)return{symbol:t.symbol.toUpperCase(),decimals:o.decimals}}return{symbol:e,decimals:void 0}}function D(e,r){return r[e]?.displayName??e}function O(e,r){return e.chains.filter(e=>!0===e.can_be_relay_deposit_source).map(e=>{let o=r.chains[e.caip2];return o?{caip2:e.caip2,displayName:o.displayName,iconUrl:o.iconUrl,vmType:o.vmType,currencyAddress:e.address,currencyDecimals:e.decimals}:null}).filter(e=>null!==e)}function I(e,r){if(!e.chains[r.destinationChain])return`Unsupported destination chain: "${r.destinationChain}". Check that the chain is in CAIP-2 format (e.g. "eip155:8453") and is supported for deposit addresses.`;let o=r.destinationCurrency.toLowerCase();return e.currencies.some(e=>e.chains.some(e=>e.caip2===r.destinationChain&&e.address.toLowerCase()===o))?null:`Unsupported destination currency "${r.destinationCurrency}" on chain "${r.destinationChain}". Check that this token address is supported on the specified chain.`}let R=new Set(["ROUTE_UNAVAILABLE","UNEXPECTED_STATE","TIMEOUT_WAITING_FOR_NEXT_ORDER","TIMEOUT_ORDER_COMPLETION","DEPOSIT_FAILED","DEPOSIT_REFUNDED","USER_EXITED","AMOUNT_TOO_LOW","INSUFFICIENT_LIQUIDITY","UNSUPPORTED_CHAIN","UNSUPPORTED_CURRENCY","UNSUPPORTED_ROUTE","NO_SWAP_ROUTES_FOUND","NO_INTERNAL_SWAP_ROUTES_FOUND","NO_QUOTES","SANCTIONED_WALLET_ADDRESS","REFUND_WALLET_CREATION_FAILED","DEPOSIT_ADDRESSES_NOT_ENABLED","NOT_AUTHENTICATED"]);function F(e){return R.has(e)?e:"UNKNOWN_ERROR"}function z(){let{params:e,setModalState:r}=(0,i.a)(),{privy:t}=(0,x.u)(),n=function(){let{privy:e,refreshSessionAndUser:r}=(0,x.u)();return(0,o.useCallback)((o,t)=>t?Promise.resolve({ok:!0,address:t}):f.depositAddress.resolveRefundAddress({privy:e,caip2:o,onWalletCreated:r}),[e,r])}(),[a,s]=(0,o.useState)(!1);return{fetchQuote:(0,o.useCallback)(async(o,i,a)=>{if(e){s(!0);try{let s=await n(o.caip2,e.refundAddress);if(!s.ok)return void r({step:"error",code:F(s.error)});let l=await t.fetchPrivyRoute(b.CreateDepositAddressQuote,{body:{source_chain:o.caip2,source_currency:o.currencyAddress,destination_chain:e.destinationChain,destination_currency:e.destinationCurrency,destination_address:e.destinationAddress,refund_address:s.address,...null!=e.slippageBps?{slippage_bps:e.slippageBps}:{}}});r({step:"address",selectedCurrency:i,selectedChain:o,availableChains:a,quote:l})}catch(t){let e=t instanceof Error?t:Error(String(t)),o="status"in e&&"number"==typeof e.status?e.status:void 0;r({step:"error",code:e instanceof f.PrivyApiError&&"feature_not_enabled"===e.code?"DEPOSIT_ADDRESSES_NOT_ENABLED":o&&o>=500?"UNKNOWN_ERROR":F(e.message),message:e.message})}finally{s(!1)}}},[e,t,n,r]),isFetching:a}}function M(e,r){switch(e.status){case"completed":return r({step:"complete",order:e});case"refunded":return r({step:"refunded",order:e});case"failed":return r({step:"failed",order:e});case"executing":return r({step:"processing",order:e});default:return}}let L=({sourceAmount:e,sourceSymbol:o,sourceChainName:t,sourceDecimals:i,destinationAmount:a,destSymbol:s,destChainName:l,destDecimals:d,onClose:c})=>(0,r.jsx)(v.C,{icon:n.Check,iconVariant:"success",title:"Transfer complete",subtitle:a?`Received ${$(e,i)} ${o} on ${t} and converted it to ${$(a,d)} ${s} on ${l}. Funds are available to use.`:`Your ${o} has been received and is now available in your wallet.`,showClose:!0,onClose:c,primaryCta:{label:"Done",onClick:c},watermark:!1});function P(){let{state:e,configData:t,close:n}=(0,i.c)("complete"),{order:a}=e,{sourceSymbol:s,sourceChainName:l,sourceDecimals:d,destSymbol:c,destChainName:u,destDecimals:p}=(0,o.useMemo)(()=>{let e=U({address:a.source_currency,caip2:a.source_chain,config:t}),r=U({address:a.destination_currency,caip2:a.destination_chain,config:t});return{sourceSymbol:e.symbol,sourceChainName:D(a.source_chain,t.chains),sourceDecimals:e.decimals,destSymbol:r.symbol,destChainName:D(a.destination_chain,t.chains),destDecimals:r.decimals}},[a,t]);return(0,r.jsx)(L,{sourceAmount:a.source_amount,sourceSymbol:s,sourceChainName:l,sourceDecimals:d,destinationAmount:a.destination_amount,destSymbol:c,destChainName:u,destDecimals:p,onClose:n})}function V(){let{modalState:e,setModalState:t,config:n,retryConfig:s,close:l,createDepositAddressEvent:d}=(0,i.a)();if("error"!==e.step)throw Error("UNEXPECTED_STATE");let{code:c}=e,{title:u,subtitle:p,detail:h,iconVariant:g}=(e=>{switch(e){case"AMOUNT_TOO_LOW":return{title:"Amount too low",subtitle:"The deposit amount is below the minimum for this route.",detail:"Try a larger amount or a different token.",iconVariant:"warning"};case"INSUFFICIENT_LIQUIDITY":return{title:"Insufficient liquidity",subtitle:"There isn't enough liquidity for this route right now.",detail:"Try a smaller amount or a different network.",iconVariant:"warning"};case"UNSUPPORTED_CHAIN":return{title:"Unsupported chain",subtitle:"Deposits from this chain type aren't supported yet. Try a different network.",iconVariant:"warning"};case"UNSUPPORTED_CURRENCY":case"UNSUPPORTED_ROUTE":case"ROUTE_UNAVAILABLE":case"NO_SWAP_ROUTES_FOUND":case"NO_INTERNAL_SWAP_ROUTES_FOUND":case"NO_QUOTES":return{title:"Route not available",subtitle:"This deposit route isn't supported right now. Try a different token or network.",iconVariant:"warning"};case"SANCTIONED_WALLET_ADDRESS":return{title:"Address restricted",subtitle:"This address cannot be used for deposits due to compliance restrictions.",iconVariant:"warning"};case"REFUND_WALLET_CREATION_FAILED":return{title:"Unable to set up refund address",subtitle:"We couldn't create a wallet to receive refunds on this chain. Please try again or select a different network.",iconVariant:"warning"};case"DEPOSIT_ADDRESSES_NOT_ENABLED":return{title:"Not enabled",subtitle:"Deposit addresses are not enabled for this app.",iconVariant:"warning"};case"NOT_AUTHENTICATED":return{title:"Not signed in",subtitle:"Please sign in to continue with your deposit.",iconVariant:"warning"};case"TIMEOUT_WAITING_FOR_NEXT_ORDER":case"TIMEOUT_ORDER_COMPLETION":return{title:"Taking longer than expected",subtitle:"Your funds are safe. The deposit is still being processed — check back later.",iconVariant:"subtle"};default:return{title:"Something went wrong",subtitle:"We couldn't complete your request. Please try again.",iconVariant:"subtle"}}})(c),[m,y]=(0,o.useState)(!1);return(0,r.jsx)(v.C,{icon:a.AlertTriangle,iconVariant:g,title:u,subtitle:h?`${p} ${h}`:p,showClose:!0,onClose:l,primaryCta:{label:"Try again",onClick:async()=>{if(d({eventName:"sdk_deposit_address_action",payload:{action:"retry",step:"error",errorCode:c}}),"ready"!==n.status){y(!0);try{await s(),t({step:"token"})}catch{y(!1)}}else t({step:"token"})},loading:m},watermark:!0})}function B(){let{state:e,close:o,createDepositAddressEvent:t}=(0,i.c)("failed"),{order:n}=e;return(0,r.jsx)(m.S,{icon:a.AlertTriangle,iconVariant:"error",title:"Transfer failed",subtitle:"Something went wrong processing your transfer.",showClose:!0,onClose:o,primaryCta:{label:"Done",onClick:o},secondaryCta:{label:"Learn about manual recovery",onClick:()=>{t({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"failed",target:"recovery_docs"}}),window.open("https://docs.privy.io","_blank","noopener,noreferrer")}},watermark:!0,children:(0,r.jsxs)(W,{href:n.tracking_url,target:"_blank",rel:"noopener noreferrer",onClick:()=>{t({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"failed",target:"relay_reference"}})},children:["Reference: ",n.provider_request_id]})})}let W=g.styled.a`
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.7;
  text-decoration: underline;
  cursor: pointer;
  color: var(--privy-color-foreground-3);
`;function Z(){let{close:e,setModalState:t,config:n,params:a,onBack:l,createDepositAddressEvent:d}=(0,i.a)(),[c,u]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{if(c&&a){if("ready"===n.status){let e=I(n.data,a);t(e?{step:"error",code:"ROUTE_UNAVAILABLE",message:e}:{step:"token"})}"error"===n.status&&t({step:"error",code:"ROUTE_UNAVAILABLE"})}},[c,n,a,t]),(0,r.jsx)(v.C,{icon:s.QrCode,iconVariant:"subtle",title:"Add funds",subtitle:"Top up your account by sending crypto from any wallet. Conversion and routing handled by Relay.",showClose:!0,onClose:e,showBack:!!l,onBack:l?()=>{d({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"intro"}}),l()}:void 0,primaryCta:{label:"Continue",onClick:()=>{if(d({eventName:"sdk_deposit_address_action",payload:{action:"continue",step:"intro"}}),"ready"===n.status&&a){let e=I(n.data,a);t(e?{step:"error",code:"ROUTE_UNAVAILABLE",message:e}:{step:"token"})}else"error"===n.status?t({step:"error",code:"ROUTE_UNAVAILABLE"}):u(!0)},loading:c&&"loading"===n.status,loadingText:null},watermark:!0})}function q(){let{state:e,setModalState:t,close:n,createDepositAddressEvent:a}=(0,i.c)("network"),[s,l]=(0,o.useState)(-1),{availableChains:d}=e,{confirm:c,isFetching:u}=function(){let e=(0,i.b)(),{params:r}=(0,i.a)(),{fetchQuote:t,isFetching:n}=z();return{confirm:(0,o.useCallback)(async o=>{if(!o||!r)return;let i=e?.modalState;i&&"network"===i.step&&await t(o,i.selectedCurrency,i.availableChains)},[r,e,t]),isFetching:n}}();return(0,r.jsx)(m.S,{title:"Select network",eyebrow:(0,r.jsxs)("span",{style:{display:"flex",alignItems:"center",gap:"0.375rem"},children:[(0,r.jsx)("img",{src:e.selectedCurrency.logoURI,alt:"",style:{width:"1rem",height:"1rem",borderRadius:"50%"}}),"Send ",e.selectedCurrency.symbol]}),showBack:!0,onBack:()=>{a({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"network"}}),t({step:"token"})},showClose:!0,onClose:n,watermark:!0,children:(0,r.jsx)(y.S,{style:{marginTop:"1rem",height:"22rem"},$colorScheme:"light",children:d.map((e,o)=>(0,r.jsxs)(v.O,{$selected:s===o,disabled:u,onClick:()=>{a({eventName:"sdk_deposit_address_action",payload:{action:"network_selected",step:"network",network:e.caip2}}),l(o),c(e)},children:[(0,r.jsx)(v.N,{src:e.iconUrl,alt:e.displayName}),(0,r.jsx)(v.a,{children:e.displayName}),u&&o===s&&(0,r.jsx)(v.b,{})]},e.caip2))})})}let H=({trackingUrl:e,onViewBlockExplorer:o,onClose:t})=>(0,r.jsx)(m.S,{icon:l.Hourglass,iconVariant:"subtle",title:"Transfer in progress",subtitle:"Your deposit was received and the transfer is now processing.",showClose:!0,onClose:t,secondaryCta:{label:"View on block explorer ↗",onClick:()=>{o(),window.open(e,"_blank","noopener,noreferrer")}},watermark:!1,children:(0,r.jsxs)(v.T,{children:[(0,r.jsxs)(v.c,{children:[(0,r.jsx)(v.d,{$status:"done",children:(0,r.jsx)(n.Check,{size:14,color:"var(--privy-color-icon-success)",strokeWidth:2})}),(0,r.jsx)(v.e,{children:"Deposit received"})]}),(0,r.jsx)(v.f,{}),(0,r.jsxs)(v.c,{children:[(0,r.jsx)(v.d,{$status:"active",children:(0,r.jsx)(Q,{})}),(0,r.jsx)(v.e,{children:"Bridging"})]}),(0,r.jsx)(v.f,{}),(0,r.jsxs)(v.c,{children:[(0,r.jsx)(v.d,{$status:"pending"}),(0,r.jsx)(v.e,{children:"Funds arrived"})]})]})}),Q=g.styled.span`
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid var(--privy-color-foreground-3);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;function Y(){let{state:e,close:t,createDepositAddressEvent:n}=(0,i.c)("processing");return function({orderId:e,enabled:r}){let{privy:t}=(0,x.u)(),{setModalState:n}=(0,i.a)();(0,o.useEffect)(()=>{let r=new AbortController;return f.depositAddress.waitForCompletion({privy:t,orderId:e,signal:r.signal}).then(e=>{r.signal.aborted||("success"===e.status?M(e.order,n):"timeout"===e.status&&n({step:"error",code:"TIMEOUT_ORDER_COMPLETION"}))}),()=>{r.abort()}},[r,e,t,n])}({orderId:e.order.id,enabled:!0}),(0,r.jsx)(H,{trackingUrl:e.order.tracking_url,onViewBlockExplorer:()=>{n({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"processing",target:"block_explorer"}})},onClose:t})}function K(){let{state:e,close:o,createDepositAddressEvent:t}=(0,i.c)("refunded"),{order:n}=e;return(0,r.jsx)(v.C,{icon:c,iconVariant:"subtle",title:"Transfer refunded",subtitle:"Your transfer was received, but the swap couldn't be completed. A refund has been started automatically.",showClose:!0,onClose:o,primaryCta:{label:"Done",onClick:o},secondaryCta:{label:"View transaction details",onClick:()=>{t({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"refunded",target:"transaction_details"}}),window.open(n.tracking_url,"_blank","noopener,noreferrer")}},watermark:!0})}function X(){let{close:e,setModalState:t,config:n,createDepositAddressEvent:a}=(0,i.a)(),{confirm:s,currencies:l,isFetching:d}=function(){let{config:e,setModalState:r}=(0,i.a)(),{fetchQuote:t,isFetching:n}=z(),a="ready"===e.status?e.data.currencies.filter(r=>O(r,e.data).length>0):[];return{confirm:(0,o.useCallback)(async o=>{if("ready"!==e.status||!o)return;let i=O(o,e.data);if(1!==i.length)r({step:"network",selectedCurrency:o,availableChains:i});else{let e=i[0];await t(e,o,i)}},[e,t,r]),currencies:a,isFetching:n}}(),[c,u]=(0,o.useState)(-1);return(0,r.jsx)(m.S,{title:"Select token",showBack:!0,onBack:()=>{a({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"token"}}),t({step:"intro"})},showClose:!0,onClose:e,watermark:!0,children:"error"===n.status?(0,r.jsx)(v.L,{children:(0,r.jsx)(v.S,{children:"Failed to load tokens"})}):"loading"===n.status?(0,r.jsx)(v.L,{children:(0,r.jsx)(k.L,{})}):(0,r.jsx)(y.S,{style:{marginTop:"1rem",height:"22rem"},$colorScheme:"light",children:l.map((e,o)=>(0,r.jsxs)(v.O,{$selected:c===o,disabled:d,onClick:()=>{a({eventName:"sdk_deposit_address_action",payload:{action:"token_selected",step:"token",token:e.symbol}}),u(o),s(e)},children:[(0,r.jsx)(v.g,{src:e.logoURI,alt:e.symbol}),(0,r.jsx)(v.a,{children:e.name}),d&&o===c?(0,r.jsx)(v.b,{}):(0,r.jsx)(v.h,{children:e.symbol})]},e.symbol))})})}function G({address:e,onClick:t}){let[i,n]=(0,o.useState)(!1);return(0,r.jsx)(r.Fragment,{children:i?(0,r.jsx)(J,{onClick:()=>n(!1),style:{marginTop:"1.5rem"},children:(0,r.jsx)(j.Q,{url:e,size:312,hideLogo:!0})}):(0,r.jsxs)(ee,{title:"Click to copy address",onClick:t,style:{marginTop:"1.5rem"},children:[(0,r.jsxs)(er,{children:[(0,r.jsx)(eo,{children:"Deposit address"}),(0,r.jsx)(et,{children:e})]}),(0,r.jsx)(ei,{children:(0,r.jsx)(en,{type:"button",onClick:e=>{e.stopPropagation(),n(!0)},children:(0,r.jsx)(s.QrCode,{size:16,color:"var(--privy-color-icon-muted)"})})})]})})}let J=g.styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
`,ee=g.styled.div`
  display: flex;
  border-radius: var(--privy-border-radius-md);
  background: var(--privy-color-background-clicked, #f1f2f9);
  padding: 1rem;
  cursor: pointer;
  gap: 0.5rem;
`,er=g.styled.div`
  flex: 1;
  min-width: 0;
  text-align: left;
`,eo=g.styled.div`
  font-size: 0.75rem;
  color: var(--privy-color-icon-muted);
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,et=g.styled.div`
  word-break: break-all;
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  font-weight: 500;
  line-height: 1.375rem;
  color: var(--privy-color-foreground);
`,ei=g.styled.div`
  width: 1.5rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
`,en=g.styled.button`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    border-radius: var(--privy-border-radius-xs);

    &:hover {
      background: var(--privy-color-background);
    }

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: none;
    }
  }
`;function ea({quote:e,selectedCurrency:t,selectedChain:i,destinationSymbol:n}){var s,l;let d,[c,h]=(0,o.useState)(!1),g=t.symbol.toUpperCase(),m=i.displayName,y=(0,o.useRef)(null);return(0,r.jsxs)(es,{children:[(0,r.jsxs)(el,{onClick:(0,o.useCallback)(()=>{let e=document.getElementById("privy-modal-content");e&&(y.current&&clearTimeout(y.current),e.style.transition="none",y.current=setTimeout(()=>{e.style.transition="",y.current=null},160)),h(e=>!e)},[]),children:[(0,r.jsxs)(ed,{children:[t.logoURI&&(0,r.jsx)(v.g,{src:t.logoURI,alt:g,style:{width:"2rem",height:"2rem"}}),i.iconUrl&&(0,r.jsx)(ec,{src:i.iconUrl,alt:m})]}),(0,r.jsxs)(eu,{children:[(0,r.jsx)(ep,{children:"You send"}),(0,r.jsxs)(eh,{children:[g," on ",m]})]}),(0,r.jsx)(ev,{children:(0,r.jsx)(c?u:p.ChevronDown,{size:16})})]}),(0,r.jsx)(ef,{$expanded:c,children:(0,r.jsx)(eb,{children:(0,r.jsxs)(eg,{children:[e.indicative_rate&&(0,r.jsxs)(v.i,{children:[(0,r.jsx)(v.j,{children:"Conversion rate"}),(0,r.jsxs)(v.k,{style:{display:"flex",alignItems:"center",gap:"0.25rem"},children:[(s=e.indicative_rate,l=n.toUpperCase(),Number.isFinite(d=Number(s))&&0!==d?d>=.01?`1 ${g} ≈ ${A(d)} ${l}`:`${A(1/d)} ${g} ≈ 1 ${l}`:`1 ${g} ≈ ${s} ${l}`),(0,r.jsx)(ex,{content:"Estimated rate based on current market conditions. Final execution price may vary depending on transfer size and routing."})]})]}),(0,r.jsxs)(v.i,{children:[(0,r.jsx)(v.j,{children:"Max slippage"}),(0,r.jsxs)(v.k,{children:[(e.slippage_bps/100).toFixed(1),"%"]})]}),(0,r.jsxs)(v.i,{children:[(0,r.jsx)(v.j,{children:"Refund address"}),(0,r.jsx)(v.k,{children:(0,r.jsx)(S.C,{value:e.refund_address,iconOnly:!0,iconSize:11,children:(0,T.d)(e.refund_address,4,4)})})]})]})})}),(0,r.jsxs)(em,{children:[(0,r.jsx)(a.AlertTriangle,{size:16,color:"var(--privy-color-icon-muted)",style:{flexShrink:0}}),(0,r.jsxs)(ey,{children:["Only send ",(0,r.jsx)("strong",{children:g})," on ",(0,r.jsx)("strong",{children:m}),". Other assets may be lost."]})]})]})}let es=g.styled.div`
  border-radius: var(--privy-border-radius-md);
  border: 1px solid var(--privy-color-foreground-4);
  overflow: hidden;
`,el=g.styled.button`
  && {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--privy-color-foreground);
    outline: none;
    box-shadow: none;

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: none;
    }
  }
`,ed=g.styled.span`
  position: relative;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
`,ec=(0,g.styled)(v.N)`
  && {
    position: absolute;
    top: -0.125rem;
    right: -0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    box-sizing: content-box;
    border: 1.5px solid #fff;
    background-color: #fff;
  }
`,eu=g.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`,ep=g.styled.span`
  font-size: 0.75rem;
  color: var(--privy-color-foreground-3);
  line-height: 1rem;
`,eh=g.styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
`,ev=g.styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-clicked, #f1f2f9);
  color: var(--privy-color-foreground-3);
`,eg=g.styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1rem 0.75rem;

  & > * {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--privy-color-foreground-4);
  }

  & > *:last-child {
    border-bottom: none;
  }
`,em=g.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.75rem 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--privy-border-radius-sm);
  background: #f8f9fc;
`,ey=g.styled.span`
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--privy-color-icon-muted);
  text-align: left;
`,ef=g.styled.div`
  display: grid;
  grid-template-rows: ${({$expanded:e})=>e?"1fr":"0fr"};
  transition: grid-template-rows 150ms ease-out;
`,eb=g.styled.div`
  overflow: hidden;
`;function ex({content:e}){let[t,i]=(0,o.useState)(!1),{refs:n,floatingStyles:a,context:s}=(0,C.useFloating)({open:t,onOpenChange:i,placement:"top",whileElementsMounted:_.autoUpdate,middleware:[(0,E.offset)(6),(0,E.flip)(),(0,E.shift)({padding:8})]}),l=(0,C.useHover)(s,{move:!1,handleClose:(0,C.safePolygon)()}),d=(0,C.useFocus)(s),{getReferenceProps:c,getFloatingProps:u}=(0,C.useInteractions)([l,d,(0,C.useClick)(s),(0,C.useDismiss)(s),(0,C.useRole)(s,{role:"tooltip"})]),{isMounted:p,styles:v}=(0,C.useTransitionStyles)(s,{duration:150});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("button",{ref:n.setReference,type:"button","aria-label":"More information about conversion rate",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:"none",background:"none",color:"var(--privy-color-icon-muted)",cursor:"pointer"},...c(),children:(0,r.jsx)(h,{size:14})}),p&&(0,r.jsx)(C.FloatingPortal,{root:document.getElementById("privy-modal-content")??void 0,children:(0,r.jsx)(ek,{ref:n.setFloating,style:{...a,...v},...u(),children:e})})]})}let ek=g.styled.div`
  max-width: 13rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--privy-border-radius-sm, 0.375rem);
  background: var(--privy-color-foreground);
  color: var(--privy-color-background);
  font-size: 0.6875rem;
  line-height: 1rem;
  font-weight: 400;
  text-align: left;
  z-index: 10;
`,ew=({quote:e,selectedCurrency:t,selectedChain:i,destinationSymbol:a,onBack:s,onClose:l})=>{let[d,c]=(0,o.useState)(!1),u=t?.symbol?.toUpperCase()??"funds",p=i?.displayName??"",h=async()=>{d||(await navigator.clipboard.writeText(e.deposit_address),c(!0),setTimeout(()=>c(!1),2e3))};return(0,r.jsxs)(m.S,{title:`Send ${u}${p?` on ${p}`:""}`,subtitle:"Send funds to the address below. Conversion and routing handled by Relay.",showBack:!0,onBack:s,showClose:!0,onClose:l,watermark:!1,children:[(0,r.jsx)(ea,{quote:e,selectedCurrency:t,selectedChain:i,destinationSymbol:a}),(0,r.jsx)(G,{address:e.deposit_address,onClick:h}),(0,r.jsx)(w.P,{style:{marginTop:"1rem",marginBottom:"0.5rem",...d?{backgroundColor:"var(--privy-color-icon-success)",borderColor:"var(--privy-color-icon-success)"}:{}},onClick:h,children:d?(0,r.jsxs)(r.Fragment,{children:["Copied ",(0,r.jsx)(n.Check,{size:16,style:{marginLeft:"0.25rem"}})]}):"Copy address"}),(0,r.jsx)(ej,{children:"Routing and bridging are handled by Relay. Privy does not control execution timing, liquidity, or transaction outcomes."})]})},ej=g.styled.p`
  && {
    margin: 0.5rem 0 0;
    font-size: 0.6875rem;
    line-height: 1.125rem;
    color: var(--privy-color-icon-muted);
    text-align: center;
  }
`;function eC(){let{state:e,configData:t,setModalState:n,close:a,params:s,createDepositAddressEvent:l}=(0,i.c)("address"),{quote:d,selectedCurrency:c,selectedChain:u,availableChains:p}=e;return function({depositAddressId:e,enabled:r,quoteCreatedAt:t}){let{privy:n}=(0,x.u)(),{setModalState:a}=(0,i.a)();(0,o.useEffect)(()=>{if(!e)return;let r=new AbortController;return f.depositAddress.waitForDeposit({privy:n,depositAddressId:e,quoteCreatedAt:t,signal:r.signal}).then(e=>{r.signal.aborted||("success"===e.status?M(e.order,a):"timeout"===e.status&&a({step:"error",code:"TIMEOUT_WAITING_FOR_NEXT_ORDER"}))}),()=>{r.abort()}},[r,e,n,t,a])}({depositAddressId:d.id,enabled:!0,quoteCreatedAt:d.created_at}),(0,r.jsx)(ew,{quote:d,selectedCurrency:c,selectedChain:u,destinationSymbol:(0,o.useMemo)(()=>U({address:s.destinationCurrency,caip2:s.destinationChain,config:t}).symbol,[s,t]),onBack:()=>{l({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"address"}}),n({step:"network",selectedCurrency:c,availableChains:p})},onClose:a})}function e_(){let{modalState:e,setModalState:o}=(0,i.a)();return(0,r.jsx)(N,{onError:e=>o({step:"error",code:"UNEXPECTED_STATE",message:e.message}),resetKey:e.step,children:(0,r.jsx)(eE,{})})}function eE(){let{modalState:e}=(0,i.a)();switch(e.step){case"intro":return(0,r.jsx)(Z,{});case"token":return(0,r.jsx)(X,{});case"network":return(0,r.jsx)(q,{});case"address":return(0,r.jsx)(eC,{});case"processing":return(0,r.jsx)(Y,{});case"complete":return(0,r.jsx)(P,{});case"refunded":return(0,r.jsx)(K,{});case"failed":return(0,r.jsx)(B,{});case"error":return(0,r.jsx)(V,{});default:return null}}e.s(["default",0,{component:()=>{let{onUserCloseViaDialogOrKeybindRef:e}=(0,t.u)(),n=(0,i.b)(),{close:a,config:s}=(0,i.a)();return(0,o.useEffect)(()=>{e.current=a},[e,a]),(0,o.useEffect)(()=>{if("ready"===s.status){for(let e of s.data.currencies)(new Image).src=e.logoURI;for(let e of Object.values(s.data.chains))(new Image).src=e.iconUrl}},[s]),n?(0,r.jsx)(e_,{}):null}}],245199)},837008,e=>{"use strict";var r=e.i(843476),o=e.i(997053),t=e.i(118364),i=e.i(737577),n=e.i(993556),a=e.i(974935),s=e.i(271645);let l=s.forwardRef(function({title:e,titleId:r,...o},t){return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":r},o),e?s.createElement("title",{id:r},e):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18 18 6M6 6l12 12"}))});var d=e.i(595693);function c(e){return(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460 40",...e,children:(0,r.jsx)("g",{fill:e.color||"var(--privy-color-foreground)",children:(0,r.jsx)("path",{d:"M0 15.4v15.38h4.64V19.96h3.58c2.47 0 3.63-.01 3.77-.02 1-.08 1.49-.15 2.18-.3a9.45 9.45 0 0 0 4.6-2.37c1.66-1.57 2.64-3.87 2.81-6.56.02-.3.02-1.19 0-1.49-.1-1.77-.56-3.35-1.36-4.72A8.84 8.84 0 0 0 15.14.57c-.93-.3-1.75-.43-3.09-.54C11.9.02 10.2 0 5.93 0H0ZM10.85 4c1.85.05 3.1.45 4.16 1.3.22.17.54.49.69.68a5.97 5.97 0 0 1 1.19 3.13c.04.35.04 1.36 0 1.71-.08.68-.23 1.3-.44 1.85a4.8 4.8 0 0 1-1.09 1.68A5.63 5.63 0 0 1 12 15.92c-.6.08-.4.08-4.01.09H4.64V3.98h2.9c1.6 0 3.08 0 3.31.02ZM187.65 5.71v5.72h-.27l-.09-.14a15.9 15.9 0 0 0-1.21-1.73c-.43-.5-1-.95-1.7-1.36-.54-.3-1.05-.5-1.73-.63a8.98 8.98 0 0 0-1.7-.17 8.84 8.84 0 0 0-7.8 4.03 12.95 12.95 0 0 0-2.03 6.39c-.07.98-.06 2.15.02 3.13.2 2.47.87 4.53 2.02 6.25a8.98 8.98 0 0 0 10.22 3.65 6.5 6.5 0 0 0 2.8-1.93c.41-.51.84-1.1 1.1-1.55l.1-.17h.37v3.58h4.38V0h-4.48Zm-5.24 5.54c1.3.14 2.3.6 3.17 1.48.9.9 1.5 2.09 1.85 3.64.36 1.6.39 3.72.06 5.43a8.13 8.13 0 0 1-1.54 3.62 5.1 5.1 0 0 1-3.93 1.96 6.13 6.13 0 0 1-2.32-.31 5.87 5.87 0 0 1-3.33-3.5c-.39-1-.62-2.05-.72-3.32-.03-.32-.04-1.35-.02-1.73.08-1.56.4-2.91.96-4.05a6.2 6.2 0 0 1 1.06-1.58 5.08 5.08 0 0 1 3.6-1.66c.25-.02.9 0 1.16.02ZM210.07 15.39l.01 15.38h4.38l.01-3.57h.37l.09.15c.24.44.84 1.26 1.21 1.7a6.79 6.79 0 0 0 2.57 1.75 9.3 9.3 0 0 0 6.86-.49 9.28 9.28 0 0 0 4.05-4.07A13.05 13.05 0 0 0 231 21.6c.21-1.73.18-3.7-.09-5.32a13.03 13.03 0 0 0-1.5-4.3 9.1 9.1 0 0 0-3.75-3.63 9.15 9.15 0 0 0-4.43-.96 7.46 7.46 0 0 0-2.8.5A7.07 7.07 0 0 0 216 9.7c-.4.52-.82 1.12-1.1 1.59l-.07.14h-.27V0h-4.5Zm11.13-4.14c1.07.1 1.94.44 2.7 1.04a6.1 6.1 0 0 1 1.64 1.98c.43.84.78 2 .94 3.11.15 1.16.16 2.4.02 3.54a9.34 9.34 0 0 1-1.39 4.03 5.33 5.33 0 0 1-2.69 2.15c-.9.3-2.04.38-3.06.2a5.14 5.14 0 0 1-3.45-2.37 6.03 6.03 0 0 1-.45-.8c-.5-1.03-.8-2.2-.92-3.58-.04-.49-.06-.89-.05-1.53.01-.76.05-1.23.13-1.85.38-2.53 1.47-4.38 3.15-5.31a5.46 5.46 0 0 1 2.3-.63 10 10 0 0 1 1.13.02ZM69.05 2.17l-.01 2.77V7.7h-3.36v3.6h3.36v6.8l.01 7.15c.06 1.4.4 2.44 1.1 3.37a5.8 5.8 0 0 0 2.97 2.07c.91.3 1.83.42 2.9.38a8.71 8.71 0 0 0 2.66-.48l-.8-3.7-.38.06a4.96 4.96 0 0 1-2.43-.06c-.33-.1-.56-.25-.8-.49-.4-.41-.6-.88-.7-1.67-.02-.2-.02-.62-.03-6.82v-6.6h4.73V7.7h-4.73V2.16h-4.49ZM133.34 2.17V7.7h-3.39v3.6h3.38v6.9l.01 7.17a5.66 5.66 0 0 0 2.36 4.49c.85.6 2.03 1.03 3.26 1.17.85.1 2.03.05 2.81-.1.3-.06.75-.18 1-.26l.2-.06v-.05l-.81-3.67-.37.06a4.99 4.99 0 0 1-1.8.09c-.85-.13-1.32-.4-1.7-.97a2.63 2.63 0 0 1-.39-1.04c-.06-.4-.06 0-.06-7.1V11.3h4.7V7.7h-4.7l-.01-2.77V2.16h-4.49ZM293.41 2.36a14.56 14.56 0 0 0-13.7 16.07 14.59 14.59 0 0 0 21.86 11.08 14.5 14.5 0 0 0 7.11-14.07 14.61 14.61 0 0 0-6.53-10.73 14.49 14.49 0 0 0-8.74-2.35ZM350.8 2.36a10.17 10.17 0 0 0-7.56 4.2c-.16.2-.45.63-.58.83l-.05.1h-.47l-.01-4.36h-7.36v36.4h7.82V27.27h.49l.05.07a11.3 11.3 0 0 0 7.49 4.15 10.52 10.52 0 0 0 9.38-4.1c1.66-2.1 2.73-4.9 3.07-8.06.1-.87.13-1.4.13-2.37 0-.8 0-1.1-.07-1.76a15.95 15.95 0 0 0-3.23-8.72 12.8 12.8 0 0 0-1.85-1.84 10.49 10.49 0 0 0-7.26-2.28Zm-.94 6.05c1.27.15 2.33.65 3.2 1.5.98.96 1.67 2.31 2.03 4 .34 1.57.38 3.68.12 5.39a9.78 9.78 0 0 1-1.04 3.25c-.14.25-.44.69-.6.89a5.35 5.35 0 0 1-4.31 2.07 5.25 5.25 0 0 1-4.41-1.9 7.35 7.35 0 0 1-1.26-2.32 14.09 14.09 0 0 1-.62-4.83c.05-1.98.38-3.53 1.02-4.85a5.63 5.63 0 0 1 2.5-2.65c.66-.34 1.3-.5 2.14-.58.18-.02 1.04 0 1.23.03ZM363.63 3.1l-.01 3.2v3.16h1.43c1.26.01 1.44.02 1.54.04.42.09.66.28.79.62.08.23.08.08.08 2.96a911.57 911.57 0 0 1 .03 10.18v7.54h7.82v-7.4l.01-7.83c.03-.94.11-1.63.27-2.28.46-1.9 1.54-2.93 3.35-3.23.52-.08.2-.08 5-.08h4.4V3.08h-3.1c-3.48 0-3.91.01-4.67.1-1.83.2-3.04.79-3.96 1.88-.5.6-.9 1.32-1.26 2.26l-.06.17h-.46V3.09h-5.6c-4.46 0-5.6 0-5.6.02ZM390.8 16.95V30.8h3.87l3.86-.01V3.09h-7.73ZM400.6 3.1l-.01.4v.38l4.66 13.4 4.69 13.47.02.05h10.3l.03-.05 4.67-13.45 4.67-13.4V3.1h-7.43l-6.7 19.26h-.5l-3.28-9.5-3.31-9.64-.05-.12h-3.88l-3.88.01ZM430.98 3.1c-.01 0-.02.19-.02.4v.39l5.08 14.59c2.8 8.02 5.08 14.6 5.08 14.61.01.02-.22.02-4.8.02h-4.82v6.42h4.95c5.09 0 5.23 0 5.87-.06 3.15-.28 5.29-1.63 6.63-4.15.28-.55.44-.95.87-2.16L459 6.78l1-2.89v-.8h-7.43l-6.69 19.26h-.5l-3.27-9.46-3.31-9.64-.06-.16h-3.88l-3.88.01ZM36.57 7.36c-1.36.1-2.6.6-3.62 1.45a5.65 5.65 0 0 0-1.67 2.42l-.05.13H31V7.7h-4.35v23.08h4.5v-7.3c0-8 0-7.34.08-7.82a4.89 4.89 0 0 1 2.06-3.18c.83-.58 1.74-.89 2.87-.98a11.87 11.87 0 0 1 2.8.25H39v-4.3l-.21-.02c-.61-.07-1.74-.1-2.22-.07ZM51.08 7.41c-2.33.12-4.3.84-5.95 2.16a9.89 9.89 0 0 0-2.03 2.2 12.5 12.5 0 0 0-2 5.78 18.04 18.04 0 0 0 0 3.65 12.13 12.13 0 0 0 2.26 6.05 9.74 9.74 0 0 0 5 3.52c2.11.64 4.7.64 6.8 0a9.78 9.78 0 0 0 4.88-3.37c1.38-1.78 2.19-4 2.4-6.58.13-1.46.06-3.06-.18-4.42a11.24 11.24 0 0 0-3.58-6.6 10 10 0 0 0-5.75-2.35c-.56-.06-1.31-.07-1.85-.04Zm1.42 3.78c.88.1 1.62.34 2.28.75a6.13 6.13 0 0 1 1.99 2.15 10.31 10.31 0 0 1 1.2 5c.02 1.23-.12 2.44-.42 3.51a7.14 7.14 0 0 1-1.81 3.32c-.61.6-1.2.98-1.95 1.24a6 6 0 0 1-2 .3 5.7 5.7 0 0 1-2.72-.6 5 5 0 0 1-1.28-.94A7.1 7.1 0 0 1 46 22.73c-.57-1.99-.6-4.46-.08-6.5a7.24 7.24 0 0 1 2.03-3.67 5.13 5.13 0 0 1 3.35-1.4 11 11 0 0 1 1.2.03ZM92.05 7.4c-.96.06-1.56.15-2.3.33a9.62 9.62 0 0 0-6.09 4.66 13.5 13.5 0 0 0-1.71 7c0 .83 0 1.04.06 1.6.16 1.77.58 3.32 1.29 4.7A9.72 9.72 0 0 0 90.28 31c1.84.37 4.08.32 5.85-.13a9.07 9.07 0 0 0 5.02-3.1A7.64 7.64 0 0 0 102.5 25l-2.11-.39-2.11-.38-.08.13a4.72 4.72 0 0 1-2.35 2.55 6.3 6.3 0 0 1-2.23.58c-.29.03-1.13.03-1.44 0a6.35 6.35 0 0 1-3.02-1.04 5.93 5.93 0 0 1-2.02-2.43 8.44 8.44 0 0 1-.72-3.18v-.26h16.38v-.81c0-1.83-.06-2.76-.25-3.87-.2-1.22-.53-2.24-1.05-3.28a8.9 8.9 0 0 0-2.66-3.26 10.1 10.1 0 0 0-5.34-1.94 18.3 18.3 0 0 0-1.46-.03Zm1.3 3.75c1.2.13 2.19.55 3.05 1.3a5.8 5.8 0 0 1 1.78 2.96c.13.51.21 1.17.21 1.66v.15H86.43v-.12c.08-.97.3-1.78.72-2.61.5-1 1.2-1.8 2.14-2.42a5.32 5.32 0 0 1 2.9-.95c.2-.01.97 0 1.17.03ZM116.79 7.41c-2 .1-3.73.65-5.22 1.65a10.7 10.7 0 0 0-4.25 6.06 16.1 16.1 0 0 0-.5 5.8c.2 2.17.84 4.13 1.88 5.76.58.9 1.32 1.73 2.15 2.4a9.37 9.37 0 0 0 3.6 1.8 12.06 12.06 0 0 0 3.92.34 10.2 10.2 0 0 0 3.84-.95 8.31 8.31 0 0 0 4.76-6.75l.01-.04h-4.37l-.05.16a4.87 4.87 0 0 1-4.24 3.75c-.59.07-1.32.06-1.93-.05a5.47 5.47 0 0 1-3.5-2.27c-.56-.75-1-1.73-1.26-2.79a13.8 13.8 0 0 1-.16-5.24 7.77 7.77 0 0 1 2.1-4.3 5.48 5.48 0 0 1 2.15-1.3 6.4 6.4 0 0 1 3.89.1c.59.21 1.03.5 1.5.96a5.32 5.32 0 0 1 1.46 2.5l.04.15h4.37v-.06a8.22 8.22 0 0 0-5.31-6.94 10.98 10.98 0 0 0-4.88-.74ZM156.2 7.41a9.87 9.87 0 0 0-6 2.29 11.02 11.02 0 0 0-3.41 5.43c-.52 1.78-.68 3.9-.48 5.97.17 1.8.63 3.38 1.37 4.8a9.68 9.68 0 0 0 5.91 4.86c1.65.48 3.63.61 5.53.36 3.72-.49 6.55-2.62 7.56-5.69.12-.39.13-.42.1-.43-.02 0-4.13-.75-4.19-.75-.03 0-.04 0-.1.16-.18.42-.45.9-.72 1.22-.16.2-.49.53-.7.7-.67.54-1.5.9-2.43 1.08-.48.08-.83.11-1.41.11-.64 0-1.07-.04-1.6-.15a5.76 5.76 0 0 1-3.93-2.83 8 8 0 0 1-.99-3.79v-.16h16.38v-1.11l-.02-1.43c-.1-2.25-.53-4-1.35-5.59a9.24 9.24 0 0 0-6.18-4.75c-1.04-.26-2.2-.36-3.33-.3Zm1.45 3.74a5.35 5.35 0 0 1 3.66 1.94 6.1 6.1 0 0 1 1.38 4.01v.12h-11.97v-.06c0-.02 0-.14.02-.25a6.6 6.6 0 0 1 2.15-4.32 5.73 5.73 0 0 1 3.5-1.46c.25-.02 1 0 1.26.02ZM233.58 7.82l8.37 23.22a49.22 49.22 0 0 1-.67 1.9 5.36 5.36 0 0 1-1.14 1.8c-.41.4-.82.58-1.48.69-.27.04-1.03.03-1.35 0a8.05 8.05 0 0 1-1.1-.23l-1.08 3.67c0 .02.32.14.66.22.83.21 1.57.29 2.56.28.56-.01.8-.03 1.24-.1 2.71-.4 4.66-2.09 5.86-5.08l9.64-26.44c0-.02-4.82-.06-4.83-.05l-2.93 8.96-2.91 8.94h-.24l-.22-.65-2.91-8.95-2.7-8.3H233.53ZM293.05 35.8c-1.18.04-1.93.09-2.8.16-2.52.24-4.53.69-5.43 1.23-.7.41-.76.86-.2 1.28.88.66 3.29 1.19 6.36 1.4a48.55 48.55 0 0 0 5.75.05c3.47-.19 6.24-.78 7.11-1.5.22-.19.3-.34.3-.53 0-.1 0-.12-.04-.22-.35-.69-2.32-1.3-5.25-1.63a41.09 41.09 0 0 0-5.8-.24Zm0 0"})})})}let u=o.styled.span`
  margin-top: 16px;
  font-size: 13px;
  text-align: center;
  color: var(--privy-color-foreground-3);
  display: block;

  && > a {
    color: var(--privy-color-accent);
  }
`,p=o.styled.a`
  && {
    padding: 0;
    color: var(--privy-color-foreground-3);
  }
`,h=o.styled.div`
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
`,v=o.styled.button`
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
`,g=({children:e,loading:o,disabled:t,success:n,size:a="lg",loadingText:s="Loading...",as:l,onClick:d,...c})=>{let u="a"===l,p=!(!o&&!t);return(0,r.jsx)(y,{as:l,disabled:u?void 0:p,"aria-disabled":u?p:void 0,$success:n,$size:a,onClick:e=>{u&&p?e.preventDefault():d?.(e)},...c,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.B,{}),s?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:s}):null]}):e})},m=(0,o.styled)(v)`
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
`,y=(0,o.styled)(v)`
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
  ${e=>e.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        background-color: var(--privy-color-background-2);
        border: 1px solid var(--privy-color-border-default);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,f=({children:e,loading:o,disabled:t,size:n="lg",loadingText:a="Loading...",as:s,onClick:l,...d})=>{let c="a"===s,u=!(!o&&!t);return(0,r.jsx)(x,{as:s,disabled:c?void 0:u,"aria-disabled":c?u:void 0,$size:n,onClick:e=>{c&&u?e.preventDefault():l?.(e)},...d,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.B,{}),a?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):e})},b=({children:e,loading:o,disabled:t,size:n="lg",loadingText:a="Loading...",as:s,onClick:l,...d})=>{let c="a"===s,u=!(!o&&!t);return(0,r.jsx)(k,{as:s,disabled:c?void 0:u,"aria-disabled":c?u:void 0,$size:n,onClick:e=>{c&&u?e.preventDefault():l?.(e)},...d,children:o?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(i.B,{}),a?(0,r.jsx)("span",{style:{marginLeft:"8px"},children:a}):null]}):e})},x=(0,o.styled)(v)`
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
  ${e=>e.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,k=(0,o.styled)(v)`
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
  ${e=>e.disabled&&o.css`
      &&&,
      &&&:hover,
      &&&:active {
        border-color: var(--privy-color-border-default);
        background-color: var(--privy-color-background-2);
        color: var(--privy-color-foreground-disabled);
        cursor: not-allowed;
      }
    `}
`,w=o.styled.button`
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

    ${e=>e.invisible&&o.css`
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
`;o.styled.div`
  /* Set to match height of SoftCtaButton to avoid reflow if conditionally rendered */
  height: 44px;
`;let j=o.styled.button`
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
`,C=({backFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)(S,{onClick:e,children:(0,r.jsx)(n.default,{height:"16px",width:"16px",strokeWidth:2})})}),_=({infoFn:e})=>(0,r.jsx)("div",{children:(0,r.jsx)(T,{"aria-label":"info",onClick:e,children:(0,r.jsx)(a.default,{height:"22px",width:"22px",strokeWidth:2})})}),E=e=>(0,r.jsx)("div",{children:(0,r.jsx)(S,{"aria-label":"close modal",onClick:e.onClose,children:(0,r.jsx)(l,{height:"16px",width:"16px",strokeWidth:2})})}),S=o.styled.button`
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
`,T=(0,o.styled)(S)`
  && {
    background-color: transparent;
  }
`,N=o.styled.div`
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
`,A=o.styled.div`
  flex: 1;
  align-items: center;
  display: flex;
  gap: 8px;
`,$=o.styled.div`
  display: flex;
  justify-content: flex-end;
`,U=o.styled.div`
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
`,D=o.styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
`;e.s(["B",0,({className:e})=>{let{appearance:o}=(0,t.u)();return(0,r.jsx)(h,{className:e,children:o.footerLogo??(0,r.jsx)(p,{href:"https://privy.io/?utm_source=module&utm_medium=module&utm_campaign=registration_module",target:"_blank",rel:"noopener noreferrer",id:"protected-by-privy",children:(0,r.jsx)(c,{color:"currentColor",height:13,width:150})})})},"E",0,({children:e,onClick:o,disabled:t,isSubmitting:n,...a})=>(0,r.jsxs)(j,{$isSubmitting:n,onClick:o,disabled:t,...a,children:[(0,r.jsx)("span",{children:e}),(0,r.jsx)("span",{children:(0,r.jsx)(i.B,{})})]}),"M",0,({backFn:e,infoFn:o,onClose:i,title:n,eyebrow:a,closeable:s=!0,className:l})=>{let{closePrivyModal:c}=(0,d.u)(),u=(0,t.u)();return(0,r.jsxs)(N,{className:l,children:[(0,r.jsxs)(A,{children:[e&&(0,r.jsx)(C,{backFn:e}),a&&(0,r.jsx)(D,{children:a}),!a&&n&&(0,r.jsx)(U,{id:"privy-dialog-title",children:n}),(0,r.jsx)("div",{style:{height:24}}),o&&(0,r.jsx)(_,{infoFn:o})]}),(0,r.jsx)($,{children:!u.render.standalone&&s&&(0,r.jsx)(E,{onClose:i||(()=>c())})})]})},"P",0,g,"S",0,f,"T",0,function({app:{legal:{privacyPolicyUrl:e,termsAndConditionsUrl:o,requireUsersAcceptTerms:t}},alwaysShowImplicitConsent:i}){let n=!(!e||!o);return(!t||i)&&(o||e)?(0,r.jsxs)(u,{children:["By logging in I agree to the"," ",o&&(0,r.jsx)("a",{href:o,target:"_blank",children:n?"Terms":"Terms of Service"}),n&&" & ",e&&(0,r.jsx)("a",{href:e,target:"_blank",children:"Privacy Policy"})]}):(0,r.jsx)(u,{})},"a",0,({variant:e="primary",size:o="lg",children:t,success:i,...n})=>{switch(e){case"secondary":return(0,r.jsx)(f,{size:o,...n,children:t});case"error":return(0,r.jsx)(f,{$warn:!0,size:o,...n,children:t});case"muted":return(0,r.jsx)(b,{size:o,...n,children:t});default:return(0,r.jsx)(g,{size:o,success:i,...n,children:t})}},"b",0,h,"c",0,({children:e,loading:o,disabled:t,...n})=>(0,r.jsx)(m,{disabled:t,...n,children:o?(0,r.jsx)(i.B,{color:"var(--privy-color-foreground-accent)"}):e}),"d",0,w,"e",0,b],837008)},241342,e=>{"use strict";var r=e.i(843476),o=e.i(271645),t=e.i(997053),i=e.i(737577),n=e.i(837008),a=e.i(632964);let s=t.styled.div`
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
`,d=t.styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`,c=(0,t.styled)(n.M)`
  margin: 0 -8px;
`,u=t.styled.div`
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
`,h=t.styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--screen-space);
`,v=t.styled.div`
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
`,m=t.styled.p`
  && {
    margin: 0;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: var(--privy-color-foreground);
  }
`,y=t.styled.div`
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
`,b=t.styled.div`
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
`,x=({children:e,...o})=>(0,r.jsx)(s,{children:(0,r.jsx)(l,{...o,children:e})}),k=t.styled.div`
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
`,j=t.styled.div`
  height: 100%;
  width: ${({pct:e})=>e}%;
  background: var(--privy-color-foreground-3);
  border-radius: 2px;
  transition: width 300ms ease-in-out;
`,C=({step:e})=>e?(0,r.jsx)(k,{children:(0,r.jsx)(j,{pct:Math.min(100,e.current/e.total*100)})}):null;x.Header=({title:e,subtitle:o,icon:t,iconVariant:i,iconLoadingStatus:n,showBack:a,onBack:s,showInfo:l,onInfo:u,showClose:p,onClose:y,step:f,headerTitle:b,eyebrow:k,...w})=>(0,r.jsxs)(d,{...w,children:[(0,r.jsx)(c,{backFn:a?s:void 0,infoFn:l?u:void 0,onClose:p?y:void 0,title:b,eyebrow:k,closeable:p}),(t||i||e||o)&&(0,r.jsxs)(h,{children:[t||i?(0,r.jsx)(x.Icon,{icon:t,variant:i,loadingStatus:n}):null,!(!e&&!o)&&(0,r.jsxs)(v,{children:[e&&(0,r.jsx)(g,{children:e}),o&&(0,r.jsx)(m,{children:o})]})]}),f&&(0,r.jsx)(C,{step:f})]}),(x.Body=o.default.forwardRef(({children:e,...o},t)=>(0,r.jsx)(u,{ref:t,...o,children:e}))).displayName="Screen.Body",x.Footer=({children:e,...o})=>(0,r.jsx)(p,{id:"privy-content-footer-container",...o,children:e}),x.Actions=({children:e,...o})=>(0,r.jsx)(_,{...o,children:e}),x.HelpText=({children:e,...o})=>(0,r.jsx)(E,{...o,children:e}),x.FooterText=({children:e,...o})=>(0,r.jsx)(S,{...o,children:e}),x.Watermark=()=>(0,r.jsx)(w,{}),x.Icon=({icon:e,variant:t="subtle",loadingStatus:n})=>"logo"===t&&e?(0,r.jsx)(f,"string"==typeof e?{children:(0,r.jsx)("img",{src:e,alt:""})}:o.default.isValidElement(e)?{children:e}:{children:o.default.createElement(e)}):"loading"===t?e?(0,r.jsx)(b,{children:(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,r.jsx)(i.C,{success:n?.success,fail:n?.fail}),"string"==typeof e?(0,r.jsx)("span",{style:{background:`url('${e}') 0 0 / contain`,height:"38px",width:"38px",borderRadius:"6px",margin:"auto",backgroundSize:"contain"}}):o.default.isValidElement(e)?o.default.cloneElement(e,{style:{width:"38px",height:"38px"}}):o.default.createElement(e,{style:{width:"38px",height:"38px"}})]})}):(0,r.jsx)(y,{$variant:t,children:(0,r.jsx)(a.N,{size:"64px"})}):(0,r.jsx)(y,{$variant:t,children:e&&("string"==typeof e?(0,r.jsx)("img",{src:e,alt:"",style:{width:"32px",height:"32px",borderRadius:"6px"}}):o.default.isValidElement(e)?e:o.default.createElement(e,{width:32,height:32,stroke:(()=>{switch(t){case"success":return"var(--privy-color-icon-success)";case"warning":return"var(--privy-color-icon-warning)";case"error":return"var(--privy-color-icon-error)";default:return"var(--privy-color-icon-muted)"}})(),strokeWidth:2}))});let _=t.styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: calc(var(--screen-space) / 2);
`,E=t.styled.div`
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
`,S=t.styled.div`
  && {
    margin-top: -1rem;
    width: 100%;
    text-align: center;
    color: var(--privy-color-foreground-2);
    font-size: 0.6875rem; // 11px
    line-height: 1rem; // 16px
  }
`;e.s(["S",0,x])},520183,e=>{"use strict";var r=e.i(843476),o=e.i(837008),t=e.i(241342);e.s(["S",0,({primaryCta:e,secondaryCta:i,helpText:n,footerText:a,watermark:s=!0,children:l,...d})=>{let c=e||i?(0,r.jsxs)(r.Fragment,{children:[e&&(()=>{let{label:t,...i}=e,n=i.variant||"primary";return(0,r.jsx)(o.a,{...i,variant:n,style:{width:"100%",...i.style},children:t})})(),i&&(()=>{let{label:e,...t}=i,n=t.variant||"secondary";return(0,r.jsx)(o.a,{...t,variant:n,style:{width:"100%",...t.style},children:e})})()]}):null;return(0,r.jsxs)(t.S,{id:d.id,className:d.className,children:[(0,r.jsx)(t.S.Header,{...d}),l?(0,r.jsx)(t.S.Body,{children:l}):null,n||c||s?(0,r.jsxs)(t.S.Footer,{children:[n?(0,r.jsx)(t.S.HelpText,{children:n}):null,c?(0,r.jsx)(t.S.Actions,{children:c}):null,s?(0,r.jsx)(t.S.Watermark,{}):null]}):null,a?(0,r.jsx)(t.S.FooterText,{children:a}):null]})}])},632964,e=>{"use strict";var r=e.i(843476),o=e.i(997053);let t=o.styled.div`
  --spinner-size: ${e=>e.$size?e.$size:"96px"};

  display: inline-flex;
  justify-content: center;
  align-items: center;

  @media all and (display-mode: standalone) {
    margin-bottom: 30px;
  }
`,i=o.styled.div`
  position: relative;
  height: var(--spinner-size);
  width: var(--spinner-size);

  opacity: 1;
  animation: fadein 200ms ease;
`,n=o.styled.div`
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
`,a=o.styled.div`
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
`,s=o.styled.div`
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
`;e.s(["N",0,({size:e,centerIcon:o})=>(0,r.jsx)(t,{$size:e,children:(0,r.jsxs)(i,{children:[(0,r.jsx)(a,{}),(0,r.jsx)(s,{}),o?(0,r.jsx)(n,{children:o}):null]})})])},520159,e=>{"use strict";var r=e.i(997053);r.styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`,r.styled.button`
  padding: 0.25rem;
  height: 30px;
  width: 30px;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--privy-border-radius-full);
  background: var(--privy-color-background-2);
`;let o=r.styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: ' ';
    border-radius: var(--privy-border-radius-full);
    height: 6px;
    width: 6px;
    background-color: var(--privy-color-icon-success);
    position: absolute;
    right: -3px;
    top: -3px;
  }
`,t=r.styled.img`
  width: 32px;
  height: 32px;
  border-radius: 0.25rem;
  object-fit: contain;
`,i=r.styled.span`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem; /* 150% */
  border-radius: var(--privy-border-radius-sm);
  background-color: var(--privy-color-background-2);

  svg {
    width: 100%;
    max-width: 1rem;
    max-height: 1rem;
    stroke-width: 2;
  }
`,n=r.styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 24rem;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-gutter: stable both-edges;
  scrollbar-width: none;
  -ms-overflow-style: none;

  ${e=>"light"===e.$colorScheme?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.06)) bottom;":"dark"===e.$colorScheme?"background: linear-gradient(var(--privy-color-background), var(--privy-color-background) 70%) bottom, linear-gradient(rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.06)) bottom;":void 0}

  background-repeat: no-repeat;
  background-size:
    100% 32px,
    100% 16px;
  background-attachment: local, scroll;
`;e.s(["C",0,i,"S",0,n,"W",0,t,"b",0,o])},773524,e=>{"use strict";var r=e.i(271645);let o=e=>{let r=e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,o)=>o?o.toUpperCase():r.toLowerCase());return r.charAt(0).toUpperCase()+r.slice(1)},t=(...e)=>e.filter((e,r,o)=>!!e&&""!==e.trim()&&o.indexOf(e)===r).join(" ").trim();var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let n=(0,r.forwardRef)(({color:e="currentColor",size:o=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:s="",children:l,iconNode:d,...c},u)=>(0,r.createElement)("svg",{ref:u,...i,width:o,height:o,stroke:e,strokeWidth:a?24*Number(n)/Number(o):n,className:t("lucide",s),...!l&&!(e=>{for(let r in e)if(r.startsWith("aria-")||"role"===r||"title"===r)return!0})(c)&&{"aria-hidden":"true"},...c},[...d.map(([e,o])=>(0,r.createElement)(e,o)),...Array.isArray(l)?l:[l]]));e.s(["default",0,(e,i)=>{let a=(0,r.forwardRef)(({className:a,...s},l)=>(0,r.createElement)(n,{ref:l,iconNode:i,className:t(`lucide-${o(e).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${e}`,a),...s}));return a.displayName=o(e),a}],773524)},823209,e=>{"use strict";let r=(0,e.i(773524).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",0,r],823209)},442633,e=>{"use strict";let r=(0,e.i(773524).default)("chevron-down",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);e.s(["ChevronDown",0,r],442633)},355982,e=>{"use strict";let r=(0,e.i(773524).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["Copy",0,r],355982)},376879,e=>{"use strict";let r=(0,e.i(773524).default)("hourglass",[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]]);e.s(["Hourglass",0,r],376879)},429136,639038,e=>{"use strict";let r=(0,e.i(773524).default)("qr-code",[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]]);e.s(["QrCode",0,r],429136);var o=e.i(997053),t=e.i(737577),i=e.i(520183);let n=(0,o.styled)(i.S)`
  #privy-content-footer-container {
    margin-top: 0;
  }
`,a=o.styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: var(--privy-color-foreground-3);
  margin: 0.25rem 0 0;
`,s=o.styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: var(--privy-border-radius-full);
  object-fit: cover;
  flex-shrink: 0;
`,l=o.styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
`,d=o.styled.span`
  font-weight: 500;
`,c=o.styled.span`
  font-size: 0.875rem;
  color: var(--privy-color-foreground-3);
  margin-left: auto;
`;o.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  min-height: 2.25rem;
  border-radius: 6.25rem;
  border: none;
  background-color: var(--privy-color-background-2);

  input {
    flex: 1;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background: transparent;
    color: var(--privy-color-foreground);

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &::placeholder {
      color: var(--privy-color-foreground-3);
    }
  }
`;let u=o.styled.button`
  && {
    position: relative;
    width: 100%;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.625rem 0.75rem;
    min-height: 3.5rem;
    border: 1px solid
      ${e=>e.$selected?"var(--privy-color-icon-interactive)":"var(--privy-color-foreground-4)"};
    border-radius: var(--privy-border-radius-md);
    background-color: ${e=>e.$selected?"var(--privy-color-info-bg)":"transparent"};
    color: var(--privy-color-foreground);
    font-size: 0.875rem;
    line-height: 1.5rem;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    transition:
      background-color 200ms ease,
      border-color 200ms ease;

    &:hover {
      background-color: var(--privy-color-background-2);
    }

    &:disabled {
      opacity: ${e=>e.$selected?1:.5};
      cursor: not-allowed;
    }

    &:focus,
    &:focus-visible {
      outline: none;
      box-shadow: none;
    }
  }
`,p=o.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 0;
`,h=o.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.5rem 0;
`,v=o.styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,g=o.styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--privy-border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${e=>"done"===e.$status?"var(--privy-color-success-light, #DCFCE7)":"var(--privy-color-background-2)"};
`,m=o.styled.div`
  width: 2px;
  height: 1rem;
  background-color: var(--privy-color-background-2);
  margin-left: 0.6875rem;
`,y=o.styled.span`
  font-size: 0.875rem;
  color: var(--privy-color-foreground);
`;o.styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--privy-border-radius-md);
  background-color: var(--privy-color-background-2);
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--privy-color-foreground-3);
`;let f=o.styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
  line-height: 1.25rem;
`,b=o.styled.span`
  color: var(--privy-color-foreground);
  font-weight: 400;
`,x=o.styled.span`
  color: var(--privy-color-foreground);
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,k=(0,o.styled)(t.L)`
  && {
    margin-left: auto;
    height: 1.5rem;
    width: 1.5rem;
    border-width: 2px;
    flex-shrink: 0;
  }
`;e.s(["C",0,n,"L",0,p,"N",0,l,"O",0,u,"S",0,a,"T",0,h,"a",0,d,"b",0,k,"c",0,v,"d",0,g,"e",0,y,"f",0,m,"g",0,s,"h",0,c,"i",0,f,"j",0,b,"k",0,x],639038)},997787,e=>{"use strict";let r=(0,e.i(773524).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",0,r],997787)},245953,(e,r,o)=>{"use strict";var t={single_source_shortest_paths:function(e,r,o){var i,n,a,s,l,d,c,u={},p={};p[r]=0;var h=t.PriorityQueue.make();for(h.push(r,0);!h.empty();)for(a in n=(i=h.pop()).value,s=i.cost,l=e[n]||{})l.hasOwnProperty(a)&&(d=s+l[a],c=p[a],(void 0===p[a]||c>d)&&(p[a]=d,h.push(a,d),u[a]=n));if(void 0!==o&&void 0===p[o])throw Error(["Could not find a path from ",r," to ",o,"."].join(""));return u},extract_shortest_path_from_predecessor_list:function(e,r){for(var o=[],t=r;t;)o.push(t),e[t],t=e[t];return o.reverse(),o},find_path:function(e,r,o){var i=t.single_source_shortest_paths(e,r,o);return t.extract_shortest_path_from_predecessor_list(i,o)},PriorityQueue:{make:function(e){var r,o=t.PriorityQueue,i={};for(r in e=e||{},o)o.hasOwnProperty(r)&&(i[r]=o[r]);return i.queue=[],i.sorter=e.sorter||o.default_sorter,i},default_sorter:function(e,r){return e.cost-r.cost},push:function(e,r){this.queue.push({value:e,cost:r}),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return 0===this.queue.length}}};r.exports=t}]);