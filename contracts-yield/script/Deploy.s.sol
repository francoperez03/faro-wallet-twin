// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Script, console2} from "forge-std/Script.sol";
import {HonkVerifier} from "../src/HonkVerifier.sol";
import {FaroYieldRegistry} from "../src/FaroYieldRegistry.sol";

/// @title Deploy — despliegue reproducible del verifier UltraHonk + FaroYieldRegistry
/// @notice `keyHash` hardcodeado al ancla real del circuito (circuits-mini/yield_cut/src/params.nr
///         ::KEY_HASH = "FARO/YIELD/v1"): mismo criterio que el deploy del Registry #2 (throwaway
///         foundry project de 04-03-SUMMARY.md), sin manifest.json (este circuito no tiene uno,
///         a diferencia de Sobrecito).
/// @dev Cero secretos en este archivo. La clave del deployer llega por `--private-key`
///      (command substitution en la shell, jamas en un archivo) o `--account`.
contract Deploy is Script {
    bytes32 constant KEY_HASH = bytes32(uint256(0x4641524f2f5949454c442f7631)); // "FARO/YIELD/v1"

    function run() external {
        address deployer = msg.sender;
        address publisher = vm.envOr("PUBLISHER_ADDRESS", deployer);

        vm.startBroadcast();
        HonkVerifier verifier = new HonkVerifier();
        FaroYieldRegistry registry = new FaroYieldRegistry(address(verifier), KEY_HASH, publisher);
        vm.stopBroadcast();

        console2.log("=== faro yield deploy ===");
        console2.log("chainId          ", block.chainid);
        console2.log("block            ", block.number);
        console2.log("deployer         ", deployer);
        console2.log("publisher        ", publisher);
        console2.log("honk_verifier    ", address(verifier));
        console2.log("faro_yield_registry", address(registry));
        console2.log("key_hash         ", vm.toString(KEY_HASH));

        require(registry.keyHash() == KEY_HASH, "keyHash anclado != esperado");
        require(address(registry.verifier()) == address(verifier), "verifier mal anclado");
        require(registry.publisher() == publisher, "publisher mal seteado");
        require(registry.owner() == deployer, "owner mal seteado");
    }
}
