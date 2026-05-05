# Task 005 — MIDI Export

## Goal

Implement MIDI export from DrumProject.

## Package

Create/implement `packages/export`.

## Requirements

- Convert `DrumProject` to a MIDI file/blob/Uint8Array.
- Preserve tempo.
- Use `instrument.midiNote`.
- Map `hit.velocity` to MIDI velocity.
- Support multiple bars.
- Empty bars must not crash.

## Frontend integration

In `apps/web` add:

- Export MIDI button.
- Download generated `.mid` file.

## Constraints

- Do not use MIDI as source of truth.
- Validate project before export.

## Tests

- Exported MIDI contains expected notes.
- Velocity mapping works.
- Tempo is included if supported by chosen library.
- Empty bars do not crash.
- Unknown instrument references are rejected before export.

## Acceptance criteria

- User can download a MIDI file from the grid pattern.
- The file should be importable into a DAW or MIDI player in basic form.
