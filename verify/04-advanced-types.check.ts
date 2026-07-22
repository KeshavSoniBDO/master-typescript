// Module 4: Advanced Types — self-check (COMPILE-TIME).
//
// Run: npm run verify:04
//
// Module 4 is validated by the type checker, not at runtime: a wrong type is
// a compile error, not a failed assertion. Each line below fails to compile
// until the matching type in exercises/04-advanced-types.ts is correct.
//
// This file is intentionally EXCLUDED from `npm run typecheck` (see the base
// tsconfig `exclude`) so the repo compiles cleanly before you solve it.

import type { Expect, Equal } from "./type-assertions.js";
import type {
  ExtractData,
  ApiResponse,
  StrictPartial,
  User,
  FilterByType,
  Reverse,
  FunctionArgs,
  ToPrimitive,
} from "../exercises/04-advanced-types.js";

// EXERCISE 1 — pull the payload type out of an ApiResponse.
type _ExtractData = Expect<Equal<ExtractData<ApiResponse<string>>, string>>;

// EXERCISE 2 — make ONLY the listed keys optional.
type _StrictPartial = Expect<
  Equal<
    StrictPartial<User, "email" | "age">,
    { id: string; name: string; email?: string; age?: number }
  >
>;

// EXERCISE 3 — keep only union members assignable to U.
type _FilterByType = Expect<
  Equal<FilterByType<string | number | boolean | null, string | number>, string | number>
>;

// EXERCISE 4 — swap keys and values.
type _Reverse = Expect<
  Equal<Reverse<{ theme: "light"; language: "en" }>, { light: "theme"; en: "language" }>
>;

// EXERCISE 6 — collect named parameters into an object.
type _FunctionArgs = Expect<
  Equal<FunctionArgs<(name: string, age: number) => boolean>, { name: string; age: number }>
>;

// EXERCISE 7 — reduce a type to a primitive tag.
type _ToPrimitiveArray = Expect<Equal<ToPrimitive<string[]>, string>>;
type _ToPrimitiveObject = Expect<Equal<ToPrimitive<{ name: string }>, "object">>;
type _ToPrimitiveFunction = Expect<Equal<ToPrimitive<(x: number) => void>, "function">>;

// Referenced so unused-type checks stay quiet; the assertions above do the work.
export type {
  _ExtractData,
  _StrictPartial,
  _FilterByType,
  _Reverse,
  _FunctionArgs,
  _ToPrimitiveArray,
  _ToPrimitiveObject,
  _ToPrimitiveFunction,
};
