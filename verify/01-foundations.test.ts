// Module 1: Foundations — self-check.
//
// Run: npm run verify:01
//
// Every test below fails until you implement the matching exercise in
// exercises/01-foundations.ts. A green run means your solution behaves
// exactly like the reference. This is your instant feedback loop.

import { test } from "node:test";
import { strict as assert } from "node:assert";

import {
  UserValidator,
  handleResponse,
  isError,
  isApiError,
  parseConfig,
  getEventType,
  getEventData,
  processInput,
  getPath,
} from "../exercises/01-foundations.js";

test("UserValidator accepts a well-formed user", () => {
  const result = new UserValidator().validate({
    id: "1",
    name: "Sonik",
    email: "sonik@example.com",
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.email, "sonik@example.com");
  }
});

test("UserValidator rejects a malformed user", () => {
  const result = new UserValidator().validate({ id: 123, name: "Sonik" });
  assert.equal(result.ok, false);
});

test("UserValidator rejects non-objects", () => {
  assert.equal(new UserValidator().validate("nope").ok, false);
  assert.equal(new UserValidator().validate(null).ok, false);
});

test("handleResponse narrows on the status discriminant", () => {
  assert.equal(handleResponse({ status: "loading" }), "Loading...");
  assert.equal(handleResponse({ status: "success", data: 42 }), "42");
  assert.equal(
    handleResponse({ status: "error", error: "Network failed" }),
    "Network failed"
  );
});

test("isError only matches real Error instances", () => {
  assert.equal(isError(new Error("boom")), true);
  assert.equal(isError({ message: "boom" }), false);
});

test("isApiError requires numeric code and string message", () => {
  assert.equal(isApiError({ code: 404, message: "Not found" }), true);
  assert.equal(isApiError({ code: "404", message: "x" }), false);
  assert.equal(isApiError("nope"), false);
});

test("parseConfig returns the object, or {} on invalid JSON", () => {
  assert.deepEqual(parseConfig('{"timeout":5000}'), { timeout: 5000 });
  assert.deepEqual(parseConfig("not json"), {});
});

test("getEventType / getEventData read the discriminated union", () => {
  assert.equal(getEventType({ type: "click", x: 1, y: 2 }), "click");
  assert.equal(getEventData({ type: "timer", duration: 5 }), 5);
});

test("processInput handles each primitive shape", () => {
  assert.equal(processInput("hi"), "HI");
  assert.equal(processInput(7), "7");
  assert.equal(processInput(true), "yes");
  assert.equal(processInput(null), "unsupported type");
});

test("getPath walks a dotted path safely", () => {
  const data = { user: { id: "1", profile: { name: "Sonik", age: 24 } } };
  assert.equal(getPath(data, "user.profile.name"), "Sonik");
  assert.equal(getPath(data, "user.unknown.path"), undefined);
});
