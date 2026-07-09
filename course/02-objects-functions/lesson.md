# Module 2: Objects and Functions

## Core Mental Model

Functions are contracts. Object types describe shapes. TypeScript mostly cares about structure, not names.

If an object has the required properties with compatible types, it fits the contract.

## Important Ideas

### Structural Typing

```ts
type User = { id: string; name: string };

const admin = { id: "1", name: "Asha", permissions: ["write"] };

const user: User = admin;
```

This works because `admin` has at least the shape required by `User`.

### Function Design

Prefer making invalid calls hard to write.

Weak contract:

```ts
function updateUser(id: string, field: string, value: unknown) {}
```

Stronger contract:

```ts
function renameUser(id: string, name: string) {}
```

## What To Practice

- Design function parameters that express intent.
- Understand excess property checks.
- Use `readonly` where mutation is not part of the contract.
- Prefer precise object types over bags of optional fields.