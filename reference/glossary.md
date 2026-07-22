# TypeScript Glossary

A quick-reference dictionary for every core term used across this course. Each
entry is one or two sentences, sometimes with a tiny example, and a pointer to
the module where it is taught in depth.

Use it two ways:

- **While learning** — look up a term the moment a lesson uses it.
- **While revising** — read it top to bottom; if any entry surprises you, reopen that module.

> Notation: `See M3` means "taught in Module 3".

---

## A

**`any`** — The escape hatch type. Turns off type checking for a value; every
operation on it compiles. Powerful and dangerous — prefer `unknown`. *See M1.*

**Anti-corruption layer** — A translation boundary that converts an external
model (DTO, third-party shape) into your clean domain model, so outside changes
do not leak inward. *See M5, M7.*

**Assertion function** — A function whose return type is `asserts x is T`. If it
returns normally, the compiler treats `x` as `T` afterward; otherwise it throws.
*See M5.*

```ts
function assertUser(v: unknown): asserts v is User { /* throw if invalid */ }
```

**Assignability** — The rule that decides whether a value of type `A` can be
used where type `B` is expected. In TypeScript this is based on shape
(structural), not name. *See M2.*

**`as` (type assertion)** — Tells the compiler "trust me, this is type `T`".
Performs **no** runtime check, so it can lie. Use only after you have already
proven the shape. *See M1, M5.*

---

## B

**Boundary** — Any place where data crosses from outside your program (API,
user input, files, storage) into your typed code. Boundaries need runtime
validation. *See M5.*

**Branded type** — A trick that adds a fake unique tag to a primitive so two
values with the same base type (e.g. `UserId` vs `OrderId`) are not
interchangeable. *See M7.*

```ts
type UserId = string & { readonly __brand: "UserId" };
```

---

## C

**Command/Query Separation (CQS)** — A design rule: a function either changes
state (command) or returns data (query), never both. Types make the split
explicit. *See M7.*

**Conditional type** — A type that chooses between two results based on a
check: `T extends U ? X : Y`. It is `if/else` for types. *See M4.*

**`const` assertion** — `as const` freezes a value to its most specific,
`readonly` literal type. *See M1, M2.*

```ts
const dirs = ["up", "down"] as const; // readonly ["up", "down"]
```

**Constraint** — A limit on a generic parameter using `extends`, guaranteeing
the type has certain members: `<T extends { id: string }>`. *See M3.*

**Contravariance** — A form of variance where function *parameter* types flow
in the opposite direction of assignability. *See M3.*

**Covariance** — A form of variance where a container of a subtype is assignable
to a container of a supertype (the common, intuitive direction). *See M3.*

---

## D

**Declaration merging** — TypeScript combining multiple declarations with the
same name (e.g. two `interface`s) into one. Interfaces merge; `type` aliases do
not. *See M2.*

**Discriminated union** — A union of object types that share a common literal
"tag" field (the discriminant), enabling safe narrowing via `switch`/`if`. *See
M1, M7.*

```ts
type State = { kind: "loading" } | { kind: "error"; message: string };
```

**Distributive conditional type** — A conditional type applied to a naked type
parameter distributes over each member of a union. *See M4.*

**Domain model** — Your program's clean internal representation of a concept,
independent of transport or storage shape. Contrast with DTO. *See M5, M7.*

**DTO (Data Transfer Object)** — The raw shape data arrives in from an API,
form, or database. Decode and map it into a domain model; do not use it
directly. *See M5.*

---

## E

**ESM (ECMAScript Modules)** — The standard JavaScript module system
(`import`/`export`). With `"type": "module"`, relative imports need a `.js`
extension. *See M6.*

**Enum** — A named set of constants. Prefer union-of-literals or `as const`
objects in most modern code. *See M1.*

**Excess property check** — A special check that flags unknown properties on an
**object literal** assigned to a typed target. *See M2.*

**Exhaustiveness check** — Using a `never`-typed default case to force the
compiler to error if a new union member is added but not handled. *See M1, M7.*

```ts
default: { const _exhaustive: never = state; return _exhaustive; }
```

**`exactOptionalPropertyTypes`** — Strict flag: an optional property `x?: T`
means "may be absent", not "may be `T | undefined`". Blocks assigning
`undefined` explicitly. *See M6.*

---

## G

**Generic** — A type parameter (a "slot") that lets a function, class, or type
work over many types while preserving their relationships. *See M3.*

**Generic default** — A fallback type for a parameter: `<T = string>`. *See M3.*

---

## I

**Indexed access type** — Looking up a property type by key: `T["name"]` or
`T[keyof T]`. *See M3, M4.*

**Index signature** — A declaration that a type has arbitrary keys of a given
type: `{ [key: string]: number }`. Access may be `undefined` under
`noUncheckedIndexedAccess`. *See M6.*

**`infer`** — Inside a conditional type, captures a piece of another type into a
new type variable. *See M4.*

```ts
type ElementType<T> = T extends (infer U)[] ? U : never;
```

