// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {MockPyth} from "@pythnetwork/pyth-sdk-solidity/MockPyth.sol";
import {FaroPMM} from "../src/FaroPMM.sol";
import {PMMPricing} from "../src/PMMPricing.sol";

contract Token is ERC20 {
    uint8 private immutable _d;

    constructor(string memory n, uint8 d) ERC20(n, n) {
        _d = d;
    }

    function decimals() public view override returns (uint8) {
        return _d;
    }

    function mint(address to, uint256 a) external {
        _mint(to, a);
    }
}

contract FaroPMMTest is Test {
    Token mext;
    Token usdt;
    MockPyth pyth;
    FaroPMM pmm;
    bytes32 constant FEED = 0xe13b1c1ffb32f34e1be9545583f01ef385fde7f42ee66049d30570dc866b77ca;
    address owner = address(0xA11CE);
    address user = address(0xB0B);
    int64 constant MXN_PER_USD = 1694619; // expo -5 → 16.94619

    function setUp() public {
        mext = new Token("MEXt", 18);
        usdt = new Token("USDT0", 6);
        pyth = new MockPyth(60, 1);
        pmm = new FaroPMM(address(mext), address(usdt), 6, address(pyth), FEED, 0.05e18, 40, 60, 50, 2_500e18, owner);
        _publish(MXN_PER_USD, 20, block.timestamp);
        // seed: 200k MEXt, sin quote
        mext.mint(owner, 200_000e18);
        vm.startPrank(owner);
        mext.approve(address(pmm), type(uint256).max);
        pmm.deposit(200_000e18, 0, true);
        vm.stopPrank();
        usdt.mint(user, 100_000e6);
        mext.mint(user, 100_000e18);
        vm.startPrank(user);
        usdt.approve(address(pmm), type(uint256).max);
        mext.approve(address(pmm), type(uint256).max);
        vm.stopPrank();
        vm.deal(user, 1 ether);
    }

    function _publish(int64 price, uint64 conf, uint256 ts) internal {
        bytes memory data = pyth.createPriceFeedUpdateData(FEED, price, conf, -5, price, conf, uint64(ts));
        bytes[] memory arr = new bytes[](1);
        arr[0] = data;
        pyth.updatePriceFeeds{value: 1}(arr);
    }

    function _update(int64 price) internal view returns (bytes[] memory arr) {
        arr = new bytes[](1);
        arr[0] = pyth.createPriceFeedUpdateData(FEED, price, 20, -5, price, 20, uint64(block.timestamp));
    }

    function test_oraclePriceIsUsdPerMext() public view {
        (, uint256 i,) = pmm.midPrice();
        // 1e18 * 1e5 / 1694619 ≈ 0.05901e18
        assertApproxEqRel(i, 0.059010e18, 0.001e18);
    }

    function test_buyMextNearOracleWhenBalanced() public {
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        uint256 out = pmm.sellQuote{value: 1}(100e6, 0, user, u); // 100 USDT0
        // 100 USD ≈ 1694.6 MEXt menos fee 0,4 % y un poco de slippage por k
        assertGt(out, 1680e18);
        assertLt(out, 1694.6e18);
        (uint256 b, uint256 q,,,) = pmm.state();
        assertEq(q, 100e6);
        assertEq(b, 200_000e18 - out);
    }

    function test_priceRisesAsInventoryDepletes() public {
        (uint256 o1,,) = pmm.quoteSellQuote(100e6);
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        pmm.sellQuote{value: 1}(2_500e6, 0, user, u);
        bytes[] memory u2 = _update(MXN_PER_USD);
        vm.prank(user);
        pmm.sellQuote{value: 1}(2_500e6, 0, user, u2); // ~40 % del inventario en dos operaciones
        (uint256 o2,,) = pmm.quoteSellQuote(100e6);
        assertLt(o2, o1); // mismos 100 USD compran menos MEXt
        (uint256 mid, uint256 i,) = pmm.midPrice();
        assertGt(mid, i); // precio medio por encima del oráculo
    }

    function test_roundTripLeavesPoolRicher() public {
        vm.startPrank(user);
        uint256 got = pmm.sellQuote{value: 1}(1_000e6, 0, user, _update(MXN_PER_USD));
        uint256 back = pmm.sellBase{value: 1}(got, 0, user, _update(MXN_PER_USD));
        vm.stopPrank();
        assertLt(back, 1_000e6); // fee + curva: el usuario no gana plata gratis
        (uint256 b, uint256 q,,,) = pmm.state();
        assertGe(b, 200_000e18 - 1); // el pool recupera su base
        assertEq(q, 1_000e6 - back);
    }

    function test_monotonicOutput(uint96 a, uint96 b) public view {
        uint256 x = bound(a, 1e6, 3_000e6);
        uint256 y = bound(b, 1e6, 3_000e6);
        if (x > y) (x, y) = (y, x);
        (uint256 ox,,) = pmm.quoteSellQuote(x);
        (uint256 oy,,) = pmm.quoteSellQuote(y);
        assertLe(ox, oy);
    }

    function test_revertsOnStaleOracle() public {
        vm.warp(block.timestamp + 120);
        bytes[] memory none;
        vm.prank(user);
        vm.expectRevert();
        pmm.sellQuote(100e6, 0, user, none);
    }

    function test_revertsOnWideConfidence() public {
        vm.warp(block.timestamp + 1); // MockPyth solo aplica updates más nuevos que el último
        bytes[] memory arr = new bytes[](1);
        arr[0] = pyth.createPriceFeedUpdateData(FEED, MXN_PER_USD, 20_000, -5, MXN_PER_USD, 20_000, uint64(block.timestamp));
        vm.prank(user);
        vm.expectRevert(FaroPMM.StaleOrWideOracle.selector);
        pmm.sellQuote{value: 1}(100e6, 0, user, arr);
    }

    function test_slippageGuard() public {
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        vm.expectRevert(FaroPMM.SlippageExceeded.selector);
        pmm.sellQuote{value: 1}(100e6, 10_000e18, user, u);
    }

    function test_tradeCapRejectsLargeSwap() public {
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        vm.expectRevert(FaroPMM.TradeTooLarge.selector);
        pmm.sellQuote{value: 1}(2_501e6, 0, user, u);
        bytes[] memory u2 = _update(MXN_PER_USD);
        vm.prank(user);
        uint256 got = pmm.sellQuote{value: 1}(2_500e6, 0, user, u2);
        assertGt(got, 0);
    }

    function test_capOnSellBase() public {
        // con USDT0 objetivo en el pool, una venta de MEXt que valga más que el tope revierte
        usdt.mint(owner, 5_000e6);
        vm.startPrank(owner);
        usdt.approve(address(pmm), type(uint256).max);
        pmm.deposit(0, 5_000e6, true);
        vm.stopPrank();
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        vm.expectRevert(FaroPMM.TradeTooLarge.selector);
        pmm.sellBase{value: 1}(60_000e18, 0, user, u); // ≈ US$ 3.540 > tope de 2.500
    }

    function test_cannotDrainBase() public {
        vm.prank(owner);
        pmm.setParams(0.05e18, 40, 60, 50, 0); // sin tope: la curva sola debe impedir el vaciado
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        uint256 got = pmm.sellQuote{value: 1}(100_000e6, 0, user, u);
        assertLt(got, 200_000e18);
        (uint256 b,,,,) = pmm.state();
        assertGt(b, 0);
        (uint256 mid, uint256 i,) = pmm.midPrice();
        assertGt(mid, 2 * i);
    }

    function test_feeAccruesToPool() public {
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        pmm.sellQuote{value: 1}(100e6, 0, user, u);
        bytes[] memory u2 = _update(MXN_PER_USD);
        vm.prank(user);
        pmm.sellBase{value: 1}(1_000e18, 0, user, u2);
        // valor del pool en USD (a oráculo) >= valor inicial: fees retenidos
        (uint256 b, uint256 q,,,) = pmm.state();
        (, uint256 i,) = pmm.midPrice();
        uint256 valueNow = (b * i) / 1e18 / 1e12 + q;
        uint256 valueStart = (200_000e18 * i) / 1e18 / 1e12;
        assertGe(valueNow, valueStart);
    }

    function test_pauseAndOwner() public {
        vm.prank(owner);
        pmm.pause();
        bytes[] memory u = _update(MXN_PER_USD);
        vm.prank(user);
        vm.expectRevert();
        pmm.sellQuote{value: 1}(100e6, 0, user, u);
        vm.prank(user);
        vm.expectRevert();
        pmm.setParams(0.2e18, 40, 60, 50, 0);
    }
}
