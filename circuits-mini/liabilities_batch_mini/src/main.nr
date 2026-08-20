mod params;
use params::{K, T, BAL_BITS, KEY_HASH};
use commitment_lib::{commit, fold_batch_acc, commit_totals};

// Variante mini de liabilities_batch (04-CONTEXT.md D-01): un solo lote (K<=64,
// el ledger completo de la demo entra en una corrida), sin nodo agregador ni
// recursion. El circuito hace, en un solo main, lo que en Sobrecito hacen
// liabilities_batch (sums + commit_acc) y la raiz del arbol (commit_totals)
// combinados, porque no hay hijos que verificar.
struct UserInput {
    balances: [Field; T],
    salt: Field,
}

// Pitfall 4 (heredado de liabilities_batch/src/main.nr): assert_max_bit_size
// necesita un literal en tiempo de compilacion.
fn assert_bal_bits(v: Field) {
    if BAL_BITS == 32 {
        v.assert_max_bit_size::<32>();
    } else if BAL_BITS == 48 {
        v.assert_max_bit_size::<48>();
    } else {
        v.assert_max_bit_size::<64>();
    }
}

// public inputs resultantes (layout compatible con SobrecitoRegistry.sol,
// D-01/D-04): [key_hash, C_L]. key_hash es un pub PARAM (constrainido contra
// el ancla KEY_HASH de params.nr), C_L es el pub RETURN.
fn main(users: [UserInput; K], r: Field, key_hash: pub Field) -> pub Field {
    assert(key_hash == KEY_HASH);

    let mut totals: [Field; T] = [0; T];
    let mut commitments: [Field; K] = [0; K];
    for i in 0..K {
        for t in 0..T {
            assert_bal_bits(users[i].balances[t]); // range proof, RF-P3
            totals[t] = totals[t] + users[i].balances[t];
        }
        commitments[i] = commit(users[i].balances, users[i].salt);
    }
    let acc_root = fold_batch_acc(commitments);
    commit_totals(totals, acc_root, r)
}

#[test]
fn mini_computes_cl() {
    let mut users: [UserInput; K] = [UserInput { balances: [0; T], salt: 0 }; K];
    for i in 0..K {
        let base = (i as Field) + 1;
        let mut balances: [Field; T] = [0; T];
        for t in 0..T {
            balances[t] = base + (t as Field);
        }
        users[i] = UserInput { balances, salt: (i as Field) + 1000 };
    }
    let c_l = main(users, 7, KEY_HASH);
    assert(c_l != 0);
}

#[test(should_fail)]
fn mini_rejects_wrong_key_hash() {
    let users: [UserInput; K] = [UserInput { balances: [1; T], salt: 1 }; K];
    let _ = main(users, 7, KEY_HASH + 1);
}
