// Module 3: Generics - Solutions & Explanations

// ============================================================================
// EXERCISE 1 SOLUTION: Basic Generic Function
// ============================================================================

function arrayLength<T>(items: T[]): number {
  return items.length;
}

// EXPLANATION:
// - T is a type parameter (placeholder)
// - items: T[] means "array of whatever type T is"
// - The function works the same way for any array type
// - The caller does not need to write <number> or <string>; TypeScript infers T

// When called:
// arrayLength([1, 2, 3])      → T = number, returns number
// arrayLength(["a", "b"])     → T = string, returns string
// arrayLength([true, false])  → T = boolean, returns boolean

// ============================================================================
// EXERCISE 2 SOLUTION: Generic Type Definition
// ============================================================================

type Pair<T> = [T, T];

// EXPLANATION:
// - A Pair is a tuple of two values of the same type
// - By using <T>, the second element must match the first's type
// - Alternative: type Pair<T> = { first: T; second: T };

const numberPair: Pair<number> = [1, 2];
const stringPair: Pair<string> = ["a", "b"];

// TypeScript enforces that both elements are the same type:
// const badPair: Pair<number> = [1, "two"];  // ERROR: "two" is not a number

// ============================================================================
// EXERCISE 3 SOLUTION: Multiple Type Parameters
// ============================================================================

function createPair<T, U>(first: T, second: U) {
  return { first, second };
}

// EXPLANATION:
// - T and U are two separate type slots
// - first: T, second: U means they can be different types
// - The return type is { first: T; second: U }
// - TypeScript infers both T and U from the arguments

const pair = createPair(42, "hello");
// T = number, U = string
// pair type: { first: number; second: string }

// ============================================================================
// EXERCISE 4 SOLUTION: Constraint to Object
// ============================================================================

function countKeys<T extends object>(obj: T): number {
  return Object.keys(obj).length;
}

// EXPLANATION:
// - <T extends object> means T must be an object type
// - This prevents passing primitives like numbers or strings
// - Object.keys() works because we know obj is an object

countKeys({ name: "Sonik", age: 24 });     // 2, OK
countKeys({ id: "u1" });                   // 1, OK
// countKeys(42);                           // ERROR: not assignable to object

// WHY THE CONSTRAINT?
// Without it, we could not safely call Object.keys(obj) because
// we would not know obj is an object. The constraint guarantees safety.

// ============================================================================
// EXERCISE 5 SOLUTION: Constraint to Specific Properties
// ============================================================================

function getId<T extends { id: string }>(obj: T): string {
  return obj.id;
}

// EXPLANATION:
// - <T extends { id: string }> means T must have an 'id' property of type string
// - This constraint guarantees obj.id exists and is a string
// - TypeScript prevents passing objects without an 'id' property

getId({ id: "123", name: "Sonik" });  // OK, has id
getId({ id: "u1" });                  // OK, has id
// getId({ name: "Sonik" });           // ERROR: missing id property

// WHY?
// Without the constraint, TypeScript would not know if obj has an 'id' property
// The constraint makes it safe to access obj.id

// ============================================================================
// EXERCISE 6 SOLUTION: keyof with Safe Property Access
// ============================================================================

type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

function getProperty<K extends keyof Product>(
  product: Product,
  key: K
): Product[K] {
  return product[key];
}

// EXPLANATION:
// - <K extends keyof Product> means K must be a valid key of Product
// - keyof Product = "name" | "price" | "inStock"
// - Product[K] is the type of that property
// - If key = "name", return type is Product["name"] = string
// - If key = "price", return type is Product["price"] = number

const product: Product = {
  name: "Laptop",
  price: 1000,
  inStock: true
};

const name: string = getProperty(product, "name");       // OK
const price: number = getProperty(product, "price");     // OK
const inStock: boolean = getProperty(product, "inStock"); // OK
// getProperty(product, "unknown");                      // ERROR

// KEY INSIGHT:
// The relationship between the key and the return type is captured.
// You cannot ask for a property that does not exist.
// And the return type matches the property type exactly.

// ============================================================================
// EXERCISE 7 SOLUTION: Generic Array Transformation
// ============================================================================

function transform<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

// EXPLANATION:
// - T is the input item type, U is the output item type
// - fn: (item: T) => U transforms T into U
// - The function maps fn over all items
// - Output type is U[], preserving the transformation type

const nums = [1, 2, 3];
const strings = transform(nums, n => n.toString());
// T = number, U = string
// strings is string[]
// strings = ["1", "2", "3"]

const words = ["hello", "world"];
const lengths = transform(words, w => w.length);
// T = string, U = number
// lengths is number[]
// lengths = [5, 5]

// ============================================================================
// EXERCISE 8 SOLUTION: Constrain to Class Instance
// ============================================================================

function getErrorMessage<T extends Error>(error: T): string {
  return error.message;
}

// EXPLANATION:
// - <T extends Error> means T must be an Error or subclass of Error
// - This guarantees error.message exists
// - TypeScript rejects non-Error types

