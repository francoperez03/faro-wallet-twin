// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable, Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import {DecimalMath} from "./PMMMath.sol";
import {PMMPricing} from "./PMMPricing.sol";

/**
 * @title FaroPMM
 * @notice Market maker proactivo (DODO v2) para base=MEXt / quote=USDT0, anclado al oráculo Pyth USD/MXN.
 *         Faro aporta inventario (idealmente solo MEXt); el precio se aleja del oráculo en función del
 *         desvío del inventario respecto de su objetivo (parámetro k). El fee queda en el pool.
 * @dev    Las cantidades de quote se normalizan internamente a 1e18 (USDT0 tiene 6 decimales).
 */
contract FaroPMM is Ownable2Step, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable BASE; // MEXt, 18 dec
    IERC20 public immutable QUOTE; // USDT0, 6 dec
    uint256 public immutable QUOTE_SCALE; // 10^(18 - quoteDecimals)
    IPyth public immutable PYTH;
    bytes32 public immutable FEED_ID; // USD/MXN

    // parámetros
    uint256 public k; // 1e18, (0, 1]
    uint256 public feeBps; // sobre el output
    uint256 public maxAge; // segundos
    uint256 public maxConfBps; // conf/price máximo aceptado

    // estado (quote en 1e18)
    uint256 public B;
    uint256 public Q;
    uint256 public B0;
    uint256 public Q0;
    PMMPricing.RState public R;

    event Swap(
        address indexed sender,
        address indexed to,
        bool sellBase,
        uint256 amountIn,
        uint256 amountOut,
        uint256 oraclePrice,
        uint256 fee
    );
    event Params(uint256 k, uint256 feeBps, uint256 maxAge, uint256 maxConfBps);
    event Inventory(uint256 B, uint256 Q, uint256 B0, uint256 Q0, PMMPricing.RState R);

    error StaleOrWideOracle();
    error SlippageExceeded();
    error InsufficientInventory();
    error BadParams();

    constructor(
        address base_,
        address quote_,
        uint8 quoteDecimals,
        address pyth_,
        bytes32 feedId_,
        uint256 k_,
        uint256 feeBps_,
        uint256 maxAge_,
        uint256 maxConfBps_,
        address owner_
    ) Ownable(owner_) {
        BASE = IERC20(base_);
        QUOTE = IERC20(quote_);
        QUOTE_SCALE = 10 ** (18 - quoteDecimals);
        PYTH = IPyth(pyth_);
        FEED_ID = feedId_;
        _setParams(k_, feeBps_, maxAge_, maxConfBps_);
    }

    // ============ swaps ============

    /// @notice Vende `baseIn` MEXt y recibe USDT0 (raw). `pythUpdate` viene de Hermes; el fee de Pyth va en msg.value.
    function sellBase(uint256 baseIn, uint256 minQuoteOut, address to, bytes[] calldata pythUpdate)
        external
        payable
        nonReentrant
        whenNotPaused
        returns (uint256 quoteOut)
    {
        uint256 i = _freshPrice(pythUpdate);
        PMMPricing.PMMState memory s = _state(i);
        (uint256 grossOut, PMMPricing.RState newR) = PMMPricing.sellBaseToken(s, baseIn);
        uint256 fee = (grossOut * feeBps) / 10_000;
        uint256 netOut = grossOut - fee;
        if (netOut > Q) revert InsufficientInventory();
        quoteOut = netOut / QUOTE_SCALE;
        if (quoteOut < minQuoteOut) revert SlippageExceeded();

        BASE.safeTransferFrom(msg.sender, address(this), baseIn);
        QUOTE.safeTransfer(to, quoteOut);
        B += baseIn;
        Q -= quoteOut * QUOTE_SCALE;
        _settle(newR);
        emit Swap(msg.sender, to, true, baseIn, quoteOut, i, fee / QUOTE_SCALE);
    }

    /// @notice Vende `quoteIn` USDT0 (raw) y recibe MEXt.
    function sellQuote(uint256 quoteIn, uint256 minBaseOut, address to, bytes[] calldata pythUpdate)
        external
        payable
        nonReentrant
        whenNotPaused
        returns (uint256 baseOut)
    {
        uint256 i = _freshPrice(pythUpdate);
        PMMPricing.PMMState memory s = _state(i);
        (uint256 grossOut, PMMPricing.RState newR) = PMMPricing.sellQuoteToken(s, quoteIn * QUOTE_SCALE);
        uint256 fee = (grossOut * feeBps) / 10_000;
        baseOut = grossOut - fee;
        if (baseOut > B) revert InsufficientInventory();
        if (baseOut < minBaseOut) revert SlippageExceeded();

        QUOTE.safeTransferFrom(msg.sender, address(this), quoteIn);
        BASE.safeTransfer(to, baseOut);
        Q += quoteIn * QUOTE_SCALE;
        B -= baseOut;
        _settle(newR);
        emit Swap(msg.sender, to, false, quoteIn, baseOut, i, fee);
    }

    // ============ views (usan el último precio on-chain, para preview) ============

    function quoteSellBase(uint256 baseIn)
        external
        view
        returns (uint256 quoteOut, uint256 oraclePrice, uint256 oracleAge)
    {
        (oraclePrice, oracleAge) = _lastPrice();
        (uint256 grossOut,) = PMMPricing.sellBaseToken(_state(oraclePrice), baseIn);
        quoteOut = (grossOut - (grossOut * feeBps) / 10_000) / QUOTE_SCALE;
    }

    function quoteSellQuote(uint256 quoteIn)
        external
        view
        returns (uint256 baseOut, uint256 oraclePrice, uint256 oracleAge)
    {
        (oraclePrice, oracleAge) = _lastPrice();
        (uint256 grossOut,) = PMMPricing.sellQuoteToken(_state(oraclePrice), quoteIn * QUOTE_SCALE);
        baseOut = grossOut - (grossOut * feeBps) / 10_000;
    }

    /// @notice Precio medio actual del PMM (quote por base, 1e18) y el del oráculo.
    function midPrice() external view returns (uint256 mid, uint256 oraclePrice, uint256 oracleAge) {
        (oraclePrice, oracleAge) = _lastPrice();
        mid = PMMPricing.getMidPrice(_state(oraclePrice));
    }

    function state()
        external
        view
        returns (uint256 base, uint256 quoteRaw, uint256 baseTarget, uint256 quoteTargetRaw, PMMPricing.RState r)
    {
        return (B, Q / QUOTE_SCALE, B0, Q0 / QUOTE_SCALE, R);
    }

    // ============ owner ============

    /// @notice Deposita inventario. Con `reset` fija los objetivos al inventario resultante (R = 1).
    function deposit(uint256 baseAmount, uint256 quoteAmountRaw, bool reset) external onlyOwner {
        if (baseAmount > 0) BASE.safeTransferFrom(msg.sender, address(this), baseAmount);
        if (quoteAmountRaw > 0) QUOTE.safeTransferFrom(msg.sender, address(this), quoteAmountRaw);
        B += baseAmount;
        Q += quoteAmountRaw * QUOTE_SCALE;
        if (reset) _resetTargets();
        emit Inventory(B, Q, B0, Q0, R);
    }

    function withdraw(uint256 baseAmount, uint256 quoteAmountRaw, address to, bool reset) external onlyOwner {
        if (baseAmount > 0) {
            B -= baseAmount;
            BASE.safeTransfer(to, baseAmount);
        }
        if (quoteAmountRaw > 0) {
            Q -= quoteAmountRaw * QUOTE_SCALE;
            QUOTE.safeTransfer(to, quoteAmountRaw);
        }
        if (reset) _resetTargets();
        emit Inventory(B, Q, B0, Q0, R);
    }

    function resetTargets() external onlyOwner {
        _resetTargets();
        emit Inventory(B, Q, B0, Q0, R);
    }

    function setParams(uint256 k_, uint256 feeBps_, uint256 maxAge_, uint256 maxConfBps_) external onlyOwner {
        _setParams(k_, feeBps_, maxAge_, maxConfBps_);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Rescata ETH sobrante de fees de Pyth.
    function sweepEth(address payable to) external onlyOwner {
        to.transfer(address(this).balance);
    }

    // ============ internals ============

    function _state(uint256 i) internal view returns (PMMPricing.PMMState memory s) {
        s = PMMPricing.PMMState({i: i, K: k, B: B, Q: Q, B0: B0, Q0: Q0, R: R});
        PMMPricing.adjustedTarget(s);
    }

    function _settle(PMMPricing.RState newR) internal {
        R = newR;
        if (newR == PMMPricing.RState.ONE) {
            B0 = B;
            Q0 = Q;
        }
    }

    function _resetTargets() internal {
        B0 = B;
        Q0 = Q;
        R = PMMPricing.RState.ONE;
    }

    function _setParams(uint256 k_, uint256 feeBps_, uint256 maxAge_, uint256 maxConfBps_) internal {
        if (k_ == 0 || k_ > DecimalMath.ONE || feeBps_ > 1_000 || maxAge_ == 0) revert BadParams();
        k = k_;
        feeBps = feeBps_;
        maxAge = maxAge_;
        maxConfBps = maxConfBps_;
        emit Params(k_, feeBps_, maxAge_, maxConfBps_);
    }

    /// @dev Publica el update de Pyth (si viene), cobra el fee y devuelve el sobrante; exige precio fresco.
    function _freshPrice(bytes[] calldata pythUpdate) internal returns (uint256 i) {
        if (pythUpdate.length > 0) {
            uint256 fee = PYTH.getUpdateFee(pythUpdate);
            require(msg.value >= fee, "PYTH_FEE");
            PYTH.updatePriceFeeds{value: fee}(pythUpdate);
            uint256 refund = msg.value - fee;
            if (refund > 0) {
                (bool ok,) = msg.sender.call{value: refund}("");
                require(ok, "REFUND");
            }
        }
        PythStructs.Price memory p = PYTH.getPriceNoOlderThan(FEED_ID, maxAge);
        return _toQuotePerBase(p);
    }

    function _lastPrice() internal view returns (uint256 i, uint256 age) {
        PythStructs.Price memory p = PYTH.getPriceUnsafe(FEED_ID);
        i = _toQuotePerBase(p);
        age = block.timestamp > p.publishTime ? block.timestamp - p.publishTime : 0;
    }

    /// @dev Pyth USD/MXN = MXN por USD. i = USDT por MEXt (1e18) = 1e18 / (price · 10^expo).
    function _toQuotePerBase(PythStructs.Price memory p) internal view returns (uint256) {
        if (p.price <= 0) revert StaleOrWideOracle();
        uint256 price = uint256(uint64(p.price));
        if (uint256(p.conf) * 10_000 > price * maxConfBps) revert StaleOrWideOracle();
        if (p.expo > 0) revert StaleOrWideOracle();
        uint256 scale = 10 ** uint256(uint32(-p.expo));
        return (DecimalMath.ONE * scale) / price;
    }

    receive() external payable {}
}
