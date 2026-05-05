# Task 000 — Repo Scaffold

## Goal

Create a pnpm TypeScript monorepo for DrumForge.

## Required structure

```text
apps/web
apps/api
packages/core
packages/playback
packages/export
packages/ui
docs
tasks
prompts
```

## Stack

- pnpm workspaces
- TypeScript
- React + Vite for `apps/web`
- Fastify for `apps/api`
- Vitest for tests
- ESLint
- Prettier

## Root scripts

Add root scripts:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

## Requirements

- All packages must compile.
- Add basic placeholder exports for packages.
- Add `GET /health` placeholder in API.
- Add simple web page in frontend.
- Do not implement product features yet.

## Acceptance criteria

- `pnpm install` works.
- `pnpm lint` works.
- `pnpm typecheck` works.
- `pnpm test` works.
- `pnpm dev` starts web/API or clearly documents how to start them.

## Notes

Follow `AGENTS.md` and `code_review.md`.
