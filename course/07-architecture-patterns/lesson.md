# Module 7: Architecture Patterns

## Why This Module Exists

At this stage, syntax is not the bottleneck.

The real challenge is designing code so types enforce architecture decisions.

Great TypeScript architecture makes invalid states hard to represent and easy to detect.

## Core Mental Model

Types are executable design constraints.

Use them to define boundaries:

- who owns state transitions
- who may call external systems
- where runtime validation must occur
- what a function guarantees on success/failure

## Pattern 1: Workflow As Discriminated Union

Model states precisely:

```ts
type PaymentState =
	| { kind: "draft" }
	| { kind: "authorized"; authId: string }
	| { kind: "captured"; captureId: string }
	| { kind: "failed"; reason: string };
```

Now transitions can be guarded by function signatures instead of comments.

## Pattern 2: Ports and Adapters

Define internal contracts first (ports), then external integration (adapters).

```ts
type UserRepository = {
	findById(id: string): Promise<User | null>;
	save(user: User): Promise<void>;
};
```

Domain logic depends on this contract, not on ORM or HTTP details.

## Pattern 3: Command/Query Separation

Make side effects and reads explicit.

- commands mutate state and return result objects
- queries read projections and return read models

This reduces accidental coupling and hidden side effects.

## Pattern 4: Result Types Instead Of Ambiguous Throws

Prefer explicit result envelopes at service boundaries:

```ts
type ServiceResult<T, E> =
	| { ok: true; value: T }
	| { ok: false; error: E };
```

This improves composition and observability.

## Pattern 5: Anti-Corruption Layer For Third-Party APIs

Never leak external SDK types across your app.

Wrap them behind internal types:

1. adapter validates and maps SDK response
2. domain receives clean internal model

If vendor changes payload shape, one adapter changes, not the whole codebase.

## Pattern 6: Typed Policy Objects

Encode business rules as types + functions, not hidden conditionals.

Example: role-based permissions as explicit policy maps.

This makes authorization logic reviewable and testable.

## Pattern 7: Boundary Testing Strategy

Architecture and tests should align:

- unit tests for pure domain functions
- contract tests for adapters
- integration tests for real boundary behavior

TypeScript reduces certain bugs, but boundary tests still catch runtime drift.

## Architecture Smells To Watch

1. Massive optional DTOs used everywhere
2. Domain code importing HTTP response types directly
3. Widespread `as any` to bypass friction
4. Services returning mixed success/error shapes unpredictably
5. State machines implemented as booleans and comments

## Simplicity Rule

Do not chase type cleverness.

A readable union plus straightforward functions beats a type-level puzzle no one can maintain.

## Refactoring Playbook

When architecture is messy:

1. identify boundary points
2. define internal contracts (ports)
3. introduce adapters incrementally
4. move state logic to discriminated unions
5. replace exceptions with explicit result types where useful

## Deep Skill Target

By end of this module, you should be able to:

1. model workflows safely with unions
2. isolate unsafe integrations behind adapters
3. design service APIs with clear typed contracts
4. refactor a fragile area into a maintainable typed architecture