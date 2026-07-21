# Module 7: Architecture Patterns - Learning Guide

## Outcome

After this module, you should be able to use TypeScript to enforce architecture boundaries, not just annotate shapes.

You will practice:

1. workflow/state modeling with discriminated unions
2. ports/adapters and anti-corruption layers
3. typed service contracts and result envelopes
4. invalid-state elimination by design

## No-Repetition Structure

- `lesson.md`: architecture-level patterns and trade-offs
- `examples/07-architecture-patterns-gotchas.ts`: design mistakes and corrected patterns
- `exercises/07-architecture-patterns.ts`: domain modeling and service boundary tasks
- `exercises/07-architecture-patterns-solutions.ts`: complete implementations
- `course/07-architecture-patterns/conceptual-questions.md`: architecture reasoning prompts
- `assignments/module-7-assignment.md`: end-to-end domain boundary design project

## Suggested Flow

1. Read lesson (45 min)
2. Study gotchas and compare alternatives (30 min)
3. Solve exercises (90-120 min)
4. Review solutions (30 min)
5. Complete assignment (2-3 hours)

## Readiness Checklist

- [ ] I can model a workflow with discriminated unions
- [ ] I can separate domain contracts from infrastructure details
- [ ] I can design typed service result envelopes
- [ ] I can identify architecture smells in broad optional-object designs
- [ ] I can explain why boundary adapters reduce long-term risk
