# Module 3 Assignment: Build a Typed API Response Wrapper

## Scenario

You are building a library that wraps API responses. The library must:

1. Handle different data types (users, posts, comments, etc.)
2. Enforce type safety at every step
3. Provide clear error information
4. Use generics to avoid repeating code

## What You Will Build

A generic `ApiResponse<T>` type and handler functions that:

- Wrap successful responses (data of type T)
- Wrap error responses (error message)
- Transform data safely using callbacks
- Validate that API responses match the expected shape
- Demonstrate generics, constraints, and keyof in a real context

## Part 1: Define the Response Type

Create a generic `ApiResponse<T>` type that represents an API response.

```ts
// It should hold either:
// - Success: { ok: true, data: T }
// - Error: { ok: false, error: string }

type ApiResponse<T> = 
  | { ok: true; data: T }
  | { ok: false; error: string };
```

This uses a **discriminated union**. The `ok` property tells you which branch you are in.

**Test your type:**

```ts
const successResponse: ApiResponse<string> = { ok: true, data: "hello" };
const errorResponse: ApiResponse<string> = { ok: false, error: "Not found" };
```

## Part 2: Create Type Definitions for Real Data

Define types for the data your API returns:

```ts
type User = {
  id: string;
  name: string;
  email: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

type Comment = {
  id: string;
  text: string;
  postId: string;
  authorId: string;
};
```

## Part 3: Write a Handler Function

Write a function `handleResponse<T>` that:

- Takes a response of type `ApiResponse<T>`
- If `ok: true`, returns the data and runs a success callback
- If `ok: false`, logs the error
- Uses control flow narrowing to handle both branches safely

```ts
function handleResponse<T>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => void,
  onError: (error: string) => void
): void {
  // TODO: implement
  // Hint: use if (response.ok) to narrow the type
}
```

**Expected behavior:**

```ts
const userResponse: ApiResponse<User> = { ok: true, data: { id: "1", name: "Sonik", email: "test@example.com" } };

handleResponse(
  userResponse,
  (user) => console.log(`Loaded user: ${user.name}`),
  (error) => console.log(`Error: ${error}`)
);
// Output: "Loaded user: Sonik"
```

## Part 4: Transform Response Data

Write a function `mapResponse<T, U>` that:

- Takes a response of type `ApiResponse<T>`
- Applies a transformation function `(T) => U`
- Returns a new response of type `ApiResponse<U>`
- Works on both success and error cases

```ts
function mapResponse<T, U>(
  response: ApiResponse<T>,
  transform: (data: T) => U
): ApiResponse<U> {
  // TODO: implement
  // Hint: use response.ok to determine the branch
  // If ok: true, transform the data
  // If ok: false, return the error as-is
}
```

**Expected behavior:**

```ts
const userResponse: ApiResponse<User> = { ok: true, data: { id: "1", name: "Sonik", email: "test@example.com" } };

const nameResponse = mapResponse(userResponse, (user) => user.name);
// nameResponse: ApiResponse<string>

if (nameResponse.ok) {
  console.log(nameResponse.data);  // "Sonik"
}
```

## Part 5: Get a Property from Response Data

Write a function `getProperty<T, K>` that:

- Takes a response of type `ApiResponse<T>`
- Takes a property key that must be a valid key of T
- Returns the property value if response is ok, or the error if not
- Uses `keyof` to ensure type safety

```ts
function getProperty<T, K extends keyof T>(
  response: ApiResponse<T>,
  key: K
): T[K] | null | string {
  // TODO: implement
  // If response.ok: return response.data[key]
  // If not ok: return response.error
  // Return type should be T[K] (property type) | string (error)
}
```

**Expected behavior:**

```ts
const userResponse: ApiResponse<User> = { ok: true, data: { id: "1", name: "Sonik", email: "test@example.com" } };

const name = getProperty(userResponse, "name");      // "Sonik" (type: string)
const email = getProperty(userResponse, "email");    // "test@example.com" (type: string)

// getProperty(userResponse, "unknown");  // ERROR: "unknown" is not a valid key of User
```

