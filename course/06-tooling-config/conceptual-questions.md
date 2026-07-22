# Module 6: Tooling and Configuration - Conceptual Questions

These are senior-level design questions, not syntax drills. There are no single
right answers — only better-reasoned ones. For each question, write your answer,
then ground it in a concrete example from a real codebase you have worked on.

1. Which compiler flags in this repo prevent the highest-risk production bugs?
2. When is temporarily relaxing strictness acceptable, and what guardrails are required?
3. Why should `typecheck` be a separate CI step from build?
4. How does module system choice (`NodeNext`, `ESNext`, `CommonJS`) affect architecture decisions?
5. What is a responsible policy for `@ts-ignore` and `@ts-expect-error`?
6. How do you migrate a large legacy repository to strict mode without freezing delivery?
7. Which TypeScript errors should block merge immediately vs become debt tickets?
8. What team practices keep `tsconfig` from drifting into inconsistent states?
9. Why can a project compile locally but fail in CI even with the same code?
10. How do you decide whether a compiler warning should become an enforced rule?
