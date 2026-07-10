// Module 4: Advanced Types - Exercises
// Different from lesson examples. Real-world scenarios combining concepts.
// Run: npm run typecheck

// ============================================================================
// EXERCISE 1: Extract Types from API Response
// ============================================================================

// Scenario: API returns { ok: true; data: T } or { ok: false; error: string }
// Extract just the data type.

type ApiResponse<T> = 
  | { ok: true; data: T }
  | { ok: false; error: string };

// TODO: Write a type ExtractData<T> that takes ApiResponse<SomeType>
// and returns just SomeType
// Hint: Use conditional type with infer

type ExtractData<T> = unknown;  // TODO

// Test:
type Test1 = ExtractData<ApiResponse<string>>;        // Should be: string
type Test2 = ExtractData<ApiResponse<{ id: number }>>;  // Should be: { id: number }

// ============================================================================
// EXERCISE 2: Build a Strict Partial Type
// ============================================================================

// Regular Partial<T> makes all properties optional.
// Write StrictPartial<T, K> that makes ONLY certain properties optional.

type StrictPartial<T, K extends keyof T> = unknown;  // TODO

type User = {
  id: string;
  name: string;
  email: string;
  age: number;
};

// TODO: Write StrictPartial so this works:
// type PartialUser = StrictPartial<User, "email" | "age">;
// Result should be:
// {
//   id: string;        (required, not in K)
//   name: string;      (required, not in K)
//   email?: string;    (optional, in K)
//   age?: number;      (optional, in K)
// }

// ============================================================================
// EXERCISE 3: Filter Union by Type
// ============================================================================

// Write FilterByType<T, U> that keeps only members of union T that extend U

type FilterByType<T, U> = unknown;  // TODO

type Mixed = string | number | boolean | null;

type Test3 = FilterByType<Mixed, string | number>;     // Should be: string | number
type Test4 = FilterByType<Mixed, null>;                // Should be: null
type Test5 = FilterByType<Mixed, object>;              // Should be: null (null does not extend object)

// ============================================================================
// EXERCISE 4: Reverse an Object Type
// ============================================================================

// Write Reverse<T> that swaps keys and values.
// { a: "x"; b: "y" } becomes { x: "a"; y: "b" }

type Reverse<T extends Record<string, string>> = unknown;  // TODO

type Config = { theme: "light"; language: "en" };
type ReversedConfig = Reverse<Config>;

// Should be: { light: "theme"; en: "language" }

// ============================================================================
// EXERCISE 5: Create a Getter Interface
// ============================================================================

// Write GettersSetters<T> that creates both getters and setters
// { name: string; age: number } becomes:
// {
//   getName: () => string;
//   setName: (value: string) => void;
//   getAge: () => number;
//   setAge: (value: number) => void;
// }

type GettersSetters<T> = unknown;  // TODO

type Product = { title: string; price: number; inStock: boolean };
type ProductGettersSetters = GettersSetters<Product>;

// ============================================================================
// EXERCISE 6: Extract Function Parameter Types
// ============================================================================

// Write FunctionArgs<F> that extracts ALL parameters as an object.
// (x: string, y: number) => boolean becomes { x: string; y: number }

type FunctionArgs<F> = unknown;  // TODO

type Func1 = (name: string, age: number, email: string) => boolean;
type Args1 = FunctionArgs<Func1>;
// Should be: { name: string; age: number; email: string }

// ============================================================================
// EXERCISE 7: Chain Type Transformations
// ============================================================================

// Write ToPrimitive<T> that:
// - Converts arrays to their element type
// - Converts objects to "object"
// - Converts functions to "function"
// - Keeps primitives as-is

type ToPrimitive<T> = unknown;  // TODO

type Test6 = ToPrimitive<string[]>;                 // Should be: string
type Test7 = ToPrimitive<{ name: string }>;         // Should be: "object"
type Test8 = ToPrimitive<(x: number) => void>;      // Should be: "function"
type Test9 = ToPrimitive<boolean>;                  // Should be: boolean

// ============================================================================
// EXERCISE 8: Hard - Build a Schema Validator Return Type
// ============================================================================

// Scenario: Validation function takes a value and returns either:
// - { ok: true; value: T }
// - { ok: false; error: string }

// Write ValidatorReturnType<T> that extracts T from a validator function.
// Validator<T> means: (value: unknown) => ValidatorResult<T>

type Validator<T> = (value: unknown) => 
  | { ok: true; value: T }
  | { ok: false; error: string };

type ValidatorReturnType<V extends Validator<any>> = unknown;  // TODO

const validateString: Validator<string> = (v) => {
  if (typeof v === "string") {
    return { ok: true, value: v };
  }
  return { ok: false, error: "Not a string" };
};

type StringValidatorType = ValidatorReturnType<typeof validateString>;
// Should be: string

// ============================================================================
// EXERCISE 9: Hard - Compose Multiple Type Validators
// ============================================================================

// Write ValidatorChain<T1, T2> that combines two validators:
// First validator extracts T1, second takes T1 and extracts T2
// Chain should preserve both types safely

type ValidatorChain<V1 extends Validator<any>, V2> = unknown;  // TODO

// Challenge: Make this work:
// const chain: ValidatorChain<typeof validateString, typeof validateNumber> = ...
// Should enforce that output of first = input of second

// ============================================================================
// EXERCISE 10: Very Hard - Build a Form Field Descriptor
// ============================================================================

// A form field descriptor might look like:
type FieldDescriptor = {
  type: "text" | "number" | "email" | "checkbox";
  required: boolean;
  validate?: (value: any) => boolean;
};

// Write FormValue<F> that extracts the actual TypeScript type from a descriptor:
// F with type: "text" and required: true => string
// F with type: "number" and required: false => number | undefined
// F with type: "checkbox" => boolean

type FormValue<F extends FieldDescriptor> = unknown;  // TODO

const nameField: FieldDescriptor = { type: "text", required: true };
const ageField: FieldDescriptor = { type: "number", required: false };
const agreeField: FieldDescriptor = { type: "checkbox", required: true };

type NameType = FormValue<typeof nameField>;   // Should be: string
type AgeType = FormValue<typeof ageField>;     // Should be: number | undefined
type AgreeType = FormValue<typeof agreeField>; // Should be: boolean

// ============================================================================
// BONUS: Very Hard - Union to Object
// ============================================================================

// Convert a discriminated union to an object where keys are discriminants.
// Input: { type: "a"; value: string } | { type: "b"; value: number }
// Output: { a: { value: string }; b: { value: number } }

type UnionToObject<T extends { type: string }> = unknown;  // TODO

type Events = 
  | { type: "click"; x: number; y: number }
  | { type: "submit"; data: Record<string, unknown> };

type EventMap = UnionToObject<Events>;
// Should be:
// {
//   click: { x: number; y: number };
//   submit: { data: Record<string, unknown> };
// }
