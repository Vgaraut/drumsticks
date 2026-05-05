# Task 011 — Polish and Quality Gate

## Goal

Prepare the app for real drummer alpha testing.

## Requirements

Add or improve:

- undo/redo for grid edits;
- keyboard shortcuts;
- error messages;
- loading states;
- sample missing fallback;
- onboarding default project;
- export feedback;
- AI patch preview clarity;
- basic responsive layout.

## Quality gate

Before alpha:

- core tests pass;
- playback can start/stop repeatedly;
- MIDI export works on a sample project;
- PDF export works on a sample project;
- project save/load works;
- no branded catalog assets;
- AI patch cannot modify unselected bars.

## Manual test script

1. Open app.
2. Create project.
3. Make kick/snare/hat groove.
4. Press play.
5. Change tempo.
6. Loop a bar.
7. Add tom.
8. Add fill via mock AI.
9. Apply patch.
10. Export MIDI.
11. Export PDF.
12. Save/reload.

## Acceptance criteria

The app is ready to show to 10 real drummers for feedback.
