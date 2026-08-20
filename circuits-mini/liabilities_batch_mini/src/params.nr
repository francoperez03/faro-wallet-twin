// Corte mini (04-CONTEXT.md D-01): un solo lote, sin arbol de agregacion.
// K=64 (ledger de la demo, <=64 usuarios), T=2 (ARGt + BOLt), BAL_BITS=48
// (mismo rango que la fixture de Sobrecito, circuits/liabilities_batch/src/params.nr).
pub global K: u32 = 64;
pub global T: u32 = 2;
pub global BAL_BITS: u32 = 48;

// Ancla de key_hash del circuito mini (D-04): no es una VK de un hijo agregado (no hay
// recursion en el mini), es un identificador fijo de "este circuito mini" que el
// Registry #2 ancla como su `keyHash` inmutable de deploy. El circuito lo constrine
// para que ninguna proof valida pueda declarar otro key_hash.
pub global KEY_HASH: Field = 0x54574e2f4d494e492f7631; // "TWN/MINI/v1" en hex
