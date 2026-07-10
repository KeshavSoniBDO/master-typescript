# Module 4: Advanced Types

## The Big Picture

Modules 1–3 taught you **the basics**: types, functions, generics. This module teaches you **to bend types to your will**.

By the end, you will be able to:

- Write types that adapt based on conditions (conditional types)
- Build types that transform other types (mapped types)
- Create types from literal strings (template literal types)
- Extract types from values automatically (the `infer` keyword)
- Use TypeScript's built-in utility types correctly
- Avoid common pitfalls that trip up even experienced developers

## Part 1: Conditional Types

**The Problem**: Sometimes you want a type to "decide" what it is based on a condition.

```ts
// Example: If T is a string, return boolean; otherwise return T
type StringOrElse<T> = T extends string ? boolean : T;

type A = StringOrElse<string>;   // boolean
type B = StringOrElse<number>;   // number
type C = StringOrElse<boolean>;  // boolean (T extends string failed, so return T)
```

This is `if/else` for types.

### Syntax

```ts
type ConditionalType<T> = T extends SomeType ? TrueType : FalseType;
```

- `T extends SomeType`: Check if T is assignable to SomeType
- `? TrueType`: If yes, the type is TrueType
- `: FalseType`: If no, the type is FalseType

### Real Example: Safe Property Access

```ts
// Without conditional type: dangerous
function getProperty1(obj: any, key: string): any {
  return obj[key];
}

// With conditional type: type-safe
type GetPropertyType<T, K extends keyof T> = T[K];

// But what if K might not exist in T?
type SafeGetProperty<T, K> = K extends keyof T ? T[K] : never;

const user = { name: "Sonik", age: 24 };

type NameType = SafeGetProperty<typeof user, "name">;      // string
type AgeType = SafeGetProperty<typeof user, "age">;        // number
type UnknownType = SafeGetProperty<typeof user, "email">; // never (property does not exist)
```

If the property exists, return its type. If not, return `never` (impossible).

### Conditional Types with Functions

```ts
// Function overloads are verbose
function handle(value: string): string;
function handle(value: number): number;
function handle(value: boolean): boolean;
function handle(value: any) {
  return value;
}

// Same behavior with a conditional type
type Handle<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

type Result1 = Handle<string>;   // string
type Result2 = Handle<number>;   // number
```

Conditional types are like `if/else` chains for types.

## Part 2: The `infer` Keyword

**The Power Move**: Extract a type from inside another type.

```ts
// Without infer: you have to know what is inside
type GetReturnType1<T> = T extends (...args: any[]) => any ? T["doesn't work"] : never;

// With infer: TypeScript extracts it for you
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type F = (x: number) => string;
type ReturnType = GetReturnType<F>;  // string (TypeScript extracted it)
```

`infer R` says: "Capture whatever is in this position and call it R."

### Real Example: Extract Array Element Type

```ts
type ArrayElement<T> = T extends (infer E)[] ? E : T;

type StringArray = string[];
type Element = ArrayElement<StringArray>;  // string

type SingleNumber = number;
type NotArray = ArrayElement<SingleNumber>;  // number (not an array, return as-is)
```

### Real Example: Extract Promise Value

```ts
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type P = Promise<string>;
type Unwrapped = Unwrap<P>;  // string

type Direct = Unwrap<number>;  // number (not a Promise, return as-is)
```

This is powerful: TypeScript figures out what is **inside** the type.

## Part 3: Mapped Types

**The Pattern**: Transform every property of a type.

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type User = { name: string; age: number };
type ReadonlyUser = Readonly<User>;

// Result:
// {
//   readonly name: string;
//   readonly age: number;
// }
```

`[K in keyof T]` means: "For each property K in T, create a property in the result."

### Real Example: Make All Properties Optional

```ts
type Optional<T> = {
  [K in keyof T]?: T[K];
};

type User = { id: string; name: string; email: string };
type PartialUser = Optional<User>;

// Result:
// {
//   id?: string;
//   name?: string;
//   email?: string;
// }
```

### Real Example: Create Getters

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;

// Result:
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

Notice `as` — that is template literal types (next section).

## Part 4: Template Literal Types

**The Idea**: Build string types from parts.

```ts
type Greeting = "Hello" | "Hi";
type Name = "Sonik" | "Asha";
type Message = `${Greeting}, ${Name}!`;

