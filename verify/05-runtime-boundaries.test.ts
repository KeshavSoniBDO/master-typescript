// Module 5: Runtime Boundaries — self-check.
//
// Run: npm run verify:05
//
// Fails until you implement the decoders in exercises/05-runtime-boundaries.ts.

import { test } from "node:test";
import { strict as assert } from "node:assert";

import {
  isRecord,
  decodeString,
  decodeNumber,
  mapUser,
  decodeUser,
  decodePositiveIntParam,
} from "../exercises/05-runtime-boundaries.js";

test("isRecord accepts plain objects and rejects everything else", () => {
  assert.equal(isRecord({ a: 1 }), true);
  assert.equal(isRecord(null), false);
  assert.equal(isRecord("nope"), false);
  assert.equal(isRecord(42), false);
});

test("decodeString / decodeNumber accept the right primitive", () => {
  const ok = decodeString("hi", "name");
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.value, "hi");

  assert.equal(decodeNumber(3, "age").ok, true);
  assert.equal(decodeString(5, "name").ok, false);
  assert.equal(decodeNumber("5", "age").ok, false);
});

test("mapUser converts a DTO to the domain model", () => {
  const user = mapUser({
    user_id: "1",
    user_email: "sonik@example.com",
    active: true,
  });
  assert.deepEqual(user, { id: "1", email: "sonik@example.com", isActive: true });
});

test("decodeUser decodes valid input and rejects invalid input", () => {
  const good = decodeUser({
    user_id: "1",
    user_email: "sonik@example.com",
    active: true,
  });
  assert.equal(good.ok, true);
  if (good.ok) {
    assert.deepEqual(good.value, {
      id: "1",
      email: "sonik@example.com",
      isActive: true,
    });
  }
  assert.equal(decodeUser({ user_id: 1 }).ok, false);
});

test("decodePositiveIntParam parses positive integers only", () => {
  const ok = decodePositiveIntParam("42", "page");
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.value, 42);

  assert.equal(decodePositiveIntParam("-1", "page").ok, false);
  assert.equal(decodePositiveIntParam(null, "page").ok, false);
  assert.equal(decodePositiveIntParam("abc", "page").ok, false);
});
