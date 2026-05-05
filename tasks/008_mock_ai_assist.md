# Task 008 — Mock AI Assist UI

## Goal

Add AI Assist UI with mocked patch generation.

## Requirements

User can:

- select one or more bars;
- choose action:
  - simplify;
  - make heavier;
  - add fill;
  - add ghost notes;
  - humanize velocity;
- generate a mocked patch;
- preview patch;
- apply patch;
- discard patch.

## Mock behavior

Implement deterministic simple transformations:

- `simplify`: remove some non-kick/snare hits;
- `make_heavier`: add kick/crash accents;
- `add_fill`: add tom hits near end of selected range;
- `add_ghost_notes`: add low-velocity snare hits;
- `humanize_velocity`: vary velocities slightly.

## Constraints

- Use real patch validation and `applyPatch` from `packages/core`.
- Do not call external AI yet.
- Do not let mock patch modify unselected bars.

## Tests

- action generates valid patch;
- preview does not apply automatically;
- apply changes project;
- discard keeps project unchanged.

## Acceptance criteria

- User can experience the AI workflow safely without a real AI service.
