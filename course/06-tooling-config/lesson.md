# Module 6: Tooling and Config

## Core Mental Model

Your TypeScript experience is shaped heavily by `tsconfig.json`.

Strict settings catch bugs earlier and force better modeling.

## Important Ideas

- `strict` enables the serious version of TypeScript.
- `noUncheckedIndexedAccess` makes array and object lookup safer.
- `exactOptionalPropertyTypes` makes optional properties more precise.
- `module` and `moduleResolution` decide how imports work.
- `tsc --noEmit` checks types without building files.

## What To Practice

- Read compiler errors carefully.
- Change one config option and observe the difference.
- Understand why React, Angular, Node, and libraries use different configs.