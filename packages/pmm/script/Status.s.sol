// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {FaroPMM} from "../src/FaroPMM.sol";
import {FaroRouter} from "../src/FaroRouter.sol";
import {PMMPricing} from "../src/PMMPricing.sol";

/// forge script script/Status.s.sol --rpc-url arbitrum  (env: PMM, ROUTER)
contract Status is Script {
    function run() external view {
        FaroPMM pmm = FaroPMM(payable(vm.envAddress("PMM")));
        FaroRouter router = FaroRouter(payable(vm.envAddress("ROUTER")));
        _inventory(pmm);
        _prices(pmm, router);
        console2.log("k / feeBps / maxAge", pmm.k(), pmm.feeBps(), pmm.maxAge());
        console2.log("maxTradeQuote 1e18", pmm.maxTradeQuote());
        console2.log("paused", pmm.paused());
    }

    function _inventory(FaroPMM pmm) internal view {
        (uint256 b, uint256 q, uint256 b0, uint256 q0, PMMPricing.RState r) = pmm.state();
        console2.log("B  (MEXt 1e18)", b);
        console2.log("Q  (USDT0 raw)", q);
        console2.log("B0 / Q0", b0, q0);
        console2.log("R (0: =1, 1: >1, 2: <1)", uint256(r));
    }

    function _prices(FaroPMM pmm, FaroRouter router) internal view {
        (uint256 mid, uint256 i, uint256 age) = pmm.midPrice();
        console2.log("oracle USD/MEXt 1e18", i, "age s", age);
        console2.log("mid    USD/MEXt 1e18", mid);
        (uint256 ref,) = router.referenceArgtPerMext();
        console2.log("ref ARGt/MEXt 1e18", ref);
        (uint256 out, uint256 usdt,,) = router.quoteArgtToMext(1_000e18);
        console2.log("1000 ARGt -> USDT0 raw -> MEXt", usdt, out);
    }
}
