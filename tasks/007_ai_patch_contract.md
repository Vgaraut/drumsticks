# Task 007 — AI Patch Contract

## Goal

Implement AI patch types, validation, and application in `packages/core`.

## Add types

- `AiAction`
- `BarSelection`
- `AiPatchRequest`
- `AiPatchResponse`
- `DrumPatch`
- `DrumPatchOperation`
- `AddHitOperation`
- `RemoveHitOperation`
- `UpdateHitVelocityOperation`
- `ReplaceBarOperation`

## Add functions

- `validatePatch(project, selection, patch)`
- `applyPatch(project, selection, patch)`
- `getSelectedBars(project, selection)`

## Validation rules

Patch must not allow:

- unknown instrument IDs;
- unknown bar IDs;
- modifications outside selected range;
- invalid step values;
- invalid velocity values;
- removing unknown hit IDs;
- duplicate hits if duplicates are unsupported.

## Tests

- valid add hit patch;
- valid remove hit patch;
- valid velocity patch;
- valid replace bar patch;
- reject unknown instrument;
- reject bar outside selection;
- reject invalid step;
- reject invalid velocity;
- patch application returns new project object.

## Acceptance criteria

- AI patching is safe and test-covered.
- No external AI API call is added in this task.
