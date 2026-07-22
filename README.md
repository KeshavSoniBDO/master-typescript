# Master TypeScript

This workspace is a long-term TypeScript learning journal and practice lab.

The goal is not just to know TypeScript syntax. The goal is to understand how TypeScript thinks: structural typing, inference, narrowing, generics, conditional types, runtime boundaries, configuration, and how to design maintainable typed systems.

## How We Will Use This Repo

- `course/` contains the learning path and lesson notes.
- `examples/` contains runnable code we can edit while learning.
- `exercises/` contains focused practice files.
- `assignments/` contains larger tasks after each module.
- `assessments/` will be used later for tests, interview-style questions, and mini-projects.
- `verify/` contains self-checking tests so you get instant pass/fail feedback on the exercises.
- `reference/` contains a glossary and revision flashcards.
- `src/` is a small sandbox TypeScript project for experiments.

Nothing here should be deleted casually. This repo is meant to become your revision library.

## Recommended Flow

1. Read the lesson note for a module.
2. Run or inspect the matching example files.
3. Complete the exercises without looking at the solution first.
4. Ask questions until the mental model is clear.
5. Do the module assignment.
6. Revisit old exercises later and solve them faster.

## Commands

After installing dependencies:

```bash
npm install
npm run typecheck
npm run dev
npm run example -- examples/01-foundations-gotchas.ts

# Check your exercise solutions (instant pass/fail):
npm run verify        # type-check the repo + run every module's self-check
npm run verify:01     # just Module 1 (verify:01 .. verify:07)
```

On a fresh clone the exercise self-checks are **red on purpose** — they turn
green as you implement each function. (`npm run typecheck` stays green; it checks
the course code, not your exercise answers.)

## Course Navigation

- Start path: [START-HERE.md](START-HERE.md)
- Roadmap: [course/00-roadmap.md](course/00-roadmap.md)
- Module assignments: [assignments/README.md](assignments/README.md)
- Assessments and capstone: [assessments/README.md](assessments/README.md)
- Glossary: [reference/glossary.md](reference/glossary.md)
- Flashcards: [reference/flashcards.md](reference/flashcards.md)

## Creator Mode (YouTube / Teaching)

If you are teaching this publicly or internally:

- Creator playbook: [course/youtube-creator-playbook.md](course/youtube-creator-playbook.md)
- Live teaching prompts: [assessments/teaching-prompts.md](assessments/teaching-prompts.md)

## Course Philosophy

We will learn TypeScript in layers:

- First, the runtime JavaScript model.
- Then, TypeScript's static model.
- Then, how inference and narrowing really work.
- Then, generics and reusable abstractions.
- Then, advanced types used in real libraries.
- Finally, architecture, tooling, testing, and API boundaries.

The deep idea: TypeScript does not make JavaScript safe by magic. It gives you a language for describing and checking assumptions before runtime. Great TypeScript developers know where those assumptions are strong, where they are weak, and how to design code around that boundary.