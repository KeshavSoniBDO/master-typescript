# Module 5: Runtime Boundaries - Conceptual Questions

These are senior-level design questions, not syntax drills. There are no single
right answers — only better-reasoned ones. For each question, write your answer,
then ground it in a concrete example from a real codebase you have worked on.

1. Where are the top three runtime boundaries in this repository right now, and how are they validated today?
2. Why is `JSON.parse(text) as User` usually a design smell even when it compiles?
3. When should a boundary decoder return a typed error result instead of throwing?
4. What is the trade-off between hand-written guards and schema libraries?
5. How does separating DTOs from domain models reduce future migration risk?
6. If validation is expensive, where should caching happen without weakening safety?
7. What kinds of bugs survive TypeScript but are caught by runtime decoders?
8. What does a "good" validation error look like for API consumers?
9. Which failures should be recoverable and which should fail fast?
10. If a team uses `any` at boundaries "temporarily", how do you prevent it becoming permanent?
