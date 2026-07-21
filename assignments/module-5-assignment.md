# Module 5 Assignment: Runtime-Safe API Boundary Layer

## Goal

Build a boundary layer that converts unknown API payloads into trusted domain objects.

This assignment should feel like a real backend/frontend integration task.

## Deliverables

Create `assignments/module-5-boundary-layer.ts` implementing all parts.

## Part 1: Result and Error Model

Define:

1. `DecodeResult<T>` success/failure union
2. `BoundaryError` union (`network`, `invalid-json`, `validation`)
3. helper functions for error construction

## Part 2: DTO and Domain Separation

Model at least two DTO/domain pairs:

1. `UserDto` -> `User`
2. `OrderDto` -> `Order`

Requirements:

- DTO uses API naming conventions (snake_case)
- Domain uses app naming conventions (camelCase, Date where needed)

## Part 3: Primitive Decoders

Implement reusable decoders:

- `decodeString`
- `decodeNumber`
- `decodeBoolean`
- `decodeIsoDate`

Each returns `DecodeResult<T>`.

## Part 4: Object Decoders

Implement decoders for `UserDto` and `OrderDto` using primitive decoders.

Rules:

- collect all field issues, do not fail on first issue
- include field names in issue messages

## Part 5: Mapping to Domain

Map decoded DTOs into domain models.

Add at least one domain-level validation rule that is not in DTO shape.

Example: `order.total > 0`.

## Part 6: End-to-End Boundary Function

Implement functions:

- `decodeUserBoundary(raw: unknown): DecodeResult<User>`
- `decodeOrderBoundary(raw: unknown): DecodeResult<Order>`

These should perform decode + map + domain validation.

## Part 7: Batch Decode

Implement batch decoder:

`decodeOrdersBoundary(raw: unknown): DecodeResult<Order[]>`

Requirements:

- accepts unknown
- validates array shape
- returns indexed issue messages

## Stretch Goals

1. Generic `decodeObject` builder from decoder shape
2. telemetry-friendly error format with codes
3. partial-success mode (`successes` + `failures`)

## Quality Checklist

- No `any` in core decoding flow
- No blind `as` assertions for external payloads
- Errors are typed and actionable
- Domain models never expose raw DTO field names
- `npm run typecheck` passes

## Why This Matters

This assignment is the difference between "typed code" and "reliable systems".

A strong boundary layer protects everything downstream.
