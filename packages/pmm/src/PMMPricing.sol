// SPDX-License-Identifier: Apache-2.0
// Port de DODO v2 PMMPricing (Copyright 2020 DODO ZOO, Apache-2.0) a Solidity 0.8.
pragma solidity 0.8.28;

import {DecimalMath, PMMMath} from "./PMMMath.sol";

/// @notice Máquina de estados del PMM: R=1 (equilibrio), R>1 (falta base, precio > i), R<1 (falta quote, precio < i).
library PMMPricing {
    enum RState {
        ONE,
        ABOVE_ONE,
        BELOW_ONE
    }

    struct PMMState {
        uint256 i; // quote por base, 1e18
        uint256 K; // 1e18
        uint256 B; // base actual
        uint256 Q; // quote actual (normalizado a 1e18)
        uint256 B0; // base objetivo
        uint256 Q0; // quote objetivo
        RState R;
    }

    function sellBaseToken(PMMState memory state, uint256 payBaseAmount)
        internal
        pure
        returns (uint256 receiveQuoteAmount, RState newR)
    {
        if (state.R == RState.ONE) {
            receiveQuoteAmount = _ROneSellBaseToken(state, payBaseAmount);
            newR = RState.BELOW_ONE;
        } else if (state.R == RState.ABOVE_ONE) {
            uint256 backToOnePayBase = state.B0 - state.B;
            uint256 backToOneReceiveQuote = state.Q - state.Q0;
            if (payBaseAmount < backToOnePayBase) {
                receiveQuoteAmount = _RAboveSellBaseToken(state, payBaseAmount);
                newR = RState.ABOVE_ONE;
                if (receiveQuoteAmount > backToOneReceiveQuote) receiveQuoteAmount = backToOneReceiveQuote;
            } else if (payBaseAmount == backToOnePayBase) {
                receiveQuoteAmount = backToOneReceiveQuote;
                newR = RState.ONE;
            } else {
                receiveQuoteAmount =
                    backToOneReceiveQuote + _ROneSellBaseToken(state, payBaseAmount - backToOnePayBase);
                newR = RState.BELOW_ONE;
            }
        } else {
            receiveQuoteAmount = _RBelowSellBaseToken(state, payBaseAmount);
            newR = RState.BELOW_ONE;
        }
    }

    function sellQuoteToken(PMMState memory state, uint256 payQuoteAmount)
        internal
        pure
        returns (uint256 receiveBaseAmount, RState newR)
    {
        if (state.R == RState.ONE) {
            receiveBaseAmount = _ROneSellQuoteToken(state, payQuoteAmount);
            newR = RState.ABOVE_ONE;
        } else if (state.R == RState.ABOVE_ONE) {
            receiveBaseAmount = _RAboveSellQuoteToken(state, payQuoteAmount);
            newR = RState.ABOVE_ONE;
        } else {
            uint256 backToOnePayQuote = state.Q0 - state.Q;
            uint256 backToOneReceiveBase = state.B - state.B0;
            if (payQuoteAmount < backToOnePayQuote) {
                receiveBaseAmount = _RBelowSellQuoteToken(state, payQuoteAmount);
                newR = RState.BELOW_ONE;
                if (receiveBaseAmount > backToOneReceiveBase) receiveBaseAmount = backToOneReceiveBase;
            } else if (payQuoteAmount == backToOnePayQuote) {
                receiveBaseAmount = backToOneReceiveBase;
                newR = RState.ONE;
            } else {
                receiveBaseAmount =
                    backToOneReceiveBase + _ROneSellQuoteToken(state, payQuoteAmount - backToOnePayQuote);
                newR = RState.ABOVE_ONE;
            }
        }
    }

    // ============ R = 1 ============
    function _ROneSellBaseToken(PMMState memory s, uint256 payBase) private pure returns (uint256) {
        return PMMMath.solveQuadraticFunctionForTrade(s.Q0, s.Q0, payBase, s.i, s.K);
    }

    function _ROneSellQuoteToken(PMMState memory s, uint256 payQuote) private pure returns (uint256) {
        return PMMMath.solveQuadraticFunctionForTrade(s.B0, s.B0, payQuote, DecimalMath.reciprocalFloor(s.i), s.K);
    }

    // ============ R < 1 ============
    function _RBelowSellQuoteToken(PMMState memory s, uint256 payQuote) private pure returns (uint256) {
        return PMMMath.generalIntegrate(s.Q0, s.Q + payQuote, s.Q, DecimalMath.reciprocalFloor(s.i), s.K);
    }

    function _RBelowSellBaseToken(PMMState memory s, uint256 payBase) private pure returns (uint256) {
        return PMMMath.solveQuadraticFunctionForTrade(s.Q0, s.Q, payBase, s.i, s.K);
    }

    // ============ R > 1 ============
    function _RAboveSellBaseToken(PMMState memory s, uint256 payBase) private pure returns (uint256) {
        return PMMMath.generalIntegrate(s.B0, s.B + payBase, s.B, s.i, s.K);
    }

    function _RAboveSellQuoteToken(PMMState memory s, uint256 payQuote) private pure returns (uint256) {
        return PMMMath.solveQuadraticFunctionForTrade(s.B0, s.B, payQuote, DecimalMath.reciprocalFloor(s.i), s.K);
    }

    // ============ helpers ============
    /// @dev Recalcula el objetivo del lado excedente con el precio actual (targets "flotantes" de DODO v2).
    function adjustedTarget(PMMState memory s) internal pure {
        if (s.R == RState.BELOW_ONE) {
            s.Q0 = PMMMath.solveQuadraticFunctionForTarget(s.Q, s.B - s.B0, s.i, s.K);
        } else if (s.R == RState.ABOVE_ONE) {
            s.B0 = PMMMath.solveQuadraticFunctionForTarget(s.B, s.Q - s.Q0, DecimalMath.reciprocalFloor(s.i), s.K);
        }
    }

    function getMidPrice(PMMState memory s) internal pure returns (uint256) {
        if (s.R == RState.BELOW_ONE) {
            uint256 R = DecimalMath.divFloor((s.Q0 * s.Q0) / s.Q, s.Q);
            R = DecimalMath.ONE - s.K + DecimalMath.mulFloor(s.K, R);
            return DecimalMath.divFloor(s.i, R);
        } else {
            uint256 R = DecimalMath.divFloor((s.B0 * s.B0) / s.B, s.B);
            R = DecimalMath.ONE - s.K + DecimalMath.mulFloor(s.K, R);
            return DecimalMath.mulFloor(s.i, R);
        }
    }
}
