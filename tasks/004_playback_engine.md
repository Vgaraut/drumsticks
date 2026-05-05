# Task 004 — Playback Engine

## Goal

Implement browser playback for DrumProject.

## Package

Create/implement `packages/playback`.

## Requirements

- Load samples by `sampleKey`.
- Provide `playProject(project, options)`.
- Provide `stop()`.
- Schedule hits according to tempo and 16-step resolution.
- Trigger instrument samples.
- Support loop playback if feasible.
- Expose current step callback for UI highlight.

## Frontend integration

In `apps/web` add:

- Play button.
- Stop button.
- Current step indicator.
- Optional loop toggle.

## Constraints

- Playback engine must not mutate project state.
- Playback engine must be isolated from React render loops.
- Do not recreate samples on each render.
- Handle browser audio context user gesture requirements.

## Tests

Test scheduling math separately from actual audio:

- step 0 time;
- step 4 time at a given BPM;
- tempo changes affect schedule;
- empty bars do not crash;
- missing sample key handled.

## Acceptance criteria

- User can click hits and hear them through browser samples.
- Play/stop works reliably.
- `pnpm lint`, `pnpm typecheck`, and `pnpm test` pass.