// Result is:
// "Hello, Sonik!" | "Hello, Asha!" | "Hi, Sonik!" | "Hi, Asha!"
```

TypeScript builds all combinations automatically.

### Real Example: Event Handler Names

```ts
type EventName = "click" | "hover" | "focus";
type Element = "button" | "input" | "div";

type EventHandler = `on${Capitalize<EventName>}${Capitalize<Element>}`;

// Results in:
// "onClickButton" | "onClickInput" | "onClickDiv" | ... (all combinations)
```

### Real Example: Path-like Types

```ts
type Path = "user" | "post" | "comment";
type ID = string;

type Endpoint = `/${Path}/${ID}` | `/${Path}`;

// Results in:
// "/user" | "/user/{id}" | "/post" | "/post/{id}" | "/comment" | "/comment/{id}"
```

### Capitalize, Uppercase, Lowercase

TypeScript provides built-in transformations:

```ts
type S1 = Capitalize<"hello">;  // "Hello"
type S2 = Uppercase<"hello">;   // "HELLO"
type S3 = Lowercase<"HELLO">;   // "hello"
type S4 = Uncapitalize<"Hello">; // "hello"
```

## Part 5: Combining Everything

Let's build a real pattern: **A type-safe event emitter**.

### Step 1: Define Events

```ts
type Events = {
  click: { x: number; y: number };
  submit: { data: Record<string, unknown> };
  error: { message: string };
};
```

### Step 2: Create Handler Type

```ts
type EventHandler<T extends keyof Events> = (payload: Events[T]) => void;
```

### Step 3: Create Emitter Type

```ts
type Emitter<T> = {
  [K in keyof T as `on${Capitalize<K & string>}`]: (handler: EventHandler<K>) => void;
};

type MyEmitter = Emitter<Events>;

// Result:
// {
//   onClick: (handler: (payload: { x: number; y: number }) => void) => void;
//   onSubmit: (handler: (payload: { data: Record<string, unknown> }) => void) => void;
//   onError: (handler: (payload: { message: string }) => void) => void;
// }
```

Now when you subscribe to `onClick`, TypeScript knows the payload shape. **No `any` types needed.**

## Part 6: Utility Types

TypeScript provides common types. Learn them.

### Partial<T>

```ts
type Partial<T> = {
  [K in keyof T]?: T[K];
};

type User = { id: string; name: string };
type PartialUser = Partial<User>;  // { id?: string; name?: string }
```

Use when: updating objects incrementally.

### Required<T>

```ts
type Required<T> = {
  [K in keyof T]-?: T[K];  // The '-?' removes optional
};

type PartialUser = { id?: string; name?: string };
type CompleteUser = Required<PartialUser>;  // { id: string; name: string }
```

Use when: you need all properties to be present.

### Pick<T, K>

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type User = { id: string; name: string; email: string };
type UserPreview = Pick<User, "id" | "name">;  // { id: string; name: string }
```

Use when: extracting specific properties.

### Omit<T, K>

```ts
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type User = { id: string; name: string; email: string };
type UserNoEmail = Omit<User, "email">;  // { id: string; name: string }
```

Use when: removing properties.

### Record<K, V>

```ts
type Record<K extends keyof any, V> = {
  [P in K]: V;
};

type Role = "admin" | "user" | "guest";
type Permissions = Record<Role, string[]>;

// Result: { admin: string[]; user: string[]; guest: string[] }
```

Use when: creating a map with specific keys.

### Exclude<T, U>

```ts
type Exclude<T, U> = T extends U ? never : T;

type Status = "pending" | "success" | "error";
type ErrorStatus = Exclude<Status, "pending" | "success">;  // "error"
```

Use when: removing a type from a union.

### Extract<T, U>

```ts
type Extract<T, U> = T extends U ? T : never;

type Status = "pending" | "success" | "error";
type SuccessStatus = Extract<Status, "success" | "error">;  // "success" | "error"
```

Use when: keeping only matching types.

### ReturnType<T>

```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : never;

type F = (x: number) => string;
type Result = ReturnType<F>;  // string
```

Use when: extracting what a function returns.

### Parameters<T>

```ts
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

type F = (x: number, y: string) => boolean;
type Args = Parameters<F>;  // [x: number, y: string]
```

