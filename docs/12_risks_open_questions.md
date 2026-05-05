# 12 — Risks and Open Questions

## Product risks

### Risk: too niche

Mitigation:

- focus on teachers and practicing drummers;
- support export to DAW for producers;
- build a lightweight workflow that works even for short grooves.

### Risk: editor UX not good enough

Mitigation:

- build grid-first;
- test with real drummers early;
- prioritize responsiveness and playback over visual polish.

### Risk: existing tools are “good enough”

Mitigation:

- differentiate by kit-first workflow;
- instant playback;
- AI patching;
- export-first design;
- modern web UX.

### Risk: AI is gimmicky

Mitigation:

- AI only patches selected bars;
- show preview;
- keep manual editing primary.

## Technical risks

### Playback timing

Browser scheduling can be bad if implemented naively.

Mitigation:

- use WebAudio/Tone.js scheduler;
- test timing math;
- keep playback engine separate from React render cycle.

### Project model drift

If types, schemas, and UI logic diverge, the project becomes fragile.

Mitigation:

- centralize in `packages/core`;
- validate at API boundaries;
- tests for domain operations.

### Export usefulness

If MIDI export is poor, producers will not use it.

Mitigation:

- test MIDI in common DAWs;
- use standard MIDI notes;
- support velocity and tempo.

### AI patch destructiveness

Bad AI patch could ruin user work.

Mitigation:

- preview before apply;
- undo;
- validation;
- only selected bars can be changed.

## Legal/content risks

### Branded catalog

Mitigation:

- do not use official logos or model names in MVP;
- use generic types and sound packs.

### Samples

Mitigation:

- use licensed/free samples with clear rights;
- maintain sample attribution docs;
- later allow user-uploaded samples.

## Open questions

- Should the first UX use only grid, or grid + simplified notation?
- Should PDF be printable grid first or standard notation first?
- What is the best default kit for the first alpha?
- Which DAW should be used for MIDI export testing first?
- How much cloud persistence is needed for initial alpha?
- Should user-uploaded samples be before or after real AI?
