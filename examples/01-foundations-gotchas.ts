// Module 1: Foundations - Edge Cases & Gotchas (NOT lesson patterns)
// These are surprising situations that catch developers
// Run: npm run typecheck

// ============================================================================
// GOTCHA 1: Type Erasure Means TypeScript Can't Protect Everything
// ============================================================================

// Simulated external API
function fetchDataFromApi(): unknown { return {}; }

// TypeScript erases all types. This is safe:
const userId: string = "123";
userId.toUpperCase();  // TypeScript knows this is safe

// But what about external data?
function processUser(data: unknown) {
  // User asserts the type:
  const userData: { id: string; name: string } = data as any;
  
  // TypeScript now trusts this. At runtime:
  // - userData.id might be a number (not a string)
  // - userData.name might be undefined
  // - userData might not have these properties
  
  return userData.name.toUpperCase();  // CRASHES if name is undefined or not a string
}

// This is why runtime validation is critical for external data

// ============================================================================
// GOTCHA 2: Type Assertions Don't Validate
// ============================================================================

// These both compile and do the EXACT SAME THING:
const assertValue1: string = "hello" as string;       // Assert: "I promise this is a string"
const assertValue2: string = ("hello") as any as string;  // Lie through 'any', then lie back
const assertValue3: string = 42 as any as string;    // This compiles but is a lie

// All compile. Only the first is honest.
// const result = (assertValue3 as any).toUpperCase();  // CRASHES: 42 is not a string
// ============================================================================
// GOTCHA 3: 'any' Defeats Type Checking Silently
// ============================================================================

const suspect: any = fetchDataFromApi();

suspect.doThis();           // No error
suspect.doThat();           // No error
suspect.foo.bar.baz.qux();  // No error
suspect[0][1][2][3];        // No error

// All compile with 'any'. All might crash at runtime.
// Using 'any' is saying "I don't need TypeScript's help here".

// Better: use 'unknown' and narrow
const safe: unknown = fetchDataFromApi();
// safe.doThis();  // ERROR: unknown type

// ============================================================================
// GOTCHA 4: 'unknown' Is Not A Substitute For Validation
// ============================================================================

const apiDataEx4: unknown = { id: "1", name: "test" };  // Simulated API response

// You CAN narrow the type:
if (typeof apiDataEx4 === "object" && apiDataEx4 !== null) {
  // Now TypeScript knows it's an object, but what properties?
  // apiDataEx4.id  // Still ERROR: object has no properties
}

// This doesn't help. You need to validate each property:
if (
  typeof apiDataEx4 === "object" &&
  apiDataEx4 !== null &&
  typeof (apiDataEx4 as any).id === "string" &&
  typeof (apiDataEx4 as any).name === "string"
) {
  const userEx4 = apiDataEx4 as { id: string; name: string };
  userEx4.id;    // NOW it's safe
}

// ============================================================================
// GOTCHA 5: Const Doesn't Mean Immutable (At Runtime)
// ============================================================================

const userEx5 = { id: "1", name: "Sonik" };
// This is const, but:
userEx5.name = "John";           // ALLOWED, no error
// userEx5.age = 25;                // TYPE ERROR: age doesn't exist

// TypeScript const only means "can't be reassigned":
// userEx5 = { id: "2" };  // ERROR: can't reassign userEx5

// For true immutability, use 'readonly' or 'as const':
const immutableEx5 = { id: "1", name: "Sonik" } as const;
// immutableEx5.name = "John";  // ERROR: name is readonly

// ============================================================================
// GOTCHA 6: Type Narrowing Can Be Confusing
// ============================================================================

// Narrowing works when you check the type:
function checkType(v: string | number): string {
  if (typeof v === "string") {
    return v.toUpperCase();  // v is string here
  } else {
    return v.toFixed(2);  // v is number here
  }
}

// But early returns can be confusing:
function processEarly(v: string | number): void {
  if (typeof v !== "string") return;  // Exit if NOT string
  
  // After this, v must be string
  console.log(v.toUpperCase());  // OK
}

// The logic inverts (NOT vs IS), which confuses people

// This is correct, but the logic is: "exit if NOT string, continue if IS string"
// Humans often reverse this mentally

// ============================================================================
// GOTCHA 7: Literal Types Are Strict
// ============================================================================

const greetingEx7 = "hello";      // Type: "hello" (literal), not string
const greetingStrEx7: string = "hello";  // Type: string

function greetEx7(text: "hello" | "goodbye") {
  console.log(text);
}

// greetEx7(greetingEx7);    // Depends on how greetingEx7 is typed

// If greetingEx7: "hello", it works
// If greetingEx7: string, it DOESN'T work (string is too broad for literal)

// This is surprising:
const statusCodeEx7 = 200;  // Type: 200 (literal number)
function handleEx7(code: 200 | 404) {
  return code;
}
handleEx7(statusCodeEx7);  // OK, because 200 is inferred as literal

