# Module 7: Architecture Patterns

## Core Mental Model

TypeScript is strongest when types express business rules, not just data shapes.

The aim is to make invalid states difficult or impossible to represent.

## Important Ideas

- Use discriminated unions for workflows and states.
- Keep unsafe external data at the edges.
- Convert DTOs into domain objects after validation.
- Use precise function contracts for service layers.
- Avoid type cleverness that makes code harder to change.

## What To Practice

- Model a real workflow as a union.
- Create typed adapters around unsafe APIs.
- Refactor broad optional objects into precise variants.
- Decide when simple types are better than advanced types.