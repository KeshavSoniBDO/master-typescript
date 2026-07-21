# Module 5: Runtime Boundaries - Learning Guide

## Outcome

After this module, you should be able to safely handle external data without lying to TypeScript.

You will practice:

1. decoding `unknown` into trusted types
2. writing reusable validators and assertions
3. separating DTOs from domain models
4. modeling boundary errors explicitly

## No-Repetition Structure

- `lesson.md`: Core concepts and architecture mental model
- `examples/05-runtime-boundaries-gotchas.ts`: edge cases and failure modes
- `exercises/05-runtime-boundaries.ts`: practical decoding and validation scenarios
- `exercises/05-runtime-boundaries-solutions.ts`: complete implementations
- `course/05-runtime-boundaries/conceptual-questions.md`: design-level thinking prompts
- `assignments/module-5-assignment.md`: production-style boundary layer project

## Suggested Study Flow

1. Read `lesson.md` slowly (40-50 min)
2. Inspect gotchas file and predict failures (20-30 min)
3. Solve exercises without solutions first (90 min)
4. Review solutions and compare trade-offs (30 min)
5. Complete assignment as a mini project (2-3 hours)

## Readiness Checklist

- [ ] I never trust external data without validation
- [ ] I can explain the difference between `as`, guard, and assertion function
- [ ] I can model decoding result types without `any`
- [ ] I keep DTOs separate from domain models
- [ ] I can return typed boundary errors

## Quality Rule

In this module, code that compiles but skips runtime validation counts as incorrect.
