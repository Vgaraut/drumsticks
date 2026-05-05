# Task 003 — Kit Builder

## Goal

Add MVP kit editing to `apps/web` using `packages/core`.

## Requirements

User can:

- view current kit;
- add an instrument;
- remove an instrument;
- rename an instrument;
- select instrument type;
- edit MIDI note;
- edit sample key;
- reset to default kit.

## Core updates

If needed, add helpers in `packages/core`:

- `addInstrument(project, instrument)`
- `removeInstrument(project, instrumentId)`
- `updateInstrument(project, instrumentId, patch)`
- `resetKit(project)`

## Important behavior

When removing an instrument:

- remove hits that reference it;
- or reject removal if hits exist, depending on chosen UX.

Pick one behavior and document it. Prefer removing dependent hits with confirmation in UI later; for MVP a clear warning is acceptable.

## Constraints

- No real brand logos or official brand catalog entries.
- Generic instrument types only.
- Keep project valid after kit edits.

## Tests

- Add instrument.
- Rename instrument.
- Remove instrument.
- Removing instrument does not leave invalid hit references.
- Invalid MIDI note is rejected.

## Acceptance criteria

- User can customize kit enough to change grid rows.
- Project validation passes after edits.
