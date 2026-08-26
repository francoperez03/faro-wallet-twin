// SPDX-License-Identifier: Apache-2.0
// Port de DODO v2 DODOMath/DecimalMath (Copyright 2020 DODO ZOO, Apache-2.0) a Solidity 0.8.
pragma solidity 0.8.28;

import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

library DecimalMath {
    uint256 internal constant ONE = 1e18;
    uint256 internal constant ONE2 = 1e36;

    function mulFloor(uint256 target, uint256 d) internal pure returns (uint256) {
        return (target * d) / ONE;
    }

    function mulCeil(uint256 target, uint256 d) internal pure returns (uint256) {
        return Math.ceilDiv(target * d, ONE);
    }

    function divFloor(uint256 target, uint256 d) internal pure returns (uint256) {
        return (target * ONE) / d;
    }

    function divCeil(uint256 target, uint256 d) internal pure returns (uint256) {
        return Math.ceilDiv(target * ONE, d);
    }

    function reciprocalFloor(uint256 target) internal pure returns (uint256) {
        return ONE2 / target;
    }
}

/// @notice Integral de la curva PMM y soluciones cuadráticas (DODO v2). Todo en fixed-point 1e18.
library PMMMath {
    /*
        Integra la curva de V1 a V2, con V0 >= V1 >= V2 > 0:
        res = i·(V1−V2)·(1 − k + k·V0²/(V1·V2))     [round down]
    */
    function generalIntegrate(uint256 V0, uint256 V1, uint256 V2, uint256 i, uint256 k)
        internal
        pure
        returns (uint256)
    {
        require(V0 > 0, "TARGET_IS_ZERO");
        uint256 fairAmount = i * (V1 - V2);
        if (k == 0) return fairAmount / DecimalMath.ONE;
        uint256 V0V0V1V2 = DecimalMath.divFloor((V0 * V0) / V1, V2);
        uint256 penalty = DecimalMath.mulFloor(k, V0V0V1V2);
        return ((DecimalMath.ONE - k + penalty) * fairAmount) / DecimalMath.ONE2;
    }

    /*
        Dado V1 y un delta pagado, resuelve el nuevo objetivo V0 (V2 = V0):
        V0 = V1·(1 + (√(1 + 4·k·i·delta/V1) − 1) / 2k)     [round down]
    */
    function solveQuadraticFunctionForTarget(uint256 V1, uint256 delta, uint256 i, uint256 k)
        internal
        pure
        returns (uint256)
    {
        if (k == 0) return V1 + DecimalMath.mulFloor(i, delta);
        if (V1 == 0) return 0;
        uint256 ki = 4 * k * i;
        uint256 sqrt = ki == 0 ? DecimalMath.ONE : Math.sqrt(Math.mulDiv(ki, delta, V1) + DecimalMath.ONE2);
        uint256 premium = DecimalMath.divFloor(sqrt - DecimalMath.ONE, k * 2) + DecimalMath.ONE;
        return DecimalMath.mulFloor(V1, premium);
    }

    /*
        Dado V1 y un delta vendido (precio i del par delta/V), resuelve cuánto V sale: |V1 − V2|.
        a·V2² + b·V2 + c = 0 con a = 1−k, −b = (1−k)V1 − kV0²/V1 + i·delta, c = −kV0²   [round down]
    */
    function solveQuadraticFunctionForTrade(uint256 V0, uint256 V1, uint256 delta, uint256 i, uint256 k)
        internal
        pure
        returns (uint256)
    {
        require(V0 > 0, "TARGET_IS_ZERO");
        if (delta == 0) return 0;
        if (k == 0) {
            uint256 out = DecimalMath.mulFloor(i, delta);
            return out > V1 ? V1 : out;
        }
        if (k == DecimalMath.ONE) {
            uint256 temp = Math.mulDiv(i * delta, V1, V0 * V0);
            return (V1 * temp) / (temp + DecimalMath.ONE);
        }
        uint256 part2 = ((k * V0) / V1) * V0 + i * delta; // kV0²/V1 + i·delta
        uint256 bAbs = (DecimalMath.ONE - k) * V1; // (1−k)V1
        bool bSig;
        if (bAbs >= part2) {
            bAbs = bAbs - part2;
            bSig = false;
        } else {
            bAbs = part2 - bAbs;
            bSig = true;
        }
        bAbs = bAbs / DecimalMath.ONE;
        uint256 squareRoot =
            DecimalMath.mulFloor((DecimalMath.ONE - k) * 4, DecimalMath.mulFloor(k, V0) * V0); // 4(1−k)kV0²
        squareRoot = Math.sqrt(bAbs * bAbs + squareRoot);
        uint256 denominator = (DecimalMath.ONE - k) * 2;
        uint256 numerator;
        if (bSig) {
            numerator = squareRoot - bAbs;
            require(numerator != 0, "PMMMath: should not be zero");
        } else {
            numerator = bAbs + squareRoot;
        }
        uint256 V2 = DecimalMath.divCeil(numerator, denominator);
        if (V2 > V1) return 0;
        return V1 - V2;
    }
}
