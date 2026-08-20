// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @notice Interfaz del verifier UltraHonk generado por `bb write_solidity_verifier -t evm`.
/// @dev `verify` NUNCA devuelve false: o devuelve true, o revierte con un error
///      custom del verifier (SumcheckFailed, ShpleminiFailed,
///      ProofLengthWrongWithLogN, PublicInputsLengthWrong, PointAtInfinity, ...).
///      Por eso el Registry lo envuelve en try/catch.
interface IVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs)
        external
        view
        returns (bool);
}
