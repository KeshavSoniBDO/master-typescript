# Module 3: Generics - Learning Guide

## Overview

Generics are how TypeScript preserves type information as it flows through your code.

Without generics, functions lose information: "I receive an array of something, but I do not know what type that something is, so I can only return `unknown`."

With generics, the relationship is preserved: "I receive an array of `T`, so I return `T`—whatever `T` turns out to be."

This module teaches you to read, write, and reason about generic types. By the end, you will understand how to:

- Use `T` as a type slot
- Constrain what `T` can be
- Use `keyof` for safe property access
- Let TypeScript infer types automatically
- Avoid over-engineering with generics

## Time Allocation

- **Lesson reading**: ~40 minutes
- **Running examples**: ~30 minutes
- **Solving exercises**: ~90 minutes (struggle included)
- **Conceptual questions**: ~30 minutes
- **Assignment**: ~60–90 minutes
- **Total**: ~4–5 hours

This is substantial. Take breaks.

## Learning Path

### Phase 1: Read and Understand (40 minutes)

Open `lesson.md` and read sequentially:

1. **The Problem Generics Solve** — Why generics matter
2. **Key Mental Model** — Think of `T` as a slot
3. **Part 1: Basic Generics** — Single type parameters
4. **Part 2: Constraints** — Limiting what `T` can be
5. **Part 3: Multiple Type Parameters** — `T` and `U`
6. **Part 4: The `keyof` Operator** — Safe property access
7. **Part 5: Type Inference** — Let TypeScript figure it out
8. **Part 6: Default Type Parameters** — Sensible defaults
9. **Part 7: Conditional Types (Preview)** — Sneak peek at Module 4

**Goal**: Understand the concepts. Do not memorize syntax.

### Phase 2: Study Examples (30 minutes)

Run the examples:

```bash
npm run example -- examples/03-generics-gotchas.ts
```

Walk through each example:

- **Example 1**: Information loss problem vs. solution
- **Example 2**: Generic functions with transformation
- **Example 3**: Generic types (not just functions)
- **Example 4**: Constraints in action
- **Example 5**: `keyof` for safe property access
- **Example 6**: Type inference
- **Example 7**: Default type parameters
- **Example 8**: Multiple constraints

For each example:

1. Run it
2. Read the comments
3. Modify it (add a line, change a type, see the error)
4. Understand why TypeScript complained

### Phase 3: Solve Exercises (90 minutes)

Open `exercises/03-generics.ts`.

There are 11 exercises (+ bonus). Do them in order:

1. **Exercise 1–3**: Warm up (10 min each)
   - Generic function, generic type, multiple parameters
   - Should feel straightforward

2. **Exercise 4–6**: Constraints and keyof (20 min each)
   - Constraints to object, to properties, to specific structure
   - `keyof` for safe property access
   - Still following patterns from examples

3. **Exercise 7–9**: Combining patterns (30 min each)
   - Array transformation
   - Class constraints
   - Object merging
   - Requires thinking about relationships

4. **Exercise 10–11**: Hard (45–60 min each)
   - Function composition
   - Property picking with `keyof`
   - Challenge yourself—these are tricky

5. **Bonus**: Very hard (if 1–11 were easy)
   - Database filtering with generics
   - Real-world pattern

**Hints**:

- Do not look at solutions unless stuck for 10+ minutes
- If you hit an error, read it carefully—it often explains the problem
- Try different approaches. Some will fail, and that is how you learn
- Compile often: `npm run typecheck`

**When stuck**:

1. Read the error message word-by-word
2. Check the lesson for similar patterns
3. Study the examples again
4. Look at one hint from solutions
5. Try again without looking at the full solution

### Phase 4: Conceptual Questions (30 minutes)

Open `course/03-generics/conceptual-questions.md`.

10 questions explore when and why to use generics.

For each question:

