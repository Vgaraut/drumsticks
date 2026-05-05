# Task 001 — Core Domain Model

## Goal

Implement the core DrumForge domain model in `packages/core`.

## Add types

- `DrumProject`
- `TimeSignature`
- `DrumInstrument`
- `DrumInstrumentType`
- `StaffPosition`
- `VisualPosition`
- `DrumSection`
- `DrumBar`
- `DrumHit`

## Add schemas

Use Zod schemas aligned with the TypeScript types.

## Add factories

- `createDefaultKit()`
- `createDefaultProject()`

## Add helpers

- `validateProject(project)`
- `toggleHit(project, barId, instrumentId, step)`
- `addHit(project, barId, instrumentId, step, velocity)`
- `removeHit(project, barId, hitId)`
- `updateHitVelocity(project, barId, hitId, velocity)`
- `addBar(project, sectionId)`
- `copyBar(project, sourceBarId, targetBarId)`

## Constraints

- MVP supports 4/4.
- MVP resolution is 16.
- Step must be 0–15.
- Velocity must be 1–127.
- Hit instrument ID must exist in kit.
- Helpers should return new project objects rather than mutating input.

## Tests

Add Vitest tests for:

- creating default project;
- validating default project;
- toggling hit on;
- toggling hit off;
- rejecting invalid step;
- rejecting invalid velocity;
- rejecting unknown instrument ID;
- adding a bar;
- copying a bar.

## Acceptance criteria

- Types and schemas are exported from `packages/core`.
- All tests pass.
- No React/UI logic in `packages/core`.
