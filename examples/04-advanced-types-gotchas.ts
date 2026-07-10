// Module 4: Advanced Types - Edge Cases & Gotchas
// These examples show tricky patterns you will encounter in real code.
// Run: npm run example examples/04-advanced-types-gotchas.ts

// ============================================================================
// GOTCHA 1: Distributive Conditional Types with Unions
// ============================================================================

// This surprises everyone at first:
type StringOrBool<T> = T extends string ? "yes" : "no";

type Result1 = StringOrBool<string>;             // "yes" (expected)
type Result2 = StringOrBool<string | number>;    // "yes" | "no" (gotcha!)

// Why? TypeScript distributes over unions automatically.
// It is like: (T is string ? "yes" : "no") for EACH member of union

// If you do NOT want distribution, wrap in brackets:
type StringOrBoolNoDistribute<T> = [T] extends [string] ? "yes" : "no";
type Result3 = StringOrBoolNoDistribute<string | number>;  // "no" (no distribution)

console.log("Gotcha 1: Distributive behavior");

// ============================================================================
// GOTCHA 2: Conditional Types with Generics
// ============================================================================

// This breaks easily:
type GetKeys<T> = keyof T;

type UnionKeys1 = GetKeys<{ a: string; b: number }>;  // "a" | "b"
type UnionKeys2 = GetKeys<string>;                    // number | symbol (!)

// Why? string has a keyof (its length, indexing, etc.)

// Better: Add a constraint
type GetKeysConstrained<T extends object> = keyof T;
// type UnionKeys3 = GetKeysConstrained<string>;  // ERROR: string not assignable to object (this is the point!)

console.log("Gotcha 2: keyof on non-objects");

// ============================================================================
// GOTCHA 3: Template Literal Types with Unions (Explosion)
// ============================================================================

type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";

// This creates 9 types automatically:
type ButtonClass = `btn-${Color}-${Size}`;

// Result: "btn-red-small" | "btn-red-medium" | "btn-red-large" | "btn-green-small" | ...
// With 3 colors and 3 sizes = 9 combinations
// With 10 colors and 10 sizes = 100 combinations
// With 20 x 20 = 400 combinations (starts slowing down TypeScript)

console.log("Gotcha 3: Combinatorial explosion");

// ============================================================================
// GOTCHA 4: Conditional Type with Arrays (Wrong Way)
// ============================================================================

// This is WRONG:
type BadArrayElement<T> = T extends Array<any> ? T[0] : T;

type Elem1 = BadArrayElement<string[]>;  // string | undefined (not string!)
// Because T[0] is indexing syntax, not extraction

// This is RIGHT:
type GoodArrayElement<T> = T extends Array<infer E> ? E : T;

type Elem2 = GoodArrayElement<string[]>;  // string (correct!)

console.log("Gotcha 4: Array element extraction");

// ============================================================================
// GOTCHA 5: Circular Type References
// ============================================================================

// Avoid this:
// type Circular<T> = T extends { next: infer N } ? N extends Circular<typeof N> ? ... : ...
// This can cause infinite loops and crashes TypeScript

// When in doubt: add a depth limit
type SafeDeep<T, D extends number = 5> = D extends 0
  ? never
  : T extends { next: infer N }
  ? SafeDeep<N, [never, never, never, never, never, D][number]>
  : T;

console.log("Gotcha 5: Circular references");

// ============================================================================
// GOTCHA 6: Mapped Types and Readonly/Optional Modifiers
// ============================================================================

type User = {
  name: string;
  age: number;
};

// This REMOVES modifiers:
type Mutable<T> = {
  [K in keyof T]: T[K];
};

// This ADDS readonly:
type ReadonlyVersion<T> = {
  readonly [K in keyof T]: T[K];
};

// This ADDS optional:
type OptionalVersion<T> = {
  [K in keyof T]?: T[K];
};

// This REMOVES both readonly and optional:
type StrictVersion<T> = {
  -readonly [K in keyof T]-?: T[K];
};

console.log("Gotcha 6: Modifier handling");

// ============================================================================
// GOTCHA 7: Infer in Multiple Positions
// ============================================================================

// What does this extract?
// TypeScript expects named parameters in conditional:
type GetBoth<T> = T extends (first: infer A, second: infer B) => any ? [A, B] : never;

// This syntax is CORRECT:
type GetBoth2<T> = T extends (first: infer A, second: infer B) => any ? [A, B] : never;

type FuncType = (x: string, y: number) => boolean;
type Args = GetBoth2<FuncType>;  // [string, number]

console.log("Gotcha 7: Multiple infer positions");

// ============================================================================
// GOTCHA 8: Conditional Type with Function Return Types
// ============================================================================

// Tricky: distinguishing async vs sync
type Async<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any[]) => Promise<infer U>
  ? U
  : T;

type A1 = Async<Promise<string>>;              // string
type A2 = Async<() => Promise<number>>;        // number
type A3 = Async<() => string>;                 // () => string (function, not promise)

console.log("Gotcha 8: Function return type extraction");

// ============================================================================
// GOTCHA 9: Union Type narrowing in Mapped Types
// ============================================================================

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

// This converts unions to intersections (very advanced, rarely used)
type Union1 = { a: string } | { b: number };
type Intersection1 = UnionToIntersection<Union1>;
// Result: { a: string } & { b: number }

console.log("Gotcha 9: Union to intersection conversion");

// ============================================================================
// GOTCHA 10: Template Literal Type with Never
// ============================================================================

type MaybeString<T> = T extends string ? T : never;

// What happens with template literals?
type TemplateResult = `Hello ${MaybeString<string | number>}`;
// Result: "Hello " & string (incomplete, because number gets filtered to never)

// More practical:
type OnlyStrings<T extends string | number | boolean> = T extends any
  ? T extends string
    ? `prefix-${T}`
    : never
  : never;

type Result = OnlyStrings<"a" | "b" | number>;
// Result: "prefix-a" | "prefix-b" (number filtered out)

console.log("Gotcha 10: Template literals with never");

// ============================================================================
// BONUS GOTCHA: The satisfies Operator
// ============================================================================

// TypeScript 4.9+ has 'satisfies' which is different from 'as'
const obj1 = { a: "hello", b: 42 } as const;  // Type narrows to exact literal type

const obj2 = { a: "hello", b: 42 } satisfies Record<string, unknown>;
// Checks that obj2 satisfies the type, but keeps inferred types

type Type1 = typeof obj1;  // { readonly a: "hello"; readonly b: 42; }
type Type2 = typeof obj2;  // { a: string; b: number; } (less narrow, but still checked)

console.log("Bonus: satisfies operator");

// ============================================================================
// KEY LEARNINGS
// ============================================================================

// 1. Distributivity: unions spread through conditionals automatically
// 2. Use [T] syntax to avoid distribution when you don't want it
// 3. infer extracts; T[K] indexes (different things!)
// 4. keyof works on non-objects too (strings, tuples, etc.)
// 5. Template literal types explode combinatorially with large unions
// 6. Mapped types transform modifiers (readonly, optional) carefully
// 7. Multiple infer: use parameter names
// 8. Circular types need depth guards
// 9. Prefer specific constraints over `any`
// 10. satisfies (TypeScript 4.9+) is better than `as` for validation

console.log("All gotchas demonstrated!");
