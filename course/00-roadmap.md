# TypeScript Mastery Roadmap

## Phase 1: Foundations That Actually Matter

Learn what TypeScript checks, what JavaScript still does at runtime, and why `strict` mode changes how you think.

Topics:

- JavaScript runtime values vs TypeScript static types
- Type annotations and inference
- `any`, `unknown`, and `never`
- Unions, literals, optional properties
- Control-flow narrowing
- Type errors as design feedback

## Phase 2: Working With Objects and Functions

Most real TypeScript lives here.

Topics:

- Function parameter and return type design
- Object types, interfaces, and type aliases
- Structural typing
- Excess property checks
- Readonly data and immutability
- Index signatures and records

## Phase 3: Generics

Generics are how we preserve relationships between inputs and outputs.

Topics:

- Generic functions
- Generic constraints
- Key-based access with `keyof`
- Generic interfaces and classes
- Default type parameters
- Inference-friendly API design

## Phase 4: Advanced Type Modeling

This is where TypeScript starts feeling like a type-level design language.

Topics:

- Mapped types
- Conditional types
- Template literal types
- Discriminated unions
- Utility types
- Type-level transformations
- Exhaustiveness checking

## Phase 5: Runtime Boundaries

The compiler cannot validate external data. Senior developers know this boundary well.

Topics:

- Parsing API responses safely
- Type guards and assertion functions
- Schema validation concepts
- Error handling with `unknown`
- Designing DTOs vs domain models

## Phase 6: Tooling and Configuration

Strong TypeScript depends on strong project configuration.

Topics:

- `tsconfig` options
- Module systems
- Build vs typecheck
- Declarations
- Library typing
- Monorepo and package typing basics

## Phase 7: Real Developer Patterns

Apply TypeScript to code architecture.

Topics:

- Typed service layers
- Repository and adapter boundaries
- State modeling
- Framework patterns in React and Angular
- Avoiding over-engineered types
- Reading type errors from third-party libraries

## Phase 8: Assessments and Projects

Once the learning phase is solid, we will create separate assignments and projects.

Possible projects:

- Typed command-line task tracker
- Runtime-safe API client
- Mini state machine library
- Form validation engine
- Typed event bus
- Angular or React type-pattern refactor

## Learning Rule

For every feature, ask two questions:

1. What JavaScript will run?
2. What assumptions is TypeScript checking before it runs?