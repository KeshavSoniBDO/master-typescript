// Module 6: Tooling & Configuration — self-check.
//
// Run: npm run verify:06
//
// Fails until you implement the helpers in exercises/06-tooling-config.ts.

import { test } from "node:test";
import { strict as assert } from "node:assert";

import {
  isPolicyStrictEnough,
  normalizeInclude,
  countDangerousSuppressions,
  evaluateGate,
  readMapValue,
  upgradePolicy,
  planMigration,
} from "../exercises/06-tooling-config.js";

test("isPolicyStrictEnough requires every strict flag", () => {
  assert.equal(
    isPolicyStrictEnough({
      strict: true,
      noUncheckedIndexedAccess: true,
      exactOptionalPropertyTypes: true,
      useUnknownInCatchVariables: true,
    }),
    true
  );
  assert.equal(
    isPolicyStrictEnough({
      strict: true,
      noUncheckedIndexedAccess: false,
      exactOptionalPropertyTypes: true,
      useUnknownInCatchVariables: true,
    }),
    false
  );
});

test("normalizeInclude trims, dedupes, and drops empty entries", () => {
  assert.deepEqual(normalizeInclude([" src ", "src", "", "test"]), ["src", "test"]);
});

test("countDangerousSuppressions counts @ts-ignore but not @ts-expect-error", () => {
  const source = [
    "// @ts-ignore",
    "foo();",
    "// @ts-expect-error",
    "bar();",
    "// @ts-ignore",
    "baz();",
  ].join("\n");
  assert.equal(countDangerousSuppressions(source), 2);
});

test("evaluateGate fails when any check fails", () => {
  const pass = evaluateGate([
    { name: "typecheck", passed: true },
    { name: "lint", passed: true },
  ]);
  assert.equal(pass.ok, true);

  const fail = evaluateGate([
    { name: "typecheck", passed: false },
    { name: "lint", passed: true },
  ]);
  assert.equal(fail.ok, false);
  if (!fail.ok) assert.deepEqual(fail.failures, ["typecheck"]);
});

test("readMapValue returns the value, or the fallback when absent", () => {
  assert.equal(readMapValue({ a: 1 }, "a", 0), 1);
  assert.equal(readMapValue({ a: 1 }, "b", 0), 0);
});

test("upgradePolicy raises named rules to error", () => {
  const next = upgradePolicy({ "no-any": "warn", "no-debugger": "off" }, ["no-any"]);
  assert.equal(next["no-any"], "error");
  assert.equal(next["no-debugger"], "off");
});

test("planMigration puts high-risk files first", () => {
  const plan = planMigration([
    { path: "a.ts", risk: "high", errorCount: 10 },
    { path: "b.ts", risk: "low", errorCount: 1 },
  ]);
  assert.equal(plan.immediate.some((f) => f.path === "a.ts"), true);
  assert.equal(plan.later.some((f) => f.path === "b.ts"), true);
});
