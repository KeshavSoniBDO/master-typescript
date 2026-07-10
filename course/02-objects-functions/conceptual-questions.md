# Module 2: Objects and Functions - Conceptual Questions

These questions go deeper than exercises. They challenge your understanding of principles, not just syntax.

Answer each thoroughly. Write 2–3 sentences explaining your thinking.

---

## Q1: When Is Structural Typing Actually a Problem?

Structural typing is flexible, but sometimes you want to prevent unintended type matches.

```ts
type Point = { x: number; y: number };
type Velocity = { x: number; y: number };

function move(point: Point, velocity: Velocity) { }
const location: Point = { x: 10, y: 20 };
const speed: Velocity = { x: 1, y: 2 };

move(location, speed);  // Compiles, but semantically wrong
```

**Your question**: How would you prevent this? What techniques could you use to make Point and Velocity incompatible even though they have the same shape?

**Hint**: Think about adding a "brand" or discriminator property.

---

## Q2: Should You Use `readonly` for Runtime Safety?

```ts
type ReadonlyConfig = {
  readonly apiKey: string;
};

const config: ReadonlyConfig = { apiKey: "secret" };
config.apiKey = "new";  // ERROR in TypeScript
(config as any).apiKey = "hacked";  // Works at runtime!
```

**Your question**: If readonly cannot prevent runtime mutation, why use it?

**Hint**: Think about contracts and intent, not runtime protection.

---

## Q3: Weak Contracts vs. Over-Specification

Two extremes:

```ts
// Weak: too flexible
function update(id: string, field: string, value: unknown) { }

// Over-specified: creates too many functions
function updateId(id: string, newId: string) { }
function updateName(id: string, name: string) { }
function updateAge(id: string, age: number) { }
function updateEmail(id: string, email: string) { }
```

**Your question**: Which is worse, and why? Can you find a middle ground?

**Hint**: Think about keyof + indexed access.

---

## Q4: Can You Have Two Unrelated Types with the Same Shape?

```ts
type UserId = string;
type ProductId = string;

const user: UserId = "user-123";
const product: ProductId = user;  // ERROR or OK?
```

TypeScript treats this as OK (they're both strings). But semantically, a UserId and ProductId are different concepts.

**Your question**: Why doesn't TypeScript distinguish between them? What's the trade-off?

**Hint**: Nominal vs. structural typing.

---

## Q5: When Should You Use a Parameter Object vs. Multiple Parameters?

```ts
// Option 1: Multiple parameters
function createUser(name: string, email: string, age: number, isAdmin: boolean) { }

// Option 2: Parameter object
function createUser(input: { name: string; email: string; age: number; isAdmin: boolean }) { }
```

**Your question**: What are the pros/cons of each? When does one become clearly better than the other?

**Hint**: Think about future changes, order dependency, clarity.

---

## Q6: Excess Property Checks—Why Only on Object Literals?

```ts
// Allowed (variable):
const fullData = { id: "1", name: "Sonik", email: "test@example.com" };
const user: User = fullData;

// Not allowed (literal):
const user2: User = { id: "1", name: "Sonik", email: "test@example.com" };  // ERROR
```

**Your question**: Why does TypeScript treat these differently? Is this a good design choice or a flaw?

**Hint**: Assume intent and trust.

---

## Q7: Index Signatures Lose Type Safety—Is That Always Bad?

```ts
type FlexibleObject = {
  id: string;
  [key: string]: any;
};

const obj: FlexibleObject = { id: "1", custom: 42 };
obj.anything = "string";  // Allowed, no type checking
```

**Your question**: If index signatures lose type safety, when would you ever use them?

**Hint**: When you genuinely don't know what properties will exist.

---

## Q8: Functions Are Contravariant in Parameters—Why Does This Matter?

```ts
type Callback = (x: number) => void;

const handler: Callback = (x: number | string) => {
  // handler accepts more than Callback promises
};

handler(5);  // But we only call it with number
```

**Your question**: Why does TypeScript allow this? What would break if it didn't?

**Hint**: Who is calling the function and what types do they expect to pass?

---

## Q9: How Do You Design a Type-Safe Plugin System?

A plugin system needs to:
- Accept plugins with any shape (as long as they have required properties)
- Prevent plugins from accessing invalid hook methods
- Preserve plugin-specific properties in TypeScript

```ts
type Plugin = {
  name: string;
  hooks?: { onInit?: () => void };
};

// Plugin 1 might add logging
// Plugin 2 might add auth
// But both must be accepted
```

**Your question**: How would you structure this? Would you use `extends Plugin` with generics?

**Hint**: Generics capture the full type, not just the base.

---

## Q10: Readonly on Nested Properties—How Deep Does It Go?

```ts
type Profile = {
  readonly user: {
    name: string;
  };
};

const profile: Profile = { user: { name: "Sonik" } };
profile.user = { name: "Keshav" };  // ERROR
profile.user.name = "Keshav";  // OK! Nested not readonly
```

**Your question**: Why is the nested property not readonly? How would you make it readonly?

**Hint**: Readonly is shallow. You need to apply it recursively.

---

## Reflection Questions

**After answering all 10, reflect on these:**

1. **What surprised you most about structural typing?**
   - Write 3–4 sentences about one surprise.

2. **When would you choose a weak contract over a strong one?**
   - Can you think of a real-world scenario?

3. **What's the relationship between TypeScript's type system and runtime behavior?**
   - How do readonly, generics, and constraints map to runtime?

4. **If you were designing a function contract, what would you prioritize?**
   - Type safety? Flexibility? Self-documenting code?

---

## Answers Guide

These are discussion questions—there's no single "right" answer. But here are hints for evaluating your own answers:

**Q1**: A "brand" property (e.g., `__type: "Point"`) makes types incompatible.

**Q2**: Readonly documents intent and prevents accidental mutation in TypeScript code. It's not runtime safety, it's a contract.

**Q3**: Weak contracts are worse—they hide bugs. keyof + indexed access finds the middle ground.

**Q4**: Structural typing assumes shapes matter more than names. Nominal would require explicit inheritance.

**Q5**: Parameter objects win when you have >2 params or params might grow.

**Q6**: It prevents typos in literals. Variables are trusted to contain intentional data.

**Q7**: When you genuinely need flexibility and trust the runtime behavior.

**Q8**: Because the caller (who calls with `number`) is satisfied—the function accepts it.

**Q9**: Use `<T extends Plugin>` to capture the full plugin shape while enforcing it has at least Plugin properties.

**Q10**: Readonly only applies to the immediate property. You need `DeepReadonly<T>` for nested.
