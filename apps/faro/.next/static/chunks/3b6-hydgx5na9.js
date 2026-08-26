(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,393794,e=>{"use strict";var t=e.i(271645);let i=t.forwardRef(function({title:e,titleId:i,...a},n){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:n,"aria-labelledby":i},a),e?t.createElement("title",{id:i},e):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"}))});e.s(["default",0,i])},577299,e=>{"use strict";var t=e.i(843476),i=e.i(72903),a=e.i(271645),n=e.i(613089),r=e.i(291446),s=e.i(744902),o=e.i(696942),d=e.i(44979),l=e.i(810907),c=e.i(604677),u=e.i(938921),g=e.i(837008),f=e.i(810977),h=e.i(282975),p=e.i(632964),m=e.i(118364),v=e.i(662123),y=e.i(200314),x=e.i(595693),b=e.i(346146),S=e.i(349893),P=e.i(999863),w=e.i(377799),C=e.i(520475),T=e.i(385171),E=e.i(223606),F=e.i(458383),I=e.i(699852),U=e.i(435232),k=e.i(758356),N=e.i(438317);e.i(123287),e.i(33750),e.i(437206),e.i(610760);let A={component:()=>{let e=(0,m.u)(),{rpcConfig:A,appId:B,closePrivyModal:L,createAnalyticsEvent:D}=(0,x.u)(),{navigate:$,setModalData:j,data:M}=(0,b.u)(),R=(0,m.u)(),{wallets:q}=(0,P.u)(),[H,G]=(0,a.useState)(null),[W,O]=(0,a.useState)(null),[V,Z]=(0,a.useState)([]),[J,z]=(0,a.useState)(0),[Y,K]=(0,a.useState)(!1),[Q,X]=(0,a.useState)(!1),[_,ee]=(0,a.useState)(!1),[et,ei]=(0,a.useState)(!1),[ea,en]=(0,a.useState)(),[er,es]=(0,a.useState)();if(!M?.funding||"solana"!==M.funding.chainType)throw Error("Invalid funding data");let{address:eo,chain:ed,connectedWallet:el}=M.funding,[ec,eu]=(0,a.useState)(M.funding.amount),eg=("ethereum"===el?.type?el:void 0)??q[0],ef=(0,y.k)(eg?.walletClientType||"unknown"),eh=ef?.name||"wallet",[ep,em]=(0,a.useState)(null);(0,a.useEffect)(()=>{(async()=>{if(!eg)return;let e=await eg.getEthereumProvider();em((0,n.createWalletClient)({account:eg.address,transport:(0,r.custom)(e)}).extend(s.publicActions))})().catch(console.error)},[eg]);let[ev,ey]=(0,a.useState)(0n),ex=(0,F.g)(ev);(0,a.useEffect)(()=>{let t=e.solanaRpcs[ed];t?(0,T.p)({rpc:t.rpc,address:eo}).then(e=>ey(BigInt(e))).catch(console.error):console.warn("Unable to load solana rpc, skipping balance")},[]);let[eb,eS]=(0,a.useState)(),{tokenPrice:eP}=(0,S.u)("solana"),{fundingAmountInBaseUnit:ew,fundingAmountInUsd:eC}=(0,F.a)({amount:ec,fee:0n,tokenPrice:eP,isUsdc:M.funding.isUSDC});if((0,a.useEffect)(()=>{(async()=>{if(!ep||!eg)return;let e=["solana:testnet","solana:devnet"].includes(ed);e&&console.warn("Solana testnets are not supported for bridging");let t=(0,c.addToDefaultChains)(R.chains).filter(({testnet:t})=>!!t===e),i=(await (0,I.g)({chains:t,address:eg.address,appId:B,rpcConfig:A})).filter(e=>e.balance>0n);if(i.length<1)return void G(new v.P(`Wallet ${(0,U.d)(eg.address)} does not have enough funds.`,void 0,v.a.INSUFFICIENT_BALANCE));i.sort((e,t)=>Number(t.balance-e.balance));let a=(await Promise.allSettled(i.map(async e=>({...e,quote:await (0,C.g)({isTestnet:!1,input:(0,C.t)({appId:B,amount:ew.toString(),user:eg.address,recipient:eo,destinationChainId:C.c,destinationCurrency:C.b,originChainId:e.chain.id})})})))).filter(e=>"fulfilled"===e.status).map(e=>e.value);if(a.length<1)return void G(new v.P(`Unable to fetch quotes for bridging. Wallet ${(0,U.d)(eg.address)} does not have enough funds.`,void 0,v.a.INSUFFICIENT_BALANCE));let n=a.map(({quote:e,balance:t,chain:i})=>({bridgeTx:(0,C.a)(e),balance:t,chain:i,isErc20Quote:!1})).filter(({bridgeTx:e})=>!!e);if(n.length>1)return void Z(n);let r=n.at(0);r?(X(!0),eS({data:r.bridgeTx.data,to:r.bridgeTx.to,value:r.bridgeTx.value,chain:r.chain})):G(new v.P(`Unable to select bridge option from quotes. Wallet ${(0,U.d)(eg.address)} does not have enough funds.`,void 0,v.a.INSUFFICIENT_BALANCE))})().catch(console.error)},[ep]),(0,a.useEffect)(()=>{(async()=>{let e,t;if(!ep||!eg||Y||_||!eb)return;K(!0);let i=(0,o.createPublicClient)({chain:eb.chain,transport:(0,d.http)((0,k.a)(eb.chain,A,B))});try{e=await i.prepareTransactionRequest({account:eg.address,to:eb.to,chain:eb.chain,data:eb.data,value:BigInt(eb.value??0)})}catch(e){console.error(e),V.length>1&&O(e.shortMessage??"Something went wrong")}if(e){"eip1559"===e.type||"eip4844"===e.type||"eip7702"===e.type?void 0!==e.gasPrice&&delete e.gasPrice:("legacy"===e.type||"eip2930"===e.type)&&(void 0!==e.maxFeePerGas&&delete e.maxFeePerGas,void 0!==e.maxPriorityFeePerGas&&delete e.maxPriorityFeePerGas),K(!1),ee(!0);try{await ep.switchChain({id:eb.chain.id})}catch(e){await ep.addChain({chain:eb.chain}),await ep.switchChain({id:eb.chain.id})}try{t=await ep.sendTransaction(e)}catch(e){console.error(e),"TransactionExecutionError"===e.name&&(V.length<1?G(new v.P(e.shortMessage,void 0,v.a.TRANSACTION_FAILURE)):O(e.shortMessage??"Something went wrong"))}if(t)return await ep.waitForTransactionReceipt({hash:t}),Q?(es("pending"),void en(t)):(ee(!1),ei(!0),void D({eventName:w.O,payload:{provider:"external",status:"success",txHash:t,address:eg.address,chainId:eb.chain.id,chainType:"ethereum",value:eb.value?(0,l.formatUnits)(BigInt(eb.value),18):void 0,token:"ETH",destination:eo,destinationClusterName:"mainnet-beta",destinationChainType:"solana",destinationValue:(0,l.formatUnits)(ew,9),destinationToken:"SOL"}}));ee(!1)}else K(!1)})().catch(console.error)},[ep,eb]),(0,C.u)({transactionHash:ea,isTestnet:!1,bridgingStatus:er,setBridgingStatus:es,onSuccess({transactionHash:e}){X(!1),ei(!0),D({eventName:w.O,payload:{provider:"external",status:"success",txHash:e,address:eg?.address,chainId:eb?.chain.id,chainType:"ethereum",value:eb?.value?(0,l.formatUnits)(BigInt(eb.value),18):void 0,token:"ETH",destination:eo,destinationClusterName:"mainnet-beta",destinationChainType:"solana",destinationValue:(0,l.formatUnits)(ew,9),destinationToken:"SOL"}})},onFailure({error:e}){X(!1),G(e)}}),(0,a.useEffect)(()=>{H&&(j({funding:M?.funding,solanaFundingData:M?.solanaFundingData,sendTransaction:M?.sendTransaction,errorModalData:{error:H,previousScreen:"TransferFromWalletScreen"}}),$("ErrorScreen",!1))},[H]),(0,a.useEffect)(()=>{if(!et)return;let e=setTimeout(L,m.v);return()=>clearTimeout(e)},[et]),et)return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(h.t,{}),(0,t.jsx)(u.b,{}),(0,t.jsxs)(u.c,{children:[(0,t.jsx)(i.default,{color:"var(--privy-color-success)",width:"64px",height:"64px"}),(0,t.jsx)(f.C,{title:"Success!",description:`You’ve successfully added ${ec} SOL to your ${R.name} wallet. It may take a minute before the funds are available to use.`})]}),(0,t.jsx)(u.R,{}),(0,t.jsx)(g.B,{})]});let eT=V[J];return V.length>1&&eT?(0,t.jsx)(I.B,{displayName:eh,configuredFundingChain:ed,formattedBalance:ex,fundingAmount:ec,fundingCurrency:"SOL",fundingAmountInUsd:eC,options:V,selectedOption:eT,isPreparing:Y,isSubmitting:_,addressToFund:eo,fundingWalletAddress:eg?.address||"",errorMessage:W,onSubmit:()=>{M.funding?.amount!==ec?(async function(){if(eg&&eT)try{let e=await (0,C.g)({isTestnet:!1,input:(0,C.t)({appId:B,amount:ew.toString(),user:eg.address,recipient:eo,destinationChainId:C.c,destinationCurrency:C.b,originChainId:eT.chain.id})}),t=(0,C.a)(e);if(!t)throw Error("Invalid transaction request");X(!0),eS({data:t.data,to:t.to,value:t.value,chain:eT.chain})}catch(e){console.error(e),G(new v.P("Unable to fetch quotes for bridging",e,v.a.INSUFFICIENT_BALANCE))}})().catch(console.error):eS({to:eT.bridgeTx.to,data:eT.bridgeTx.data,value:eT.bridgeTx.value,chain:eT.chain})},onSelect:e=>{e!==J&&(O(null),z(e))},onAmountChange:eu}):_&&eg?(0,t.jsx)(N.T,{walletClientType:eg?.walletClientType||"unknown",displayName:eh,addressToFund:eo,isBridging:Q,isErc20Flow:!1,chainId:"solana",chainName:(0,E.g)(ed),totalPriceInUsd:void 0,totalPriceInNativeCurrency:void 0,gasPriceInUsd:void 0,gasPriceInNativeCurrency:void 0}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(h.t,{}),(0,t.jsx)(p.N,{}),(0,t.jsx)("div",{style:{marginTop:"1rem"}}),(0,t.jsx)(g.B,{})]})}};e.s(["AwaitingEvmToSolBridgingScreen",0,A,"default",0,A])},938921,e=>{"use strict";var t=e.i(997053);let i=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
  flex-grow: 100;
`,a=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
`,n=t.styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`,r=(0,t.styled)(a)`
  padding: 20px 0;
`,s=(0,t.styled)(a)`
  gap: 16px;
`,o=t.styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`,d=t.styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;t.styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;let l=t.styled.div`
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
`,c=t.styled.div`
  height: 16px;
`,u=t.styled.div`
  height: 12px;
`;t.styled.div`
  position: relative;
`;let g=t.styled.div`
  height: ${e=>e.height??"12"}px;
`;t.styled.div`
  background-color: var(--privy-color-accent);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-color: white;
  border-width: 2px !important;
`,e.s(["B",0,i,"C",0,r,"F",0,o,"H",0,n,"R",0,u,"S",0,l,"a",0,d,"b",0,c,"c",0,s,"d",0,g,"e",0,a])},274584,e=>{"use strict";var t=e.i(742741),i=e.i(595693),a=e.i(435232);let n=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2}),r=(e,i=6,a=!1)=>{let n=parseFloat((0,t.formatEther)(e)).toFixed(i).replace(/0+$/,"").replace(/\.$/,"");return a?n:`${"0"===n?"<0.001":n}`};e.s(["a",0,(e,i)=>{let a,r=(a=i*parseFloat((0,t.formatEther)(e)),n.format(a));return"$0.00"===r?"<$0.01":r},"b",0,(e,t)=>{let{chains:n}=(0,i.u)(),r=`https://etherscan.io/address/${t}`,s=`${(0,a.y)(e,n)}/address/${t}`;try{new URL(s)}catch{return r}return s},"c",0,(e,t)=>{let i,a=(i=t*parseFloat(e),n.format(i));return"$0.00"!==a?a:"<$0.01"},"g",0,(e,t,i=6,a=!1)=>`${r(e,i,a)} ${t}`,"p",0,r,"s",0,e=>e.reduce((e,t)=>e+t,0n)])},640694,e=>{"use strict";let t=new Intl.NumberFormat(void 0,{style:"currency",currency:"USD",maximumFractionDigits:2});e.s(["A",0,"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL","D",0,{"solana:mainnet":{EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v:{symbol:"USDC",decimals:6,address:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB:{symbol:"USDT",decimals:6,address:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:devnet":{"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU":{symbol:"USDC",decimals:6,address:"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"},EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS:{symbol:"USDT",decimals:6,address:"EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"},So11111111111111111111111111111111111111112:{symbol:"SOL",decimals:9,address:"So11111111111111111111111111111111111111112"}},"solana:testnet":{}},"J",0,["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"],"L",0,1e9,"R",0,["CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C","CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW"],"S",0,"11111111111111111111111111111111","T",0,"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA","a",0,"TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb","g",0,function(e,i){let a=parseFloat(e.toString())/1e9,n=t.format(i*a);return"$0.00"===n?"<$0.01":n}])},458383,e=>{"use strict";var t=e.i(640694);function i(e,t=6,a=!1,n=!1){let r=(parseFloat(e.toString())/1e9).toFixed(t).replace(/0+$/,"").replace(/\.$/,""),s=n?"":" SOL";return a?`${r}${s}`:`${"0"===r?"<0.001":r}${s}`}e.s(["a",0,function({amount:e,fee:a,tokenPrice:n,isUsdc:r}){let s=BigInt(Math.floor(parseFloat(e)*10**(r?6:9))),o=r?s:s+a;return{fundingAmountInBaseUnit:s,fundingAmountInUsd:n?(0,t.g)(s,n):void 0,totalPriceInUsd:n?(0,t.g)(o,n):void 0,totalPriceInNativeCurrency:i(o),feePriceInNativeCurrency:i(a),feePriceInUsd:n?(0,t.g)(a,n):void 0}},"g",0,i])},220242,e=>{"use strict";var t=e.i(271645),i=e.i(595693);e.s(["u",0,({enabled:e=!0}={})=>{let{showFiatPrices:a,getUsdPriceForSol:n}=(0,i.u)(),[r,s]=(0,t.useState)(!0),[o,d]=(0,t.useState)(void 0),[l,c]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{(async()=>{if(a&&e)try{s(!0);let e=await n();e?c(e):d(Error("Unable to fetch SOL price"))}catch(e){d(e)}finally{s(!1)}else s(!1)})()},[]),{solPrice:l,isSolPriceLoading:r,solPriceError:o}}])},349893,e=>{"use strict";var t=e.i(271645),i=e.i(604677),a=e.i(118364),n=e.i(595693),r=e.i(220242);e.s(["u",0,function(e){let{tokenPrice:s,isTokenPriceLoading:o,tokenPriceError:d}=(e=>{let{showFiatPrices:r,getUsdTokenPrice:s,chains:o}=(0,n.u)(),[d,l]=(0,t.useState)(!0),[c,u]=(0,t.useState)(void 0),[g,f]=(0,t.useState)(void 0);return(0,t.useEffect)(()=>{e||=a.t;let t=(0,i.addToDefaultChains)(o).find(t=>t.id===Number(e));(async()=>{if(r){if(!t)return l(!1),u(Error(`Unable to fetch token price on chain id ${e}`));try{l(!0);let e=await s(t);e?f(e):u(Error(`Unable to fetch token price on chain id ${t.id}`))}catch(e){u(e)}finally{l(!1)}}else l(!1)})()},[e]),{tokenPrice:g,isTokenPriceLoading:d,tokenPriceError:c}})("solana"===e?-1:e),{solPrice:l,isSolPriceLoading:c,solPriceError:u}=(0,r.u)({enabled:"solana"===e});return"solana"===e?{tokenPrice:l,isTokenPriceLoading:c,tokenPriceError:u}:{tokenPrice:s,isTokenPriceLoading:o,tokenPriceError:d}}])}]);