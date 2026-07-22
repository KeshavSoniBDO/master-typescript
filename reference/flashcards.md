# Revision Flashcards

Active recall beats re-reading. These cards cover the load-bearing ideas from
every module. Two ways to use them:

- **On GitHub / in a Markdown preview** — each question is a collapsible card.
  Read the question, answer out loud, then expand to check.
- **In Anki or Quizlet** — copy the CSV block at the bottom and import it as
  `Front,Back`.

Spacing beats cramming: run one module's deck per day, then mix all decks before
the capstone.

> Tip: if you can teach the answer to an imaginary student in two sentences, you
> know it. If you can only recite keywords, revisit the module.

---

## Module 1 — Foundations

<details><summary>What are the "two languages" inside TypeScript?</summary>

JavaScript at **runtime** (values, side effects) and TypeScript at **compile
time** (static types). Types are erased before the JS runs.
</details>

<details><summary>Why can't TypeScript protect data coming from an API?</summary>

Types are erased at runtime, so the compiler never sees the real value. External
data must be validated at runtime (Module 5).
</details>

<details><summary>`any` vs `unknown` — the one-line difference?</summary>

`any` disables checking (any operation compiles). `unknown` holds anything but
permits **no** operation until you narrow it. Prefer `unknown`.
</details>

<details><summary>What is `never`, and when do you see it?</summary>

The type with no values: unreachable code, always-throwing functions, and
exhausted unions in an exhaustiveness check.
</details>

<details><summary>What is narrowing?</summary>

The compiler shrinking a broad type to a specific one inside a branch, using
`typeof`, `in`, `===`, or a type guard.
</details>

<details><summary>How do you force the compiler to catch an unhandled union case?</summary>

Assign the value to a `never` in the `default` branch. Adding a new union member
then breaks the build until you handle it.
</details>

<details><summary>Does `as` perform a runtime check?</summary>

No. `as` only tells the compiler to trust you. It can lie and cause silent
runtime bugs.
</details>

---

## Module 2 — Objects and Functions

<details><summary>Structural vs nominal typing?</summary>

Structural = compatibility by **shape** (TypeScript's default). Nominal =
compatibility by declared **name** (Java/C#).
</details>

<details><summary>Which direction does assignability flow?</summary>

A value may have **extra** members, but it must have **every** member the target
requires. Extra is fine; missing is not.
</details>

<details><summary>What is an excess property check, and when does it fire?</summary>

A check that flags unknown properties — but only on an **object literal**
assigned directly to a typed target. Assign through a variable and it does not
fire.
</details>

<details><summary>`interface` vs `type` — one key difference?</summary>

Interfaces support declaration merging and `extends`; `type` aliases do not
merge but can name unions, tuples, and primitives.
</details>

<details><summary>What does `readonly` guarantee?</summary>

Compile-time protection against reassignment. There is **no** runtime
enforcement.
</details>

<details><summary>What does `satisfies` do that a type annotation does not?</summary>

It checks a value against a type **without widening** the value's inferred type,
so you keep the precise literal types.
</details>

---

## Module 3 — Generics

<details><summary>What problem do generics solve?</summary>

They preserve the relationship between input and output types instead of losing
it to `unknown` or `any`.
</details>

<details><summary>The one-sentence mental model for a generic?</summary>

A type parameter is a **slot** filled in at the call site, then flowing through
the whole signature.
</details>

<details><summary>What does a constraint (`T extends ...`) buy you?</summary>

It guarantees the type has certain members, so you can safely use them inside
the generic.
</details>

<details><summary>What does `keyof T` produce?</summary>

A union of `T`'s property keys. `keyof { id: string; email: string }` →
`"id" | "email"`.
</details>

<details><summary>What is an indexed access type?</summary>

Looking up a property type by key: `T["name"]`, or `T[keyof T]` for all value
types.
</details>

<details><summary>Sign you are over-engineering with generics?</summary>

A type parameter used only once, or one that could be a plain concrete type
without losing safety. Delete it.
</details>

---

## Module 4 — Advanced Types

<details><summary>What is a conditional type?</summary>

`T extends U ? X : Y` — a compile-time branch that resolves to one type or the
other based on assignability.
</details>

<details><summary>What does `infer` do?</summary>

Inside a conditional type, it captures part of another type into a new variable,
e.g. the element type of an array or the return type of a function.
</details>

<details><summary>What is a mapped type?</summary>

A type that transforms every property of another: `{ [K in keyof T]: ... }`. It
powers `Partial`, `Readonly`, `Pick`, and more.
</details>

<details><summary>What is a template literal type?</summary>

A string literal type assembled from other types, e.g.
`` `on${Capitalize<Event>}` `` → `"onClick" | "onSubmit"`.
</details>

<details><summary>Name five built-in utility types and what they do.</summary>

`Partial` (all optional), `Pick` (subset of keys), `Omit` (drop keys), `Record`
(key→value map), `ReturnType` (a function's result type). Also `Required`,
`Exclude`, `Extract`, `Parameters`, `Awaited`, `NonNullable`.
</details>

<details><summary>What is a distributive conditional type?</summary>

A conditional applied to a naked type parameter distributes over each member of
a union, checking them one at a time.
</details>

---

## Module 5 — Runtime Boundaries

<details><summary>What is a runtime boundary?</summary>

Any place external data enters your program: API responses, user input, files,
storage, query params, message queues.
</details>

<details><summary>The three-layer decode model?</summary>

1) unknown input (unsafe) → 2) validate/decode (proof) → 3) domain model (safe).
Skipping layer 2 is the classic mistake.
</details>

