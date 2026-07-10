// Module 1: Foundations - Deep Conceptual Questions
// These explore the philosophy behind TypeScript's design choices.
// Write your thoughts. Struggle with these.

// ============================================================================
// QUESTION 1: Type Erasure - Why Does TypeScript Work This Way?
// ============================================================================

// TypeScript's core principle: erase all type information at runtime.
// This means:
// - No typeof checks work on TypeScript types
// - No runtime performance cost for types
// - No type information shipped to users
//
// QUESTION: Is type erasure a feature or a limitation?
//
// THINK ABOUT:
// - What would happen if types WEREN'T erased? (Like in languages: Java, C#)
// - What problems does erasure solve?
// - What problems does it create?
// - Could TypeScript have been designed differently?
// - Why did the designers choose this path?
//
// CHALLENGE: Name one thing you wish TypeScript could do at runtime.
// Could you implement it? Would it be worth the cost?

// ============================================================================
// QUESTION 2: Structural Typing - When Is It A Feature?
// ============================================================================

// TypeScript uses structural typing (shapes match, names don't):
//
// interface Dog { bark(): void; }
// interface Animal { bark(): void; }
// const dog: Dog = { bark: () => {} };
// const animal: Animal = dog;  // OK, same shape
//
// Languages like Java use nominal typing (names matter):
// In Java, you'd need to explicitly say "Dog implements Animal"
//
// QUESTION: When is structural typing better? Worse?
//
// THINK ABOUT:
// - Does structural typing make refactoring easier or harder?
// - Can you accidentally satisfy a type you didn't intend?
// - Is there a danger in "shapes matching by accident"?
// - What debugging problems does structural typing create?
// - Could you use types as documentation if shapes match accidentally?
//
// CHALLENGE: Write an example where structural typing causes a subtle bug.
// How would nominal typing prevent it?

// ============================================================================
// QUESTION 3: The Unknown-Any Spectrum
// ============================================================================

// TypeScript gives you choices:
// - any: "I don't know and I don't care" (escape hatch)
// - unknown: "I don't know but I'll check" (safe default)
// - specific type: "I know exactly" (ideal)
//
// QUESTION: Why does TypeScript offer both any and unknown?
// Why not just forbid any? Why not just have any?
//
// THINK ABOUT:
// - When do you NEED any?
// - When should you choose unknown instead?
// - Is any a code smell?
// - Does the existence of any defeat TypeScript's purpose?
// - How would you audit a codebase for dangerous any usage?
//
// CHALLENGE: Find a real project with 'any'. Count them.
// Categorize each: Is it necessary? Could you replace it with unknown?

// ============================================================================
// QUESTION 4: Strict Mode - Is It Worth The Cost?
// ============================================================================

// TypeScript has "strict": true that enables multiple checks:
// - noImplicitAny: parameters must have types
// - strictNullChecks: null is not assignable to everything
// - strictFunctionTypes: function parameters are checked strictly
// - strictPropertyInitialization: class properties must be initialized
// - etc.
//
// QUESTION: Should strict mode be the default?
// Why isn't every TypeScript project in strict mode?
//
// THINK ABOUT:
// - What's the cost of strict mode (dev time, refactoring)?
// - What's the benefit (fewer bugs, better types)?
// - Can you gradually adopt strict mode in a legacy project?
// - Are there downsides to NEVER using strict mode?
// - Would you enable it on a new project?
//
// CHALLENGE: Take a non-strict project and try migrating it.
// Document the pain points. Is it worth it?

// ============================================================================
// QUESTION 5: Type Narrowing - Is It Magic or Fragile?
// ============================================================================

// Type narrowing is powerful:
// let value: string | number = "hello";
// if (typeof value === "string") {
//   value.toUpperCase();  // TypeScript knows it's string
// }
//
// But it's also fragile:
// function process(v: string | number | boolean) {
//   if (typeof v === "string") { /* ... */ }
//   else if (typeof v === "number") { /* ... */ }
//   else {
//     // TypeScript ASSUMES this is boolean
//     // But what if someone adds a new type to the union?
//   }
// }
//
// QUESTION: Is type narrowing reliable enough to depend on?
//
// THINK ABOUT:
// - What breaks narrowing? (null handling, truthiness, type guards)
// - How do you ensure narrowing is exhaustive?
// - Should you use assertions (type v as boolean) or narrowing?
// - Can narrowing be wrong but still compile?
// - How does this affect large refactorings?
//
// CHALLENGE: Write a complex type narrowing scenario.
// Then change the type union. How many places break?

// ============================================================================
// QUESTION 6: Inference vs Declaration - Which Should You Prefer?
// ============================================================================

