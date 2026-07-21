# Module 7 Assignment: Typed Service Architecture Refactor

## Goal

Design and implement a small but realistic service architecture where TypeScript enforces boundaries and workflow rules.

## Deliverables

Create `assignments/module-7-architecture.ts` and implement all parts.

## Scenario

You are building a ticketing workflow service with external integration.

## Part 1: Workflow State Model

Define a discriminated union for ticket lifecycle:

- `open`
- `in-progress`
- `resolved`
- `closed`

Rules:

- each state carries only relevant fields
- impossible combinations must be unrepresentable

## Part 2: Transition Functions

Implement transition functions that enforce valid moves:

- `open -> in-progress`
- `in-progress -> resolved`
- `resolved -> closed`

Invalid transitions should return typed errors.

## Part 3: Port Contracts

Define ports/interfaces for:

- repository
- notification gateway
- audit logger

Domain logic must depend on ports, not concrete classes.

## Part 4: In-Memory Adapters

Create in-memory implementations for each port.

These should satisfy contracts and support local testing.

## Part 5: External DTO Adapter

Simulate external payload decoding and mapping:

- decode unknown payload to DTO
- map DTO to domain model
- return typed decode errors if invalid

## Part 6: Service Layer

Implement a `TicketService` use-case method `resolveTicket` that:

1. loads ticket
2. validates transition
3. persists update
4. emits notification
5. logs audit
6. returns typed result

## Part 7: Smell Detection Utility

Implement a helper that scans source text and flags architecture smells:

- `as any` in service code
- DTO field names in domain namespace
- optional-heavy state objects

## Stretch Goals

1. split write model and read model
2. add policy engine for role-based transitions
3. add idempotency handling to transition commands

## Quality Checklist

- no invalid workflow state combinations
- no domain dependency on external payload shape
- explicit result types for service operations
- adapters isolated behind typed ports
- `npm run typecheck` passes

## Why This Matters

This assignment connects typing skill to architecture quality.

You are not just writing TypeScript. You are designing safer systems.
