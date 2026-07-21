# Module 2: Objects and Functions - Learning Guide

## Overview

This module teaches you how **TypeScript sees objects**—not by their names, but by their shapes.

You'll learn:
- **Structural typing**: shapes matter, names don't
- **Function contracts**: weak vs. strong design
- **Compatibility rules**: when objects fit where they're expected
- **Property access safety**: using keyof and indexed types
- **Immutability promises**: readonly keyword

By the end, you will understand why TypeScript allows some surprising things—and why those things are actually correct.

## Philosophy

**Structural typing is powerful because it removes unnecessary ceremony.**

In Java:
```java
class Point extends Coordinate { }  // Must declare inheritance upfront
```

In TypeScript:
```ts
const point = { x: 1, y: 2 };
const coord: Coordinate = point;  // Works automatically—shape matches
```

This means **less planning, more flexibility**. But it also means **thinking about shapes instead of classes**.

## Learning Structure

Unlike Modules 1–3, we are **not repeating concepts**.

- **lesson.md**: Core concepts with examples EMBEDDED
- **examples/02-objects-functions-gotchas.ts**: EDGE CASES & TRICKY PATTERNS (not basics)
- **exercises/02-objects-functions.ts**: DIFFERENT SCENARIOS combining concepts
- **assignments/module-2-assignment.md**: REAL PRODUCTION PATTERN (configuration manager)

This means:

- Read lesson, understand concepts
- Study gotchas to avoid pitfalls
- Solve exercises for different use cases
- Build assignment to integrate everything

**No repetition. Variety keeps you engaged.**

## Time Allocation

- **Lesson reading**: ~40 minutes
- **Studying gotchas**: ~30 minutes
- **Solving exercises**: ~80 minutes
- **Assignment project**: ~2–3 hours
- **Total**: ~3–4 hours

Shorter than Modules 1 and 3, but more challenging conceptually.

## Phase 1: Read Lesson (40 minutes)

Open `lesson.md`. Read sequentially:

1. **The Big Picture** — Why structural typing matters
2. **Part 1: Structural Typing Fundamentals** — How shapes work
3. **Part 2: Objects in Detail** — Excess property checks, optional, index signatures, readonly
4. **Part 3: Function Contracts** — Weak vs. strong, keyof with generics
5. **Part 4: Function Parameter Design** — Objects vs. multiple params, discriminated unions
6. **Part 5: Compatibility Rules** — The surprising bits (contravariance, assignment direction)
7. **Common Patterns** — Plugin systems, configs, data transformation
8. **What NOT To Do** — Anti-patterns to avoid

**Goal**: Understand WHY each concept exists and WHEN you'd use it.

## Phase 2: Study Gotchas (30 minutes)

Run the gotchas file:

```bash
npm run example -- examples/02-objects-functions-gotchas.ts
```

12 edge cases that will trip you up:

1. Excess property checks (only on literals, not variables)
2. Optional vs. missing property differences
3. Readonly doesn't protect at runtime
4. Contravariance in function parameters
5. Index signatures lose type safety
6. Structural typing allows unintended matches
7. Generic constraints can be too loose
8. Assignment direction matters
9. Functions have different compatibility rules
10. Type widening affects assignment
11. Readonly is shallow
12. Optional doesn't allow extra fields

**For each gotcha**:

1. Read the code and explanation
2. Understand the trap
3. See the solution or workaround
4. Remember: "Don't do this"

## Phase 3: Solve Exercises (80 minutes)

Open `exercises/02-objects-functions.ts`.

10 exercises covering DIFFERENT scenarios than lesson examples:

1. Plugin system (accept any shape with required properties)
2. Configuration merger (safely merge nested objects)
3. Type-safe event handlers (different events, different payloads)
4. Adapter pattern (convert one shape to another)
5. Conditional field requirements (discriminated unions)
6. Deep object updates (nested keyof constraints)
7. Readonly configuration (immutability with safe mutations)
8. API response handler (discriminated union status codes)
9. Form builder (schema → TypeScript types)
10. Recursive object mapper (transform nested structures)

**Plus bonus**: Type-safe object merge

**Solving strategy**:

- Do exercises 1–4 first (warm up)
- Move to 5–7 (using pattern combinations)
- Tackle 8–10 if confident (real challenge)
- Try bonus for extra mastery

**When stuck**:

1. Re-read relevant lesson section
2. Review gotchas file
3. Look at solutions file for guidance
4. Try a simpler version of the problem

## Phase 4: Answer Conceptual Questions (optional, 30 minutes)

Open `conceptual-questions.md`.

10 deep questions that challenge your understanding:

1. When is structural typing a problem? (Brand properties)
2. Should you use readonly for runtime safety? (Intent vs. enforcement)
3. Weak contracts vs. over-specification (Finding the middle ground)
4. Type systems: nominal vs. structural (Trade-offs)
5. Parameter objects vs. multiple parameters (When to choose which)
6. Excess property checks—why only on literals? (Assume intent)
7. Index signatures lose type safety—when use them? (Genuine flexibility)
8. Functions are contravariant—why matters? (Caller perspective)
9. Type-safe plugin systems (Structural flexibility with constraints)
10. Readonly on nested properties (Shallow vs. deep)