// You can infer:
// const user = { id: "1", name: "Sonik" };  // TypeScript infers type
//
// Or declare:
// const user: { id: string; name: string } = { id: "1", name: "Sonik" };
//
// QUESTION: Which is better? Always? Sometimes?
//
// THINK ABOUT:
// - Does inference help readability or hurt it?
// - Does declared types serve as documentation?
// - Which catches more bugs (inference vs declaration)?
// - What's the performance difference?
// - How do these interact with "strict" mode?
//
// CHALLENGE: Refactor some code:
// 1. Version A: Use inference everywhere
// 2. Version B: Declare all types explicitly
// Compare: readability, safety, maintenance difficulty

// ============================================================================
// QUESTION 7: Type vs Value - Why Are They Separate?
// ============================================================================

// In TypeScript (and many languages), types and values are separate:
// const x: string = "hello";
// - "string" is a TYPE (erased at runtime)
// - "hello" is a VALUE (exists at runtime)
//
// Some languages (like Scala, Rust) blur this line with const generics.
//
// QUESTION: Would TypeScript be better if types and values were unified?
//
// THINK ABOUT:
// - What problems does separating them solve?
// - What problems does it create?
// - Can you reference a type as a value? (Only with typeof)
// - Can you use a value as a type? (Only with type of)
// - What would unified types look like?
//
// CHALLENGE: Find a case where you wish types and values weren't separate.
// Can you work around it? Should TypeScript support this?

// ============================================================================
// QUESTION 8: Literal Types - Too Powerful or Just Right?
// ============================================================================

// Literal types let you be hyper-specific:
// type Direction = "north" | "south" | "east" | "west";
// const config: { timeout: 5000; retries: 3 } = { timeout: 5000, retries: 3 };
//
// But they can be surprising:
// const direction = "north";  // Type: "north" (literal), not string
// const timeout = 5000;       // Type: 5000 (literal), not number
//
// QUESTION: When are literal types helpful? When are they a nuisance?
//
// THINK ABOUT:
// - Do literals improve type safety or add noise?
// - When do you need a literal vs a broader type?
// - How do literals interact with inference?
// - Can literal types cause compatibility issues?
// - Should literals be opt-in (as const) or default?
//
// CHALLENGE: Write a function that requires very specific literals.
// Then write code that calls it. How many type errors occur?

// ============================================================================
// QUESTION 9: Union Types - Powerful or Confusing?
// ============================================================================

// Unions let you express multiple possibilities:
// type Response = string | number | boolean;
//
// But handling them requires work:
// if (typeof response === "string") { /* ... */ }
// else if (typeof response === "number") { /* ... */ }
// else { /* ... */ }
//
// Alternative: use discriminated unions:
// type Response = 
//   | { type: "string"; value: string }
//   | { type: "number"; value: number };
//
// QUESTION: Are plain unions or discriminated unions better?
//
// THINK ABOUT:
// - Which is easier to understand for new developers?
// - Which catches more bugs?
// - Which is more flexible?
// - When does plain union make sense?
// - When do you NEED discriminated?
// - Can you mix both?
//
// CHALLENGE: Refactor a plain union to discriminated.
// Did it improve the code or add noise?

// ============================================================================
// QUESTION 10: The Contract Between Language and Developer
// ============================================================================

// TypeScript makes a contract:
// "I will check your types at compile time.
//  After that, you're on your own.
//  External data is NOT guaranteed."
//
// This is different from languages with runtime type checking.
//
// QUESTION: Is this contract fair? Helpful? Dangerous?
//
// THINK ABOUT:
// - What responsibility does the developer have?
// - What responsibility does TypeScript have?
// - What happens if you violate the contract (use 'any' too much)?
// - How do you verify that external data matches its type?
// - Is runtime validation always necessary?
// - Can you trust types from your own code?
//
// CHALLENGE: Write a piece of code that violates TypeScript's contract.
// How bad does it get? Could you have prevented it?

// ============================================================================
// DEEP QUESTION: What Would You Change About TypeScript?
// ============================================================================

// If you were redesigning TypeScript today, what would you change?
//
// Consider:
// 1. SYNTAX: Would you use different syntax?
// 2. PHILOSOPHY: Would you keep type erasure? Structural typing?
// 3. STRICTNESS: Would you force strict mode?
// 4. RUNTIME: Would you add runtime type information?
// 5. TOOLING: Would you change how it integrates with editors?
//
// CHALLENGE: Pick ONE thing to change. Defend your choice.
// What would you gain? What would you lose?

// ============================================================================
// FINAL CHALLENGE: Teach Someone Else
// ============================================================================

// Pick one concept from Module 1:
// - Type erasure
// - Structural typing
// - any vs unknown
// - Type narrowing
// - Inference
//
// Write an explanation that:
// 1. Defines it in simple terms
// 2. Gives a concrete example
// 3. Explains WHY it matters
// 4. Shows a gotcha (something surprising)
// 5. Explains when to use it / when to avoid it
//
// Then show it to someone who doesn't know TypeScript.
// Did they understand? What was confusing?
