# Task 002 — Basic Grid Editor

## Goal

Build a basic grid editor in `apps/web` using the domain helpers from `packages/core`.

## Requirements

- Create local project state using `createDefaultProject()`.
- Render first section.
- Render bars.
- Render 16 steps per bar.
- Render one row per instrument.
- Clicking a cell toggles a hit.
- Active cells are visually distinct.
- Tempo input exists and updates project tempo.
- Show project title.

## UX

The first demo should let a user create a basic kick/snare/hat pattern.

## Constraints

- Do not duplicate grid logic in React components.
- Use helpers from `packages/core`.
- Keep editor state serializable.
- Do not implement playback yet.

## Tests

Add component or unit tests where practical:

- default rows render;
- clicking a cell adds a hit;
- clicking again removes it;
- tempo update changes state.

## Acceptance criteria

- The app displays a clickable drum grid.
- User can toggle hits.
- `pnpm lint`, `pnpm typecheck`, and `pnpm test` pass.