These are **discussion questions**—no single right answer. Write 2–3 sentences explaining your thinking.

## Phase 5: Build Assignment (2–3 hours)

Open `assignments/module-2-assignment.md`.

**The project: Configuration Manager**

You will implement:

1. **Configuration types** (database, server, logging, app)
2. **Validation plugin system** (custom validators for each section)
3. **Configuration merger** (dev + prod overrides)
4. **Type-safe access** (keyof-based getConfig)
5. **Configuration loader** (from env, file, or defaults)
6. **Conditional properties** (stretch goal)
7. **Field-level validation** (stretch goal)

This is a **real production pattern** used in:
- dotenv, config modules (Node.js)
- Environment variable parsers
- Docker/Kubernetes config management
- Cloud service APIs

### Expected Workflow

1. Define types for database, server, logging configs
2. Create validator rule and plugin system
3. Implement config merger
4. Write type-safe getConfig function
5. Build ConfigLoader
6. Add conditional properties (stretch)
7. Implement field-level errors (stretch)

Use `npm run typecheck` frequently. Errors guide you.

## Key Concepts Checklist

Before moving to Module 3, verify:

- [ ] Structural typing: shapes matter, names don't
- [ ] Excess property checks: only on object literals
- [ ] Weak contracts: `(field: string, value: unknown)` are less safe
- [ ] Strong contracts: specific types prevent errors
- [ ] `keyof`: gets property names
- [ ] Indexed access: `T[K]` gets property type
- [ ] Readonly: immutability promise (compile-time only)
- [ ] Contravariance: functions accept MORE, return LESS
- [ ] Assignment direction: Extended → Base OK, Base → Extended NOT OK
- [ ] Discriminated unions: encode valid combinations

## Common Mistakes

### Mistake 1: Thinking readonly Prevents Runtime Mutation

```ts
// NO:
const config: readonly { apiKey: string } = { apiKey: "secret" };
// This doesn't stop: (config as any).apiKey = "hacked"
```

Readonly is a TypeScript-time promise, not a runtime guarantee.

### Mistake 2: Over-Using Index Signatures

```ts
// Avoid:
type FlexibleConfig = {
  [key: string]: any;  // Loses all type safety
};

// Prefer:
type FlexibleConfig = {
  id: string;
  [key: string]: string;  // At least value type is known
};
```

Index signatures are for genuine flexibility, not laziness.

### Mistake 3: Ignoring Assignment Direction

```ts
type Base = { id: string };
type Extended = { id: string; name: string };

// OK:
const base: Base = { id: "1", name: "Sonik" } as Extended;

// NOT OK:
const extended: Extended = { id: "1" };  // Missing name
```

Remember: You can assign MORE to LESS, not the other way around.

### Mistake 4: Using Weak Contracts When Strong Are Possible

```ts
// Weak (bad):
function update(id: string, field: string, value: unknown) { }

// Strong (good):
function updateUser<K extends keyof User>(id: string, field: K, value: User[K]) { }
```

Always prefer strong contracts that prevent invalid calls.

## Debugging Structural Typing Issues

When a type doesn't work:

1. **Check the shape**: Does the object have all required properties?
2. **Check property types**: Are they exactly compatible?
3. **Check assignment direction**: Are you assigning Extended → Base?
4. **Check generics**: Are constraints correct? Does `extends` make sense?
5. **Use typeof**: Check what TypeScript thinks the type is
6. **Test in isolation**: Create a small example that fails, verify expectation

## Resources

- `lesson.md` — Comprehensive explanations
- `examples/02-objects-functions-gotchas.ts` — 12 gotchas explained
- `exercises/02-objects-functions.ts` — 10 different scenarios
- `exercises/02-objects-functions-solutions.ts` — Complete solutions
- `course/02-objects-functions/conceptual-questions.md` — Deep questions
- `assignments/module-2-assignment.md` — Configuration manager project

## After This Module

You will understand:

- How TypeScript's structural typing is fundamentally different from nominal systems (Java, C#)
- How to design function contracts that prevent invalid calls
- When to use weak vs. strong contracts
- How to leverage `keyof` and indexed access for type safety
- How to build plugin systems that are both flexible and type-safe
- Readonly properties and their limitations
- Contravariance and why function compatibility works "backwards"

You are ready to understand **how real TypeScript libraries work**—libraries that use structural typing to provide flexibility without sacrificing type safety.

## Next Module

Module 3 will teach **Generics**—how to write types that work for many different types, not just one specific type.

Generics build on the concepts of structural typing and function contracts. You'll learn when generics are helpful and when they're over-engineering.

Good luck. Module 2 is where TypeScript starts feeling "different" from other languages.
