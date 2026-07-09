# Module 3: Generics

## Core Mental Model

Generics preserve relationships between values.

Without generics, we often lose information.

```ts
function first(items: unknown[]) {
  return items[0];
}
```

With generics, the output stays connected to the input.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```

## Important Ideas

- `T` is a type parameter, not a value.
- Constraints say what a generic type must be capable of.
- `keyof` lets us work with property names safely.
- Good generic APIs infer types from arguments instead of forcing callers to manually provide them.

## What To Practice

- Write generic functions with clear input/output relationships.
- Add constraints only when needed.
- Use `keyof` to avoid unsafe property access.
- Avoid generics that do not add real type information.