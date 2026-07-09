# Module 1: Foundations

## The One Big Idea

TypeScript is two languages at once:

1. **JavaScript at runtime** — values, functions, objects, side effects.
2. **TypeScript at compile time** — static types that describe and prove things about those values.

The compiler erases all types before JavaScript runs. This means:

- TypeScript **cannot** prove anything about values coming from external sources (APIs, user input, files).
- TypeScript **cannot** stop you from writing code that fails at runtime.
- TypeScript **can** catch mistakes *before* runtime if you structure your code well.

Mastering TypeScript starts with asking: what does the compiler know here? What does it not know?

## The Runtime / Static Time Split

### Example: What Gets Erased?

```ts
const userId: string = "123";
const age: number = 30;

function greet(name: string): void {
  console.log(`Hello, ${name}`);
}
```

What TypeScript **compiles to** (JavaScript):

```js
const userId = "123";
const age = 30;

function greet(name) {
  console.log(`Hello, ${name}`);
}
```

Every `: string`, `: number`, `: void` is gone. JavaScript does not know they ever existed.

At runtime, JavaScript has:
- No way to check that `userId` is actually a string.
- No way to enforce that `greet()` receives a string.
- No automatic type coercion (that is a feature of the language, not TypeScript).

### What TypeScript Checked

Before compiling, TypeScript checked:

```ts
greet(123);  // ERROR at compile time: Argument of type 'number' is not assignable to parameter of type 'string'
greet(userId);  // OK: userId is a string
```

If you ignored the error and the code ran anyway, JavaScript would just call the function with the number. No runtime error.

## Core Concepts

### 1. Type Inference

TypeScript infers the type from the value. You do not always need to write it explicitly.

```ts
// TypeScript infers this is the literal type "Sonik", not just string
const language = "TypeScript";

// TypeScript infers this is string (because it can be reassigned)
let framework = "React";

// TypeScript infers this is number
const year = 2026;
```

Why does it matter? Because a `const "TypeScript"` can never be reassigned, so TypeScript knows it will always be exactly that string. This precision helps in type narrowing later.

### 2. `any` — Escape Hatch

```ts
const value: any = fetchFromUnknownAPI();
value.doSomething();  // OK, no error
value.foo();  // OK, no error
value.bar();  // OK, no error
```

`any` tells TypeScript: "Stop checking this value. I will handle it." This is useful during:

- Migrating legacy JavaScript.
- Working with truly dynamic code.
- Temporary debugging.

But `any` defeats the entire purpose of TypeScript. Once you use `any`, the compiler stops helping you catch bugs for that value.

### 3. `unknown` — Safe Unknown

```ts
const value: unknown = fetchFromUnknownAPI();

// ERROR: Object is of type 'unknown'
value.doSomething();

// OK: You must prove what it is first
if (typeof value === "string") {
  value.toUpperCase();  // Now TypeScript knows it is a string
}
```

`unknown` means: "I have a value, but the compiler does not know what it is. You must prove it before using it."

This is **much stronger** than `any`. It forces you to think about unsafe boundaries.

### 4. `never` — Impossible Value

```ts
// A function that never returns (infinite loop or throws)
function crash(): never {
  while (true) {}
}

// A union case that cannot happen
type Status = "pending" | "success" | "error";

function handle(status: Status): void {
  if (status === "pending") {
    console.log("Waiting...");
  } else if (status === "success") {
    console.log("Done!");
  } else if (status === "error") {
    console.log("Failed!");
  } else {
    // If you add a fourth status but forget to handle it,
    // TypeScript will show an error here because this branch is theoretically impossible
    const impossible: never = status;
  }
}
```

`never` is used for exhaustiveness checking. It says: "This code path should never execute." If the compiler proves it can, you have a bug.

### 5. Unions and Literals

Instead of loose types, be precise about what values are allowed.

Weak:
```ts
function updateStatus(status: string) {}
```

Strong:
```ts
function updateStatus(status: "pending" | "success" | "error") {}
```

Now the compiler checks that you only pass valid statuses. Invalid calls fail at compile time, not runtime.

### 6. Control Flow Narrowing

TypeScript is smart about tracking type changes inside code.

```ts
function process(value: string | number) {
  if (typeof value === "string") {
    // Inside this block, TypeScript knows value is a string
    console.log(value.toUpperCase());
  } else {
    // Inside this block, TypeScript knows value is a number
    console.log(value.toFixed(2));
  }
}
```

You write one `if`, and TypeScript figures out the type on each branch. This is **narrowing**.

## Strict Mode: The Reality Check

Without `strict: true` in `tsconfig.json`, TypeScript allows things like:

```ts
function greet(name) {  // OK if not strict; ERROR if strict
  console.log(name.toUpperCase());
}
```

With `strict: true`, you must be explicit about types:

```ts
function greet(name: string) {  // Required
  console.log(name.toUpperCase());
}
```

Strict mode forces you to write better TypeScript. We are using strict mode in this project.

## Mental Model Checklist

Before moving forward, ask yourself these questions about any TypeScript code:

1. **What exists at runtime?** (Only JavaScript values; types are erased.)
2. **What can TypeScript prove here?** (Types that came from code you control.)
3. **What is external/unknown?** (API responses, user input, files, etc.)
4. **Where do I need narrowing?** (Unions, optional properties, etc.)
5. **What would break if the type was wrong?** (If the answer is "nothing," the type is useless.)

## What To Practice

- Predict inferred types for `const`, `let`, and function returns.
- Spot where TypeScript loses information (and when to use generics later).
- Replace `any` with `unknown` and write type guards.
- Model values using unions instead of loose strings.
- Notice what happens at runtime vs at compile time.
- Think in terms of contracts: what does a function **promise** about its inputs and outputs?