<details><summary>Type guard vs assertion function?</summary>

A type guard returns a boolean (`x is T`) for branching. An assertion function
returns `asserts x is T` and throws on invalid input (fail fast).
</details>

<details><summary>Why is `raw as User` dangerous at a boundary?</summary>

`as` verifies nothing. If the real shape differs, you get silent runtime risk.
Decode instead.
</details>

<details><summary>What is a DTO, and what do you do with it?</summary>

The raw transport shape. Decode and map it into your domain model — never let it
leak into domain logic.
</details>

<details><summary>What does a `DecodeResult<T>` express?</summary>

Success or failure explicitly:
`{ ok: true; value: T } | { ok: false; issues: string[] }` — no throwing, no
guessing.
</details>

---

## Module 6 — Tooling and Config

<details><summary>What is `tsconfig.json`, conceptually?</summary>

Your **type policy**. It decides how hard the compiler checks and how modules
resolve — part of your architecture, not setup fluff.
</details>

<details><summary>What does `strict: true` do?</summary>

Turns on the whole family of strict checks (`strictNullChecks`, `noImplicitAny`,
and more). It is the baseline for real projects.
</details>

<details><summary>What does `noUncheckedIndexedAccess` change?</summary>

Array and index-signature access yields `T | undefined`, forcing you to handle
the missing case.
</details>

<details><summary>What does `exactOptionalPropertyTypes` enforce?</summary>

Optional (`x?: T`) means "may be absent", not "may be `undefined`". You cannot
assign `undefined` explicitly.
</details>

<details><summary>Under `useUnknownInCatchVariables`, what type is a caught error?</summary>

`unknown`. You must narrow it (e.g. `instanceof Error`) before using it.
</details>

<details><summary>With `"type": "module"` + NodeNext, what do relative imports need?</summary>

A `.js` extension — even though the source file is `.ts`. e.g.
`import { x } from "./util.js"`.
</details>

<details><summary>Where is a type policy actually enforced?</summary>

In CI, via a type gate like `tsc --noEmit`. A policy nobody runs is just a
suggestion.
</details>

---

## Module 7 — Architecture Patterns

<details><summary>Core idea: what are types, architecturally?</summary>

Executable design constraints. Use them to make invalid states hard to represent
and easy to detect.
</details>

<details><summary>How does a discriminated union enforce a workflow?</summary>

