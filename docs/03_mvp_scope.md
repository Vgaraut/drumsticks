# 03 — MVP Scope

## MVP definition

A user can create a project, write a basic drum groove, hear it, save it, and export it.

## Must-have

### Core model

- Project with title, tempo, time signature, resolution.
- Kit with instruments.
- Sections with bars.
- Bars with hits.
- Hits with instrument ID, step, velocity.

### Editor

- 16-step grid for 4/4.
- Rows are instruments.
- Click toggles hit.
- Velocity states: soft, normal, accent.
- Add bar.
- Copy/paste bar.

### Kit

- Default kit.
- Add/remove instrument.
- Rename instrument.
- Set type, MIDI note, sample key.

### Playback

- Sample playback in browser.
- Play/stop.
- Tempo.
- Loop.
- Current step indicator.

### Export

- MIDI export.
- Debug JSON export.
- Basic printable PDF/grid.

### AI mock

- Select bars.
- Choose transformation.
- Generate mocked patch.
- Preview and apply/discard.

## Should-have

- API project save/load.
- Auth stub.
- Metronome.
- Better keyboard shortcuts.
- Undo/redo.

## Could-have

- Real AI endpoint.
- PDF with standard notation rendering.
- Import MIDI.
- Share link.
- User-uploaded samples.

## Won't-have in MVP

- VST.
- Official DAW connector.
- Audio-to-MIDI transcription.
- Real-time multiplayer.
- Branded instrument catalog.
- Licensing real drum/cymbal brands.
- Advanced notation with tuplets, polyrhythms, odd meters.

## MVP milestone plan

### M0 — Scaffold

Repo, apps, packages, lint/typecheck/test.

### M1 — Domain

Core model, schemas, helpers, tests.

### M2 — Grid

Basic editor with default kit.

### M3 — Playback

Browser sample playback with tempo.

### M4 — Export

MIDI and debug JSON.

### M5 — Kit Builder

Add/remove/rename instruments.

### M6 — AI Mock

Patch contract, mocked transformations, preview/apply.

### M7 — Persistence

Project API + database.

### M8 — Printable PDF

Readable printable grid/PDF.
