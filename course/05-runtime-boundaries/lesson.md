# Module 5: Runtime Boundaries

## Core Mental Model

TypeScript cannot prove external data is correct just because we wrote a type.

This is especially important for:

- API responses
- Local storage
- URL params
- Form input
- JSON files
- Message queues

## Important Ideas

Type assertions do not validate data.

```ts
const user = responseJson as User;
```

This tells TypeScript to trust us. It does not check anything at runtime.

Safer code proves the shape before using it.

```ts
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value;
}
```

## What To Practice

- Parse unknown data before trusting it.
- Write type guards.
- Understand assertions vs validation.
- Separate transport DTOs from domain models.