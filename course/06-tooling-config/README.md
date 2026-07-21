# Module 6: Tooling and Configuration - Learning Guide

## Outcome

After this module, you should be able to explain and defend the TypeScript configuration of a real project.

You will practice:

1. strictness strategy
2. compiler flag trade-offs
3. module resolution debugging
4. typecheck/build separation in CI

## No-Repetition Structure

- `lesson.md`: architecture-level understanding of compiler policy
- `examples/06-tooling-config-gotchas.ts`: practical surprises and anti-patterns
- `exercises/06-tooling-config.ts`: hands-on config modeling and typed tooling helpers
- `exercises/06-tooling-config-solutions.ts`: complete implementations
- `course/06-tooling-config/conceptual-questions.md`: design and operations thinking
- `assignments/module-6-assignment.md`: tsconfig hardening + migration plan project

## Suggested Flow

1. Study lesson (40 min)
2. Inspect gotchas (20 min)
3. Solve exercises (75-90 min)
4. Review solutions (30 min)
5. Complete assignment (2 hours)

## Readiness Checklist

- [ ] I can explain each strict flag enabled in this repository
- [ ] I can diagnose common module resolution issues
- [ ] I know what should run in CI before build/deploy
- [ ] I can plan an incremental strictness migration
- [ ] I can justify suppressions (`@ts-ignore`) with policy
