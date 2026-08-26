// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console2} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {FaroPMM} from "../src/FaroPMM.sol";
import {FaroRouter} from "../src/FaroRouter.sol";
import {ICurveTwocrypto} from "../src/interfaces/ICurveTwocrypto.sol";
import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

/// forge test --match-contract Fork --fork-url $ARBITRUM_RPC_URL
contract ForkTest is Test {
    address constant CURVE = 0x356D349dA9ADd7Efb56a35fAB939A2c6D852f853;
    address constant ARGT = 0x59863989d080B22476DB95656d0C3CC18be92214;
    address constant USDT0 = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9;
    address constant MEXT = 0xb96aA6babCcD738d6644ADd4912fE5eFbEBF5a25;
    address constant PYTH = 0xff1a0f4744e8582DF1aE09D5611b887B6a12925C;
    bytes32 constant FEED = 0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66049d30570dc866b77ca;
    address owner = address(0xA11CE);
    address user = address(0xB0B);
    FaroPMM pmm;
    FaroRouter router;

    function setUp() public {
        vm.createSelectFork(vm.envString("ARBITRUM_RPC_URL"));
        // En el fork no podemos publicar un update firmado de Pyth: mockeamos la lectura "fresca" con el último precio on-chain.
        PythStructs.Price memory last = IPyth(PYTH).getPriceUnsafe(FEED);
        last.publishTime = block.timestamp;
        vm.mockCall(PYTH, abi.encodeWithSelector(IPyth.getPriceNoOlderThan.selector, FEED, uint256(600)), abi.encode(last));
        pmm = new FaroPMM(MEXT, USDT0, 6, PYTH, FEED, 0.05e18, 40, 600, 100, 0, owner);
        router = new FaroRouter(CURVE, payable(address(pmm)));
        deal(MEXT, owner, 50_000e18);
        vm.startPrank(owner);
        IERC20(MEXT).approve(address(pmm), type(uint256).max);
        pmm.deposit(50_000e18, 0, true);
        vm.stopPrank();
        deal(ARGT, user, 5_000_000e18);
        vm.startPrank(user);
        IERC20(ARGT).approve(address(router), type(uint256).max);
        IERC20(MEXT).approve(address(router), type(uint256).max);
        vm.stopPrank();
    }

    function test_argtToMextAndBack() public {
        bytes[] memory none;
        (uint256 q, uint256 usdt, uint256 i, uint256 age) = router.quoteArgtToMext(1_000_000e18);
        console2.log("1M ARGt -> USDT0 (Curve):", usdt);
        console2.log("-> MEXt (PMM):", q);
        console2.log("oracle USD/MEXt 1e18:", i, "age s:", age);
        (uint256 ref,) = router.referenceArgtPerMext();
        console2.log("ref ARGt per MEXt 1e18:", ref);
        vm.prank(user);
        uint256 got = router.swapArgtToMext(1_000_000e18, (q * 99) / 100, block.timestamp + 60, none);
        assertGe(got, (q * 99) / 100);
        assertEq(IERC20(MEXT).balanceOf(user), got);
        vm.prank(user);
        uint256 back = router.swapMextToArgt(got, 0, block.timestamp + 60, none);
        console2.log("MEXt back to ARGt:", back);
        assertLt(back, 1_000_000e18); // fees de Curve x2 + PMM x2
        assertGt(back, 970_000e18); // pero cerca
    }
}
