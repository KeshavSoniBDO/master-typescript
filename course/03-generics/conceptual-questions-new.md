// Module 3: Generics - Deep Conceptual Questions
// These questions explore the WHY and WHEN, not the HOW.
// Write your thoughts. Struggle with these.

// ============================================================================
// QUESTION 1: Generic vs Concrete - The Flexibility Cost
// ============================================================================

// Consider this dilemma:
//
// Generic version:
// function process<T>(items: T[]): T[] { ... works for any type ... }
//
// Concrete versions:
// function processStrings(items: string[]): string[] { ... can optimize for strings ... }
// function processNumbers(items: number[]): number[] { ... can optimize for numbers ... }
//
// QUESTION: When should you write generics vs concrete functions?
// What is the cost of generics?
//
// THINK ABOUT:
// - Code reuse vs code clarity
// - Performance implications
// - Debugging difficulty
// - Type-checking complexity
// - Maintenance burden
//
// CHALLENGE: Find an example where concrete is better than generic.

// ============================================================================
// QUESTION 2: Generic Constraints - Trust vs Flexibility
// ============================================================================

// Without constraint: too loose
// function anyThing<T>(value: T): T { return value; }
//
// With constraint: limits users
// function onlyStrings<T extends string>(value: T): T { return value; }
//
// With keyof constraint: specific but rigid
// function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }
//
// QUESTION: How do you know when a constraint is "just right"?
// What happens if your constraint is too loose? Too tight?
//
// THINK ABOUT:
// - What does "wrong" look like for each level?
// - How does constraint affect the user's experience?
// - Can you make a constraint that is always wrong?
// - Can you ever have no constraint and still be type-safe?
//
// CHALLENGE: Write a constraint that is so specific it's useless.

// ============================================================================
// QUESTION 3: The Inference Problem - Help or Hindrance?
// ============================================================================

// TypeScript tries to infer T from arguments:
//
// Inference success:
// function getFirst<T>(items: T[]): T { return items[0]; }
// const first = getFirst([1, 2, 3]);  // T inferred as number
//
// Inference failure:
// function process<T>(transform: (x: T) => T): T { return ... }
// const result = process((x) => x + 1);  // T can't be inferred (circular)
//
// Inference confusion:
// function merge<T, U>(a: T, b: U): T & U { return { ...a, ...b }; }
// const result = merge({ x: 1 }, "hello");  // Both T and U inferred, but result is weird
//
// QUESTION: Is inference a feature or a bug in generics?
//
// THINK ABOUT:
// - When does inference help readability?
// - When does it make code harder to understand?
// - Should developers ever write <T> explicitly to be clear?
// - Can inference mislead you about what code does?
//
// CHALLENGE: Write a generic where inference is harmful, then write it better.

// ============================================================================
// QUESTION 4: Using vs Abusing Generics
// ============================================================================

// Legitimate generic:
// function clone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }
//
// Forced generic (T is not used meaningfully):
// function getName<T>(user: T): string { return (user as any).name; }
//
// Overcomplicated generic:
// function combineSmallNumbers<T extends { value: number } & { amount: number }>(
//   obj1: T,
//   obj2: T
// ): T { return { ...obj1, value: obj1.value + obj2.value }; }
//
// QUESTION: When does a generic stop being helpful and become a code smell?
//
// THINK ABOUT:
// - What's a sign that T is not being used meaningfully?
// - When do you need to use 'as any' inside a generic (red flag)?
// - Can a generic ever make code LESS clear than concrete?
// - How do you know when to stop and use overloads instead?
//
// CHALLENGE: Find 3 bad generics in real code and explain why they're bad.

// ============================================================================
// QUESTION 5: Generic Variance - Why It's Confusing
// ============================================================================

// This is deeply confusing but important:
//
// If Cat extends Animal, does Dog[] extend Animal[]?
// Answer: NO. Arrays are invariant in TypeScript.
//
// type AnimalArray = Animal[];
// type CatArray = Cat[];
// const cats: CatArray = [new Cat()];
// const animals: AnimalArray = cats;  // ERROR: not assignable
//
// But functions ARE more flexible:
// type AnimalCallback = (a: Animal) => void;
// type CatCallback = (c: Cat) => void;
// const handleAnimal: AnimalCallback = handleCat;  // OK (contravariance)
//
// QUESTION: Why does TypeScript treat generics differently in different contexts?
// What's the deep principle?
//
// THINK ABOUT:
// - What can go wrong if you assign CatArray to AnimalArray?
// - What can go wrong if you assign AnimalCallback to CatCallback?
// - Is one direction safer than the other?
// - Can you use this to make better type designs?
//
// CHALLENGE: Explain contravariance to a teammate in 2 sentences.

