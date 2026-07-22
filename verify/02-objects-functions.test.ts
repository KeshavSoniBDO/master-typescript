// Module 2: Objects & Functions — self-check.
//
// Run: npm run verify:02
//
// Fails until you implement the matching exercise in
// exercises/02-objects-functions.ts. Green means your solution matches
// the reference behavior.

import { test } from "node:test";
import { strict as assert } from "node:assert";

import {
  adaptUser,
  mergeConfigs,
  withConfig,
} from "../exercises/02-objects-functions.js";

test("adaptUser maps a snake_case API shape to the camelCase app shape", () => {
  const result = adaptUser({
    user_id: "1",
    user_name: "Sonik",
    user_email: "sonik@example.com",
  });
  assert.deepEqual(result, {
    id: "1",
    name: "Sonik",
    email: "sonik@example.com",
  });
});

test("mergeConfigs overrides selected fields and keeps the rest", () => {
  const base = {
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "secret",
  };
  const merged = mergeConfigs(base, { port: 3306 });
  assert.equal(merged.port, 3306);
  assert.equal(merged.host, "localhost");
  assert.equal(merged.username, "admin");
});

test("withConfig returns a NEW object with updated fields and untouched credentials", () => {
  const config = {
    host: "localhost",
    port: 5432,
    credentials: { username: "admin", password: "secret" },
  };
  const next = withConfig(config, { host: "prod.example.com", port: 3306 });
  assert.equal(next.host, "prod.example.com");
  assert.equal(next.port, 3306);
  assert.deepEqual(next.credentials, { username: "admin", password: "secret" });
  assert.notEqual(next, config);
});
