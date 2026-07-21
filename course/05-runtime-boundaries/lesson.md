# Module 5: Runtime Boundaries

## The Big Shift In This Module

Modules 1-4 taught you how to model code that is already in your control.

This module teaches what happens when data comes from outside your control.

Examples:

- HTTP responses
- Local storage
- Query params
- Form input
- File parsing
- Message queues
- Third-party SDK callbacks

At these boundaries, TypeScript cannot protect you unless you validate at runtime.

## Core Mental Model

TypeScript gives compile-time confidence.
Runtime boundaries require runtime proof.

Think in three layers:

1. Unknown input (unsafe)
2. Validation/decoding (proof)
3. Domain model (safe)

The biggest mistake: skipping layer 2.

## Why `as` Is Dangerous Here

```ts
type User = { id: string; email: string };

const raw = await fetch("/api/user").then(r => r.json());
const user = raw as User;
```

This compiles. But it does not verify anything.

If `raw = { id: 123 }`, you have silent runtime risk.

Use `as` only when you already proved the shape.

## Decode Pipeline Pattern

Use a predictable pipeline for all external data:

1. Receive `unknown`
2. Run validator/decoder
3. Convert to domain object
4. Return typed result or structured error

```ts
type DecodeResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: string[] };
```

This pattern scales from tiny scripts to enterprise services.

## Type Guards vs Assertion Functions

### Type Guard

```ts
function isUser(value: unknown): value is { id: string; email: string } {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.id === "string" && typeof obj.email === "string";
}
```

Use when you want boolean-based branching.

### Assertion Function

```ts
function assertUser(value: unknown): asserts value is { id: string; email: string } {
  if (!isUser(value)) {
    throw new Error("Invalid user payload");
  }
}
```

Use when invalid input should fail fast.

## DTO vs Domain Model

Do not leak raw transport data into domain logic.

### DTO (transport shape)

```ts
type UserDto = {
  user_id: string;
  user_email: string;
  created_at: string;
};
```

### Domain model (business shape)

```ts
type User = {
  id: string;
  email: string;
  createdAt: Date;
};
```

Map explicitly:

```ts
function toUser(dto: UserDto): User {
  return {
    id: dto.user_id,
    email: dto.user_email,
    createdAt: new Date(dto.created_at)
  };
}
```

This keeps domain logic clean and protects against API churn.

## Error Modeling At Boundaries

Avoid throwing unstructured strings everywhere.

Use typed error variants:

```ts
type BoundaryError =
  | { kind: "network"; message: string }
  | { kind: "invalid-json"; message: string }
  | { kind: "validation"; issues: string[] };
```

Now error handling is predictable and exhaustive.

## Schema Libraries (When To Use)

For larger systems, use runtime schema libraries:

- Zod
- Valibot
- io-ts
- Yup (form-focused)

When this module uses manual validators, it is to build fundamentals.

Production rule:

- Small utility: hand-written guard is fine
- Shared contract or API surface: prefer schema library

## Boundary Design Rules

1. Treat all external data as `unknown`
2. Validate at the edge, not deep inside business code
3. Convert DTO -> domain once
4. Return typed results, not vague strings
5. Never mix transport quirks into domain model

## What Not To Do

Bad patterns:

- `JSON.parse(...) as MyType` without checks
- global `any` for API clients
- optional-everything mega types (`{ a?: ..., b?: ..., c?: ... }`)
- catch blocks that swallow errors silently

Good patterns:

- narrow early
- model failures explicitly
- keep validation code testable and isolated

## Deep Skill Target For This Module

By the end, you should be able to answer:

1. Where are the runtime boundaries in my app?
2. Which boundaries have no validation yet?
3. Which domain models are contaminated by DTO fields?
4. Which `as` assertions can be removed by proper decoding?

If you can answer those, you are moving into senior TypeScript territory.