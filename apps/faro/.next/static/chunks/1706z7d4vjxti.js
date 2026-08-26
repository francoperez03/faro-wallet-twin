(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,518139,e=>{"use strict";var n=e.i(271645);let t=n.forwardRef(function({title:e,titleId:t,...l},a){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:a,"aria-labelledby":t},l),e?n.createElement("title",{id:t},e):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"}))});e.s(["default",0,t])},314866,e=>{"use strict";var n=e.i(843476),t=e.i(997053),l=e.i(616918);let a=t.styled.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let n,l;"green"===e.$color&&(n="var(--privy-color-success-dark)",l="var(--privy-color-success-light)"),"red"===e.$color&&(n="var(--privy-color-error)",l="var(--privy-color-error-light)"),"gray"===e.$color&&(n="var(--privy-color-foreground-2)",l="var(--privy-color-background-2)");let a=t.keyframes`
      from, to {
        background-color: ${l};
      }

      50% {
        background-color: rgba(${l}, 0.8);
      }
    `;return t.css`
      color: ${n};
      background-color: ${l};
      ${e.$isPulsing&&t.css`
        animation: ${a} 3s linear infinite;
      `};
    `}}

  ${l.L}
`;e.s(["C",0,({children:e,color:t,isLoading:l,isPulsing:i,...o})=>(0,n.jsx)(a,{$color:t,$isLoading:l,$isPulsing:i,...o,children:e})])},282975,e=>{"use strict";var n=e.i(843476),t=e.i(346146),l=e.i(837008);e.s(["t",0,function({title:e}){let{currentScreen:a,navigateBack:i,navigate:o,data:r,setModalData:c}=(0,t.u)();return(0,n.jsx)(l.M,{title:e,backFn:"ManualTransferScreen"===a?i:a===r?.funding?.methodScreen?r.funding.comingFromSendTransactionScreen?()=>o("SendTransactionScreen"):void 0:r?.funding?.methodScreen?()=>{let e=r.funding;e.usingDefaultFundingMethod&&(e.usingDefaultFundingMethod=!1),c({funding:e,solanaFundingData:r?.solanaFundingData}),o(e.methodScreen)}:void 0})}])},213444,e=>{"use strict";var n=e.i(843476),t=e.i(518139);e.s(["I",0,({icon:e,name:l})=>"string"==typeof e?(0,n.jsx)("img",{alt:`${l||"wallet"} logo`,src:e,style:{height:24,width:24,borderRadius:4}}):void 0===e?(0,n.jsx)(t.default,{style:{height:24,width:24}}):e?(0,n.jsx)(e,{style:{height:24,width:24}}):null])},616918,e=>{"use strict";var n=e.i(997053);let t=n.keyframes`
  from, to {
    background: var(--privy-color-foreground-4);
    color: var(--privy-color-foreground-4);
  }

  50% {
    background: var(--privy-color-foreground-accent);
    color: var(--privy-color-foreground-accent);
  }
`,l=n.css`
  ${e=>e.$isLoading?n.css`
          width: 35%;
          animation: ${t} 2s linear infinite;
          border-radius: var(--privy-border-radius-sm);
        `:""}
`;e.s(["L",0,l])},810977,e=>{"use strict";var n=e.i(843476),t=e.i(997053);let l=({title:e,description:t,children:l,...i})=>(0,n.jsx)(a,{...i,children:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("h3",{children:e}),"string"==typeof t?(0,n.jsx)("p",{children:t}):t,l]})});(0,t.styled)(l)`
  margin-bottom: 24px;
`;let a=t.styled.div`
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
`,i=(0,t.styled)(a)`
  align-items: center;
  text-align: center;
  gap: 16px;

  h3 {
    margin-bottom: 24px;
  }
`;e.s(["C",0,({title:e,description:t,icon:l,children:a,...o})=>(0,n.jsxs)(i,{...o,children:[l||null,(0,n.jsx)("h3",{children:e}),t&&"string"==typeof t?(0,n.jsx)("p",{children:t}):t,a]}),"S",0,l])},317842,e=>{"use strict";var n=e.i(997053);let t=n.styled.span`
  margin-top: 4px;
  color: var(--privy-color-foreground);
  text-align: center;

  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem; /* 157.143% */

  && a {
    color: var(--privy-color-accent);
  }
`;e.s(["S",0,t])},639559,e=>{"use strict";var n=e.i(843476),t=e.i(271645),l=e.i(837008),a=e.i(810977),i=e.i(282975),o=e.i(213444),r=e.i(314866),c=e.i(317842),s=e.i(118364),d=e.i(200314),p=e.i(595693),u=e.i(346146),y=e.i(999863),h=e.i(133996),g=e.i(328708),f=e.i(33750),m=e.i(997053),w=e.i(435232),x=e.i(385171),v=e.i(737577),T=e.i(103853);e.i(123287),e.i(437206),e.i(610760);let C=({provider:e,displayName:l,logo:a,connectOnly:i,connector:r})=>{let c,{navigate:s,setModalData:y}=(0,u.u)(),{connectWallet:h,walletConnectionStatus:g}=(0,p.u)(),m=(0,v.h)(),[T,C]=(0,t.useState)(!1),_="wallet_connect_v2"===r.connectorType?e:r.walletClientType,[$,k]=(0,t.useState)(!1);(0,t.useEffect)(()=>{$&&("connected"===g?.status||g?.connectError)&&(s(i?"ConnectOnlyStatusScreen":"ConnectionStatusScreen"),k(!1))},[$,g]);let W=(0,d.k)(e),O=window.matchMedia("(display-mode: standalone)").matches,M=(0,d.b)({connectorType:r.connectorType,walletClientType:_});c=M&&M.chainTypes.includes(r.chainType)?()=>{M.isInstalled||"solana"===r.chainType&&"isInstalled"in r&&r.isInstalled?(h(r,_),s(i?"ConnectOnlyStatusScreen":"ConnectionStatusScreen")):(0,d.l)({isMobile:f.isMobile,walletConfig:M})?(y(n=>({...n,externalConnectWallet:{...n?.externalConnectWallet,preSelectedWalletId:e,walletChainType:"solana"===r.chainType?"solana-only":"ethereum-only"}})),s(i?"ConnectOnlyLandingScreen":"AuthenticateWithWalletScreen")):f.isMobile?(y({installWalletModalData:{walletConfig:M,chainType:r.chainType,connectOnly:i}}),s("WalletInterstitialScreen")):(y({installWalletModalData:{walletConfig:M,chainType:r.chainType,connectOnly:i}}),s("InstallWalletScreen"))}:"coinbase_wallet"!==r.connectorType||"eoaOnly"!==r.coinbaseWalletConfig.preference?.options||!f.isMobile||O||(0,w.q)()?()=>{if(!(0,x.r)(window.navigator.userAgent)||event?.isTrusted){if("mobile_wallet_adapter"===r.walletClientType)return h(r,_),void k(!0);h(r,_),i?"wallet_connect_v2"===r.connectorType?(y(e=>({...e,externalConnectWallet:{...e?.externalConnectWallet,preSelectedWalletId:"wallet_connect_qr"}})),s("ConnectOnlyLandingScreen")):s("ConnectOnlyStatusScreen"):s("ConnectionStatusScreen")}}:()=>{window.location.href=`https://go.cb-w.com/dapp?cb_url=${encodeURI(window.location.href)}`};let F=l||W?.metadata?.shortName||W?.name||r.walletClientType;return(0,n.jsxs)(b,{onClick:()=>{T||(C(!0),setTimeout(()=>C(!1),2e3),c())},disabled:T,children:[(0,n.jsx)(o.I,{icon:a||W?.image_url?.md,name:F}),(0,n.jsx)("span",{children:F}),(0,n.jsxs)(S,{id:"chip-container",children:[m?.walletClientType===_&&m?.chainType===r.chainType?(0,n.jsx)(j,{color:"gray",children:"Recent"}):(0,n.jsx)("span",{id:"connect-text",children:"Connect"}),"solana"===r.chainType&&(0,n.jsx)(j,{color:"gray",children:"Solana"})]})]})},b=(0,m.styled)(v.m)`
  /* Wallet name text color */
  > span {
    color: var(--privy-color-foreground);
  }

  /* Show "Connect" on hover */
  > #chip-container > #connect-text {
    font-weight: 500;
    color: var(--privy-color-accent);
    opacity: 0;
    transition: opacity 0.1s ease-out;
  }

  :hover > #chip-container > #connect-text {
    opacity: 1;
  }

  @media (max-width: 440px) {
    > #chip-container > #connect-text {
      display: none;
    }
  }
`,j=(0,m.styled)(r.C)`
  margin-left: auto;
`,S=m.styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
`,_=["coinbase_wallet","base_account"],$=["metamask","okx_wallet","rainbow","uniswap","bybit_wallet","ronin_wallet","haha_wallet","uniswap_extension","zerion","rabby_wallet","cryptocom","binance","kraken_wallet","robinhood_wallet"],k=["safe"],W=["phantom","backpack","solflare","jupiter","universal_profile"],O={component:()=>{let e,{connectors:o}=(0,p.u)(),{setModalData:r,data:f,navigate:m}=(0,u.u)(),w=(0,s.u)(),{wallets:x}=(0,y.u)(),T=o.filter(d.d).flatMap(e=>e.wallets),[b,j]=(0,t.useState)("default"),S="solana"===f?.funding?.chainType,O=!!f?.funding?.crossChainBridgingEnabled;e="ethereum"===f?.funding?.chainType?f.funding.erc20Address&&!f.funding.isUSDC?"ethereum-only":O&&!f.funding.chain.testnet?"ethereum-and-solana":"ethereum-only":O&&!f.funding?.isUSDC?"ethereum-and-solana":"solana-only";let F=x.filter(e=>"privy"!==e.walletClientType),D=F.map(e=>e.walletClientType),B=T.filter(e=>"privy"!==e.walletClientType),E=B.map(e=>e.walletClientType),A=[],L={...f.funding};L.usingDefaultFundingMethod&&(L.usingDefaultFundingMethod=!1);let I=({wallet:e,walletChainType:n})=>{r({...f,funding:{...L,connectedWallet:e,onContinueWithExternalWallet:()=>m(N({destChainType:S?"solana":"ethereum",sourceChainType:n}))},solanaFundingData:f?.solanaFundingData?{...f.solanaFundingData,sourceWalletData:{address:e.address,walletClientType:e.walletClientType}}:void 0}),m("FundingAmountEditScreen")};"solana-only"!==e&&A.push(...F.map((e,t)=>(0,n.jsx)(M,{onClick:()=>I({wallet:e,walletChainType:"ethereum"}),icon:e.meta.icon,name:e.meta.name,chainType:e.type},t))),"ethereum-only"!==e&&A.push(...B.map((e,t)=>(0,n.jsx)(M,{onClick:()=>I({wallet:e,walletChainType:"solana"}),icon:e.meta.icon,name:e.meta.name,chainType:e.type},t))),A.push(...(({walletList:e,walletChainType:t,connectors:l,connectOnly:a,ignore:i,walletConnectEnabled:o,forceWallet:r})=>{let c=[],s=[],d=[],p=l.filter(e=>"ethereum-only"===t?"ethereum"===e.chainType:"solana-only"!==t||"solana"===e.chainType),u=p.find(e=>"wallet_connect_v2"===e.connectorType);for(let[l,y]of(r?[r.wallet]:e).entries()){if("detected_ethereum_wallets"===y)for(let[e,t]of p.filter(({chainType:e,connectorType:n,walletClientType:t})=>"solana"!==e&&("uniswap_wallet_extension"===t||"uniswap_extension"===t?!i.includes("uniswap"):"crypto.com_wallet_extension"===t||"crypto.com_onchain"===t?!i.includes("cryptocom"):"injected"===n&&!i.includes(t))).entries()){let{walletClientType:i,walletBranding:o,chainType:r}=t;("unknown"===i?s:c).push((0,n.jsx)(C,{connectOnly:a,provider:i,logo:o.icon,displayName:o.name,connector:t},`${l}-${y}-${i}-${r}-${e}`))}if("detected_solana_wallets"===y)for(let[e,o]of p.filter(({chainType:e,walletClientType:n})=>{if("solana"===e)return"ethereum-only"!==t&&!i.includes(n)}).entries()){let{walletClientType:t,walletBranding:i,chainType:r}=o;("unknown"===t?s:c).push((0,n.jsx)(C,{connectOnly:a,provider:t,logo:i.icon,displayName:i.name,connector:o},`${l}-${y}-${t}-${r}-${e}`))}if(W.includes(y)){let e=p.find(e=>"injected"===e.connectorType&&e.walletClientType===y||e.connectorType===y);if(e&&c.push((0,n.jsx)(C,{connectOnly:a,provider:y,connector:e},`${l}-${y}`)),"solana-only"===t||"ethereum-and-solana"===t){let e=p.find(({chainType:e,walletClientType:n})=>"solana"===e&&n===y);e&&c.push((0,n.jsx)(C,{connectOnly:a,provider:y,connector:e},`${y}-solana`))}}else if($.includes(y)){let e=p.find(e=>"uniswap"===y?"uniswap_wallet_extension"===e.walletClientType||"uniswap_extension"===e.walletClientType:"cryptocom"===y?"crypto.com_wallet_extension"===e.walletClientType||"crypto.com_onchain"===e.walletClientType:"injected"===e.connectorType&&e.walletClientType===y);if(o&&!e&&(e=u),e&&c.push((0,n.jsx)(C,{connectOnly:a,provider:y,connector:e,logo:"injected"===e.connectorType?e.walletBranding.icon:void 0,displayName:"injected"===e.connectorType?e.walletBranding.name:void 0},`${l}-${y}`)),"solana-only"===t||"ethereum-and-solana"===t){let e=p.find(({chainType:e,walletClientType:n})=>"solana"===e&&n===y);e&&c.push((0,n.jsx)(C,{connectOnly:a,provider:y,connector:e},`${y}-solana`))}}else if(_.includes(y)){let e=p.find(({connectorType:e})=>e===y);e&&c.push((0,n.jsx)(C,{connectOnly:a,provider:y,connector:e,displayName:"coinbase_wallet"===e.walletClientType?"Coinbase":"Base",logo:"coinbase_wallet"===e.walletClientType?g.v:g.w},`${l}-${y}`))}else if(k.includes(y))u&&d.push((0,n.jsx)(C,{connectOnly:a,provider:y,connector:u},`${l}-${y}`));else if("wallet_connect"===y)u&&d.push((0,n.jsx)(C,{connectOnly:a,provider:y,connector:u,logo:u.walletBranding.icon,displayName:"WalletConnect"},`${l}-${y}`));else if(y===r?.wallet){let t="ethereum"===r.chainType&&e.includes("detected_ethereum_wallets"),i="solana"===r.chainType&&e.includes("detected_solana_wallets");if(t||i){let e=p.find(({walletClientType:e})=>e===y);e&&c.push((0,n.jsx)(C,{connectOnly:a,provider:y,displayName:e.walletBranding?.name,logo:e.walletBranding?.icon,connector:e},`${l}-${y}`))}}}return[...s,...c,...d]})({walletList:w.appearance.walletList.filter(e=>!F.some(n=>n.walletClientType===e)&&!B.some(n=>n.walletClientType===e)),walletChainType:e,connectors:o,connectOnly:!0,ignore:[...w.appearance.walletList,...D,...E],walletConnectEnabled:w.externalWallets.walletConnect.enabled}));let z=(0,n.jsx)(h.W,{text:"More wallets",onClick:()=>j("overflow")}),N=({sourceChainType:e,destChainType:n})=>"ethereum"===e&&"solana"===n?"AwaitingEvmToSolBridgingScreen":"ethereum"===e&&"ethereum"===n?"AwaitingExternalEthereumTransferScreen":"solana"===e&&"ethereum"===n?"AwaitingSolToEvmBridgingScreen":L.externalSolanaFundingScreen;return(0,t.useEffect)(()=>{r({...f,externalConnectWallet:{onCompleteNavigateTo:({address:e,walletClientType:n,walletChainType:t})=>{let l=t??"ethereum",a="ethereum"===l?F.find(t=>t.address===e&&t.walletClientType===n):B.find(t=>t.address===e&&t.walletClientType===n);return r({...f,funding:{...L,connectedWallet:a,onContinueWithExternalWallet:()=>{m(N({destChainType:S?"solana":"ethereum",sourceChainType:l}))}},solanaFundingData:f?.solanaFundingData?{...f.solanaFundingData,sourceWalletData:{address:e||"",walletClientType:n||""}}:void 0}),"FundingAmountEditScreen"}}})},[]),(0,n.jsxs)(n.Fragment,"overflow"===b?{children:[(0,n.jsx)(l.M,{backFn:()=>j("default")},"header"),(0,n.jsxs)(v.r,{children:[(0,n.jsx)(c.S,{style:{color:"var(--privy-color-foreground-3)",textAlign:"left"},children:"More wallets"}),A]}),(0,n.jsx)(l.B,{})]}:{children:[(0,n.jsx)(i.t,{}),(0,n.jsx)(a.C,{title:"Transfer from wallet",description:"Connect a wallet to deposit funds or send funds manually to your wallet address."}),(0,n.jsxs)(v.r,{children:[A.length>4?A.slice(0,3):A,A.length>4&&z]}),(0,n.jsx)(l.B,{})]})}},M=({onClick:e,icon:t,name:l,chainType:a})=>(0,n.jsxs)(v.m,{onClick:e,children:[(0,n.jsx)(T.I,{style:{width:20},children:(0,n.jsx)(o.I,{icon:t,name:l})}),l,(0,n.jsx)(r.C,{color:"gray",style:{marginLeft:"auto"},children:"Connected"}),"solana"===a&&(0,n.jsx)(r.C,{color:"gray",children:"Solana"})]});e.s(["TransferFromWalletScreen",0,O,"default",0,O])},133996,e=>{"use strict";var n=e.i(843476),t=e.i(131402),l=e.i(737577);e.s(["W",0,({onClick:e,text:a})=>(0,n.jsxs)(l.m,{onClick:e,children:[(0,n.jsx)(l.n,{children:(0,n.jsx)(t.Wallet,{})}),(0,n.jsx)(l.G,{children:a})]})])},103853,e=>{"use strict";var n=e.i(997053),t=e.i(837008),l=e.i(339484);let a=n.styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,i=n.styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    border-radius: var(--privy-border-radius-sm);
  }
`,o=n.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`,r=n.styled.div`
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
`;n.styled.div`
  font-size: 42px !important;
`;let c=n.styled.input`
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
`,s=(0,n.styled)(c)`
  && {
    font-size: 42px;
  }
`;n.styled.button`
  cursor: pointer;
  padding-left: 4px;
`;let d=n.styled.div`
  font-size: 18px;
`,p=n.styled.div`
  font-size: 12px;
  color: var(--privy-color-foreground-3);
  // we need this container to maintain a static height if there's no content
  height: 20px;
`;n.styled.div`
  display: flex;
  flex-direction: row;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  svg {
    margin-right: 6px;
    margin: auto;
  }
`,(0,n.styled)(l.LinkButton)`
  margin-top: 16px;
`;let u=n.keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;(0,n.styled)(t.d)`
  border-radius: var(--privy-border-radius-md) !important;
  animation: ${u} 0.3s ease-in-out;
`;let y=n.styled.div``,h=n.styled.a`
  && {
    color: var(--privy-color-accent);
  }

  cursor: pointer;
`;e.s(["F",0,o,"I",0,i,"a",0,r,"b",0,c,"c",0,d,"d",0,p,"e",0,a,"f",0,y,"g",0,h,"h",0,s])},131402,e=>{"use strict";let n=(0,e.i(773524).default)("wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);e.s(["Wallet",0,n],131402)}]);