Use when: extracting function arguments.

## Part 7: Distributive Conditional Types

**The Subtlety**: Conditional types behave differently with unions.

```ts
type Check<T> = T extends string ? true : false;

type Result1 = Check<"hello">;                    // true
type Result2 = Check<string>;                     // true
type Result3 = Check<string | number>;            // boolean (not boolean!)

// Why? Distributivity: Check is applied to EACH member of the union:
// Check<string> | Check<number> = true | false = boolean
```

This happens automatically with unions. Sometimes you want it, sometimes you don't.

### Avoiding Distributivity (When You Do NOT Want It)

```ts
type CheckNoDistribute<T> = T extends string ? true : false;

// Wrap the check to prevent distribution:
type CheckWrapped<T> = [T] extends [string] ? true : false;

type Result = CheckWrapped<string | number>;  // false (no distribution)
```

Wrapping in `[]` prevents TypeScript from distributing over the union.

## Part 8: Common Mistakes

### Mistake 1: Forgetting `infer`

```ts
// Wrong: trying to access the inside directly
type GetArrayElement<T> = T[0];  // This is indexing, not extracting

// Right: use infer to capture it
type GetArrayElement<T> = T extends (infer E)[] ? E : never;
```

### Mistake 2: Conditional Type Doesn't Distribute When You Need It To

```ts
// Sometimes unions do NOT distribute
type IsString<T> = T extends string ? "yes" : "no";
type Result = IsString<string | number>;  // "yes" | "no" (correct, distributed)

// But if your type is complex, you might need to force it
type CheckEach<T> = T extends any ? T extends string ? true : false : never;
// The 'T extends any' ensures distribution happens correctly
```

### Mistake 3: Infinite Recursion

```ts
// Wrong: infinite recursion
type Flatten<T> = T extends (infer E)[] ? Flatten<E> : T;
type Result = Flatten<[[string]]>;  // Works, but deep recursion can cause issues

// Watch out for: mutually recursive types that never terminate
```

## Part 9: Real Production Pattern: Schema Validation

Here is a pattern you will see in production libraries (like Zod, Yup, Prisma):

```ts
// Define a schema
type UserSchema = {
  name: { type: "string"; required: true };
  age: { type: "number"; required: true };
  email: { type: "string"; required: false };
};

// Extract the TypeScript type from the schema
type Infer<T> = {
  [K in keyof T]: T[K] extends { type: infer TType; required: true }
    ? TType extends "string"
      ? string
      : TType extends "number"
      ? number
      : never
    : T[K] extends { type: infer TType; required: false }
    ? TType extends "string"
      ? string | undefined
      : TType extends "number"
      ? number | undefined
      : never
    : never;
};

type User = Infer<UserSchema>;

// Result:
// {
//   name: string;
//   age: number;
//   email: string | undefined;
// }
```

Now the schema **defines the runtime behavior**, and the TypeScript type is **derived from it**. No duplication.

## What NOT To Do

**Mistake: Over-Engineering Simple Cases**

```ts
// Do not do this:
type ComplexHelper<T> = T extends any
  ? T extends string
    ? boolean
    : T extends number
    ? string
    : T
  : never;

// When this is clearer:
type Simple<T> = T extends string ? boolean : T extends number ? string : T;
```

**Mistake: Chasing Type Perfection**

Sometimes `any` is fine. Not everything needs perfect types.

```ts
// If 90% of types are strict and 10% is `any`, that is OK.
// Do not spend 3 hours typing something that works with `any` in 10 minutes.
```

## Key Takeaways

1. **Conditional types**: Add logic to types (if/else for types)
2. **Mapped types**: Transform every property of a type
3. **Template literal types**: Build string types from parts
4. **`infer` keyword**: Extract types from other types
5. **Utility types**: Use TypeScript's built-ins (Pick, Omit, Record, etc.)
6. **Distributivity**: Unions are applied element-by-element in conditionals
7. **Real patterns**: Event emitters, schema validation, API types

Advanced types are not about complexity—they are about **making impossible states impossible** and **catching errors earlier**.

## Next: Exercises and Assignment

The exercises will show you **gotchas and tricky patterns** you will encounter. The assignment will build a **type-safe form builder**—a real production pattern you will see in codebases.