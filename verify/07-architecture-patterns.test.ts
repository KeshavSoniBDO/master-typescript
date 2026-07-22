// Module 7: Architecture Patterns — self-check.
//
// Run: npm run verify:07
//
// Fails until you implement the workflow, ports, and policies in
// exercises/07-architecture-patterns.ts.

import { test } from "node:test";
import { strict as assert } from "node:assert";

import {
  describeTicketState,
  startProgress,
  createTicket,
  InMemoryTicketRepository,
  canCloseTicket,
  getResolutionSummary,
} from "../exercises/07-architecture-patterns.js";

test("describeTicketState returns a non-empty description", () => {
  const text = describeTicketState({ kind: "open", createdAt: new Date() });
  assert.equal(typeof text, "string");
  assert.ok(text.length > 0);
});

test("startProgress advances an open ticket to in-progress", () => {
  const next = startProgress({ kind: "open", createdAt: new Date() }, "sonik");
  assert.equal(next.kind, "in-progress");
  if (next.kind === "in-progress") {
    assert.equal(next.assignedTo, "sonik");
  }
});

test("createTicket succeeds for a valid title", () => {
  const result = createTicket("Fix login");
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.title, "Fix login");
  }
});

test("InMemoryTicketRepository saves and finds tickets", async () => {
  const repo = new InMemoryTicketRepository();
  const ticket = {
    id: "t1",
    title: "Fix login",
    state: { kind: "open" as const, createdAt: new Date() },
  };
  await repo.save(ticket);
  const found = await repo.findById("t1");
  assert.equal(found?.id, "t1");
  assert.equal(await repo.findById("missing"), null);
});

test("canCloseTicket only allows closing a resolved ticket", () => {
  const resolved = canCloseTicket({
    kind: "resolved",
    resolvedAt: new Date(),
    resolution: "done",
  });
  assert.equal(resolved.allowed, true);

  const open = canCloseTicket({ kind: "open", createdAt: new Date() });
  assert.equal(open.allowed, false);
});

test("getResolutionSummary summarizes a resolved ticket", () => {
  const summary = getResolutionSummary({
    kind: "resolved",
    resolvedAt: new Date(),
    resolution: "patched",
  });
  assert.ok(summary.length > 0);
});
