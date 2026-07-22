// Module 1: Foundations - Exercises
// Different scenarios from lesson. Learning through practice.
// Try to solve without looking at solutions.
// Run: npm run typecheck

// ============================================================================
// EXERCISE 1: Build a Runtime Validator
// ============================================================================

// You receive data from an API. It SHOULD be a User, but you're not sure.
// Build a validator that:
// 1. Checks if data has required properties
// 2. Checks if properties have correct types
// 3. Returns typed result if valid

interface Validator<T> {
  validate(data: unknown): { ok: true; value: T } | { ok: false; reason: string };
}

type User = { id: string; name: string; email: string };

// TODO: Create a UserValidator that:
// - Checks data is an object
// - Checks id, name, email are strings
// - Returns { ok: true; value: User } if valid
// - Returns { ok: false; reason: "..." } if invalid

class UserValidator implements Validator<User> {
  validate(data: unknown): { ok: true; value: User } | { ok: false; reason: string } {
    // TODO: implement validation
    return { ok: false, reason: "not implemented" };
  }
}

// Tests:
// const validator = new UserValidator();
// const result1 = validator.validate({ id: "1", name: "Sonik", email: "test@example.com" });
// if (result1.ok) {
//   result1.value.id;  // string, type-safe
// }
//
// const result2 = validator.validate({ id: 123, name: "Sonik" });  // missing email
// if (!result2.ok) {
//   console.log(result2.reason);
// }

// ============================================================================
// EXERCISE 2: Type Discriminator - Narrowing by Shape
// ============================================================================

// You have different types of events. Each has a different shape.
// Build functions that safely handle each type.

type ClickEvent = { type: "click"; x: number; y: number };
type SubmitEvent = { type: "submit"; formData: Record<string, unknown> };
type TimerEvent = { type: "timer"; duration: number };

type Event = ClickEvent | SubmitEvent | TimerEvent;

// TODO: Create these functions:
// function handleEvent(event: Event): void
// function getEventData(event: Event): unknown
// function getEventType(event: Event): string

function handleEvent(event: Event): void {
  // TODO: Use type narrowing to call different handlers
  // - For click: log x, y
  // - For submit: log form keys
  // - For timer: log duration
}

function getEventData(event: Event): unknown {
  // TODO: Return the core data for this event
  // - Click: { x, y }
  // - Submit: formData
  // - Timer: duration
  return null;
}

function getEventType(event: Event): string {
  // TODO: Get the discriminator
  return event.type;
}

// ============================================================================
// EXERCISE 3: Type Guards for Complex Narrowing
// ============================================================================

// You receive data that MIGHT be an error, but you're not sure how.
// Build a type guard to check.

function isError(value: unknown): value is Error {
  // TODO: Check if value is an Error
  // - Check if it's an object
  // - Check if it has 'message' property (string)
  // - Check if it has 'name' property (string)
  return false;
}

function isApiError(value: unknown): value is { code: number; message: string } {
  // TODO: Check if value looks like an API error
  // Must have both 'code' (number) and 'message' (string)
  return false;
}

function handleError(error: unknown): void {
  // TODO: Use the type guards to handle different error types
  // - If Error: log error.message
  // - Else if ApiError: log error.code and message
  // - Else: log "Unknown error"
}

// Tests:
// handleError(new Error("Something went wrong"));
// handleError({ code: 404, message: "Not found" });
// handleError("just a string");

// ============================================================================
// EXERCISE 4: Controlled Any Usage - Escape with Safety
// ============================================================================

// Sometimes you NEED to work with untyped data (legacy code, dynamic data).
// But you should minimize the blast radius of 'any'.

function parseConfig(configString: string): Record<string, unknown> {
  // TODO: Parse JSON safely
  // - If parsing fails, return empty object
  // - If result is not an object, return empty object
  // - Otherwise return the object
  try {
    const parsed: any = JSON.parse(configString);  // 'any' is OK here (parsing is dynamic)
    
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;  // Now we return Record<string, unknown>, narrower than any
    }
    return {};
  } catch {
    return {};
  }
}

// Tests:
// const config = parseConfig('{ "timeout": 5000, "host": "localhost" }');
// config.timeout;  // unknown type (safe)

// ============================================================================
// EXERCISE 5: Control Flow Narrowing
// ============================================================================

// You receive a value that could be multiple types.
// Use TypeScript's control flow analysis to narrow safely.

