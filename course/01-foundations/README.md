# Module 1: Foundations - Complete Learning Guide

## What You Will Learn

This module teaches the **foundational mental model** of TypeScript. After this module, you will understand:

1. How TypeScript is two languages at once (runtime JavaScript + compile-time types)
2. What the compiler can and cannot prove
3. How to work safely with external data
4. How type inference, narrowing, and guards work
5. How strict mode makes better TypeScript

## Learning Path

### Step 1: Read the Lesson (20 min)

Read [lesson.md](lesson.md) carefully. Pay attention to:

- The runtime/static split (most important concept)
- How types are erased before running
- Why `unknown` is safer than `any`
- What `never` catches

**Key question to ask yourself:** At each code example, ask: "What exists at runtime? What did TypeScript prove?"

### Step 2: Run the Examples (15 min)

Open [examples/01-foundations-gotchas.ts](../../examples/01-foundations-gotchas.ts)

Read through it. Do not just skim—understand each section.

Then run it:

```bash
npm run example -- examples/01-foundations-gotchas.ts
```

Notice:

- What prints to the console
- How narrowing forces you to check types
- How type guards validate external data

**Key insight:** The code that runs is simple. The types are what make it safe.

### Step 3: Complete the Exercises (45 min)

Open [exercises/01-foundations-new-exercises.ts](../../exercises/01-foundations-new-exercises.ts)

The file has 8 exercises. Do them in order:

1. Predict inferred types (hover to check)
2. Replace `any` with `unknown` and narrow
3. Write type guards
4. Use union types instead of loose strings
5. Control flow narrowing
6. Handle optional properties
7. Exhaustiveness checking
8. Combine all concepts

**Do not look at solutions yet.** Try to figure them out.

Run:

```bash
npm run typecheck
```

Fix any errors until the output is clean.

### Step 4: Check Your Work (10 min)

Open [exercises/01-foundations-new-exercises-solutions.ts](../../exercises/01-foundations-new-exercises-solutions.ts)

Compare your code to the solutions. Look for:

- Did you use the same approach?
- Did you miss an edge case?
- Is there a simpler way?

**Do not be discouraged if your answers differ.** There are often multiple correct approaches.

### Step 5: Answer Conceptual Questions (30 min)

Open [conceptual-questions-new.md](conceptual-questions-new.md)

These are thinking questions, not syntax drills. Sit with each one.

For each question:

1. Write down your first answer.
2. Think of a counter-argument.
3. Refine your answer.
4. Discuss it out loud (rubber duck debugging works for learning too).

**Write your reflections in a file:** `exercises/01-my-reflections.md`

Include:

- What was the biggest insight?
- What is still confusing?
- How would you explain TypeScript to a JavaScript developer?
- When would you NOT use TypeScript?

### Step 6: Do the Assignment (60 min)

Open [assignments/module-1-assignment.md](../../assignments/module-1-assignment.md)

Build a typed settings parser. This brings together:

- Type definitions with unions and optionals
- Type guards for validation
- External data handling
- Exhaustiveness checking

Create a file: `assignments/module-1-settings.ts`

Implement all the functions described. Run `npm run typecheck` until no errors.

## Quick Reference

### Key Concepts

| Concept | When to Use | Example |
|---|---|---|
| `any` | Never (except migrating code) | ❌ Defeats TypeScript |
| `unknown` | External data, APIs, user input | ✅ `const data: unknown = fetch()` |
| `never` | Exhaustiveness checks, impossible states | ✅ `const x: never = status;` |
| Union types | Restrict to specific values | ✅ `type Status = "pending" \\| "done"` |
| Type guards | Validate and narrow | ✅ `if (typeof x === "string")` |
| Optional properties | May or may not exist | ✅ `type User = { email?: string }` |
| Narrowing | Use type checks to prove types | ✅ Inside `if`, TypeScript knows more |

### Mental Model Checklist

Before you move to Module 2, ask yourself:

- [ ] I can explain runtime vs compile-time types
- [ ] I know why `unknown` is better than `any`
- [ ] I can write a type guard
- [ ] I understand control flow narrowing
- [ ] I know how to validate external data
- [ ] I can use exhaustiveness checks with `never`
- [ ] I know when TypeScript can and cannot help

If any of these are unclear, **revisit that concept before moving on.** Do not skip foundations.

## Common Mistakes to Avoid

1. **Using `as` to silence errors instead of validating**
   - ❌ `const user = data as User;`
   - ✅ `if (isUser(data)) { const user = data; }`

2. **Forgetting to narrow optional properties**
   - ❌ `console.log(user.email.length);`
   - ✅ `if (user.email) console.log(user.email.length);`

3. **Not thinking about external boundaries**
   - ❌ Trust API responses without validation
   - ✅ Validate all external data with type guards

4. **Overusing `any` when learning**
   - ❌ `const x: any = ...` (gives up)
   - ✅ `const x: unknown = ...` (forces you to think)

5. **Missing exhaustiveness checks**
   - ❌ Forget to handle all union cases
   - ✅ Use `never` to catch missing cases

## What's Next?

Once you are confident with Module 1:

- You understand runtime vs static
- You can validate external data
- You know how to use unions and narrowing
- You can answer the conceptual questions

**Then move to Module 2: Objects and Functions** — where you will design precise function contracts and model complex data safely.

## Time Investment

Expected time to complete Module 1:

- Lesson: 20 min
- Examples: 15 min
- Exercises: 45 min
- Conceptual questions: 30 min
- Assignment: 60 min
- **Total: ~2.5 hours**

Do not rush. Understanding is better than speed.

## Resources

If you want to dive deeper:

- [TypeScript Handbook: Type Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [TypeScript Handbook: Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

## Questions?

If a concept is unclear:

1. Re-read that section of the lesson
2. Look at the related example
3. Try the exercise again
4. Ask me to explain it differently

Good luck. This module is the foundation for everything else. Take your time.
"