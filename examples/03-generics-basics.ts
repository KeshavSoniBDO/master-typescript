// Module 3: Generics - Runnable Examples

// ============================================================================
// EXAMPLE 1: Information Loss Problem
// ============================================================================

// Without generics: information is lost
function getFirstLosing(items: unknown[]): unknown {
  return items[0];
}

const nums = [1, 2, 3];
const firstNum = getFirstLosing(nums);  // Type is unknown, lost the relationship

// With generics: relationship is preserved
function getFirstPreserved<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumTyped = getFirstPreserved(nums);  // Type is number, relationship preserved

console.log(firstNum, firstNumTyped);

// ============================================================================
// EXAMPLE 2: Generic Functions
// ============================================================================

// Single type parameter
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);           // T = number
const str = identity("hello");      // T = string
const bool = identity(true);        // T = boolean

// The function is the same, but respects each type

// Generic with transformation
function map<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

const strings = map([1, 2, 3], n => n.toString());
// strings type: string[]

const doubled = map([1, 2, 3], n => n * 2);
// doubled type: number[]

console.log(strings, doubled);

// ============================================================================
// EXAMPLE 3: Generic Types
// ============================================================================

// Define a generic type
type Container<T> = {
  value: T;
  isEmpty: boolean;
};

const numberContainer: Container<number> = {
  value: 42,
  isEmpty: false
};

const stringContainer: Container<string> = {
  value: "hello",
  isEmpty: false
};

// The same type shape, different value types

// Generic with constraint
type HasId<T extends { id: string }> = {
  item: T;
  getId: () => string;
};

const userBox: HasId<{ id: string; name: string }> = {
  item: { id: "u1", name: "Sonik" },
  getId: function() {
    return this.item.id;
  }
};

console.log(userBox.getId());

// ============================================================================
// EXAMPLE 4: Constraints
// ============================================================================

// Without constraint: too loose, has to lie
function getPropertyLoose<T>(obj: T, key: string): unknown {
  return (obj as any)[key];
}

getPropertyLoose(42, "anything");  // Compiles but nonsensical

// With constraint: type-safe
function getProperty<T extends Record<string, unknown>>(
  obj: T,
  key: string
): unknown {
  return obj[key];
}

getProperty({ name: "Sonik" }, "name");  // OK
// getProperty(42, "num");                // ERROR: not assignable

// Constraint on method parameters
function printId<T extends { id: string }>(obj: T): void {
  console.log(`ID: ${obj.id}`);
}

printId({ id: "user-1", name: "Sonik" });  // OK, has id
// printId({ name: "Sonik" });              // ERROR: missing id property

// ============================================================================
// EXAMPLE 5: keyof for Safe Property Access
// ============================================================================

type User = {
  id: string;
  name: string;
  email: string;
};

const user: User = {
  id: "u1",
  name: "Sonik",
  email: "sonik@example.com"
};

// Without keyof: not type-safe
function getUserPropertyWeak(user: User, key: string): unknown {
  return (user as any)[key];
}

getUserPropertyWeak(user, "unknownProp");  // Compiles but wrong

// With keyof: type-safe
function getUserProperty<K extends keyof User>(user: User, key: K): User[K] {
  return user[key];
}

const userId: string = getUserProperty(user, "id");           // OK, returns string
const userName: string = getUserProperty(user, "name");       // OK, returns string
// const unknown = getUserProperty(user, "unknownProp");      // ERROR: not a valid key

console.log(userId, userName);

// The key must be valid, and the return type matches the property type

// ============================================================================
// EXAMPLE 6: Inference
// ============================================================================

// Explicit (verbose)
const explicit = getFirstPreserved<number>([1, 2, 3]);

// Inferred (better)
const inferred = getFirstPreserved([1, 2, 3]);
// TypeScript knows T = number, so inferred type is number

// Inference with multiple parameters
function merge<T, U>(first: T, second: U): T & U {
  return { ...first, ...second } as T & U;
}

const result = merge({ name: "Sonik" }, { age: 24 });
// T = { name: string }, U = { age: number }
// result type: { name: string } & { age: number }

console.log(result);

// ============================================================================
// EXAMPLE 7: Default Type Parameters
// ============================================================================

type Box<T = string> = {
  value: T;
};

const stringBox: Box = { value: "hello" };              // T = string (default)
const numberBox: Box<number> = { value: 42 };          // T = number (explicit)

console.log(stringBox, numberBox);

// ============================================================================
// EXAMPLE 8: Multiple Constraints
// ============================================================================

// T must be an object, K must be a key of T
function pick<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const picked = pick({ name: "Sonik", age: 24 }, "name");
// picked type: string

console.log(picked);

// ============================================================================
// SUMMARY
// ============================================================================

// Key takeaways:
// 1. Generics preserve relationships between input and output
// 2. T is a slot that gets filled based on the argument
// 3. Constraints restrict what types T can be
// 4. keyof lets you safely access object properties
// 5. Inference means you usually do not write T explicitly
// 6. Use generics when the same logic works for multiple types