getErrorMessage(new Error("Something went wrong"));  // OK
getErrorMessage(new TypeError("Type error"));        // OK
// getErrorMessage("not an error");                  // ERROR

// WHY?
// Error has a message property. The constraint guarantees it exists.
// Without it, we could not safely access error.message

// ============================================================================
// EXERCISE 9 SOLUTION: Merge Objects with Generics
// ============================================================================

function mergeObjects<T extends object, U extends object>(
  obj1: T,
  obj2: U
): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// EXPLANATION:
// - Both obj1 and obj2 must be objects
// - { ...obj1, ...obj2 } spreads both objects into one
// - T & U is the intersection type: "has all properties of T and U"
// - The cast 'as T & U' tells TypeScript the result type

const userMerged = mergeObjects({ name: "Sonik" }, { age: 24 });
// T = { name: string }, U = { age: number }
// Result type: { name: string } & { age: number }
// userMerged.name is string, userMerged.age is number

const merged = mergeObjects({ id: "1" }, { admin: true });
// merged.id is string, merged.admin is boolean

// ============================================================================
// EXERCISE 10 SOLUTION: Generic Function Composition
// ============================================================================

function compose<T, U, V>(
  fn1: (input: T) => U,
  fn2: (input: U) => V
): (input: T) => V {
  return (input: T) => fn2(fn1(input));
}

// EXPLANATION:
// - fn1 transforms T to U
// - fn2 transforms U to V
// - The composed function transforms T directly to V
// - It chains: call fn1 first, then pass result to fn2

const add1 = (n: number) => n + 1;
const times2 = (n: number) => n * 2;
const composed = compose(add1, times2);
// Composed function: (n: number) => number
// compose(5) = times2(add1(5)) = times2(6) = 12

const toNumber = (s: string) => parseInt(s);
const double = (n: number) => n * 2;
const stringToDouble = compose(toNumber, double);
// Composed function: (s: string) => number
// stringToDouble("5") = double(toNumber("5")) = double(5) = 10

// ============================================================================
// EXERCISE 11 SOLUTION: Pick Properties from Object
// ============================================================================

type User = {
  id: string;
  name: string;
  email: string;
  age: number;
};

function pick<T, K extends keyof T>(obj: T, keys: K[]): Record<K, T[K]> {
  const result = {} as Record<K, T[K]>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

// EXPLANATION:
// - T is the object type, K is a key of T
// - keys: K[] is an array of valid property names
// - Record<K, T[K]> means "object with keys K, values are T[K]"
// - For each key, we copy the property from obj to result

const user: User = {
  id: "1",
  name: "Sonik",
  email: "test@example.com",
  age: 24
};

const partial = pick(user, ["name", "age"]);
// Result: { name: "Sonik", age: 24 }
// partial.name is string
// partial.age is number
// partial.id does not exist

// ============================================================================
// BONUS SOLUTION: Very Hard - Typed Database Query
// ============================================================================

type DbUser = {
  id: string;
  name: string;
  email: string;
};

type DbPost = {
  id: string;
  title: string;
  authorId: string;
};

function filterBy<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return items.filter(item => item[key] === value);
}

// EXPLANATION:
// - T is the item type, K is a valid key of T
// - key: K means we can only filter by properties that exist
// - value: T[K] means the value must match the property type
// - We filter items where item[key] === value

const users: DbUser[] = [
  { id: "1", name: "Sonik", email: "sonik@example.com" },
  { id: "2", name: "Asha", email: "asha@example.com" }
];

const sonikUsers = filterBy(users, "name", "Sonik");
// K = "name", value = "Sonik" (type string)
// Result: [{ id: "1", name: "Sonik", email: "sonik@example.com" }]

const posts: DbPost[] = [
  { id: "p1", title: "Hello", authorId: "1" },
  { id: "p2", title: "World", authorId: "2" }
];

const postsBy1 = filterBy(posts, "authorId", "1");
// K = "authorId", value = "1" (type string)
// Result: [{ id: "p1", title: "Hello", authorId: "1" }]

// ============================================================================
// KEY LEARNING POINTS
// ============================================================================

// 1. Generics preserve relationships
//    - Input array type determines output element type
//    - Input key determines output value type

// 2. Constraints make generics safe
//    - <T extends object> ensures you can call Object methods
//    - <K extends keyof T> ensures the key exists
//    - <T extends { id: string }> ensures the property exists

// 3. keyof enables type-safe property access
//    - keyof T gives you "name" | "price" | ... (the valid keys)
//    - T[K] gives you the type of property K
//    - This prevents passing invalid keys

// 4. Multiple type parameters encode relationships
//    - <T, U> for different types
//    - Callback functions link them: (T) => U

// 5. Inference makes generics user-friendly
//    - Do not write <number, string> explicitly
//    - Let TypeScript infer from arguments
//    - Good generic APIs hide the complexity