// ============================================================================
// QUESTION 6: Generic Defaults - Trap or Tool?
// ============================================================================

// With default:
// type Box<T = string> = { value: T };
// const stringBox: Box = { value: "hello" };  // OK: T = string
//
// Without default:
// type Box<T> = { value: T };
// const stringBox: Box = { value: "hello" };  // ERROR: T must be specified
//
// QUESTION: When are defaults helpful? When are they dangerous?
//
// THINK ABOUT:
// - Does a default make the type easier to use?
// - Can a default hide mistakes?
// - Should defaults ever surprise you?
// - Is <T = unknown> better or worse than <T = string>?
//
// CHALLENGE: Write a generic with a default that causes a confusing bug.

// ============================================================================
// QUESTION 7: Circular Generics - When Does It Break?
// ============================================================================

// Self-referential generic:
// type Node<T> = { value: T; next?: Node<T> };  // OK, recursive but safe
//
// More complex:
// type Builder<T extends Builder<T>> = { build: () => T };  // Self-bounded
//
// Very complex:
// type Chain<T extends Chain<U>, U extends Chain<T>> = { ... };  // Bidirectional
//
// QUESTION: How deep can you go with circular generics before they break?
//
// THINK ABOUT:
// - What does "break" mean? (Infinite recursion? Type checking failure?)
// - Can you have a circular generic that compiles but doesn't work?
// - How do you test a circular generic is actually type-safe?
// - When would you need this complexity?
//
// CHALLENGE: Write a circular generic and find where it fails.

// ============================================================================
// QUESTION 8: Generic Composition - Can It Be Done Right?
// ============================================================================

// Composing generics is hard:
// function compose<T, U, V>(f: (x: T) => U, g: (x: U) => V): (x: T) => V {
//   return (x) => g(f(x));
// }
//
// But what if you want to compose 3 functions? 4? N?
// Do you need overloads? A builder pattern? Something else?
//
// QUESTION: Is generic composition scalable?
//
// THINK ABOUT:
// - How many type parameters are "too many"?
// - Does readability suffer with deep composition?
// - Are there patterns from other languages (Haskell, Rust) that help?
// - Should you limit composition depth in practice?
//
// CHALLENGE: Write a compose function that works for 1, 2, and 3 function arguments.

// ============================================================================
// QUESTION 9: Generic Protocols - Can You Enforce Behavior?
// ============================================================================

// You can constrain to a shape:
// function handle<T extends { id: string }>(obj: T): string { return obj.id; }
//
// But can you enforce BEHAVIOR via generics?
// For example: "T must be serializable"
// Or: "T must be comparable"
// Or: "T must be sortable"
//
// QUESTION: What behaviors can TypeScript enforce on generics? What can't it?
//
// THINK ABOUT:
// - TypeScript is structural, not behavioral
// - You can check for methods/properties, but not behavior
// - How do you encode behavior requirements in a constraint?
// - Are there scenarios where this matters for correctness?
//
// CHALLENGE: Write a constraint that tries to enforce "must be serializable".
// What does it actually check? What can slip through?

// ============================================================================
// QUESTION 10: Generic Escape Routes - When to Use 'as any'
// ============================================================================

// Sometimes you need to escape:
// function store<T>(key: string, value: T): void {
//   localStorage[key] = JSON.stringify(value);  // Type error: can't stringify T
//   // Solution: cast to any
//   (value as any).someMethod();
// }
//
// QUESTION: When is 'as any' legitimate inside a generic?
// When is it a red flag?
//
// THINK ABOUT:
// - Does using 'as any' mean your generic is broken?
// - Can you make the generic work without it?
// - What does it mean about your understanding if you need to cast?
// - Are there "acceptable" reasons for 'as any' in generics?
//
// CHALLENGE: Take a generic that uses 'as any' and try to remove it.
// What did you have to change?

// ============================================================================
// FINAL CHALLENGE: Design Your Own Generic
// ============================================================================

// For each scenario below, decide:
// 1. Should this be generic or concrete?
// 2. What constraints (if any) do you need?
// 3. What would break if the constraint was looser?
//
// SCENARIOS:
// A) A function that validates any value against a schema
// B) A class that manages permissions (read, write, delete) for any resource
// C) A utility that converts one format to another (JSON, CSV, XML)
// D) A queue that ensures FIFO order of any data type
// E) A comparator that determines if two values are "equal"
//
// Pick one and write it. Then trade with someone and critique their design.
