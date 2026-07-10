// Module 2: Objects and Functions - Gotchas & Edge Cases
// Focus: Surprises and tricky corners (NOT basic examples from lesson)
// Run: npm run example examples/02-objects-functions-gotchas.ts

// ============================================================================
// GOTCHA 1: Excess Property Checks Only on Object Literals
// ============================================================================

type UserEx1 = { id: string; name: string };

// This is ALLOWED (assigned from variable):
const fullData = { id: "1", name: "Sonik", email: "test@example.com", age: 30 };
const user1: UserEx1 = fullData;  // No error! TypeScript trusts the variable

// This is DISALLOWED (object literal):
// const user2: UserEx1 = { id: "1", name: "Sonik", email: "test@example.com" };  // ERROR!

console.log(user1);  // Works at runtime
// console.log(user2);  // Would not reach here due to compile error

// WHY? TypeScript assumes object literals might be typos.
// Variables are assumed intentional.

// ============================================================================
// GOTCHA 2: Optional vs. Missing Property
// ============================================================================

type ConfigEx2 = {
  host: string;
  port?: number;
};

// These are different:
const config1: ConfigEx2 = { host: "localhost" };                 // port omitted (fine)
// const config2: ConfigEx2 = { host: "localhost", port: undefined }; // port explicitly undefined (might not work with strictNullChecks)
const config3: ConfigEx2 = { host: "localhost", port: 5432 };      // port provided (fine)

// ============================================================================
// GOTCHA 3: Readonly Does Not Prevent Runtime Mutation
// ============================================================================

type ReadonlyConfigEx3 = {
  readonly apiKey: string;
};

const configEx3: ReadonlyConfigEx3 = { apiKey: "secret" };
// configEx3.apiKey = "new";  // ERROR at compile time

// But at runtime:
(configEx3 as any).apiKey = "hacked";  // This works!
console.log(configEx3.apiKey);  // "hacked" - TypeScript made a promise it couldn't keep

// Readonly is only a TypeScript-time promise, not runtime protection.

// ============================================================================
// GOTCHA 4: Contravariance in Function Parameters
// ============================================================================

type Handler = (x: number) => void;

// This is ALLOWED (scary):
const handler: Handler = (x: number | string) => {
  // Handler accepts more than promised!
};

// But this is OK because Handler only calls with numbers:
handler(5);  // We call with number, handler accepts number | string

// HOWEVER, if code thinks handler only accepts numbers:
const betterHandler = (x: number) => console.log(x + 1);
const handler2: Handler = betterHandler;  // This is OK
handler2(5);  // It works - betterHandler is stricter (accepts only number)

// The rule: Functions are assignable if they accept SAME OR MORE types.
// Not less! That would be type unsafe.

// ============================================================================
// GOTCHA 5: Index Signatures Make Property Access Unsafe
// ============================================================================

type FlexibleObjectEx5 = {
  id: string;
  [key: string]: string;
};

const obj: FlexibleObjectEx5 = { id: "1", custom: "value" };

// This feels safe:
// const value: string = obj["custom"];  // Could be undefined at runtime
// const valueAny: string = obj["anything"];  // Also could be undefined

// Better to use optional:
const valueOpt: string | undefined = obj["custom"];
const valueAnyOpt: string | undefined = obj["anything"];

// ============================================================================
// GOTCHA 6: Structural Typing Allows Unintended Matches
// ============================================================================

type Point = { x: number; y: number };
type Velocity = { x: number; y: number };

function move(point: Point, velocity: Velocity): void {
  point.x += velocity.x;
  point.y += velocity.y;
}

const location: Point = { x: 10, y: 20 };
const speed: Velocity = { x: 1, y: 2 };

move(location, speed);  // Works because shapes match!

// But we meant them to be different concepts:
// Point should maybe include `id`, Velocity should include `time`

// Structural typing doesn't care about semantic meaning.
// Both are just { x: number; y: number }

// ============================================================================
// GOTCHA 7: Generic Constraints Can Be Too Loose
// ============================================================================

function updateEx7<K extends string>(
  id: string,
  field: K,
  value: unknown
): void {
  // field can be ANY string!
  // No type safety on value
}

