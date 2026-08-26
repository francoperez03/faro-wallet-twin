import { test } from "node:test";
import assert from "node:assert/strict";
import { computeRebalance, MIN_LEG } from "./rebalance";

const u = (n: string) => BigInt(n) * BigInt("1000000000000000000");

test("todo hacia una sola chain", () => {
  const current = { arbitrum: u("100"), base: u("50"), polygon: u("0") };
  const target = { arbitrum: u("0"), base: u("0"), polygon: u("150") };
  const legs = computeRebalance(current, target);
  assert.equal(legs.length, 2);
  const total = legs.reduce((acc, l) => acc + l.amount, BigInt(0));
  assert.equal(total, u("150"));
  legs.forEach((l) => assert.equal(l.to, "polygon"));
});

test("una chain reparte a partes iguales", () => {
  const current = { arbitrum: u("300"), base: u("0"), polygon: u("0") };
  const target = { arbitrum: u("100"), base: u("100"), polygon: u("100") };
  const legs = computeRebalance(current, target);
  assert.equal(legs.length, 2);
  const total = legs.reduce((acc, l) => acc + l.amount, BigInt(0));
  assert.equal(total, u("200"));
  legs.forEach((l) => assert.equal(l.from, "arbitrum"));
});

test("sin cambio no genera patas", () => {
  const current = { arbitrum: u("10"), base: u("20"), polygon: u("30") };
  const legs = computeRebalance(current, current);
  assert.equal(legs.length, 0);
});

test("deltas por debajo del mínimo se ignoran (polvo)", () => {
  const dust = MIN_LEG / BigInt(2);
  const current = { arbitrum: u("10") + dust, base: u("10") - dust, polygon: u("10") };
  const target = { arbitrum: u("10"), base: u("10"), polygon: u("10") };
  const legs = computeRebalance(current, target);
  assert.equal(legs.length, 0);
});
