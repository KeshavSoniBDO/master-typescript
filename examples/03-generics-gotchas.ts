// Module 3: Generics - Edge Cases & Gotchas (NOT lesson patterns)
// These are the tricky situations and surprises that catch developers
// Run: npm run typecheck

// ============================================================================
// GOTCHA 1: Type Parameter Not Used
// ============================================================================

// This compiles but T is useless
function logFirst<T>(items: T[]): void {
  console.log(items[0]);  // Could just accept unknown[]
}

// Better: only use generics if they affect the return type
function getFirstUseful<T>(items: T[]): T | undefined {
  return items[0];  // Now T actually matters for the return
}

// ============================================================================
// GOTCHA 2: Inference Ambiguity
// ============================================================================

// TypeScript can't infer T from two different sources
function createObject<T>(key: string, value: T): { key: string; value: T } {
  return { key, value };
}

// Clear:
const obj1 = createObject("name", "Sonik");  // T = string, inferred from value

// Ambiguous: value and comparison are both type T, but they conflict
// function ambiguous<T>(a: T, b: T, compare: (x: T, y: T) => boolean) { }
// ambiguous(42, "hello", (x, y) => x === y);  // ERROR: number vs string

// ============================================================================
// GOTCHA 3: Constraint Too Loose
// ============================================================================

// The constraint allows too much
function getProp<T extends object>(obj: T, key: string): any {
  return (obj as any)[key];  // Still have to lie with 'as any'
}

// Any object has this signature, but not all have the key you want
getProp({ name: "Sonik" }, "unknownKey");  // Compiles but wrong at runtime

// Better: use keyof to guarantee the key exists
function getPropSafe<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];  // No cast needed, type-safe
}

// ============================================================================
// GOTCHA 4: Generic Default Values Are Weird
// ============================================================================

type Box<T = string> = { value: T };

const box1: Box = { value: "hello" };       // Works: T defaults to string
const box2: Box<number> = { value: 42 };    // Works: explicit T

// But what if you pass an incompatible type?
// const box3: Box = { value: 42 };         // ERROR: even though T defaults to string
// You can't override the default without explicitly writing Box<number>

// ============================================================================
// GOTCHA 5: Inference from Return Type vs Parameters
// ============================================================================

function process<T>(input: T): T {
  return input;
}

// Inference from parameter
const result1 = process(42);  // T = number, returns number

// What if you WANT to specify T differently?
const result2: string = process(42 as any);  // Hack: cast to get what you want

// Better: make T more flexible
function processTyped<T, R>(input: T, transform: (x: T) => R): R {
  return transform(input);
}

const result3 = processTyped(42, (n) => n.toString());  // T = number, R = string

// ============================================================================
// GOTCHA 6: Generic Functions and Overloading Clash
// ============================================================================

// TypeScript can't tell these apart:
// function handle<T extends string | number>(value: T): T { return value; }
// function handle<T extends boolean>(value: T): T { return value; }
// ERROR: overloads don't distinguish

// The generic T can't be narrowed in overloads
// Solution: use explicit types instead of generics for overloading
function handleExplicit(value: string): string;
function handleExplicit(value: number): number;
function handleExplicit(value: boolean): boolean;
function handleExplicit(value: string | number | boolean) {
  return value;
}

// ============================================================================
// GOTCHA 7: Union Expansion in Generics
// ============================================================================

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

// If T is a union, Result<T> creates multiple union members
type StringOrNumber = Result<string | number>;
// This becomes:
// { ok: true; data: string | number } | { ok: false; error: string }

// But sometimes you want:
// { ok: true; data: string } | { ok: true; data: number } | { ok: false; error: string }

// This is rare, but the distinction matters for discriminated unions

// ============================================================================
// GOTCHA 8: keyof Gotcha - Non-String Keys
// ============================================================================

const mixed = { name: "Sonik", 42: "answer", [Symbol.toStringTag]: "Mixed" };

type KeysOfMixed = keyof typeof mixed;
// KeysOfMixed = "name" | "42" | typeof Symbol.toStringTag
// Symbols and numeric keys are included!

function getKeyTypeSafe<K extends keyof typeof mixed>(
  obj: typeof mixed,
  key: K
): typeof mixed[K] {
  return obj[key];
}

// If you only want string keys:
type StringKeys<T> = Extract<keyof T, string>;

// ============================================================================
// GOTCHA 9: Generic Constraint Doesn't Validate Runtime
// ============================================================================

function mustHaveId<T extends { id: string }>(obj: T): string {
  return obj.id;
}

const data = { id: 123 };  // Compiles: satisfies { id: string } at compile time
// But at runtime, id is a number, not a string!
// TypeScript can't check this.

// You might do:
// const result = mustHaveId(data);
// result.toUpperCase();  // Crashes at runtime: 123 is not a string

// ============================================================================
// GOTCHA 10: Partial Application Not Supported
// ============================================================================

function combine<T, U, V>(a: T, b: U, fn: (x: T, y: U) => V): V {
  return fn(a, b);
}

// You can't do this:
// type NumToStr = (x: number) => string;
// const partial: (b: string, fn: NumToStr) => string = combine<number>;
// ERROR: can't partially apply generics

// Workaround: wrap in a function
function combineNumbers(b: string, fn: (x: number, y: string) => string): string {
  return combine(42, b, fn);
}

// ============================================================================
// GOTCHA 11: Generics in Class Properties
// ============================================================================

class Store<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }
}

const store = new Store<string>();
store.add("hello");

// But here's the surprise:
const store2 = new Store();  // T = unknown (not inferred from class)
// You must specify: new Store<string>()

// With functions:
function create<T>(initial: T): Store<T> { return new Store(); }
const store3 = create("hello");  // T inferred from argument

// ============================================================================
// GOTCHA 12: Circular Generic Constraints
// ============================================================================

// This looks good but can cause issues:
// type Node<T> = { value: T; next?: Node<T> };
// Infinite generic recursion is possible:
// function traverse<T extends Node<any>>(node: T): void {
//   if (node.next) traverse(node.next);  // Next is T, goes forever
// }

// Add a depth limit:
function traverseSafe<T extends { next?: T }>(node: T, depth: number): void {
  if (depth <= 0 || !node.next) return;
  traverseSafe(node.next, depth - 1);
}

// ============================================================================
// SUMMARY: When Generics Hurt
// ============================================================================

// - When T doesn't appear in the return type (not useful)
// - When constraints are weaker than the implementation needs
// - When you're tempted to use 'as any' inside the generic
// - When inference is ambiguous or confusing
// - When the generic doesn't simplify the code vs concrete types
// - When you need different behavior for different types (use overloads instead)

// Best practice: Only use generics when:
// 1. The same implementation truly works for ALL types
// 2. Type information needs to flow from input to output
// 3. Users benefit from type safety by providing their type
// 4. You avoid using 'as any' or casting inside the generic
