// Runs every module's self-check in a single pass.
//
// Run: npm run verify   (also runs the full type check first)
//
// Each import registers that module's tests with node:test, which executes
// them automatically and sets a non-zero exit code if anything fails.

import "./01-foundations.test.js";
import "./02-objects-functions.test.js";
import "./03-generics.test.js";
import "./05-runtime-boundaries.test.js";
import "./06-tooling-config.test.js";
import "./07-architecture-patterns.test.js";
