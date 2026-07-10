// Module 3: Generics - Exercises
// Try to solve these without looking at solutions.
// Run: npm run typecheck

// ============================================================================
// EXERCISE 1: Basic Generic Function
// ============================================================================

// Write a generic function that returns the length of any array.
// Do not use unknown, use T.

function arrayLength<T>(items: T[]): number {
  // TODO: implement
  return -1;
}

// Tests (should not have type errors):
// arrayLength([1, 2, 3]);           // 3
// arrayLength(["a", "b"]);          // 2
// arrayLength([true, false]);       // 2

// ============================================================================
// EXERCISE 2: Generic Type Definition
// ============================================================================

// Create a generic type called Pair that holds two values of the same type.
// type Pair<T> = ?

// TODO: define Pair

// Test usage (do not change):
// const numberPair: Pair<number> = [1, 2];
// const stringPair: Pair<string> = ["a", "b"];

// ============================================================================
// EXERCISE 3: Multiple Type Parameters
// ============================================================================

// Write a function that takes two values of different types
// and returns an object with both.

function createPair<T, U>(first: T, second: U) {
  // TODO: return { first, second }
  // What is the return type?
}

// Tests:
// const pair = createPair(42, "hello");
// pair.first is number
// pair.second is string

// ============================================================================
// EXERCISE 4: Constraint to Object
// ============================================================================

// Write a function that takes any object and returns the number of keys.
// The type parameter must be constrained to objects.

function countKeys<T extends object>(obj: T): number {
  // TODO: implement (hint: Object.keys())
  return -1;
}

// Tests:
// countKeys({ name: "Sonik", age: 24 });     // 2
// countKeys({ id: "u1" });                   // 1
// countKeys(42);                             // ERROR: number is not an object

// ============================================================================
// EXERCISE 5: Constraint to Specific Properties
// ============================================================================

// Write a function that takes an object with an 'id' property
// and returns just the id.

function getId<T extends { id: string }>(obj: T): string {
  // TODO: implement
  return "";
}

// Tests:
// getId({ id: "123", name: "Sonik" });  // "123"
// getId({ id: "u1" });                  // "u1"
// getId({ name: "Sonik" });             // ERROR: missing id

// ============================================================================
// EXERCISE 6: keyof with Safe Property Access
// ============================================================================

// Write a function that gets a property from an object.
// The key must be a valid property of T.
// The return type depends on the property type.

type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

function getProperty<K extends keyof Product>(
  product: Product,
  key: K
): Product[K] {
  // TODO: implement
  return product[key];
}

// Tests (uncomment after implementing):
// const name: string = getProperty(product, "name");      // OK
// const price: number = getProperty(product, "price");    // OK
// const inStock: boolean = getProperty(product, "inStock"); // OK
// getProperty(product, "unknown");                        // ERROR

// ============================================================================
// EXERCISE 7: Generic Array Transformation
// ============================================================================

// Write a function that transforms an array using a callback.
// Input: array of T, function that converts T to U
// Output: array of U

function transform<T, U>(items: T[], fn: (item: T) => U): U[] {
  // TODO: implement
  return [];
}

// Tests:
// const nums = [1, 2, 3];
// const strings = transform(nums, n => n.toString());
// strings is string[]
//
// const words = ["hello", "world"];
// const lengths = transform(words, w => w.length);
// lengths is number[]

// ============================================================================
// EXERCISE 8: Constrain to Class Instance
// ============================================================================

// Write a function that takes an Error instance and extracts the message.
// Use a constraint to ensure only Error objects are accepted.

function getErrorMessage<T extends Error>(error: T): string {
  // TODO: implement
  return "";
}

// Tests:
// getErrorMessage(new Error("Something went wrong"));  // "Something went wrong"
// getErrorMessage(new TypeError("Type error"));        // "Type error"
// getErrorMessage("not an error");                     // ERROR: string is not Error

// ============================================================================
// EXERCISE 9: Merge Objects with Generics
// ============================================================================

// Write a function that merges two objects.
// Both parameters must be objects.
// Return type is the intersection of both.

function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U
): T & U {
  // TODO: implement (hint: use Object.assign or spread)
  return { ...obj1, ...obj2 } as T & U;
}

// Tests:
// const user = mergeObjects({ name: "Sonik" }, { age: 24 });
// user.name is string
// user.age is number
//
// const merged = mergeObjects({ id: "1" }, { admin: true });
// merged.id is string
// merged.admin is boolean

// ============================================================================
// EXERCISE 10: Hard - Generic Function Composition
// ============================================================================

// Write a function that takes two transformation functions
// and combines them into one.
// If first function goes T -> U, and second goes U -> V,
// the result should go T -> V.

function compose<T, U, V>(
  fn1: (input: T) => U,
  fn2: (input: U) => V
): (input: T) => V {
  // TODO: implement
  return (input: T) => fn2(fn1(input));
}

// Tests:
// const add1 = (n: number) => n + 1;
// const times2 = (n: number) => n * 2;
// const composed = compose(add1, times2);
// composed(5) === 12  // (5 + 1) * 2 = 12
//
// const toNumber = (s: string) => parseInt(s);
// const double = (n: number) => n * 2;
// const stringToDouble = compose(toNumber, double);
// stringToDouble("5") === 10

// ============================================================================
// EXERCISE 11: Hard - Pick Properties from Object
// ============================================================================

// Write a generic function that picks specific properties from an object.
// The keys parameter must be valid keys of the object.

type UserEx11 = {
  id: string;
  name: string;
  email: string;
  age: number;
};

function pick<T, K extends keyof T>(obj: T, keys: K[]): Record<K, T[K]> {
  // TODO: implement
  // Hint: create a new object with only the specified keys
  const result = {} as Record<K, T[K]>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

// Tests:
// const user: UserEx11 = { id: "1", name: "Sonik", email: "test@example.com", age: 24 };
// const partial = pick(user, ["name", "age"]);
// partial.name is string
// partial.age is number
// partial.id does not exist on type

// ============================================================================
// BONUS: Very Hard - Create a Typed Database Query
// ============================================================================

// This is a sneak peek at real patterns.
// Do this if Exercise 11 was easy.

type UserBonus = {
  id: string;
  name: string;
  email: string;
};

type PostBonus = {
  id: string;
  title: string;
  authorId: string;
};

// Write a generic query function that filters an array based on a condition.
// Input: array of items, a property to check, a value to match
// Output: array of items where property matches value

function filterBy<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  // TODO: implement
  return [];
}

// Tests (do not change):
// const users: UserBonus[] = [
//   { id: "1", name: "Sonik", email: "sonik@example.com" },
//   { id: "2", name: "Asha", email: "asha@example.com" }
// ];
//
// const sonikUsers = filterBy(users, "name", "Sonik");
// Result: [{ id: "1", name: "Sonik", email: "sonik@example.com" }]
//
// const postsBy1 = filterBy(posts, "authorId", "1");
// Result: [{ id: "p1", title: "Hello", authorId: "1" }]
