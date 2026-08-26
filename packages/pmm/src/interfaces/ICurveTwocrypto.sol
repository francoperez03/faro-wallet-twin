// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// @notice Slice mínimo de Curve twocrypto-ng (ARGt/USDT0 en Arbitrum).
interface ICurveTwocrypto {
    function coins(uint256 i) external view returns (address);
    function get_dy(uint256 i, uint256 j, uint256 dx) external view returns (uint256);
    function price_oracle() external view returns (uint256);
    function exchange(uint256 i, uint256 j, uint256 dx, uint256 minDy, address receiver)
        external
        returns (uint256);
}