Each transition function accepts only the states it may start from, so illegal
moves (e.g. capturing an unauthorized payment) do not compile.
</details>

<details><summary>What are ports and adapters?</summary>

A *port* is an internal contract (interface); an *adapter* implements it with a
specific technology. Domain code depends on the port, not the adapter.
</details>

<details><summary>Why depend on a port instead of a concrete class?</summary>

You can swap a real adapter for an in-memory fake in tests, and the domain code
never notices. Infrastructure changes without touching the core.
</details>

<details><summary>What is Command/Query Separation?</summary>

A function either changes state (command, returns an outcome) or reads state
(query, returns data) — never both. Types make the split explicit.
</details>

<details><summary>What is an anti-corruption layer?</summary>

A translation boundary that maps an external model into your clean domain model,
so outside changes cannot corrupt your core.
</details>

---

## Anki / Quizlet import (CSV)

Copy everything in the block below into a `.csv` file and import as `Front,Back`.
Quotes are escaped for CSV.

```csv
Front,Back
"TypeScript's two languages?","JavaScript at runtime (values) and TypeScript at compile time (types, erased before running)."
"any vs unknown?","any disables checking; unknown holds anything but allows no operation until narrowed. Prefer unknown."
"What is never?","The type with no values: unreachable code, always-throwing functions, exhausted unions."
"What is narrowing?","Compiler shrinking a broad type to a specific one in a branch via typeof, in, ===, or a type guard."
"Does as check at runtime?","No. It only tells the compiler to trust you; it can lie."
"Structural vs nominal typing?","Structural = compatibility by shape (TS default). Nominal = by declared name (Java/C#)."
"Direction of assignability?","A value may have extra members but must have every member the target requires."
"When does an excess property check fire?","Only on an object literal assigned directly to a typed target."
"interface vs type?","Interfaces merge and extend; type aliases do not merge but can name unions, tuples, primitives."
"What does satisfies do?","Checks a value against a type without widening its inferred type."
"What problem do generics solve?","They preserve the input/output type relationship instead of losing it to unknown/any."
"Mental model of a generic?","A type slot filled at the call site, flowing through the whole signature."
"What does keyof T produce?","A union of T's property keys."
"What is infer?","Inside a conditional type, captures part of another type into a new variable."
"What is a mapped type?","A type transforming every property of another: { [K in keyof T]: ... }."
"What is a conditional type?","T extends U ? X : Y — a compile-time branch based on assignability."
"Three-layer decode model?","unknown input -> validate/decode -> domain model. Never skip validation."
"Type guard vs assertion function?","Guard returns boolean (x is T) for branching; assertion returns asserts x is T and throws on invalid input."
"Why is 'raw as User' dangerous?","as verifies nothing; a wrong shape causes silent runtime risk. Decode instead."
"What is a DTO?","The raw transport shape; decode and map it to a domain model, never use it directly."
"What is tsconfig.json conceptually?","Your type policy: how hard the compiler checks and how modules resolve."
"What does strict: true do?","Turns on the whole family of strict checks; the baseline for real projects."
"noUncheckedIndexedAccess effect?","Index/array access yields T | undefined, forcing you to handle the missing case."
"useUnknownInCatchVariables effect?","catch (e) gives e type unknown; narrow before use."
"NodeNext relative imports need what?","A .js extension even though the source is .ts."
"Types, architecturally?","Executable design constraints that make invalid states hard to represent."
"Ports and adapters?","Port = internal contract (interface); adapter = tech-specific implementation. Domain depends on the port."
"Command/Query Separation?","A function either changes state (command) or reads it (query), never both."
"What is an anti-corruption layer?","A translation boundary mapping an external model into your clean domain model."
"How does a discriminated union enforce a workflow?","Transition functions accept only valid starting states, so illegal moves do not compile."
```

---

## Related

- Definitions: [reference/glossary.md](glossary.md)
- Deep questions per module: `course/<module>/conceptual-questions.md`
