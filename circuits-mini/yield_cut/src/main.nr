mod params;
use params::{K, KEY_HASH};
use commitment_lib::{commit, commit_totals, fold_batch_acc};

// Corte de rendimiento (yield): la declaracion probada del plan aprobado es
// "los rewards que la app acredita son exactamente el rendimiento que Morpho
// generó sobre los fondos, repartido pro rata", sin revelar balances individuales.
// Delta (yield del vault en el periodo) es publico on-chain sin ZK (recomputable
// con dos eth_call historicos); lo que prueba este circuito es que Sum(reward_i)
// nunca excede Delta (mas alla de polvo de redondeo acotado) y que cada reward_i
// es el floor pro rata honesto de balance_i sobre Delta, sin filtrar balance_i.
struct UserInput {
    balance: Field,
    reward: Field,
    salt: Field,
}

// BAL_BITS=48 fijo (mismo contrato de unidad que circuits-mini/liabilities_batch_mini:
// BAL_SCALE 1e10, unidades de 8 decimales). Literal en vez de params::BAL_BITS: el generic
// de assert_max_bit_size necesita una constante en tiempo de compilacion (Pitfall heredado
// de circuits-mini/liabilities_batch_mini/src/main.nr).
fn assert_bal_bits(v: Field) {
    v.assert_max_bit_size::<48>();
}

// public inputs resultantes, layout [key_hash, C_L, delta] (D-diseño del plan de yield):
// key_hash es un pub PARAM (constrainido contra el ancla KEY_HASH de params.nr, mismo
// rol que en el mini), C_L y delta son el pub RETURN en ese orden (el orden de un tuple
// pub return es el orden de declaracion). delta llega como witness PRIVADO (no pub param)
// y se expone via el return: asi el layout final coincide con [key_hash, cL, delta] que
// FaroYieldRegistry.sol espera (cL en publicInputs[1] igual que SobrecitoRegistry, delta
// nuevo en publicInputs[2]).
fn main(users: [UserInput; K], r: Field, key_hash: pub Field, delta: Field) -> pub (Field, Field) {
    assert(key_hash == KEY_HASH);

    let mut total_balance: Field = 0;
    let mut total_reward: Field = 0;
    let mut commitments: [Field; K] = [0; K];
    for i in 0..K {
        assert_bal_bits(users[i].balance); // rango 48 bits, RF-P1
        assert_bal_bits(users[i].reward); // rango 48 bits, RF-P1
        total_balance = total_balance + users[i].balance;
        total_reward = total_reward + users[i].reward;
        commitments[i] = commit([users[i].balance, users[i].reward], users[i].salt);
    }

    // RF-P2: Sum(reward_i) <= delta, con polvo acotado a < K unidades minimas (el floor
    // pro rata por usuario deja como maximo casi 1 unidad de resto cada uno, K usuarios
    // acotan el polvo total a < K; jamas puede haber inyeccion, sum > delta rechaza).
    // assert_max_bit_size prueba la no negatividad de `dust` sin wraparound de field: si
    // total_reward > delta, `dust` (mod p) queda cerca del modulo (~254 bits), muy por
    // encima de 64 bits, y la prueba se cae aca.
    let dust = delta - total_reward;
    dust.assert_max_bit_size::<64>();
    assert((dust as u64) < (K as u64));

    // RF-P3: pro rata honesto por usuario, floor exacto de la division real
    // (reward_i = floor(delta * balance_i / total_balance)): balance_i*delta -
    // reward_i*total_balance es el resto de esa division, siempre < total_balance
    // cuando el prover uso el floor real; cualquier reward_i inflado o desviado hace
    // que ese resto sea negativo (falla la no negatividad) o exceda total_balance
    // (falla la cota de resto). Los productos (balance_i, reward_i <=48 bits, delta
    // implicitamente acotado por el chequeo de dust arriba) entran holgados en el field.
    for i in 0..K {
        let rhs = users[i].balance * delta;
        let lhs = users[i].reward * total_balance;
        let diff = rhs - lhs;
        diff.assert_max_bit_size::<64>();
        assert((diff as u64) < (total_balance as u64));
    }

    let acc_root = fold_batch_acc(commitments);
    let c_l = commit_totals([total_balance, total_reward], acc_root, r);
    (c_l, delta)
}

// ---------------------------------------------------------------------------
// Tests (D-05 del plan de yield: caso feliz, rechazo de Sum>Delta, rechazo de
// pro rata torcido, rechazo de key_hash ajeno).
// ---------------------------------------------------------------------------

fn empty_users() -> [UserInput; K] {
    [UserInput { balance: 0, reward: 0, salt: 0 }; K]
}

#[test]
fn yield_cut_happy_path() {
    let mut users = empty_users();
    // Un usuario real: balance=1000, reward=100 (floor pro rata exacto de delta=100
    // sobre un total_balance de 1000, unico usuario => reward = delta entero).
    users[0] = UserInput { balance: 1000, reward: 100, salt: 42 };
    let (c_l, delta_out) = main(users, 7, KEY_HASH, 100);
    assert(c_l != 0);
    assert(delta_out == 100);
}

#[test(should_fail)]
fn yield_cut_rejects_sum_reward_over_delta() {
    let mut users = empty_users();
    // reward=100 > delta=50: dust = delta - total_reward queda negativo (mod p, ~254 bits).
    users[0] = UserInput { balance: 1000, reward: 100, salt: 42 };
    let _ = main(users, 7, KEY_HASH, 50);
}

#[test(should_fail)]
fn yield_cut_rejects_skewed_pro_rata() {
    let mut users = empty_users();
    // Dos usuarios con el MISMO balance (1000 cada uno, total_balance=2000) deberian
    // repartirse el delta=100 en partes iguales (50/50). Este caso le da TODO el reward
    // a users[0] y NADA a users[1]: viola el floor pro rata honesto por usuario.
    users[0] = UserInput { balance: 1000, reward: 100, salt: 1 };
    users[1] = UserInput { balance: 1000, reward: 0, salt: 2 };
    let _ = main(users, 7, KEY_HASH, 100);
}

#[test(should_fail)]
fn yield_cut_rejects_wrong_key_hash() {
    let mut users = empty_users();
    users[0] = UserInput { balance: 1000, reward: 100, salt: 42 };
    let _ = main(users, 7, KEY_HASH + 1, 100);
}
