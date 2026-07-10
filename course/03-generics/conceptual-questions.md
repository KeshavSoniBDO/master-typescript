// Module 3: Generics - Conceptual Questions
//
// These questions are meant to make you think deeply about generics.
// There are no "right" answers, but better and worse ones.
// Write your thoughts in comments. Be honest. Struggle a bit.

// ============================================================================
// QUESTION 1: When Do You Actually Need Generics?
// ============================================================================

// Consider these two functions:

function stringReplace(str: string, old: string, newStr: string): string {
  return str.replace(old, newStr);
}

function genericReplace<T>(items: T[], target: T, replacement: T): T[] {
  return items.map(item => item === target ? replacement : item);
}

// stringReplace is specific to strings. Should it be generic? Why or why not?
//
// genericReplace works on any type. Does it need to be generic? What would
// the non-generic version look like? Would it be better or worse?
//
// QUESTION: What is the difference between "could be generic" and "should be generic"?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 2: Over-Engineering with Generics
// ============================================================================

// These are all valid TypeScript:

function getStringLength<T extends string>(value: T): number {
  return value.length;
}

function getString<T extends string>(value: T): T {
  return value;
}

function isStringEmpty<T extends string>(value: T): boolean {
  return value.length === 0;
}

// Each function takes only strings. Why write them as generics?
// What problem does the generic "solve"?
//
// QUESTION: Is this good code? What would you do instead?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 3: Inference vs Explicit Type Parameters
// ============================================================================

// These do the same thing:

function double1(n: number): number {
  return n * 2;
}

function double2<T extends number>(n: T): T {
  return (n * 2) as T;
}

const numbers = [1, 2, 3];

// map([1, 2, 3], n => n * 2);        // Inference: T = number
// map<number>([1, 2, 3], n => n * 2); // Explicit: T specified

// QUESTION: When should you make the caller write <number> explicitly?
// When should you let TypeScript infer it?
// What happens to code readability in each case?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 4: Generic Constraints and Information Loss
// ============================================================================

// Without constraint:
function getPropertyAny<T>(obj: T, key: string): any {
  return (obj as any)[key];
}

// With constraint:
function getPropertyConstrained<T extends object>(obj: T, key: string): unknown {
  return obj[key];
}

// With better constraint:
function getPropertySafe<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// All three accept an object. But the third is more strict about keys.
//
// QUESTION: Why should you be strict about property access?
// What goes wrong if you allow any string as a key?
// When would you use each version? (There might be reasons to use the first two.)

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 5: Generic Callback Functions
// ============================================================================

// Callback signature problem:

function processUser1(user: { id: string; name: string }, callback: (u: unknown) => void) {
  callback(user);
}

function processUser2<T extends { id: string; name: string }>(
  user: T,
  callback: (u: T) => void
) {
  callback(user);
}

// In processUser1, the callback does not know what type of user it receives.
// In processUser2, the callback knows exactly: type T.

// QUESTION: Why does the second version help the callback function?
// What can the callback do with that information?
// Are there situations where the first version (unknown) is better?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 6: When Generics Hide Intent
// ============================================================================

// Generic version:
function transform<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

// Specific version (for numbers -> strings):
function numberToStrings(numbers: number[]): string[] {
  return numbers.map(n => n.toString());
}

// transform([1, 2, 3], n => n.toString());  // What does this do? Have to read the code.
// numberToStrings([1, 2, 3]);                // Clear: numbers become strings.

// QUESTION: When is it better to write specific functions instead of generic ones?
// What do you lose by being too generic?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 7: Generics and Type Safety
// ============================================================================

// Dangerous (loses information):
function first(items: unknown[]): unknown {
  return items[0];
}

// Type-safe (preserves information):
function firstGeneric<T>(items: T[]): T {
  return items[0];
}

// const num = first([1, 2, 3]);        // Type: unknown, no operations possible
// const num2 = firstGeneric([1, 2, 3]); // Type: number, can use number operations

// QUESTION: How does generics make your code safer, not just more type-correct?
// What are you prevented from doing with unknown that you can do with number?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 8: Designing APIs with Generics
// ============================================================================

// Two API designs for storing data:

// Design 1: Any type
function store1(key: string, value: any): void {
  // store value
}
function get1(key: string): any {
  // retrieve value
}

// Design 2: Generic type
type Store<T> = {
  set(key: string, value: T): void;
  get(key: string): T | undefined;
};

// Design 1 users:
// const value = get1("name");       // Type: any
// value.toUpperCase();              // OK? Maybe. Maybe it is a number.

// Design 2 users:
// const store: Store<string> = ...
// const value = store.get("name");  // Type: string | undefined
// value.toUpperCase();              // ERROR: string | undefined does not have toUpperCase()
// value?.toUpperCase();             // OK: safely handles undefined

// QUESTION: Which design is harder to use? Which one catches bugs?
// Why would you choose one over the other?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 9: Generic Relationships and Correctness
// ============================================================================

// This is allowed:
function wrongReverse<T, U>(items: T[]): U[] {
  return [] as U[];  // Return wrong type, but TypeScript does not stop you
}

// wrongReverse<number, string>([1, 2, 3]);  // Claims to return string[], but does not

// This is safer (T and U are related):
function correctMap<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

// correctMap([1, 2, 3], n => n.toString()); // Return type must match fn's return

// QUESTION: How do you enforce that generics are actually related?
// What makes one generic signature "correct" and another suspicious?

// YOUR ANSWER:
// ...

// ============================================================================
// QUESTION 10: Default Type Parameters
// ============================================================================

type Response<T = unknown> = {
  data: T;
  error: string | null;
};

type ResponseNoDefault<T> = {
  data: T;
  error: string | null;
};

// With default:
// const r1: Response = { data: "hello", error: null };  // T = unknown
// const r2: Response<string> = { data: "hello", error: null }; // T = string

// Without default:
// const r3: ResponseNoDefault = { ... };  // ERROR: missing type parameter
// const r4: ResponseNoDefault<string> = { ... }; // OK

// QUESTION: When should you provide a default type parameter?
// What is the trade-off between flexibility and requiring explicit types?

// YOUR ANSWER:
// ...

// ============================================================================
// REFLECTION: Before Moving On
// ============================================================================

// Write a paragraph about what you learned in this module.
// Include:
// 1. One time when generics saved you from a bug
// 2. One time when generics might be overkill
// 3. How you think about "T" now versus before

// YOUR REFLECTION:
// ...