// updateEx7("user1", "id", "new-id");  // OK
// updateEx7("user1", "invalidField", "anything");  // Also OK (too loose!)

// Better:
type UserEx7 = { id: string; name: string; age: number };

function updateUserEx7<K extends keyof UserEx7>(
  id: string,
  field: K,
  value: UserEx7[K]  // Value type matches field type
): void {
  // Now safer
}

// updateUserEx7("user1", "id", "new-id");  // OK: string for string field
// updateUserEx7("user1", "age", 30);  // OK: number for number field
// updateUserEx7("user1", "age", "thirty");  // ERROR: age needs number

// ============================================================================
// GOTCHA 8: Assignment Direction Matters
// ============================================================================

type BaseEx8 = { id: string };
type ExtendedEx8 = { id: string; name: string };

let base: BaseEx8 = { id: "1" };
const extended: ExtendedEx8 = { id: "1", name: "Sonik" };

// Extended → Base OK (extended has everything base needs)
base = extended;  // OK

// Base → Extended NOT OK (base missing name)
// extended = base;  // ERROR

// Remember: assigning MORE to LESS is OK. Assigning LESS to MORE is not.

// ============================================================================
// GOTCHA 9: Functions NOT Objects—Different Compatibility
// ============================================================================

type Callback = (x: number) => string;

// Compatible? No, because:
const wrong: Callback = (x: number | string) => {
  // If we return something that's not always a string:
  return typeof x === "number" ? x.toString() : x;  // OK, always string
};

// But:
type BetterCallback = (x: number) => string | number;

// This is WRONG:
// const cb: Callback = function(x: number): string | number { return x; };
// ERROR: Can't assign string | number return to string return

// Functions are contravariant in parameters, covariant in return types.

// ============================================================================
// GOTCHA 10: Type Widening in Function Calls
// ============================================================================

type PresetEx10 = "light" | "dark";

const configEx10 = { theme: "light" as const };  // Use 'as const' to prevent widening
// Without 'as const', type would be string, not "light"

function applyThemeEx10(theme: PresetEx10): void {
  console.log(`Applying ${theme}`);
}

applyThemeEx10(configEx10.theme);  // OK with 'as const'
// Without 'as const': ERROR because theme would be string

// Type narrowing and widening affect compatibility.

// ============================================================================
// GOTCHA 11: Readonly on Nested Properties
// ============================================================================

type Profile = {
  readonly user: {
    name: string;
  };
};

const profile: Profile = {
  user: { name: "Sonik" }
};

// This is NOT allowed:
// profile.user = { name: "Keshav" };  // ERROR: Cannot assign to readonly

// But this IS allowed:
profile.user.name = "Keshav";  // OK! Readonly only protects the top level

// To make nested properties readonly:
type DeepReadonly = {
  readonly user: {
    readonly name: string;
  };
};

// ============================================================================
// GOTCHA 12: Optional Properties and Excess Property Checks
// ============================================================================

type LenientEx12 = {
  id: string;
  email?: string;
};

// This is allowed (optional property):
const lenient2: LenientEx12 = { id: "1", email: "test@example.com" };  // OK

// Excess properties are NOT allowed (even if optional):
// const lenient3: LenientEx12 = { id: "1", email: "test@example.com", phone: "555-1234" };  // ERROR

// Optional only means "might not be here", not "I accept extra fields"

// ============================================================================
// KEY LEARNINGS
// ============================================================================

/*
1. Excess property checks only apply to fresh object literals
2. Variables are trusted to contain intentional data
3. Readonly is TypeScript-only, not runtime-safe
4. Functions use contravariance for parameters (accept more, give less back)
5. Structural typing allows unintended shape matches (semantic mismatch)
6. Generic constraints with keyof provide type safety for field access
7. Assignment is directional: Extended → Base OK, Base → Extended NOT OK
8. Functions and objects have different compatibility rules
9. Type widening affects assignment compatibility
10. Readonly is shallow unless explicitly nested
11. Optional ≠ accept extra fields
12. Use 'as const' to prevent type widening in function calls
*/
