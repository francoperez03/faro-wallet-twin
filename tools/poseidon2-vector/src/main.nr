// ponytail: crate descartable, solo para imprimir un vector de test real desde
// commitment_lib (Noir real) via `nargo test --show-output`. No se prueba ni se
// deploya; existe únicamente para generar lib/poseidon2/test-vectors/commitment-vector.json.

fn main() {}

#[test]
fn print_commitment_vector() {
    let result = commitment_lib::commit([1000000000000000000], 424242);
    dep::std::println(result);
}
