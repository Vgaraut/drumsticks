# Code Review Rules

Review as if this is a product codebase maintained by a small team using coding agents.

## Correctness

- Does the code do what the task asked?
- Are invalid project states prevented?
- Are edge cases handled?
- Does the editor remain usable with empty bars, missing samples, and tempo changes?

## Architecture

- Is domain logic in `packages/core`?
- Is UI logic separated from business logic?
- Is playback isolated from editor state?
- Is export logic isolated from UI?
- Are AI patches validated before application?

## Type safety

- Are types specific enough?
- Are there unnecessary `any` types?
- Are runtime schemas aligned with TypeScript types?
- Are instrument IDs and bar IDs treated as opaque IDs rather than display names?

## Tests

- Are important paths covered?
- Are edge cases covered?
- Do tests demonstrate intended behavior?
- Are regression tests added for fixed bugs?

## Maintainability

- Is the code readable?
- Are functions small and cohesive?
- Is logic duplicated?
- Are dependency choices justified?
- Is there a clear boundary between product state, playback state, and API state?

## UX

- Does the editor feel responsive?
- Can the user recover from mistakes?
- Are destructive operations reversible or clearly confirmed?
- Is playback start/stop obvious?
- Are tempo and loop controls visible?

## AI-specific review

- Does AI return structured data, not free-form modifications?
- Is the patch preview shown before applying?
- Can the user discard the patch?
- Are unknown instruments, invalid steps, invalid velocities, and out-of-range bars rejected?

## Red flags

Reject or revise code that:

- stores PDF/MIDI as the source of truth;
- makes AI overwrite the whole project without validation;
- couples React components directly to Tone.js scheduling internals;
- uses real brand logos or trademarked catalog entries in the MVP;
- adds VST, DAW integration, or audio-to-MIDI transcription before the MVP editor works.
