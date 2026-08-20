// Corte de rendimiento (yield): K usuarios por lote, un solo main (mismo criterio
// sin recursion que circuits-mini/liabilities_batch_mini, ver su params.nr). K=64
// (ledger de la demo). BAL_BITS=48: mismo rango/escala que el mini (BAL_SCALE 1e10,
// unidades de 8 decimales, el contrato de unidad existente en lib/sobrecito-mini/prove.ts).
pub global K: u32 = 64;
pub global BAL_BITS: u32 = 48;

// Ancla de key_hash propia del circuito de yield (distinta de la del mini): ningun corte
// de rewards puede declarar otro key_hash, ancla que FaroYieldRegistry fija en su deploy.
pub global KEY_HASH: Field = 0x4641524f2f5949454c442f7631; // "FARO/YIELD/v1" en hex