1. Write your honest answer (not what you think is "right")
2. Think of a real example from your code
3. Compare your answer to the explanations

These questions have no "correct" answer. They are about understanding trade-offs:

- When is a generic helpful vs. over-engineered?
- How do you know if your generic is actually correct?
- When should you force explicit types vs. let TypeScript infer?

### Phase 5: Assignment (60–90 minutes)

Open `assignments/module-3-assignment.md`.

This is a **7-part project**: Build a typed API response wrapper.

You will implement:

1. `ApiResponse<T>` type (success/error discriminated union)
2. Type definitions for real data (User, Post, Comment)
3. `handleResponse()` function (control flow narrowing)
4. `mapResponse()` function (transform data safely)
5. `getProperty()` function (`keyof` in action)
6. `validateResponse()` function (runtime validation)
7. `chainResponses()` function (link two responses)
8. **Stretch**: `batchResponses()` function (combine multiple responses)

**Why this assignment**:

- Real-world pattern (API responses, error handling)
- Uses every concept: generics, constraints, `keyof`, narrowing
- Combines parts into a coherent whole
- Demonstrates why generics matter

**Before submitting**:

```bash
npm run typecheck
```

All files should compile with zero errors.

## Key Concepts Checklist

Before moving to Module 4, verify you understand:

- [ ] `T` is a type slot, not a value
- [ ] Generic functions preserve relationships (input type → output type)
- [ ] Constraints limit what `T` can be (safety + clarity)
- [ ] `keyof T` gives you valid property names
- [ ] `T[K]` gives you the type of property `K`
- [ ] Inference means you rarely write `<T>` explicitly
- [ ] Generics are only worth it if the same logic works for multiple types
- [ ] Over-engineered generics are worse than specific types

## Common Mistakes

**Mistake 1**: Writing generics that only work for one type

```ts
// Bad: only works for strings
function getLength<T extends string>(value: T): number {
  return value.length;
}

// Good: actually generic
function arrayLength<T>(items: T[]): number {
  return items.length;
}
```

**Mistake 2**: Forgetting constraints

```ts
// Bad: no safety
function getProperty<T>(obj: T, key: string): unknown {
  return (obj as any)[key];
}

// Good: constrained
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

**Mistake 3**: Losing information

```ts
// Bad: T not used for output
function process<T>(items: T[]): unknown {
  return items[0];
}

// Good: T used for output
function first<T>(items: T[]): T {
  return items[0];
}
```

## Debugging Generics

When TypeScript complains about your generic:

1. **Read the error** — It usually pinpoints the problem
2. **Check constraints** — Does `T` have what you need?
3. **Check usage** — Are you calling it with compatible arguments?
4. **Simplify** — Remove generics, make it work for one type, then make it generic
5. **Test inference** — Add explicit `<Type>` to see if that fixes it

## After This Module

You will understand:

- How types flow through functions
- Why constraints exist
- How to read generic libraries (React, lodash, etc.)
- How to write simple generics
- When generics are worth the complexity

You are **not** a generic expert yet. That comes with practice.

## Next Steps

- Move to Module 4: Advanced Types (conditional types, template literal types, mapped types)
- Or review exercises/assignment if anything feels fuzzy
- Or apply generics to code you wrote in Modules 1–2

## Resources

- `lesson.md` — Comprehensive explanation
- `examples/03-generics-gotchas.ts` — Edge cases and surprises
- `exercises/03-generics.ts` — Problems to solve
- `exercises/03-generics-solutions.ts` — Solutions with explanations
- `conceptual-questions.md` — Deep thinking questions
- `assignments/module-3-assignment.md` — Real-world project

## Questions?

If a concept does not click:

1. Re-read the lesson section
2. Study the related example
3. Try a small variation of an exercise
4. Write a simple generic from scratch (e.g., `function first<T>(items: T[]): T`)

Generics are powerful and elegant once they click. Struggle a bit—it is worth it.

Good luck.
