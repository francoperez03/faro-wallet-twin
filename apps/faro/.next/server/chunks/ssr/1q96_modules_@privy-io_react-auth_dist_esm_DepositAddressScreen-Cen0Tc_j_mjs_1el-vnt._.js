module.exports=[180447,a=>{"use strict";var b=a.i(187924),c=a.i(572131),d=a.i(766374),e=a.i(310077),f=a.i(968141),g=a.i(373949),h=a.i(778856),i=a.i(752650),j=a.i(760847);let k=(0,j.default)("undo-2",[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]]),l=(0,j.default)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);var m=a.i(470011);let n=(0,j.default)("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);var o=a.i(608273),p=a.i(775716),q=a.i(164909),r=a.i(94293),s=a.i(309085),t=a.i(615340),u=a.i(284145),v=a.i(169359),w=a.i(167827),x=a.i(271280),y=a.i(81187),z=a.i(994417),A=a.i(890442),B=a.i(659036),C=a.i(167853);a.i(366962),a.i(906301),a.i(794954),a.i(562724);class D extends c.Component{static getDerivedStateFromError(){return{hasError:!0}}componentDidCatch(a,b){this.props.onError(a)}componentDidUpdate(a){a.resetKey!==this.props.resetKey&&this.state.hasError&&this.setState({hasError:!1})}render(){return this.state.hasError?null:this.props.children}constructor(...a){super(...a),this.state={hasError:!1}}}function E(a){return a>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(Math.round(a)):a>=100?new Intl.NumberFormat("en-US",{maximumFractionDigits:1}).format(a):a>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(a):new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(a)}function F(a,b){let c=Number(a);if(!Number.isFinite(c)||0===c)return a;let d=null!=b?c/10**b:c;return d>=1e3?new Intl.NumberFormat("en-US",{maximumFractionDigits:2}).format(d):d>=1?new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(d):d>=1e-4?new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(d):new Intl.NumberFormat("en-US",{maximumSignificantDigits:4}).format(d)}function G({address:a,caip2:b,config:c}){for(let d of c.currencies){let c=d.chains.find(c=>c.caip2===b&&c.address.toLowerCase()===a.toLowerCase());if(c)return{symbol:d.symbol.toUpperCase(),decimals:c.decimals}}return{symbol:a,decimals:void 0}}function H(a,b){return b[a]?.displayName??a}function I(a,b){return a.chains.filter(a=>!0===a.can_be_relay_deposit_source).map(a=>{let c=b.chains[a.caip2];return c?{caip2:a.caip2,displayName:c.displayName,iconUrl:c.iconUrl,vmType:c.vmType,currencyAddress:a.address,currencyDecimals:a.decimals}:null}).filter(a=>null!==a)}function J(a,b){if(!a.chains[b.destinationChain])return`Unsupported destination chain: "${b.destinationChain}". Check that the chain is in CAIP-2 format (e.g. "eip155:8453") and is supported for deposit addresses.`;let c=b.destinationCurrency.toLowerCase();return a.currencies.some(a=>a.chains.some(a=>a.caip2===b.destinationChain&&a.address.toLowerCase()===c))?null:`Unsupported destination currency "${b.destinationCurrency}" on chain "${b.destinationChain}". Check that this token address is supported on the specified chain.`}let K=new Set(["ROUTE_UNAVAILABLE","UNEXPECTED_STATE","TIMEOUT_WAITING_FOR_NEXT_ORDER","TIMEOUT_ORDER_COMPLETION","DEPOSIT_FAILED","DEPOSIT_REFUNDED","USER_EXITED","AMOUNT_TOO_LOW","INSUFFICIENT_LIQUIDITY","UNSUPPORTED_CHAIN","UNSUPPORTED_CURRENCY","UNSUPPORTED_ROUTE","NO_SWAP_ROUTES_FOUND","NO_INTERNAL_SWAP_ROUTES_FOUND","NO_QUOTES","SANCTIONED_WALLET_ADDRESS","REFUND_WALLET_CREATION_FAILED","DEPOSIT_ADDRESSES_NOT_ENABLED","NOT_AUTHENTICATED"]);function L(a){return K.has(a)?a:"UNKNOWN_ERROR"}function M(){let{params:a,setModalState:b}=(0,e.a)(),{privy:d}=(0,u.u)(),f=function(){let{privy:a,refreshSessionAndUser:b}=(0,u.u)();return(0,c.useCallback)((c,d)=>d?Promise.resolve({ok:!0,address:d}):s.depositAddress.resolveRefundAddress({privy:a,caip2:c,onWalletCreated:b}),[a,b])}(),[g,h]=(0,c.useState)(!1);return{fetchQuote:(0,c.useCallback)(async(c,e,g)=>{if(a){h(!0);try{let h=await f(c.caip2,a.refundAddress);if(!h.ok)return void b({step:"error",code:L(h.error)});let i=await d.fetchPrivyRoute(t.CreateDepositAddressQuote,{body:{source_chain:c.caip2,source_currency:c.currencyAddress,destination_chain:a.destinationChain,destination_currency:a.destinationCurrency,destination_address:a.destinationAddress,refund_address:h.address,...null!=a.slippageBps?{slippage_bps:a.slippageBps}:{}}});b({step:"address",selectedCurrency:e,selectedChain:c,availableChains:g,quote:i})}catch(d){let a=d instanceof Error?d:Error(String(d)),c="status"in a&&"number"==typeof a.status?a.status:void 0;b({step:"error",code:a instanceof s.PrivyApiError&&"feature_not_enabled"===a.code?"DEPOSIT_ADDRESSES_NOT_ENABLED":c&&c>=500?"UNKNOWN_ERROR":L(a.message),message:a.message})}finally{h(!1)}}},[a,d,f,b]),isFetching:g}}function N(a,b){switch(a.status){case"completed":return b({step:"complete",order:a});case"refunded":return b({step:"refunded",order:a});case"failed":return b({step:"failed",order:a});case"executing":return b({step:"processing",order:a});default:return}}let O=({sourceAmount:a,sourceSymbol:c,sourceChainName:d,sourceDecimals:e,destinationAmount:g,destSymbol:h,destChainName:i,destDecimals:j,onClose:k})=>(0,b.jsx)(o.C,{icon:f.Check,iconVariant:"success",title:"Transfer complete",subtitle:g?`Received ${F(a,e)} ${c} on ${d} and converted it to ${F(g,j)} ${h} on ${i}. Funds are available to use.`:`Your ${c} has been received and is now available in your wallet.`,showClose:!0,onClose:k,primaryCta:{label:"Done",onClick:k},watermark:!1});function P(){let{state:a,configData:d,close:f}=(0,e.c)("complete"),{order:g}=a,{sourceSymbol:h,sourceChainName:i,sourceDecimals:j,destSymbol:k,destChainName:l,destDecimals:m}=(0,c.useMemo)(()=>{let a=G({address:g.source_currency,caip2:g.source_chain,config:d}),b=G({address:g.destination_currency,caip2:g.destination_chain,config:d});return{sourceSymbol:a.symbol,sourceChainName:H(g.source_chain,d.chains),sourceDecimals:a.decimals,destSymbol:b.symbol,destChainName:H(g.destination_chain,d.chains),destDecimals:b.decimals}},[g,d]);return(0,b.jsx)(O,{sourceAmount:g.source_amount,sourceSymbol:h,sourceChainName:i,sourceDecimals:j,destinationAmount:g.destination_amount,destSymbol:k,destChainName:l,destDecimals:m,onClose:f})}function Q(){let{modalState:a,setModalState:d,config:f,retryConfig:h,close:i,createDepositAddressEvent:j}=(0,e.a)();if("error"!==a.step)throw Error("UNEXPECTED_STATE");let{code:k}=a,{title:l,subtitle:m,detail:n,iconVariant:p}=(a=>{switch(a){case"AMOUNT_TOO_LOW":return{title:"Amount too low",subtitle:"The deposit amount is below the minimum for this route.",detail:"Try a larger amount or a different token.",iconVariant:"warning"};case"INSUFFICIENT_LIQUIDITY":return{title:"Insufficient liquidity",subtitle:"There isn't enough liquidity for this route right now.",detail:"Try a smaller amount or a different network.",iconVariant:"warning"};case"UNSUPPORTED_CHAIN":return{title:"Unsupported chain",subtitle:"Deposits from this chain type aren't supported yet. Try a different network.",iconVariant:"warning"};case"UNSUPPORTED_CURRENCY":case"UNSUPPORTED_ROUTE":case"ROUTE_UNAVAILABLE":case"NO_SWAP_ROUTES_FOUND":case"NO_INTERNAL_SWAP_ROUTES_FOUND":case"NO_QUOTES":return{title:"Route not available",subtitle:"This deposit route isn't supported right now. Try a different token or network.",iconVariant:"warning"};case"SANCTIONED_WALLET_ADDRESS":return{title:"Address restricted",subtitle:"This address cannot be used for deposits due to compliance restrictions.",iconVariant:"warning"};case"REFUND_WALLET_CREATION_FAILED":return{title:"Unable to set up refund address",subtitle:"We couldn't create a wallet to receive refunds on this chain. Please try again or select a different network.",iconVariant:"warning"};case"DEPOSIT_ADDRESSES_NOT_ENABLED":return{title:"Not enabled",subtitle:"Deposit addresses are not enabled for this app.",iconVariant:"warning"};case"NOT_AUTHENTICATED":return{title:"Not signed in",subtitle:"Please sign in to continue with your deposit.",iconVariant:"warning"};case"TIMEOUT_WAITING_FOR_NEXT_ORDER":case"TIMEOUT_ORDER_COMPLETION":return{title:"Taking longer than expected",subtitle:"Your funds are safe. The deposit is still being processed — check back later.",iconVariant:"subtle"};default:return{title:"Something went wrong",subtitle:"We couldn't complete your request. Please try again.",iconVariant:"subtle"}}})(k),[q,r]=(0,c.useState)(!1);return(0,b.jsx)(o.C,{icon:g.AlertTriangle,iconVariant:p,title:l,subtitle:n?`${m} ${n}`:m,showClose:!0,onClose:i,primaryCta:{label:"Try again",onClick:async()=>{if(j({eventName:"sdk_deposit_address_action",payload:{action:"retry",step:"error",errorCode:k}}),"ready"!==f.status){r(!0);try{await h(),d({step:"token"})}catch{r(!1)}}else d({step:"token"})},loading:q},watermark:!0})}function R(){let{state:a,close:c,createDepositAddressEvent:d}=(0,e.c)("failed"),{order:f}=a;return(0,b.jsx)(q.S,{icon:g.AlertTriangle,iconVariant:"error",title:"Transfer failed",subtitle:"Something went wrong processing your transfer.",showClose:!0,onClose:c,primaryCta:{label:"Done",onClick:c},secondaryCta:{label:"Learn about manual recovery",onClick:()=>{d({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"failed",target:"recovery_docs"}}),window.open("https://docs.privy.io","_blank","noopener,noreferrer")}},watermark:!0,children:(0,b.jsxs)(S,{href:f.tracking_url,target:"_blank",rel:"noopener noreferrer",onClick:()=>{d({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"failed",target:"relay_reference"}})},children:["Reference: ",f.provider_request_id]})})}let S=p.styled.a`
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.7;
  text-decoration: underline;
  cursor: pointer;
  color: var(--privy-color-foreground-3);
`;function T(){let{close:a,setModalState:d,config:f,params:g,onBack:i,createDepositAddressEvent:j}=(0,e.a)(),[k,l]=(0,c.useState)(!1);return(0,c.useEffect)(()=>{if(k&&g){if("ready"===f.status){let a=J(f.data,g);d(a?{step:"error",code:"ROUTE_UNAVAILABLE",message:a}:{step:"token"})}"error"===f.status&&d({step:"error",code:"ROUTE_UNAVAILABLE"})}},[k,f,g,d]),(0,b.jsx)(o.C,{icon:h.QrCode,iconVariant:"subtle",title:"Add funds",subtitle:"Top up your account by sending crypto from any wallet. Conversion and routing handled by Relay.",showClose:!0,onClose:a,showBack:!!i,onBack:i?()=>{j({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"intro"}}),i()}:void 0,primaryCta:{label:"Continue",onClick:()=>{if(j({eventName:"sdk_deposit_address_action",payload:{action:"continue",step:"intro"}}),"ready"===f.status&&g){let a=J(f.data,g);d(a?{step:"error",code:"ROUTE_UNAVAILABLE",message:a}:{step:"token"})}else"error"===f.status?d({step:"error",code:"ROUTE_UNAVAILABLE"}):l(!0)},loading:k&&"loading"===f.status,loadingText:null},watermark:!0})}function U(){let{state:a,setModalState:d,close:f,createDepositAddressEvent:g}=(0,e.c)("network"),[h,i]=(0,c.useState)(-1),{availableChains:j}=a,{confirm:k,isFetching:l}=function(){let a=(0,e.b)(),{params:b}=(0,e.a)(),{fetchQuote:d,isFetching:f}=M();return{confirm:(0,c.useCallback)(async c=>{if(!c||!b)return;let e=a?.modalState;e&&"network"===e.step&&await d(c,e.selectedCurrency,e.availableChains)},[b,a,d]),isFetching:f}}();return(0,b.jsx)(q.S,{title:"Select network",eyebrow:(0,b.jsxs)("span",{style:{display:"flex",alignItems:"center",gap:"0.375rem"},children:[(0,b.jsx)("img",{src:a.selectedCurrency.logoURI,alt:"",style:{width:"1rem",height:"1rem",borderRadius:"50%"}}),"Send ",a.selectedCurrency.symbol]}),showBack:!0,onBack:()=>{g({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"network"}}),d({step:"token"})},showClose:!0,onClose:f,watermark:!0,children:(0,b.jsx)(r.S,{style:{marginTop:"1rem",height:"22rem"},$colorScheme:"light",children:j.map((a,c)=>(0,b.jsxs)(o.O,{$selected:h===c,disabled:l,onClick:()=>{g({eventName:"sdk_deposit_address_action",payload:{action:"network_selected",step:"network",network:a.caip2}}),i(c),k(a)},children:[(0,b.jsx)(o.N,{src:a.iconUrl,alt:a.displayName}),(0,b.jsx)(o.a,{children:a.displayName}),l&&c===h&&(0,b.jsx)(o.b,{})]},a.caip2))})})}let V=({trackingUrl:a,onViewBlockExplorer:c,onClose:d})=>(0,b.jsx)(q.S,{icon:i.Hourglass,iconVariant:"subtle",title:"Transfer in progress",subtitle:"Your deposit was received and the transfer is now processing.",showClose:!0,onClose:d,secondaryCta:{label:"View on block explorer ↗",onClick:()=>{c(),window.open(a,"_blank","noopener,noreferrer")}},watermark:!1,children:(0,b.jsxs)(o.T,{children:[(0,b.jsxs)(o.c,{children:[(0,b.jsx)(o.d,{$status:"done",children:(0,b.jsx)(f.Check,{size:14,color:"var(--privy-color-icon-success)",strokeWidth:2})}),(0,b.jsx)(o.e,{children:"Deposit received"})]}),(0,b.jsx)(o.f,{}),(0,b.jsxs)(o.c,{children:[(0,b.jsx)(o.d,{$status:"active",children:(0,b.jsx)(W,{})}),(0,b.jsx)(o.e,{children:"Bridging"})]}),(0,b.jsx)(o.f,{}),(0,b.jsxs)(o.c,{children:[(0,b.jsx)(o.d,{$status:"pending"}),(0,b.jsx)(o.e,{children:"Funds arrived"})]})]})}),W=p.styled.span`
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
`;function X(){let{state:a,close:d,createDepositAddressEvent:f}=(0,e.c)("processing");return function({orderId:a,enabled:b}){let{privy:d}=(0,u.u)(),{setModalState:f}=(0,e.a)();(0,c.useEffect)(()=>{let b=new AbortController;return s.depositAddress.waitForCompletion({privy:d,orderId:a,signal:b.signal}).then(a=>{b.signal.aborted||("success"===a.status?N(a.order,f):"timeout"===a.status&&f({step:"error",code:"TIMEOUT_ORDER_COMPLETION"}))}),()=>{b.abort()}},[b,a,d,f])}({orderId:a.order.id,enabled:!0}),(0,b.jsx)(V,{trackingUrl:a.order.tracking_url,onViewBlockExplorer:()=>{f({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"processing",target:"block_explorer"}})},onClose:d})}function Y(){let{state:a,close:c,createDepositAddressEvent:d}=(0,e.c)("refunded"),{order:f}=a;return(0,b.jsx)(o.C,{icon:k,iconVariant:"subtle",title:"Transfer refunded",subtitle:"Your transfer was received, but the swap couldn't be completed. A refund has been started automatically.",showClose:!0,onClose:c,primaryCta:{label:"Done",onClick:c},secondaryCta:{label:"View transaction details",onClick:()=>{d({eventName:"sdk_deposit_address_action",payload:{action:"link_opened",step:"refunded",target:"transaction_details"}}),window.open(f.tracking_url,"_blank","noopener,noreferrer")}},watermark:!0})}function Z(){let{close:a,setModalState:d,config:f,createDepositAddressEvent:g}=(0,e.a)(),{confirm:h,currencies:i,isFetching:j}=function(){let{config:a,setModalState:b}=(0,e.a)(),{fetchQuote:d,isFetching:f}=M(),g="ready"===a.status?a.data.currencies.filter(b=>I(b,a.data).length>0):[];return{confirm:(0,c.useCallback)(async c=>{if("ready"!==a.status||!c)return;let e=I(c,a.data);if(1!==e.length)b({step:"network",selectedCurrency:c,availableChains:e});else{let a=e[0];await d(a,c,e)}},[a,d,b]),currencies:g,isFetching:f}}(),[k,l]=(0,c.useState)(-1);return(0,b.jsx)(q.S,{title:"Select token",showBack:!0,onBack:()=>{g({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"token"}}),d({step:"intro"})},showClose:!0,onClose:a,watermark:!0,children:"error"===f.status?(0,b.jsx)(o.L,{children:(0,b.jsx)(o.S,{children:"Failed to load tokens"})}):"loading"===f.status?(0,b.jsx)(o.L,{children:(0,b.jsx)(v.L,{})}):(0,b.jsx)(r.S,{style:{marginTop:"1rem",height:"22rem"},$colorScheme:"light",children:i.map((a,c)=>(0,b.jsxs)(o.O,{$selected:k===c,disabled:j,onClick:()=>{g({eventName:"sdk_deposit_address_action",payload:{action:"token_selected",step:"token",token:a.symbol}}),l(c),h(a)},children:[(0,b.jsx)(o.g,{src:a.logoURI,alt:a.symbol}),(0,b.jsx)(o.a,{children:a.name}),j&&c===k?(0,b.jsx)(o.b,{}):(0,b.jsx)(o.h,{children:a.symbol})]},a.symbol))})})}function $({address:a,onClick:d}){let[e,f]=(0,c.useState)(!1);return(0,b.jsx)(b.Fragment,{children:e?(0,b.jsx)(_,{onClick:()=>f(!1),style:{marginTop:"1.5rem"},children:(0,b.jsx)(x.Q,{url:a,size:312,hideLogo:!0})}):(0,b.jsxs)(aa,{title:"Click to copy address",onClick:d,style:{marginTop:"1.5rem"},children:[(0,b.jsxs)(ab,{children:[(0,b.jsx)(ac,{children:"Deposit address"}),(0,b.jsx)(ad,{children:a})]}),(0,b.jsx)(ae,{children:(0,b.jsx)(af,{type:"button",onClick:a=>{a.stopPropagation(),f(!0)},children:(0,b.jsx)(h.QrCode,{size:16,color:"var(--privy-color-icon-muted)"})})})]})})}let _=p.styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
`,aa=p.styled.div`
  display: flex;
  border-radius: var(--privy-border-radius-md);
  background: var(--privy-color-background-clicked, #f1f2f9);
  padding: 1rem;
  cursor: pointer;
  gap: 0.5rem;
`,ab=p.styled.div`
  flex: 1;
  min-width: 0;
  text-align: left;
`,ac=p.styled.div`
  font-size: 0.75rem;
  color: var(--privy-color-icon-muted);
  line-height: 1rem;
  margin-bottom: 0.25rem;
`,ad=p.styled.div`
  word-break: break-all;
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  font-weight: 500;
  line-height: 1.375rem;
  color: var(--privy-color-foreground);
`,ae=p.styled.div`
  width: 1.5rem;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  padding-top: 0.25rem;
`,af=p.styled.button`
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
`;function ag({quote:a,selectedCurrency:d,selectedChain:e,destinationSymbol:f}){var h,i;let j,[k,n]=(0,c.useState)(!1),p=d.symbol.toUpperCase(),q=e.displayName,r=(0,c.useRef)(null);return(0,b.jsxs)(ah,{children:[(0,b.jsxs)(ai,{onClick:(0,c.useCallback)(()=>{let a=document.getElementById("privy-modal-content");a&&(r.current&&clearTimeout(r.current),a.style.transition="none",r.current=setTimeout(()=>{a.style.transition="",r.current=null},160)),n(a=>!a)},[]),children:[(0,b.jsxs)(aj,{children:[d.logoURI&&(0,b.jsx)(o.g,{src:d.logoURI,alt:p,style:{width:"2rem",height:"2rem"}}),e.iconUrl&&(0,b.jsx)(ak,{src:e.iconUrl,alt:q})]}),(0,b.jsxs)(al,{children:[(0,b.jsx)(am,{children:"You send"}),(0,b.jsxs)(an,{children:[p," on ",q]})]}),(0,b.jsx)(ao,{children:(0,b.jsx)(k?l:m.ChevronDown,{size:16})})]}),(0,b.jsx)(as,{$expanded:k,children:(0,b.jsx)(at,{children:(0,b.jsxs)(ap,{children:[a.indicative_rate&&(0,b.jsxs)(o.i,{children:[(0,b.jsx)(o.j,{children:"Conversion rate"}),(0,b.jsxs)(o.k,{style:{display:"flex",alignItems:"center",gap:"0.25rem"},children:[(h=a.indicative_rate,i=f.toUpperCase(),Number.isFinite(j=Number(h))&&0!==j?j>=.01?`1 ${p} ≈ ${E(j)} ${i}`:`${E(1/j)} ${p} ≈ 1 ${i}`:`1 ${p} ≈ ${h} ${i}`),(0,b.jsx)(au,{content:"Estimated rate based on current market conditions. Final execution price may vary depending on transfer size and routing."})]})]}),(0,b.jsxs)(o.i,{children:[(0,b.jsx)(o.j,{children:"Max slippage"}),(0,b.jsxs)(o.k,{children:[(a.slippage_bps/100).toFixed(1),"%"]})]}),(0,b.jsxs)(o.i,{children:[(0,b.jsx)(o.j,{children:"Refund address"}),(0,b.jsx)(o.k,{children:(0,b.jsx)(B.C,{value:a.refund_address,iconOnly:!0,iconSize:11,children:(0,C.d)(a.refund_address,4,4)})})]})]})})}),(0,b.jsxs)(aq,{children:[(0,b.jsx)(g.AlertTriangle,{size:16,color:"var(--privy-color-icon-muted)",style:{flexShrink:0}}),(0,b.jsxs)(ar,{children:["Only send ",(0,b.jsx)("strong",{children:p})," on ",(0,b.jsx)("strong",{children:q}),". Other assets may be lost."]})]})]})}let ah=p.styled.div`
  border-radius: var(--privy-border-radius-md);
  border: 1px solid var(--privy-color-foreground-4);
  overflow: hidden;
`,ai=p.styled.button`
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
`,aj=p.styled.span`
  position: relative;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
`,ak=(0,p.styled)(o.N)`
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
`,al=p.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`,am=p.styled.span`
  font-size: 0.75rem;
  color: var(--privy-color-foreground-3);
  line-height: 1rem;
`,an=p.styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
`,ao=p.styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--privy-border-radius-full);
  background-color: var(--privy-color-background-clicked, #f1f2f9);
  color: var(--privy-color-foreground-3);
`,ap=p.styled.div`
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
`,aq=p.styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.75rem 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--privy-border-radius-sm);
  background: #f8f9fc;
`,ar=p.styled.span`
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: var(--privy-color-icon-muted);
  text-align: left;
`,as=p.styled.div`
  display: grid;
  grid-template-rows: ${({$expanded:a})=>a?"1fr":"0fr"};
  transition: grid-template-rows 150ms ease-out;
`,at=p.styled.div`
  overflow: hidden;
`;function au({content:a}){let[d,e]=(0,c.useState)(!1),{refs:f,floatingStyles:g,context:h}=(0,y.useFloating)({open:d,onOpenChange:e,placement:"top",whileElementsMounted:z.autoUpdate,middleware:[(0,A.offset)(6),(0,A.flip)(),(0,A.shift)({padding:8})]}),i=(0,y.useHover)(h,{move:!1,handleClose:(0,y.safePolygon)()}),j=(0,y.useFocus)(h),{getReferenceProps:k,getFloatingProps:l}=(0,y.useInteractions)([i,j,(0,y.useClick)(h),(0,y.useDismiss)(h),(0,y.useRole)(h,{role:"tooltip"})]),{isMounted:m,styles:o}=(0,y.useTransitionStyles)(h,{duration:150});return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("button",{ref:f.setReference,type:"button","aria-label":"More information about conversion rate",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",padding:0,border:"none",background:"none",color:"var(--privy-color-icon-muted)",cursor:"pointer"},...k(),children:(0,b.jsx)(n,{size:14})}),m&&(0,b.jsx)(y.FloatingPortal,{root:document.getElementById("privy-modal-content")??void 0,children:(0,b.jsx)(av,{ref:f.setFloating,style:{...g,...o},...l(),children:a})})]})}let av=p.styled.div`
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
`,aw=({quote:a,selectedCurrency:d,selectedChain:e,destinationSymbol:g,onBack:h,onClose:i})=>{let[j,k]=(0,c.useState)(!1),l=d?.symbol?.toUpperCase()??"funds",m=e?.displayName??"",n=async()=>{j||(await navigator.clipboard.writeText(a.deposit_address),k(!0),setTimeout(()=>k(!1),2e3))};return(0,b.jsxs)(q.S,{title:`Send ${l}${m?` on ${m}`:""}`,subtitle:"Send funds to the address below. Conversion and routing handled by Relay.",showBack:!0,onBack:h,showClose:!0,onClose:i,watermark:!1,children:[(0,b.jsx)(ag,{quote:a,selectedCurrency:d,selectedChain:e,destinationSymbol:g}),(0,b.jsx)($,{address:a.deposit_address,onClick:n}),(0,b.jsx)(w.P,{style:{marginTop:"1rem",marginBottom:"0.5rem",...j?{backgroundColor:"var(--privy-color-icon-success)",borderColor:"var(--privy-color-icon-success)"}:{}},onClick:n,children:j?(0,b.jsxs)(b.Fragment,{children:["Copied ",(0,b.jsx)(f.Check,{size:16,style:{marginLeft:"0.25rem"}})]}):"Copy address"}),(0,b.jsx)(ax,{children:"Routing and bridging are handled by Relay. Privy does not control execution timing, liquidity, or transaction outcomes."})]})},ax=p.styled.p`
  && {
    margin: 0.5rem 0 0;
    font-size: 0.6875rem;
    line-height: 1.125rem;
    color: var(--privy-color-icon-muted);
    text-align: center;
  }
`;function ay(){let{state:a,configData:d,setModalState:f,close:g,params:h,createDepositAddressEvent:i}=(0,e.c)("address"),{quote:j,selectedCurrency:k,selectedChain:l,availableChains:m}=a;return function({depositAddressId:a,enabled:b,quoteCreatedAt:d}){let{privy:f}=(0,u.u)(),{setModalState:g}=(0,e.a)();(0,c.useEffect)(()=>{if(!a)return;let b=new AbortController;return s.depositAddress.waitForDeposit({privy:f,depositAddressId:a,quoteCreatedAt:d,signal:b.signal}).then(a=>{b.signal.aborted||("success"===a.status?N(a.order,g):"timeout"===a.status&&g({step:"error",code:"TIMEOUT_WAITING_FOR_NEXT_ORDER"}))}),()=>{b.abort()}},[b,a,f,d,g])}({depositAddressId:j.id,enabled:!0,quoteCreatedAt:j.created_at}),(0,b.jsx)(aw,{quote:j,selectedCurrency:k,selectedChain:l,destinationSymbol:(0,c.useMemo)(()=>G({address:h.destinationCurrency,caip2:h.destinationChain,config:d}).symbol,[h,d]),onBack:()=>{i({eventName:"sdk_deposit_address_action",payload:{action:"back",step:"address"}}),f({step:"network",selectedCurrency:k,availableChains:m})},onClose:g})}function az(){let{modalState:a,setModalState:c}=(0,e.a)();return(0,b.jsx)(D,{onError:a=>c({step:"error",code:"UNEXPECTED_STATE",message:a.message}),resetKey:a.step,children:(0,b.jsx)(aA,{})})}function aA(){let{modalState:a}=(0,e.a)();switch(a.step){case"intro":return(0,b.jsx)(T,{});case"token":return(0,b.jsx)(Z,{});case"network":return(0,b.jsx)(U,{});case"address":return(0,b.jsx)(ay,{});case"processing":return(0,b.jsx)(X,{});case"complete":return(0,b.jsx)(P,{});case"refunded":return(0,b.jsx)(Y,{});case"failed":return(0,b.jsx)(R,{});case"error":return(0,b.jsx)(Q,{});default:return null}}a.s(["default",0,{component:()=>{let{onUserCloseViaDialogOrKeybindRef:a}=(0,d.u)(),f=(0,e.b)(),{close:g,config:h}=(0,e.a)();return(0,c.useEffect)(()=>{a.current=g},[a,g]),(0,c.useEffect)(()=>{if("ready"===h.status){for(let a of h.data.currencies)(new Image).src=a.logoURI;for(let a of Object.values(h.data.chains))(new Image).src=a.iconUrl}},[h]),f?(0,b.jsx)(az,{}):null}}],180447)}];

//# sourceMappingURL=1q96_modules_%40privy-io_react-auth_dist_esm_DepositAddressScreen-Cen0Tc_j_mjs_1el-vnt._.js.map