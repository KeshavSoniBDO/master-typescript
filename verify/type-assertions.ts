// Type-level assertion helpers.
//
// Some exercises are validated by the COMPILER, not at runtime (a wrong type
// should be a red squiggle, not a failed assertion). Use these in *.test.ts
// files and let `npm run typecheck` (or `npm run verify`) enforce them:
//
//   type _check = Expect<Equal<MyResult, { id: string }>>;
//
// If the two types are not identical, `Expect<...>` fails to compile.

export type Expect<T extends true> = T;

export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

export type NotEqual<A, B> = Equal<A, B> extends true ? false : true;
