# Module 4: Advanced Types - Learning Guide

## Overview

This module teaches you to **think in types**—to write types that adapt, transform, and validate.

Modules 1–3 taught you the rules. This module teaches you to **break those rules intentionally** using advanced techniques.

By the end, you will understand:

- Conditional types (types that decide based on logic)
- Mapped types (transforming every property of an object type)
- Template literal types (building string patterns from parts)
- The `infer` keyword (extracting types from inside types)
- Utility types (TypeScript's built-in helpers)
- When to use each pattern (and when not to)

## Learning Structure

Unlike Modules 1–3, we are **not repeating concepts**.

- **lesson.md**: Core concepts with examples EMBEDDED
- **examples/04-advanced-types-gotchas.ts**: EDGE CASES & TRICKY PATTERNS (not basics)
- **exercises/04-advanced-types.ts**: DIFFERENT SCENARIOS combining concepts
- **assignment**: REAL PRODUCTION PATTERN (type-safe form builder)

This means:

- Read lesson, understand concepts
- Study gotchas to avoid pitfalls
- Solve exercises for different use cases
- Build assignment to integrate everything

**No repetition. No boredom.**

## Time Allocation

- **Lesson reading**: ~50 minutes
- **Studying gotchas**: ~30 minutes
- **Solving exercises**: ~90 minutes
- **Assignment project**: ~2–3 hours
- **Total**: ~4–5 hours

Similar to Module 3, but more concentrated.

## Phase 1: Read Lesson (50 minutes)

Open `lesson.md`. Read sequentially:

1. **The Big Picture** — Why advanced types matter
2. **Part 1: Conditional Types** — if/else for types
3. **Part 2: The `infer` Keyword** — Extract types from types
4. **Part 3: Mapped Types** — Transform every property
5. **Part 4: Template Literal Types** — Build string patterns
6. **Part 5: Combining Everything** — Event emitter pattern
7. **Part 6: Utility Types** — TypeScript's built-in helpers
8. **Part 7: Distributive Conditional Types** — The gotcha
9. **Part 8: Common Mistakes** — Avoid these
10. **Part 9: Real Production Pattern** — Schema validation

**Goal**: Understand WHAT each technique does and WHY.

## Phase 2: Study Gotchas (30 minutes)

Run the gotchas file:

```bash
npm run example examples/04-advanced-types-gotchas.ts
```

10 edge cases that will trip you up:

1. Distributive conditional types (unions spread automatically)
2. `keyof` on non-objects
3. Template literal type explosion (combinatorial)
4. Array element extraction (wrong ways)
5. Circular type references
6. Mapped type modifiers
7. Multiple `infer` positions
8. Function return type extraction
9. Union to intersection conversion
10. Template literals with `never`

**For each gotcha**:

1. Read the explanation
2. Understand the problem
3. See the solution
4. Remember: "Don't do this"

## Phase 3: Solve Exercises (90 minutes)

Open `exercises/04-advanced-types.ts`.

10 exercises covering DIFFERENT scenarios than lesson examples:

1. Extract types from API responses
2. Build strict partial types
3. Filter unions by type
4. Reverse object types (keys ↔ values)
5. Create getters and setters
6. Extract function parameter types
7. Chain type transformations
8. Build schema validators
9. Compose validators
10. Form field descriptors (hard)

**Plus bonus**: Union to object conversion (very hard)

**Solving strategy**:

- Do exercises 1–5 first (warm up)
- Move to 6–8 (using pattern combinations)
- Tackle 9–10 if confident (real challenge)
- Try bonus for extra mastery

**When stuck**:

1. Re-read relevant lesson section
2. Review gotchas file
3. Try a simpler version of the problem
4. Come back to it later

## Phase 4: Build Assignment (2–3 hours)

Open `assignments/module-4-assignment.md`.

**The project: Type-Safe Form Builder**

You will implement:

1. **Field types** (text, email, number, checkbox)
2. **Schema type** (object of fields)
3. **Extract form values** (schema → TypeScript type)
4. **Validator function** (runtime validation)
5. **Form builder** (type-safe component)
6. **Field-level errors** (detailed validation results)
7. **Dynamic schemas** (stretch goal)

This is a **real production pattern** used in:
- React Hook Form
- Zod / Yup
- Prisma
- tRPC

### Why This Assignment

It forces you to:

- Write conditional types (if field is required)
- Use mapped types (transform schema keys)
- Combine multiple patterns
- Think about types AND runtime behavior
- Build something actually useful

### Expected Workflow

1. Define field types (Part 1)
2. Create schema type (Part 2)
3. Write `ExtractFormValues` (Part 3) — hardest part
4. Implement validator (Part 4)
5. Create form builder (Part 5)
6. Add field-level errors (Part 6)
7. Try dynamic schemas (Part 7 stretch)

Use `npm run typecheck` frequently. Errors guide you.

## Key Concepts Checklist

Before moving to Module 5, verify:

- [ ] Conditional types: `T extends U ? X : Y`
- [ ] `infer`: Extracting types from inside types
- [ ] Mapped types: `{ [K in keyof T]: T[K] }`
- [ ] Template literal types: `` `${T}` ``
- [ ] Distributivity: Unions spread through conditionals
- [ ] Utility types: Partial, Required, Pick, Omit, Record, etc.
- [ ] `keyof`: Gets property names
- [ ] Constraints: Limiting generic types
- [ ] Real patterns: Event emitters, schema validation, form builders

## Common Mistakes

### Mistake 1: Over-Using Advanced Types

```ts
// Do NOT do this for simple cases:
type Simple<T> = T extends string ? "yes" : "no";

// Sometimes just this is better:
type SimplerApproach = string | number;
```

Advanced types are for **hard problems**, not every type.

### Mistake 2: Infinite Recursion

```ts
// Avoid:
type Flatten<T> = T extends (infer E)[] ? Flatten<E> : T;

// Can cause performance issues with deep nesting
```

Add depth guards for recursive types.

### Mistake 3: Ignoring Distributivity

```ts
// Gotcha:
type Check<T> = T extends string ? true : false;
type Result = Check<string | number>;  // true | false (unexpected)

// Solution:
type CheckNoDistribute<T> = [T] extends [string] ? true : false;
type Result2 = CheckNoDistribute<string | number>;  // false
```

Remember: unions distribute automatically.

### Mistake 4: Complex Types Without `satisfies`

```ts
// Pre-4.9:
const obj = { a: "hello" } as const;

// TypeScript 4.9+:
const obj2 = { a: "hello" } satisfies { a: string };

// satisfies is clearer—it checks AND keeps inferred types
```

## Debugging Advanced Types

When a type does not work:

1. **Simplify**: Remove parts until it compiles
2. **Test components**: Check conditional types separately
3. **Check constraints**: Does T have what you assume?
4. **Watch distributivity**: Wrap in `[]` if unexpected
5. **Use `infer` correctly**: Only in conditional extensions
6. **Verify with examples**: Test with actual values

## Resources

- `lesson.md` — Comprehensive explanations
- `examples/04-advanced-types-gotchas.ts` — 10 gotchas explained
- `exercises/04-advanced-types.ts` — 10 different scenarios
- `assignments/module-4-assignment.md` — Form builder project

## After This Module

You will understand:

- How libraries like Zod, Prisma, React Query infer types
- How to write types that transform other types
- When advanced types are worth it vs. when to use `any`
- Patterns that prevent impossible states in code
- Real patterns from production codebases

You are ready to read **library source code** and understand advanced type patterns.

## Next Module

Module 5 will teach **Decorators, Enums, Namespaces** and how types work at **runtime**.

Good luck. This module is where TypeScript stops being about "preventing bugs" and starts being about "expressing intent perfectly."
