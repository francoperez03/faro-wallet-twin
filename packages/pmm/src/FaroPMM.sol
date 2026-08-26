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
    uint256 public maxTradeQuote; // tope por operación en quote (1e18); 0 = sin tope

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
    event Params(uint256 k, uint256 feeBps, uint256 maxAge, uint256 maxConfBps, uint256 maxTradeQuote);
    event Inventory(uint256 B, uint256 Q, uint256 B0, uint256 Q0, PMMPricing.RState R);

    error StaleOrWideOracle();
    error SlippageExceeded();
    error InsufficientInventory();
    error BadParams();
    error TargetsOutOfSync();

    uint256 public constant MAX_ORACLE_AGE = 10 minutes;
    uint256 public constant MAX_CONF_BPS_CAP = 500;
    error TradeTooLarge();

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
        uint256 maxTradeQuote_,
        address owner_
    ) Ownable(owner_) {
        BASE = IERC20(base_);
        QUOTE = IERC20(quote_);
        QUOTE_SCALE = 10 ** (18 - quoteDecimals);
        PYTH = IPyth(pyth_);
        FEED_ID = feedId_;
        _setParams(k_, feeBps_, maxAge_, maxConfBps_, maxTradeQuote_);
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
        (uint256 i, uint256 pythFee) = _freshPrice(pythUpdate);
        uint256 received = _pull(BASE, baseIn);
        (uint256 grossOut, PMMPricing.RState newR) = PMMPricing.sellBaseToken(_state(i), received);
        if (maxTradeQuote > 0 && grossOut > maxTradeQuote) revert TradeTooLarge();
        uint256 fee = (grossOut * feeBps) / 10_000;
        uint256 netOut = grossOut - fee;
        if (netOut > Q) revert InsufficientInventory();
        quoteOut = netOut / QUOTE_SCALE;
        if (quoteOut < minQuoteOut) revert SlippageExceeded();

        B += received;
        Q -= quoteOut * QUOTE_SCALE;
        _settle(newR);
        QUOTE.safeTransfer(to, quoteOut);
        _refund(pythFee);
        emit Swap(msg.sender, to, true, received, quoteOut, i, fee / QUOTE_SCALE);
    }

    /// @notice Vende `quoteIn` USDT0 (raw) y recibe MEXt.
    function sellQuote(uint256 quoteIn, uint256 minBaseOut, address to, bytes[] calldata pythUpdate)
        external
        payable
        nonReentrant
        whenNotPaused
        returns (uint256 baseOut)
    {
        if (maxTradeQuote > 0 && quoteIn * QUOTE_SCALE > maxTradeQuote) revert TradeTooLarge();
        (uint256 i, uint256 pythFee) = _freshPrice(pythUpdate);
        uint256 received = _pull(QUOTE, quoteIn);
        (uint256 grossOut, PMMPricing.RState newR) = PMMPricing.sellQuoteToken(_state(i), received * QUOTE_SCALE);
        uint256 fee = (grossOut * feeBps) / 10_000;
        baseOut = grossOut - fee;
        if (maxTradeQuote > 0 && (baseOut * i) / DecimalMath.ONE > maxTradeQuote) revert TradeTooLarge();
        if (baseOut > B) revert InsufficientInventory();
        if (baseOut < minBaseOut) revert SlippageExceeded();

        Q += received * QUOTE_SCALE;
        B -= baseOut;
        _settle(newR);
        BASE.safeTransfer(to, baseOut);
        _refund(pythFee);
        emit Swap(msg.sender, to, false, received, baseOut, i, fee);
    }

    // ============ views (usan el último precio on-chain, para preview) ============

    function quoteSellBase(uint256 baseIn)
        external
        view
        returns (uint256 quoteOut, uint256 oraclePrice, uint256 oracleAge)
    {
        (oraclePrice, oracleAge) = _lastPrice();
        (uint256 grossOut,) = PMMPricing.sellBaseToken(_state(oraclePrice), baseIn);
        if (maxTradeQuote > 0 && grossOut > maxTradeQuote) revert TradeTooLarge();
        uint256 netOut = grossOut - (grossOut * feeBps) / 10_000;
        if (netOut > Q) revert InsufficientInventory();
        quoteOut = netOut / QUOTE_SCALE;
    }

    function quoteSellQuote(uint256 quoteIn)
        external
        view
        returns (uint256 baseOut, uint256 oraclePrice, uint256 oracleAge)
    {
        (oraclePrice, oracleAge) = _lastPrice();
        if (maxTradeQuote > 0 && quoteIn * QUOTE_SCALE > maxTradeQuote) revert TradeTooLarge();
        (uint256 grossOut,) = PMMPricing.sellQuoteToken(_state(oraclePrice), quoteIn * QUOTE_SCALE);
        baseOut = grossOut - (grossOut * feeBps) / 10_000;
        if (maxTradeQuote > 0 && (baseOut * oraclePrice) / DecimalMath.ONE > maxTradeQuote) revert TradeTooLarge();
        if (baseOut > B) revert InsufficientInventory();
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
        if (baseAmount > 0) B += _pull(BASE, baseAmount);
        if (quoteAmountRaw > 0) Q += _pull(QUOTE, quoteAmountRaw) * QUOTE_SCALE;
        if (reset) _resetTargets();
        else _checkTargets();
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
        else _checkTargets();
        emit Inventory(B, Q, B0, Q0, R);
    }

    function resetTargets() external onlyOwner {
        _resetTargets();
        emit Inventory(B, Q, B0, Q0, R);
    }

    function setParams(uint256 k_, uint256 feeBps_, uint256 maxAge_, uint256 maxConfBps_, uint256 maxTradeQuote_)
        external
        onlyOwner
    {
        _setParams(k_, feeBps_, maxAge_, maxConfBps_, maxTradeQuote_);
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

    function _setParams(uint256 k_, uint256 feeBps_, uint256 maxAge_, uint256 maxConfBps_, uint256 maxTradeQuote_)
        internal
    {
        if (k_ == 0 || k_ > DecimalMath.ONE || feeBps_ > 1_000) revert BadParams();
        if (maxAge_ == 0 || maxAge_ > MAX_ORACLE_AGE) revert BadParams();
        if (maxConfBps_ == 0 || maxConfBps_ > MAX_CONF_BPS_CAP) revert BadParams();
        k = k_;
        feeBps = feeBps_;
        maxAge = maxAge_;
        maxConfBps = maxConfBps_;
        maxTradeQuote = maxTradeQuote_;
        emit Params(k_, feeBps_, maxAge_, maxConfBps_, maxTradeQuote_);
    }

    /// @dev Publica el update de Pyth (si viene) y exige precio fresco. Devuelve el fee pagado; el sobrante lo reembolsa el swap al final.
    function _freshPrice(bytes[] calldata pythUpdate) internal returns (uint256 i, uint256 fee) {
        if (pythUpdate.length > 0) {
            fee = PYTH.getUpdateFee(pythUpdate);
            require(msg.value >= fee, "PYTH_FEE");
            PYTH.updatePriceFeeds{value: fee}(pythUpdate);
        }
        PythStructs.Price memory p = PYTH.getPriceNoOlderThan(FEED_ID, maxAge);
        i = _toQuotePerBase(p);
    }

    /// @dev Reembolsa el ETH que sobró del fee de Pyth (siempre, haya update o no). Última interacción del swap.
    function _refund(uint256 fee) internal {
        uint256 refund = msg.value - fee;
        if (refund > 0) {
            (bool ok,) = msg.sender.call{value: refund}("");
            require(ok, "REFUND");
        }
    }

    /// @dev Trae `amount` del caller y devuelve lo que realmente entró (tokens con fee o rebasing).
    function _pull(IERC20 token, uint256 amount) internal returns (uint256 received) {
        uint256 before = token.balanceOf(address(this));
        token.safeTransferFrom(msg.sender, address(this), amount);
        received = token.balanceOf(address(this)) - before;
    }

    /// @dev Un cambio de inventario sin reset no puede dejar B < B0 en R>1 ni Q < Q0 en R<1 (adjustedTarget haría underflow).
    function _checkTargets() internal view {
        if (R == PMMPricing.RState.ABOVE_ONE && Q < Q0) revert TargetsOutOfSync();
        if (R == PMMPricing.RState.BELOW_ONE && B < B0) revert TargetsOutOfSync();
        if (R == PMMPricing.RState.ONE && (B != B0 || Q != Q0)) revert TargetsOutOfSync();
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
