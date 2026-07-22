// Module 3: Generics — self-check.
//
// Run: npm run verify:03
//
// Fails until you implement the generic classes in exercises/03-generics.ts.

import { test } from "node:test";
import { strict as assert } from "node:assert";

import {
  GenericCache,
  SafeArray,
  PluginRegistry,
  EventEmitter,
} from "../exercises/03-generics.js";

test("GenericCache stores, retrieves, and falls back", () => {
  const cache = new GenericCache<string>();
  cache.set("name", "Sonik");
  assert.equal(cache.get("name"), "Sonik");
  assert.equal(cache.get("missing"), undefined);
  assert.equal(cache.getOrDefault("missing", "fallback"), "fallback");
});

test("SafeArray maps, filters, and bounds-checks", () => {
  const arr = new SafeArray([1, 2, 3, 4, 5]);
  assert.equal(arr.length, 5);
  assert.equal(arr.get(0), 1);
  assert.equal(arr.get(10), undefined);

  const doubled = arr.map((n) => n * 2);
  assert.equal(doubled.get(0), 2);
  assert.equal(doubled.length, 5);

  const big = arr.filter((n) => n > 2);
  assert.equal(big.length, 3);
  assert.equal(big.get(0), 3);
});

test("PluginRegistry runs every registered handler in order", () => {
  const registry = new PluginRegistry<string>();
  registry.register({ name: "uppercase", handler: (s) => s.toUpperCase() });
  registry.register({
    name: "reverse",
    handler: (s) => s.split("").reverse().join(""),
  });
  assert.equal(registry.count(), 2);
  assert.deepEqual(registry.execute("hello"), ["HELLO", "olleh"]);
});

test("EventEmitter delivers typed payloads to subscribers", () => {
  const emitter = new EventEmitter<{ login: { userId: string } }>();
  let received = "";
  emitter.on("login", (data) => {
    received = data.userId;
  });
  emitter.emit("login", { userId: "user1" });
  assert.equal(received, "user1");
});
