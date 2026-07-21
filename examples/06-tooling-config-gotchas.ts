// Module 6: Tooling/Config - Gotchas
// Focus: how compiler options change behavior and safety.

export {};

// GOTCHA 1: index signatures are not guaranteed properties
const featureFlags: Record<string, boolean> = { beta: true };
const maybeFlag = featureFlags["missing"]; // boolean | undefined with noUncheckedIndexedAccess

// GOTCHA 2: optional does not mean "present with undefined"
type Options = { timeout?: number };
const o1: Options = {}; // valid
const o2: Options = { timeout: 5000 }; // valid
// const o3: Options = { timeout: undefined }; // can fail with exactOptionalPropertyTypes

// GOTCHA 3: catch variable is unknown
function parseNumber(raw: string): number {
  try {
    return Number(raw);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return 0;
  }
}

// GOTCHA 4: broad config types can hide mistakes
type LooseConfig = Record<string, string | number | boolean>;
const loose: LooseConfig = { retrise: 3 }; // typo still accepted

// GOTCHA 5: precise config catches typos
type StrictConfig = { retries: number; useCache: boolean };
// const strictBad: StrictConfig = { retrise: 3, useCache: true }; // error
const strictGood: StrictConfig = { retries: 3, useCache: true };

// GOTCHA 6: suppressions hide future regressions
// @ts-expect-error intentional demonstration
const forcedNumber: number = "oops";
void forcedNumber;

// GOTCHA 7: module resolution mismatch causes confusing import errors
// In NodeNext, extension behavior and package exports matter.

// GOTCHA 8: runtime and type-time can diverge with incorrect tsconfig assumptions
const envSource: Record<string, string | undefined> = { NODE_ENV: "development" };
const env = envSource["NODE_ENV"]; // string | undefined
if (env === "production") {
  console.log("prod mode");
}

// GOTCHA 9: generated types can be stale if not included in build graph
// Keep generated declarations refreshed and referenced.

// GOTCHA 10: strictness is policy, not preference
function safeDivide(a: number, b: number): number {
  if (b === 0) return 0;
  return a / b;
}

console.log(Boolean(maybeFlag), strictGood.retries, parseNumber("5"), safeDivide(10, 2));
