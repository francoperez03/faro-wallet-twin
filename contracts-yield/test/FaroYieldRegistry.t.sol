// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {HonkVerifier} from "../src/HonkVerifier.sol";
import {FaroYieldRegistry} from "../src/FaroYieldRegistry.sol";

/// @title FaroYieldRegistry.t.sol — gate duro del plan de yield (D-diseño)
/// @notice HARD GATE: una proof generada con bb.js (WASM, `noir.execute` + `UltraHonkBackend`
///         `verifierTarget: 'evm'`, EL MISMO camino que corre `lib/sobrecito-mini/prove-yield.ts`
///         en runtime) tiene que verificar `true` en el HonkVerifier generado con bb nativo
///         `--optimized` desde la MISMA vk. `fixtures/proof-bbjs.hex` y
///         `fixtures/public_inputs-bbjs.json` son la proof/public inputs reales de esa corrida
///         de bb.js (mismos inputs que `circuits-mini/yield_cut/Prover.toml`: 1 usuario real
///         balance=1000/reward=100, delta=100, resto padding K=64). `fixtures/proof.hex` (bb
///         nativo) queda como control cruzado. Si `test_bbjsProofVerifiesAgainstVerifier`
///         falla, el deploy se aborta (GATE_FAILED), mismo criterio que el gate D-05 del
///         circuito mini hermano (04-03-PLAN.md).
contract FaroYieldRegistryTest is Test {
    HonkVerifier internal verifier;
    FaroYieldRegistry internal registry;

    address internal publisher = address(0xB0B);

    bytes internal proof; // proof de bb.js (WASM), el mismo camino que el pipeline real
    bytes internal nativeProof; // proof de bb nativo, control cruzado
    bytes32[] internal publicInputs;

    // Public inputs de la fixture: [key_hash, cL, delta] (circuits-mini/yield_cut/Prover.toml:
    // 1 usuario real balance=1000/reward=100, delta=100, K-1 usuarios de padding en cero).
    bytes32 internal constant KEY_HASH = 0x000000000000000000000000000000000000004641524f2f5949454c442f7631;
    bytes32 internal constant C_L = 0x1b88b5697d98702e26da7e6b54aaf81dd74d87c777b90a8fd6b4bb14bae3883e;
    bytes32 internal constant DELTA = bytes32(uint256(100));

    function setUp() public {
        verifier = new HonkVerifier();
        registry = new FaroYieldRegistry(address(verifier), KEY_HASH, publisher);

        proof = vm.parseBytes(vm.readFile("test/fixtures/proof-bbjs.hex"));
        nativeProof = vm.parseBytes(vm.readFile("test/fixtures/proof.hex"));

        string memory piJson = vm.readFile("test/fixtures/public_inputs-bbjs.json");
        bytes32[] memory pi = vm.parseJsonBytes32Array(piJson, ".public_inputs");
        publicInputs = pi;

        assertEq(publicInputs.length, 3, "fixture debe tener 3 public inputs");
        assertEq(publicInputs[0], KEY_HASH, "fixture keyHash desalineado");
        assertEq(publicInputs[1], C_L, "fixture cL desalineado");
        assertEq(publicInputs[2], DELTA, "fixture delta desalineado");
    }

    /// @notice GATE DURO (bloquea el deploy si falla): la proof de bb.js tiene que verificar
    ///         true en el HonkVerifier generado con bb nativo desde la misma vk.
    function test_bbjsProofVerifiesAgainstVerifier() public {
        bool ok = verifier.verify(proof, publicInputs);
        assertTrue(ok, "GATE_FAILED: la proof de bb.js no verifica contra el verifier generado");
    }

    /// @notice Control cruzado: la proof de bb NATIVO (misma vk, mismos inputs) tambien
    ///         verifica, confirmando que el verifier generado es correcto independientemente
    ///         de que backend de proving se use.
    function test_nativeProofVerifiesAgainstVerifier() public {
        bool ok = verifier.verify(nativeProof, publicInputs);
        assertTrue(ok, "la proof de bb nativo no verifica contra el verifier generado");
    }

    function test_publishAcceptsRealProof() public {
        FaroYieldRegistry.CutInput memory inp = _validInput();

        vm.prank(publisher);
        registry.publish(inp, proof, publicInputs);

        FaroYieldRegistry.Cut memory cut = registry.getCut(inp.corteId);
        assertEq(cut.cL, C_L);
        assertEq(cut.cR, DELTA);
        assertEq(registry.DECLARED_MASK(), 0x0E);
    }

    function test_publishRevertsOnTamperedProof() public {
        FaroYieldRegistry.CutInput memory inp = _validInput();

        bytes memory tampered = proof;
        // Flip un byte del medio de la proof: cualquier cambio rompe el pairing check.
        tampered[100] = bytes1(uint8(tampered[100]) ^ 0xFF);

        vm.prank(publisher);
        vm.expectRevert();
        registry.publish(inp, tampered, publicInputs);
    }

    function test_publishRevertsOnTamperedPublicInput() public {
        FaroYieldRegistry.CutInput memory inp = _validInput();

        bytes32[] memory tampered = publicInputs;
        tampered[2] = bytes32(uint256(101)); // delta distinto del que constrainio el circuito

        // cR (declarado en el CutInput) sigue en 100: el chequeo cR==publicInputs[2] revierte
        // ANTES de siquiera llamar al verifier (chequeo barato primero, mismo orden que Sobrecito).
        vm.prank(publisher);
        vm.expectRevert(
            abi.encodeWithSelector(FaroYieldRegistry.CRMismatch.selector, tampered[2], inp.cR)
        );
        registry.publish(inp, proof, tampered);
    }

    /// @notice El chequeo nuevo del fork (vs SobrecitoRegistry): cR declarado en el CutInput
    ///         tiene que igualar publicInputs[2] (el delta PROBADO), o revierte antes de
    ///         gastar gas en el verifier.
    function test_publishRevertsOnCRMismatch() public {
        FaroYieldRegistry.CutInput memory inp = _validInput();
        inp.cR = bytes32(uint256(999)); // declara un delta distinto al probado en publicInputs[2]

        vm.prank(publisher);
        vm.expectRevert(
            abi.encodeWithSelector(FaroYieldRegistry.CRMismatch.selector, DELTA, inp.cR)
        );
        registry.publish(inp, proof, publicInputs);
    }

    function _validInput() internal pure returns (FaroYieldRegistry.CutInput memory inp) {
        uint8[] memory verdicts = new uint8[](1);
        verdicts[0] = 1;
        uint16[] memory coverageBps = new uint16[](1);
        coverageBps[0] = 10000;

        inp = FaroYieldRegistry.CutInput({
            corteId: keccak256("test-corte-yield"),
            cL: C_L,
            cR: DELTA,
            blockB: 12345,
            verdicts: verdicts,
            coverageBps: coverageBps,
            attestationHash: keccak256("attestation-declarada")
        });
    }
}
