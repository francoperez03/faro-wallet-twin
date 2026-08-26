// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ICurveTwocrypto} from "./interfaces/ICurveTwocrypto.sol";
import {FaroPMM} from "./FaroPMM.sol";

/**
 * @title FaroRouter
 * @notice ARGt ↔ USDT0 (Curve twocrypto) ↔ MEXt (FaroPMM) en una sola transacción. Nunca retiene fondos.
 */
contract FaroRouter is ReentrancyGuard {
    using SafeERC20 for IERC20;

    ICurveTwocrypto public immutable CURVE;
    FaroPMM public immutable PMM;
    IERC20 public immutable ARGT;
    IERC20 public immutable USDT0;
    IERC20 public immutable MEXT;
    uint256 private constant ARGT_INDEX = 0;
    uint256 private constant USDT0_INDEX = 1;

    error Expired();
    error NotOwner();

    modifier checkDeadline(uint256 deadline) {
        if (block.timestamp > deadline) revert Expired();
        _;
    }

    constructor(address curve_, address payable pmm_) {
        CURVE = ICurveTwocrypto(curve_);
        PMM = FaroPMM(pmm_);
        ARGT = IERC20(CURVE.coins(ARGT_INDEX));
        USDT0 = IERC20(CURVE.coins(USDT0_INDEX));
        MEXT = PMM.BASE();
        require(address(USDT0) == address(PMM.QUOTE()), "QUOTE_MISMATCH");
        ARGT.forceApprove(curve_, type(uint256).max);
        USDT0.forceApprove(curve_, type(uint256).max);
        USDT0.forceApprove(pmm_, type(uint256).max);
        MEXT.forceApprove(pmm_, type(uint256).max);
    }

    /// @notice ARGt → USDT0 (Curve) → MEXt (PMM). msg.value cubre el fee de Pyth; el sobrante vuelve.
    function swapArgtToMext(uint256 argtIn, uint256 minMextOut, uint256 deadline, bytes[] calldata pythUpdate)
        external
        payable
        nonReentrant
        checkDeadline(deadline)
        returns (uint256 mextOut)
    {
        ARGT.safeTransferFrom(msg.sender, address(this), argtIn);
        uint256 usdt = CURVE.exchange(ARGT_INDEX, USDT0_INDEX, argtIn, 0, address(this));
        mextOut = PMM.sellQuote{value: msg.value}(usdt, minMextOut, msg.sender, pythUpdate);
        _refund();
    }

    /// @notice MEXt → USDT0 (PMM) → ARGt (Curve).
    function swapMextToArgt(uint256 mextIn, uint256 minArgtOut, uint256 deadline, bytes[] calldata pythUpdate)
        external
        payable
        nonReentrant
        checkDeadline(deadline)
        returns (uint256 argtOut)
    {
        MEXT.safeTransferFrom(msg.sender, address(this), mextIn);
        uint256 usdt = PMM.sellBase{value: msg.value}(mextIn, 0, address(this), pythUpdate);
        argtOut = CURVE.exchange(USDT0_INDEX, ARGT_INDEX, usdt, minArgtOut, msg.sender);
        _refund();
    }

    function swapUsdt0ToMext(uint256 usdtIn, uint256 minMextOut, uint256 deadline, bytes[] calldata pythUpdate)
        external
        payable
        nonReentrant
        checkDeadline(deadline)
        returns (uint256 mextOut)
    {
        USDT0.safeTransferFrom(msg.sender, address(this), usdtIn);
        mextOut = PMM.sellQuote{value: msg.value}(usdtIn, minMextOut, msg.sender, pythUpdate);
        _refund();
    }

    function swapMextToUsdt0(uint256 mextIn, uint256 minUsdtOut, uint256 deadline, bytes[] calldata pythUpdate)
        external
        payable
        nonReentrant
        checkDeadline(deadline)
        returns (uint256 usdtOut)
    {
        MEXT.safeTransferFrom(msg.sender, address(this), mextIn);
        usdtOut = PMM.sellBase{value: msg.value}(mextIn, minUsdtOut, msg.sender, pythUpdate);
        _refund();
    }

    // ============ cotizaciones (preview, último precio on-chain) ============

    function quoteArgtToMext(uint256 argtIn)
        external
        view
        returns (uint256 mextOut, uint256 usdtMid, uint256 oraclePrice, uint256 oracleAge)
    {
        usdtMid = CURVE.get_dy(ARGT_INDEX, USDT0_INDEX, argtIn);
        (mextOut, oraclePrice, oracleAge) = PMM.quoteSellQuote(usdtMid);
    }

    function quoteMextToArgt(uint256 mextIn)
        external
        view
        returns (uint256 argtOut, uint256 usdtMid, uint256 oraclePrice, uint256 oracleAge)
    {
        (usdtMid, oraclePrice, oracleAge) = PMM.quoteSellBase(mextIn);
        argtOut = CURVE.get_dy(USDT0_INDEX, ARGT_INDEX, usdtMid);
    }

    /// @notice Precio cruzado de referencia ARGt por MEXt = (ARGt por USD, Curve) × (USD por MEXt, Pyth).
    function referenceArgtPerMext() external view returns (uint256 argtPerMext, uint256 oracleAge) {
        uint256 argtPerUsd = CURVE.price_oracle(); // 1e18
        (, uint256 usdPerMext, uint256 age) = PMM.midPrice();
        argtPerMext = (argtPerUsd * usdPerMext) / 1e18;
        oracleAge = age;
    }

    /// @notice Rescata ETH que alguien mandó directo al router. Solo el owner del PMM.
    function sweepEth(address payable to) external {
        if (msg.sender != PMM.owner()) revert NotOwner();
        to.transfer(address(this).balance);
    }

    function _refund() internal {
        uint256 bal = address(this).balance;
        if (bal > 0) {
            (bool ok,) = msg.sender.call{value: bal}("");
            require(ok, "REFUND");
        }
    }

    receive() external payable {}
}
