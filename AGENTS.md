# AGENTS.md

## Project

This repository contains **DrumForge**, a standalone web application for drummers.

The product lets users:

- build a custom drum kit;
- write drum parts in a grid editor;
- play the result back in the browser;
- export MIDI / printable PDF / JSON;
- use AI assistance to transform selected bars.

This is **not** a DAW, **not** a VST plugin, and **not** an AI-only music generator.

## Product principle

The main workflow must stay simple:

```text
Create/select kit -> click hits in grid -> press play -> hear result -> export MIDI/PDF
```

Do not prioritize advanced notation, cloud features, VST integration, or AI generation before this workflow feels good.

## Tech stack

- Language: TypeScript
- Package manager: pnpm
- Frontend: React + Vite
- Backend: Fastify
- Database: PostgreSQL later; in-memory storage is acceptable only for early tasks
- ORM: Drizzle
- Runtime validation: Zod
- Tests: Vitest
- Audio playback: WebAudio / Tone.js
- MIDI export: TypeScript library or small custom exporter
- PDF export: simple printable grid first; proper notation later
- Linting: ESLint
- Formatting: Prettier

## Repository structure

- `apps/web` — frontend application
- `apps/api` — backend API
- `packages/core` — domain types, schemas, grid logic, patch logic
- `packages/playback` — browser playback engine
- `packages/export` — MIDI/PDF/JSON export helpers
- `packages/ui` — shared UI components
- `docs` — product and architecture docs
- `tasks` — agent task specs
- `prompts` — reusable AI prompts/contracts

## Engineering principles

- Prefer explicit, boring, readable code.
- Keep domain logic in `packages/core`, not inside React components.
- Keep playback scheduling isolated from editor state.
- Keep AI output validated before applying it to a project.
- Never let AI endpoints directly overwrite a project without validation.
- Keep editor state serializable.
- Use domain-specific types instead of loose objects.
- Avoid hidden global state.
- Avoid premature abstractions.
- Do not introduce new production dependencies without explaining why.
- Do not use `any` unless there is a strong reason and the reason is documented.

## Testing rules

When changing code:

- run typecheck;
- run tests;
- add tests for core logic;
- add regression tests for bug fixes.

Expected root commands:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm dev
```

If a command is missing, add it before proceeding.

## UX principles

The editor must feel immediate.

Required MVP interaction:

1. User selects or creates a kit.
2. User clicks grid cells.
3. User presses play.
4. User hears kick/snare/hat/etc. instantly.
5. User can export MIDI/PDF.

Avoid modal-heavy flows. Avoid making users configure notation before they can hear a groove.

## AI rules

AI is an assistant, not the main author.

AI features should operate on a selected range of bars and return a structured patch.

Allowed AI actions:

- simplify selected pattern;
- make selected pattern heavier;
- add fill;
- add ghost notes;
- humanize velocity;
- adapt selected pattern to current kit.

AI responses must be validated against project schema before being applied.

## Catalog rules

MVP catalog uses generic instrument types, not branded instruments.

Allowed MVP labels:

- Kick
- Snare
- Closed Hi-Hat
- Open Hi-Hat
- Crash
- Ride
- Rack Tom
- Floor Tom
- Clap
- Perc

Do not add real brand logos, brand names as official catalog items, or model names unless the user manually types them into their own private custom kit.

## Review checklist

Before finishing a task, verify:

- no domain logic is duplicated in UI components;
- schemas and types are updated together;
- editor state remains serializable;
- playback can be stopped cleanly;
- AI patches are validated;
- invalid project states are rejected;
- tests cover important edge cases;
- errors are visible or recoverable;
- no unrelated features were added.