**Interface** — A named object type that supports declaration merging and
`extends`. Roughly interchangeable with a `type` alias for object shapes. *See
M2.*

**Intersection type** — `A & B`: a value that satisfies **both** types at once.
*See M2.*

---

## K

**`keyof`** — Produces a union of a type's property keys: `keyof User` →
`"id" | "email"`. *See M3.*

---

## L

**Literal type** — A type that is one exact value: `"open"`, `42`, `true`.
Building blocks of discriminated unions. *See M1.*

---

## M

**Mapped type** — A type that transforms every property of another type:
`{ [K in keyof T]: ... }`. Powers `Partial`, `Readonly`, and friends. *See M4.*

**Module vs script** — A file with any top-level `import`/`export` is a
*module* (its declarations are scoped to the file). Otherwise it is a *script*
(declarations are global). `moduleDetection: auto` + `"type": "module"` makes
every file a module. *See M6.*

**`moduleDetection`** — The compiler setting that decides how files are
classified as module vs script. *See M6.*

---

## N

**Narrowing** — The compiler shrinking a broad type to a more specific one
inside a branch, based on checks like `typeof`, `in`, `===`, or a type guard.
*See M1.*

**`never`** — The type with no values. Signals unreachable code, an
always-throwing function, or an exhausted union. *See M1.*

**`NodeNext`** — The module/resolution mode that follows Node's ESM rules,
including the `.js`-extension requirement on relative imports. *See M6.*

**Nominal typing** — Type compatibility based on declared **names** (Java, C#).
TypeScript is *not* nominal by default; it is structural. *See M2.*

**`noImplicitAny`** — Strict flag: error when the compiler would otherwise
silently infer `any`. *See M6.*

**`noUncheckedIndexedAccess`** — Strict flag: array/index access yields
`T | undefined`, forcing you to handle the missing case. *See M6.*

---

## O

**Overloads** — Multiple call signatures for one function, letting the return
type depend on the argument types. *See M2, M3.*

---

## P

**`Partial<T>`** — Utility type making every property of `T` optional. *See M4.*

**Ports and adapters (hexagonal architecture)** — Define an internal contract
(a *port*, usually an interface), then implement it with technology-specific
*adapters*. Domain code depends on the port, not the adapter. *See M7.*

**Predicate (type predicate)** — The `x is T` return annotation that makes a
boolean function act as a type guard. *See M5.*

---

## R

**`readonly`** — Marks a property or array as non-reassignable at compile time
(no runtime enforcement). *See M2.*

**`Record<K, V>`** — Utility type for an object with keys `K` and values `V`.
*See M4.*

**Result type** — An explicit success-or-failure return shape instead of
throwing: `{ ok: true; value: T } | { ok: false; error: E }`. *See M5, M7.*

---

## S

**`satisfies`** — Checks that a value matches a type **without** widening the
value's inferred type. Great for config objects. *See M2, M4.*

```ts
const config = { port: 3000 } satisfies Record<string, number>;
```

**`strict`** — The master compiler flag that turns on the whole family of strict
checks. The baseline for real projects. *See M6.*

**`strictNullChecks`** — Strict flag: `null` and `undefined` are not assignable
to other types unless explicitly allowed. *See M6.*

**Structural typing** — TypeScript's core rule: compatibility is decided by
**shape**, not name. If it has the required members, it fits. *See M2.*

---

## T

**Template literal type** — A string literal type built from other types:
`` `on${Capitalize<Event>}` ``. *See M4.*

**Tuple** — A fixed-length array with a known type per position:
`[string, number]`. *See M1, M2.*

**Type alias** — A name for any type via `type X = ...`. Unlike interfaces, it
does not merge and can name unions, tuples, primitives, etc. *See M2.*

**Type guard** — A boolean-returning function with an `x is T` predicate that
narrows a type when it returns `true`. *See M5.*

**Type parameter** — The declared slot in a generic, e.g. the `T` in `<T>`.
*See M3.*

---

## U

**Union type** — `A | B`: a value that is **one of** several types. Narrow it
before using member-specific operations. *See M1.*

**`unknown`** — The safe top type. Holds any value but permits no operations
until you narrow it. The disciplined alternative to `any`. *See M1.*

**`useUnknownInCatchVariables`** — Strict flag: `catch (e)` gives `e` the type
`unknown`, forcing you to check before using it. *See M6.*

**Utility types** — Built-in generic type transforms: `Partial`, `Required`,
`Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `ReturnType`, `Parameters`,
`Awaited`, `NonNullable`, and more. *See M4.*

---

## V

**Variance** — How the assignability of a container relates to the assignability
of its type argument (covariant, contravariant, or invariant). *See M3.*

---

## W

**Widening** — The compiler generalizing a literal to its base type (e.g. `"up"`
inferred as `string`). Prevent it with `as const` or `satisfies`. *See M1, M2.*

---

## Related

- Flashcards for active recall: [reference/flashcards.md](flashcards.md)
- Course roadmap: [course/00-roadmap.md](../course/00-roadmap.md)
