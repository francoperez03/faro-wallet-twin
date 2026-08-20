import { test } from "node:test";
import assert from "node:assert/strict";
import { recomputeCommitment } from "./commit";
import vector from "./test-vectors/commitment-vector.json" with { type: "json" };

test("recomputeCommitment reproduce el vector real de commitment_lib", () => {
  const balances = vector.balances.map((b) => BigInt(b));
  const salt = BigInt(vector.salt);
  const result = recomputeCommitment(balances, salt);
  assert.equal(result, BigInt(vector.expected));
});

test("recomputeCommitment cambia si cambia un balance (sanity check de no-colisión)", () => {
  const salt = BigInt(vector.salt);
  const original = recomputeCommitment(vector.balances.map((b) => BigInt(b)), salt);
  const tampered = recomputeCommitment([BigInt(vector.balances[0]) + BigInt(1)], salt);
  assert.notEqual(original, tampered);
});