type Status = "loading" | "success" | "error";
type Response<T> = 
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: Response<T>): string {
  // TODO: Narrow based on response.status
  // - If loading: return "Loading..."
  // - If success: return the data (or string representation)
  // - If error: return the error message
  
  if (response.status === "loading") {
    return "Loading...";
  }
  
  // TODO: narrow further and return appropriate string
  return "";
}

// Tests:
// const res1: Response<string> = { status: "loading" };
// handleResponse(res1);  // "Loading..."
//
// const res2: Response<number> = { status: "success", data: 42 };
// handleResponse(res2);  // "42"
//
// const res3: Response<string> = { status: "error", error: "Network failed" };
// handleResponse(res3);  // "Network failed"

// ============================================================================
// EXERCISE 6: Build a Safe Wrapper Around External Data
// ============================================================================

// Simulate an external library that returns 'any'.
// Build a type-safe wrapper.

function fetchUserFromExternalAPI(): any {
  // Simulates an external library that doesn't have types
  return { id: "1", name: "Sonik", active: true };
}

// TODO: Create a function that:
// function getTypedUser(): User (from EXERCISE 1)
// - Calls fetchUserFromExternalAPI
// - Validates the result
// - Returns User if valid, throws if invalid

type UserForWrapping = { id: string; name: string; email: string };

function getTypedUser(): UserForWrapping {
  // TODO: implement
  // Hint: use validator from EXERCISE 1
  throw new Error("Not implemented");
}

// ============================================================================
// EXERCISE 7: Defensive Copying - Preventing Mutation
// ============================================================================

// You receive a readonly configuration object.
// You need to ensure it doesn't get mutated.

type AppConfig = {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
};

function createAppConfig(config: AppConfig): AppConfig {
  // TODO: Return a defensive copy (or freeze the original)
  // Options:
  // 1. Object.freeze(config)
  // 2. Create a new object: { ...config }
  // 3. Create a Proxy that prevents mutations
  
  // Which is best and why?
  return config;
}

// ============================================================================
// EXERCISE 8: Unknown vs Never - The Right Type for Each Case
// ============================================================================

function processInput(value: unknown): string {
  // TODO: Handle unknown value
  // - If string: return uppercase
  // - If number: return string representation
  // - If boolean: return "yes" or "no"
  // - Otherwise: return "unsupported type"
  
  return "not implemented";
}

function assertNever(value: never): never {
  // TODO: This function proves unreachability
  // - It should throw an error with the value
  // - Used in exhaustiveness checks
  throw new Error(`Unreachable code reached: ${value}`);
}

// Usage:
type Animal = "dog" | "cat" | "bird";

function greet(animal: Animal): string {
  if (animal === "dog") return "Woof";
  if (animal === "cat") return "Meow";
  if (animal === "bird") return "Tweet";
  
  // If we forgot to handle "bird", TypeScript would error:
  return assertNever(animal);  // ERROR if we forgot a case
}

// ============================================================================
// EXERCISE 9: Hard - Type-Safe Object Property Access
// ============================================================================

// Build a function that safely accesses nested properties.
// Input: object, path like "user.profile.name"
// Output: value if path exists, undefined if not

type DeepObject = {
  user: {
    id: string;
    profile: {
      name: string;
      age: number;
    };
  };
};

function getPath(obj: unknown, path: string): unknown {
  // TODO: Split path by ".", navigate through obj
  // - Start with obj
  // - For each segment, check if obj is an object
  // - Access obj[segment]
  // - Move to next segment
  // - Return final value or undefined
  
  return undefined;
}

// Tests:
// const data: DeepObject = { user: { id: "1", profile: { name: "Sonik", age: 24 } } };
// getPath(data, "user.profile.name");  // "Sonik"
// getPath(data, "user.unknown.path");  // undefined
// getPath(data, "user");               // { id, profile }

// ============================================================================
// BONUS: Very Hard - Infer Type from Runtime Data
// ============================================================================

// Can you write a function that:
// - Takes an object
// - Returns an object describing its type structure
// - Like: { id: "string", age: "number", active: "boolean" }

// This is used in libraries like Zod, Prisma, etc.

function inferSchema(obj: unknown): Record<string, string> {
  // TODO: Analyze obj's properties
  // For each property, determine its type:
  // - typeof returns "string", "number", "boolean", "object", "function", "symbol", "undefined"
  // - For objects/arrays, you might need deeper inspection
  
  return {};
}

// Tests:
// const schema = inferSchema({ id: "1", age: 24, active: true });
// schema.id;     // "string"
// schema.age;    // "number"
// schema.active; // "boolean"
