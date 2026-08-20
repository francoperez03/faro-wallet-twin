// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {IVerifier} from "./IVerifier.sol";

/// @title FaroYieldRegistry — registro de cortes de rendimiento (yield) con predicado probado
/// @notice Fork minimo de SobrecitoRegistry (Sobrecito, `contracts/src/SobrecitoRegistry.sol`,
///         fuente read-only, jamas editada). La declaracion probada cambia: en vez de
///         "solvencia de pasivos" (cL = commitment de balances), esta version prueba
///         "los rewards acreditados son exactamente el rendimiento de Morpho repartido
///         pro rata", sin revelar balances individuales.
/// @notice PROBADO CRIPTOGRAFICAMENTE en esta fase: `cL` (commitment de balance+reward por
///         usuario) Y `cR` (el delta del vault en el periodo, que ahora es un PUBLIC INPUT
///         mas de la prueba, no un dato declarado por el publisher). Unico cambio real
///         respecto del registry original: `PUBLIC_INPUTS_LENGTH` pasa de 2 a 3 y se agrega
///         el chequeo `cR == publicInputs[2]`.
/// @notice DECLARADO (sin verificacion criptografica en esta fase): `verdicts` y
///         `coverageBps` (mismo criterio que SobrecitoRegistry) y `attestationHash`.
///         `declaredMask` baja de 0x0F a 0x0E: cR deja de estar declarado.
/// @notice Autorizacion single-sig (rol `publisher`, mismo criterio que SobrecitoRegistry).
/// @notice PoC no auditado.
contract FaroYieldRegistry {
    // ---------------------------------------------------------------------
    // Errores
    // ---------------------------------------------------------------------

    error NotOwner();
    error NotPublisher();
    error ZeroAddress();
    error CutExists(bytes32 corteId);
    error CutNotFound(bytes32 corteId);
    error BadPublicInputsLength(uint256 got, uint256 want);
    error KeyHashMismatch(bytes32 got, bytes32 want);
    error CLMismatch(bytes32 got, bytes32 want);
    error CRMismatch(bytes32 got, bytes32 want);
    error TooManyEntries(uint256 got, uint256 max);
    error ProofRejected(bytes32 corteId);

    // ---------------------------------------------------------------------
    // Constantes
    // ---------------------------------------------------------------------

    /// @notice Largo exacto del array de public inputs de la prueba: [key_hash, C_L, delta].
    ///         Layout del circuito circuits-mini/yield_cut/src/main.nr: key_hash es pub PARAM,
    ///         (C_L, delta) es el pub RETURN en ese orden. Delta pasa a ser PROBADO (antes era
    ///         cR declarado sin prueba en SobrecitoRegistry).
    uint256 public constant PUBLIC_INPUTS_LENGTH = 3;

    /// @notice Tope de entradas en verdicts/coverageBps: mismo criterio que SobrecitoRegistry.
    uint256 public constant MAX_ENTRIES = 256;

    /// @notice Bitmask de los campos DECLARADOS (no probados) en esta fase.
    ///         bit0 = cR (cae: ahora probado), bit1 = verdicts, bit2 = coverageBps,
    ///         bit3 = attestationHash. Solo la attestation (y verdicts/coverage, sin
    ///         contraparte en la declaracion de yield pero mantenidos por compatibilidad
    ///         de struct/evento con SobrecitoRegistry) quedan declarados.
    uint8 public constant DECLARED_MASK = 0x0E;

    // ---------------------------------------------------------------------
    // Tipos
    // ---------------------------------------------------------------------

    /// @dev El struct en calldata es obligatorio: mismo motivo que SobrecitoRegistry
    ///      (Stack too deep sin via_ir, que no puede prenderse por el verifier optimizado).
    struct CutInput {
        bytes32 corteId;
        bytes32 cL; // PROBADO: debe igualar publicInputs[1]
        bytes32 cR; // PROBADO (nuevo, fork de yield): debe igualar publicInputs[2] (delta)
        uint64 blockB; // bloque de anclaje (B2, el corte actual; Delta = convertToAssets(B2) - convertToAssets(B1))
        uint8[] verdicts; // DECLARADO, mantenido por compatibilidad de forma con SobrecitoRegistry
        uint16[] coverageBps; // DECLARADO, idem
        bytes32 attestationHash; // DECLARADO: hash de la attestation del co-firmante
    }

    struct Cut {
        bytes32 cL;
        bytes32 cR;
        bytes32 attestationHash;
        uint64 blockB;
        uint64 publishedAt; // != 0 <=> el corte existe
        uint8[] verdicts;
        uint16[] coverageBps;
    }

    // ---------------------------------------------------------------------
    // Estado
    // ---------------------------------------------------------------------

    IVerifier public immutable verifier; // address inmutable, cero swap silencioso
    bytes32   public immutable keyHash;  // KEY_HASH de circuits-mini/yield_cut, anclado en el deploy

    address public owner;
    address public pendingOwner;
    address public publisher;

    mapping(bytes32 => Cut) internal _cuts;
    bytes32[] public corteIds; // append-only: permite enumerar y leer el ultimo

    // ---------------------------------------------------------------------
    // Eventos
    // ---------------------------------------------------------------------

    event CutPublished(
        bytes32 indexed corteId,
        bytes32 cL,
        bytes32 cR,
        uint64 blockB,
        bytes32 attestationHash,
        uint8[] verdicts,
        uint16[] coverageBps,
        uint64 publishedAt,
        uint8 declaredMask
    );
    event PublisherChanged(address indexed previous, address indexed current);
    event OwnershipTransferStarted(address indexed previous, address indexed pending);
    event OwnershipTransferred(address indexed previous, address indexed current);

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor(address verifier_, bytes32 keyHash_, address publisher_) {
        if (verifier_ == address(0) || publisher_ == address(0)) revert ZeroAddress();
        if (keyHash_ == bytes32(0)) revert ZeroAddress();
        verifier = IVerifier(verifier_);
        keyHash = keyHash_;
        owner = msg.sender;
        publisher = publisher_;
        emit OwnershipTransferred(address(0), msg.sender);
        emit PublisherChanged(address(0), publisher_);
    }

    // ---------------------------------------------------------------------
    // Publicacion
    // ---------------------------------------------------------------------

    /// @notice Publica un corte de yield. Orden de chequeos deliberado: baratos primero.
    /// @dev Sin `updateCut` ni `deleteCut`: un corte publicado es inmutable, igual que
    ///      SobrecitoRegistry. Unico diff funcional real vs SobrecitoRegistry.publish:
    ///      el chequeo nuevo de `cR == publicInputs[2]` (delta ahora probado).
    function publish(CutInput calldata inp, bytes calldata proof, bytes32[] calldata publicInputs) external {
        if (msg.sender != publisher) revert NotPublisher();
        if (_cuts[inp.corteId].publishedAt != 0) revert CutExists(inp.corteId);
        if (publicInputs.length != PUBLIC_INPUTS_LENGTH) {
            revert BadPublicInputsLength(publicInputs.length, PUBLIC_INPUTS_LENGTH);
        }
        if (publicInputs[0] != keyHash) revert KeyHashMismatch(publicInputs[0], keyHash);
        if (publicInputs[1] != inp.cL) revert CLMismatch(publicInputs[1], inp.cL);
        if (publicInputs[2] != inp.cR) revert CRMismatch(publicInputs[2], inp.cR);
        if (inp.verdicts.length > MAX_ENTRIES) revert TooManyEntries(inp.verdicts.length, MAX_ENTRIES);
        if (inp.coverageBps.length > MAX_ENTRIES) revert TooManyEntries(inp.coverageBps.length, MAX_ENTRIES);

        try verifier.verify(proof, publicInputs) returns (bool ok) {
            if (!ok) revert ProofRejected(inp.corteId);
        } catch {
            revert ProofRejected(inp.corteId);
        }

        // effects antes del log (checks-effects-interactions, mismo patron que SobrecitoRegistry)
        Cut storage c = _cuts[inp.corteId];
        c.cL = inp.cL;
        c.cR = inp.cR;
        c.attestationHash = inp.attestationHash;
        c.blockB = inp.blockB;
        c.publishedAt = uint64(block.timestamp);
        c.verdicts = inp.verdicts;
        c.coverageBps = inp.coverageBps;
        corteIds.push(inp.corteId);

        _emitPublished(inp, c.publishedAt);
    }

    /// @dev Emit en funcion internal: mismo motivo que SobrecitoRegistry (9 argumentos
    ///      desbordan el stack aun con struct calldata).
    function _emitPublished(CutInput calldata inp, uint64 publishedAt) internal {
        emit CutPublished(
            inp.corteId,
            inp.cL,
            inp.cR,
            inp.blockB,
            inp.attestationHash,
            inp.verdicts,
            inp.coverageBps,
            publishedAt,
            DECLARED_MASK
        );
    }

    // ---------------------------------------------------------------------
    // Lecturas
    // ---------------------------------------------------------------------

    function getCut(bytes32 corteId) external view returns (Cut memory) {
        Cut memory c = _cuts[corteId];
        if (c.publishedAt == 0) revert CutNotFound(corteId);
        return c;
    }

    function cutExists(bytes32 corteId) external view returns (bool) {
        return _cuts[corteId].publishedAt != 0;
    }

    function cutCount() external view returns (uint256) {
        return corteIds.length;
    }

    function latestCorteId() external view returns (bytes32) {
        uint256 n = corteIds.length;
        if (n == 0) revert CutNotFound(bytes32(0));
        return corteIds[n - 1];
    }

    // ---------------------------------------------------------------------
    // Acceso
    // ---------------------------------------------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function setPublisher(address newPublisher) external onlyOwner {
        if (newPublisher == address(0)) revert ZeroAddress();
        emit PublisherChanged(publisher, newPublisher);
        publisher = newPublisher;
    }

    /// @dev Transferencia en dos pasos, mismo patron que SobrecitoRegistry.
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert NotOwner();
        emit OwnershipTransferred(owner, msg.sender);
        owner = msg.sender;
        pendingOwner = address(0);
    }
}
