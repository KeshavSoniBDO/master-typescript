# Final Capstone: Type-Safe Ticket Platform Slice

## Objective

Build a mini vertical slice that integrates all modules:

1. runtime boundary decoding
2. domain workflow modeling
3. typed service contracts
4. configuration and quality gates

## Build Requirements

Create `assessments/final-capstone.ts`.

### Part A: Boundary Layer

- decode unknown API payload for `TicketDto`
- map to domain `Ticket`
- return `DecodeResult<Ticket>` with structured issues

### Part B: Domain Workflow

Model ticket states as discriminated union:

- `open`
- `in-progress`
- `resolved`
- `closed`

Add typed transition functions with invalid transition errors.

### Part C: Service Layer

Define ports:

- `TicketRepository`
- `Notifier`
- `AuditLogger`

Implement `resolveTicket` use case returning explicit result union.

### Part D: Config Boundary

- parse raw env map (`Record<string, string | undefined>`)
- validate into typed config object
- reject invalid/missing settings

### Part E: Architecture Smell Check

Create helper that flags:

- blind `as` assertions on external payloads
- use of `any` in service layer
- DTO names leaking into domain namespace

## Constraints

- no `any` in core logic
- no unchecked blind assertions for boundary payloads
- `npm run typecheck` must pass
- types should stay readable for future maintainers

## Deliverables

1. `assessments/final-capstone.ts`
2. short reflection in `assessments/final-capstone-reflection.md`:
   - trade-offs you made
   - what you would harden next
   - where runtime risks still exist

## Evaluation Rubric

1. Correctness (30%)
2. Boundary Safety (25%)
3. Type Design Clarity (20%)
4. Architecture Separation (15%)
5. Maintainability (10%)

## Completion Standard

Capstone is complete when:

- all parts compile cleanly
- service flow is end-to-end typed
- boundary and architecture rules are enforced by design
