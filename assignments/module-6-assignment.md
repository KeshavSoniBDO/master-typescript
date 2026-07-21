# Module 6 Assignment: TypeScript Configuration Hardening Plan

## Goal

Create a practical hardening plan for TypeScript tooling and enforceable quality gates.

This assignment is half implementation, half engineering design.

## Deliverables

Create two files:

1. `assignments/module-6-hardening.ts` (code utilities)
2. `assignments/module-6-hardening-plan.md` (decision document)

## Part 1: Typed Config Model

In `module-6-hardening.ts`, define typed interfaces for:

- compiler options policy
- CI checks policy
- suppression policy

## Part 2: Gate Evaluator

Implement a function that evaluates whether a repo passes type-policy checks.

Inputs:

- strictness flags
- count of `@ts-ignore`
- typecheck pass/fail status

Output:

- structured result with failures and recommended actions

## Part 3: Migration Planner

Given a list of files with error counts and risk levels, compute a phased migration plan:

- phase 1: highest risk/highest value
- phase 2: medium risk
- phase 3: cleanup and consistency

## Part 4: Suppression Linter

Implement a utility that scans source text and reports:

- raw `@ts-ignore` count
- `@ts-expect-error` count
- forbidden suppression locations (e.g., core domain folder)

## Part 5: Plan Document

In `module-6-hardening-plan.md`, write:

1. which strict flags are mandatory and why
2. which checks block PR merge
3. how suppressions are allowed and audited
4. rollback strategy if strict migration breaks delivery

## Stretch Goals

1. add policy severity levels (`block`, `warn`, `observe`)
2. detect stale suppressions automatically
3. output migration dashboard JSON

## Quality Checklist

- policy decisions are explicit and justified
- code avoids `any` in core paths
- planner is deterministic and testable
- migration plan is realistic for a team, not theoretical
- `npm run typecheck` passes
