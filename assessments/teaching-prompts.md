# Teaching Prompts (Instructor Mode)

Use these prompts to test understanding live while recording or teaching.

## Module 1

1. Explain compile-time vs runtime using one bug example.
2. Show why `unknown` forces safer code than `any`.
3. Demonstrate exhaustive narrowing with `never`.

## Module 2

1. Explain structural typing in one minute.
2. Give one case where excess property checks save you.
3. Compare weak vs strong function contracts.

## Module 3

1. Write a generic preserving input-output relationship.
2. Add a meaningful constraint and explain why.
3. Identify one generic that should be non-generic.

## Module 4

1. Show conditional type distribution on unions.
2. Use `infer` to extract nested result types.
3. Refactor an over-clever type into readable version.

## Module 5

1. Decode unknown payload safely in front of audience.
2. Show DTO to domain mapping and why it exists.
3. Return structured validation issues, not plain string.

## Module 6

1. Explain top strictness flags in this repo and their practical impact.
2. Propose a realistic strict migration plan for legacy code.
3. Define CI gate policy for type quality.

## Module 7

1. Model workflow with discriminated unions.
2. Separate port contract from adapter implementation.
3. Explain why result unions can outperform exceptions at boundaries.

## Final Capstone Prompt

Implement one vertical slice that includes:

- boundary decoder
- domain workflow
- service result typing
- architecture smell detection

Then explain your trade-offs in under 3 minutes.