// But:
let statusCode2Ex7: number = 200;
// handleEx7(statusCode2Ex7);  // ERROR: number is not 200 | 404

// ============================================================================
// GOTCHA 8: Excess Property Checks Only on Object Literals
// ============================================================================

type UserEx8 = { id: string; name: string };

// Excess property check (on literal):
// const user1: UserEx8 = { id: "1", name: "Sonik", age: 24 };  // ERROR: age is extra

// But:
const objEx8 = { id: "1", name: "Sonik", age: 24 };
const user2Ex8: UserEx8 = objEx8;  // OK, no error!

// Why? TypeScript uses structural typing:
// - Object literal { ...} is checked strictly
// - Variable assignment is checked loosely (must have all required properties)

// This is a gotcha because the same data can be valid or invalid
// depending on how you write it

// ============================================================================
// GOTCHA 9: Union Type Narrowing Is Context-Dependent
// ============================================================================

type ResultEx9<T> = { ok: true; data: T } | { ok: false; error: string };

function handleEx9<T>(result: ResultEx9<T>) {
  if (!result.ok) {
    // Inside: result is { ok: false; error: string }
    console.log(result.error);  // OK
  } else {
    // Inside: result is { ok: true; data: T }
    console.log(result.data);  // OK
  }
}

// But what if you narrow on a property, then use another?
function narrowExampleEx9<T>(result: ResultEx9<T>) {
  if (result.ok) {
    console.log(result.data);  // OK: we know ok is true, so data exists
  }
}

// Problem: non-exhaustive narrowing
const valueEx9: ResultEx9<string> | { ok: null } = { ok: null } as any;
if (valueEx9.ok as boolean) {
  // valueEx9 is still { ok: null } or { ok: true; data: string }
  // Not fully narrowed!
}

// ============================================================================
// GOTCHA 10: Inference vs Declaration
// ============================================================================

// Inferred:
const data1Ex10 = { name: "Sonik", age: 24 };  // Type: { name: string; age: number }

// Declared:
const data2Ex10: { name: string; age: number } = { name: "Sonik", age: 24 };

// These look the same, but:
// - Inferred: TypeScript infers the tightest type possible
// - Declared: You specify exactly what you want

// Problem case:
const configEx10 = { timeout: 5000, retries: 3 };  // Inferred: { timeout: number; retries: number }

function initializeEx10(cfg: { timeout: 5000; retries: 3 }) {
  // cfg.timeout must be exactly 5000, not any number
}

// initializeEx10(configEx10);  // ERROR: number is not exactly 5000

// Solution:
const config2Ex10: { timeout: 5000; retries: 3 } = { timeout: 5000, retries: 3 };
// OR:
const config3Ex10 = { timeout: 5000, retries: 3 } as const;

// ============================================================================
// GOTCHA 11: Never Type Is Genuinely Empty
// ============================================================================

type Impossible = never;

// Never is used in impossibleness:
type Response = { ok: true; data: string } | { ok: false; error: string };

function handle(r: Response) {
  if (r.ok) {
    // Type: { ok: true; data: string }
  } else if (!r.ok) {
    // Type: { ok: false; error: string }
  } else {
    // Type: never (unreachable)
    const x: never = r;  // Proves we're unreachable
  }
}

// Never is NOT the same as void:
// - void: "function doesn't return a meaningful value"
// - never: "function never returns" (throws or infinite loop)

function throwError(msg: string): never {
  throw new Error(msg);
}

// If you call throwError, execution stops:
// throwError("oops");
// console.log("unreachable");  // This doesn't run

// ============================================================================
// GOTCHA 12: Implicit Index Signature Access
// ============================================================================

const dataEx12: Record<string, any> = { id: "1", name: "Sonik" };

// Access with string key is OK:
dataEx12["id"];  // OK
const someStringKey = "name";
dataEx12[someStringKey];  // OK

// But properties are not type-safe:
const keyEx12 = "unknown";
dataEx12[keyEx12];  // Type: any (not the value type)

// With strict mode:
// const data2Ex12: Record<string, string> = { id: "1", name: "Sonik" };
// data2Ex12[keyEx12];  // Type: string | undefined (with noUncheckedIndexedAccess)

// This is why keyof is safer:
type UserEx12 = { id: string; name: string };
const userEx12: UserEx12 = { id: "1", name: "Sonik" };
const userKeyEx12: keyof UserEx12 = "id";
userEx12[userKeyEx12];  // Type-safe

// ============================================================================
// SUMMARY: When to Worry About Erasure
// ============================================================================

// TypeScript CAN'T protect:
// 1. External data (APIs, files, user input)
// 2. Casting and 'as any' usage
// 3. Runtime behavior vs type declarations
// 4. Libraries without proper types
// 5. Legacy JavaScript mixed with TypeScript

// TypeScript CAN'T prevent:
// 1. Incorrect 'as' assertions
// 2. Using 'any' to escape checks
// 3. Lying about type narrowing
// 4. Over-specifying with 'as const'

// Best practice: Use TypeScript's help, but validate external data
