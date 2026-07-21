# Module 6: Tooling and Configuration

## Why This Module Matters

Many TypeScript teams think they are writing "strict TypeScript" but are not.

The compiler configuration decides:

- how hard TypeScript checks
- how imports resolve
- what runtime assumptions are allowed
- whether your CI catches bugs early or late

Tooling is not setup fluff. It is part of your architecture.

## Core Mental Model

`tsconfig.json` is your type policy.

Code style conventions are optional.
Type safety conventions must be enforced by compiler flags.

## Strict Mode Is The Baseline

`strict: true` enables a family of checks.

Without strict mode, TypeScript can feel permissive to the point of false confidence.

If you inherit a legacy repo, migrate to strict incrementally, but keep strict as target state.

## Flags That Change Daily Behavior

### `noUncheckedIndexedAccess`

```ts
const map: Record<string, string> = { a: "x" };
const value = map["missing"]; // string | undefined with this flag
```

This forces safer handling for dynamic key access.

### `exactOptionalPropertyTypes`

Optional means "may be omitted", not "always present with undefined".

This catches subtle API contract mistakes.

### `useUnknownInCatchVariables`

Catch variables become `unknown`:

```ts
try {
	// ...
} catch (error) {
	// error is unknown, must narrow
}
```

This prevents unsafe assumptions in error handling.

### `noPropertyAccessFromIndexSignature`

Prevents overconfident dot-access when a type only guarantees index signature.

You must access safely with brackets and narrowing.

## Module System Decisions

The `module` and `moduleResolution` options are not cosmetic.

They affect:

- import path style
- interop behavior
- emitted JavaScript shape
- runtime compatibility in Node/browser/bundler

For modern Node projects, `NodeNext` is usually correct.

## Typecheck vs Build

Separate commands by intent:

- `tsc --noEmit`: correctness gate
- build command: runtime artifact generation

In CI, fail fast on typecheck before build.

## Project References (Scaling Pattern)

As codebases grow, use project references to split domains into typed units.

Benefits:

- faster incremental checks
- clearer ownership boundaries
- fewer accidental cross-module imports

## Declaration Discipline

For libraries, declaration output matters.

Bad public types lock users into pain.

Rules:

1. Keep exported API types readable
2. Avoid exposing giant inferred anonymous types
3. Version public type contracts intentionally

## CI and Editor Integration

High quality workflow:

1. editor diagnostics on save
2. pre-commit typecheck for changed files (optional)
3. full CI typecheck on every PR
4. zero-warning policy for core rules

## What Not To Do

- disabling strict flags to "move faster"
- using `skipLibCheck` as excuse to ignore real local errors
- mixing module systems casually
- accepting long-lived `@ts-ignore` debt

## Migration Strategy For Legacy Repos

1. Turn on strict in CI with allowlist for excluded folders
2. Fix highest-risk areas first (auth, billing, external I/O)
3. Replace `any` with `unknown` + narrowing
4. Remove temporary suppressions in each sprint

## Deep Skill Target

By end of this module, you should be able to:

1. explain every important compiler flag in your repo
2. defend why each flag is enabled or disabled
3. diagnose module-resolution errors quickly
4. design a realistic strictness migration plan