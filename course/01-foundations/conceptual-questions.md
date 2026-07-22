# Module 1: Deep Conceptual Questions

These are not syntax drills. These are thinking questions designed to build a deep mental model of TypeScript.

After finishing the exercises and examples, sit with these questions. Discuss them out loud or write your answers.

## Core Mental Model

### Question 1: The Erasure Problem

**Scenario:**

You write this code:

```ts
const user: { id: string; name: string } = someApiCall();
function greet(u: { id: string; name: string }) {
  console.log(`Hello ${u.name}`);
}
greet(user);
```

At runtime, JavaScript has no idea what `{ id: string; name: string }` means. It is gone.

**Question:** If a type can be completely wrong at runtime and TypeScript cannot catch it, why is TypeScript useful at all?

**Think about:**
- When does a lie about types cause runtime errors?
- When does it not matter?
- What is TypeScript actually protecting you from?

---

### Question 2: `any` vs `unknown`

**Scenario:**

```ts
const value1: any = fetch();
const value2: unknown = fetch();

value1.foo.bar.baz.qux();  // No error, but crashes at runtime
value2.foo.bar.baz.qux();  // Error: Object is of type 'unknown'
```

**Question:** Why would you ever use `any` when `unknown` exists?

**Think about:**
- When is `any` legitimate?
- What does `any` say about code quality?
- Why does TypeScript allow it if it is dangerous?

---

### Question 3: Inference vs Explicit Types

**Scenario:**

```ts
// Option A: Explicit
const age: number = 30;

// Option B: Inferred
const age = 30;
```

Both result in the same type check. TypeScript infers `age` is a number in option B.

**Question:** Which is better? Should you always write explicit types?

**Think about:**
- What does explicit typing communicate to other developers?
- When does inference help? When does it hurt?
- Is inference a feature or a crutch?

---

### Question 4: The External Data Problem

**Scenario:**

```ts
type User = { id: string; name: string };

// From an API
const user = (await fetch('/api/user').then(r => r.json())) as User;

// From localStorage
const saved = localStorage.getItem('user');
const user2 = JSON.parse(saved) as User;

// From a form
const user3: User = { id: formData.id, name: formData.name };
```

All three are lying to TypeScript. The data might not match the type.

**Question:** How do you know when data from outside is safe to trust? How do you validate it properly?

**Think about:**
- What is the difference between a type assertion and validation?
- Why does TypeScript allow `as` if it defeats type safety?
- Where should validation happen in an app?

---

### Question 5: Strictness and Real Life

**Scenario:**

You work at a company with a large existing codebase. It was not written in strict mode. Now someone suggests enabling `strict: true`.

Without strict, this compiles:

```ts
function greet(name) {
  return `Hello ${name}`;
}
```

With strict, it fails until you add types:

```ts
function greet(name: string) {
  return `Hello ${name}`;
}
```

**Question:** Is the extra typing worth it? What does it change about the code quality?

**Think about:**
- What bugs does strict mode prevent?
- What is the cost of adding types to legacy code?
- Would you enable strict mode on a new project?

---

### Question 6: Narrowing and Logic

**Scenario:**

```ts
function process(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());  // OK
  } else {
    console.log(value.toFixed(2));     // OK
  }
}
```

TypeScript is smart. It knows that if it is not a string, it must be a number.

**Question:** Why does TypeScript do this? What would happen if it did not?

**Think about:**
- How does control flow narrowing help you write safer code?
- What happens if you forget a case?
- How does this relate to the `never` type?

---

### Question 7: Type Guards and Performance

**Scenario:**

You write a type guard:

```ts
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as any).id === "string" &&
    typeof (value as any).name === "string"
  );
}
```

This runs every time you call it. It has a cost.

**Question:** When should you validate external data? When is it overkill?

**Think about:**
- Does every API response need a type guard?
- What is the cost of not validating?
- How do libraries solve this problem?

---

### Question 8: Types as Documentation

**Scenario:**

You see this function:

```ts
function updateUser(id: string, updates: Partial<User>): Promise<User> {
  // ...
}
```

Without reading the code, you know:
- It takes a user ID and a partial update object.
- It returns a promise of a user.
- The update does not require all fields.

**Question:** Is this a better way to document code than comments?

**Think about:**
- What does a strong type signature tell you?
- What does it not tell you?
- How do types replace documentation?

---

### Question 9: Structural Typing

**Scenario:**

```ts
interface Dog { bark(): void; }
interface Robot { bark(): void; }

const dog: Dog = { bark: () => {} };
const robot: Robot = dog; // OK — same shape, different intent
```

TypeScript matches types by shape, not by name. Languages like Java match by name (you must explicitly declare `implements`).

**Question:** When is structural typing a feature, and when is it a trap?

**Think about:**
- Does matching by shape make refactoring easier or riskier?
- Can you satisfy a type by accident and introduce a subtle bug?
- Where would a "brand" (a unique marker property) protect you?

---

### Question 10: Type Space vs Value Space

**Scenario:**

```ts
const x: string = "hello";
// "string" lives in TYPE space (erased at runtime)
// "hello" lives in VALUE space (exists at runtime)
```

Types and values are two separate worlds. You can only cross between them in specific ways (`typeof value` to get a type, or a class name that is both).

**Question:** Why does keeping types and values separate make TypeScript simpler to reason about?

**Think about:**
- What breaks if you try to use a type as a value?
- When do you actually need `typeof` to bridge the two?
- How does erasure depend on this separation?

---

### Question 11: Literal Types

**Scenario:**

```ts
type Direction = "north" | "south" | "east" | "west";

const a = "north";          // inferred as "north" (a literal)
let b = "north";            // inferred as string (widened)
const c = "north" as const; // stays "north"
```

Literal types let you be hyper-specific, but inference sometimes widens them to `string` or `number`.

**Question:** When do you want a narrow literal, and when does it just add noise?

**Think about:**
- Why does `const` keep the literal but `let` widen it?
- Where do string-literal unions replace enums?
- When does `as const` earn its keep?

---

## Reflecting on Learning

After thinking through these, answer:

1. **What was the biggest insight from this module?**
2. **What do you still find confusing?**
3. **When would you reach for TypeScript vs plain JavaScript?**
4. **What would convince a colleague to use TypeScript?**

Write your answers in a file: `exercises/01-my-reflections.md`
"