## Part 6: Validate Response Shape

Write a function `validateResponse<T>` that:

- Takes an unknown response
- Checks if it has the structure `{ ok: boolean, data?: unknown, error?: string }`
- Returns `ApiResponse<T> | null`
- Demonstrates runtime validation of type-level promises

```ts
function validateResponse<T>(value: unknown): ApiResponse<T> | null {
  // TODO: implement
  // Check if value is an object
  // Check if value has an 'ok' property (boolean)
  // If ok is true, it must have 'data'
  // If ok is false, it must have 'error' (string)
  // If valid, cast to ApiResponse<T> and return
  // If invalid, return null

  // Hint: use typeof, 'in' operator, typeof checks
}
```

**Expected behavior:**

```ts
const goodResponse = { ok: true, data: { id: "1", name: "Sonik", email: "test@example.com" } };
const validated = validateResponse<User>(goodResponse);
// validated is not null, and has type ApiResponse<User>

const badResponse = { ok: true };  // Missing data
const invalid = validateResponse<User>(badResponse);
// invalid is null
```

## Part 7: Chain Responses

Write a function `chainResponses<T, U>` that:

- Takes two responses: `ApiResponse<T>` and a function that returns `ApiResponse<U>`
- If first response ok, call the function with the data and return its response
- If first response errored, return the error as-is (do not call the function)
- Demonstrates binding generics together

```ts
function chainResponses<T, U>(
  first: ApiResponse<T>,
  onSuccess: (data: T) => ApiResponse<U>
): ApiResponse<U> {
  // TODO: implement
  // If first.ok: return onSuccess(first.data)
  // Otherwise: return { ok: false, error: first.error }
}
```

**Expected behavior:**

```ts
const getUserResponse = (): ApiResponse<User> => {
  return { ok: true, data: { id: "1", name: "Sonik", email: "test@example.com" } };
};

const getPostsByUser = (user: User): ApiResponse<Post[]> => {
  return { ok: true, data: [{ id: "p1", title: "Hello", content: "...", authorId: user.id }] };
};

const result = chainResponses(getUserResponse(), getPostsByUser);
// result: ApiResponse<Post[]>

if (result.ok) {
  console.log(result.data);  // Array of posts
}
```

## Stretch Goal: Type-Safe Batch Operations

If you finish Part 7, try this:

Write a function `batchResponses<T>` that:

- Takes an array of `ApiResponse<T>`
- Returns `ApiResponse<T[]>` (all successes) or the first error
- Demonstrates combining multiple generic values

```ts
function batchResponses<T>(responses: ApiResponse<T>[]): ApiResponse<T[]> {
  // TODO: implement
  // Collect all data if all ok
  // Return first error if any failed
}
```

## Testing Checklist

Before submitting, verify:

- [ ] `ApiResponse<T>` compiles without errors
- [ ] `handleResponse` correctly narrowstype based on `ok` property
- [ ] `mapResponse` transforms data and preserves errors
- [ ] `getProperty` uses `keyof` and prevents invalid property access
- [ ] `validateResponse` safely casts unknown to `ApiResponse<T>`
- [ ] `chainResponses` chains two async-like operations
- [ ] `npm run typecheck` passes with no errors

## Hint: Run typecheck often

```bash
npm run typecheck
```

This validates your generic implementations. If you see errors, read them carefully—they often point to the exact problem.

## What You Will Learn

By completing this assignment:

1. **Generic constraints** (`K extends keyof T`) ensure type safety
2. **Discriminated unions** enable narrowing in generic types
3. **Inference** means you rarely write types explicitly
4. **Type relationships** are preserved from input to output
5. **Real patterns** (response handlers, chains) use generics heavily

This is not contrived—real TypeScript code in production uses these patterns daily.
