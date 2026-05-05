# 01 — Product Requirements

## Product name

Working name: **DrumForge**.

## Product description

DrumForge is a standalone web app for creating drum parts. Users build a custom drum kit, write patterns in a grid editor, play them in the browser, export MIDI/PDF, and use AI assistance for controlled edits.

## Main workflow

```text
Create project
  -> choose/default kit
  -> write groove in grid
  -> hear playback
  -> edit velocity/accent
  -> export MIDI/PDF
  -> optionally ask AI to patch selected bars
```

## MVP features

### Project

- Create project.
- Rename project.
- Set tempo.
- Set 4/4 time signature.
- Use 16-step resolution per bar.
- Save/load project.

### Kit Builder

- Add instrument.
- Remove instrument.
- Rename instrument.
- Select type.
- Select MIDI note.
- Select sample key.
- Optional visual position for a simple kit view.

### Grid Editor

- Render rows from kit instruments.
- Render bars and steps.
- Toggle hit on/off.
- Edit velocity.
- Add/remove bars.
- Copy/paste bar.
- Select bar range.

### Playback

- Play.
- Stop.
- Loop selected range.
- Tempo control.
- Metronome.
- Current step indicator.
- Sample-based drum sound.

### Export

- Export MIDI.
- Export debug JSON.
- Export basic printable PDF/grid.

### AI Assist

- Select 1–4 bars.
- Choose transformation.
- Get patch preview.
- Apply or discard patch.

Allowed transformations:

- simplify;
- make heavier;
- add fill;
- add ghost notes;
- humanize velocity;
- adapt to kit.

## Non-goals

- VST plugin;
- DAW replacement;
- mobile-native app;
- cloud multiplayer;
- audio recording;
- audio-to-MIDI transcription;
- official branded drum/cymbal catalog;
- full professional engraving;
- all time signatures and tuplets in MVP.

## User stories

### Drummer

As a drummer, I want to click a beat into a grid and immediately hear it, so I can test ideas quickly.

As a drummer, I want to export MIDI, so I can use the groove in Ableton, Logic, Reaper, FL Studio, or other DAWs.

As a drummer, I want to export a printable sheet, so I can practice or bring it to rehearsal.

### Teacher

As a teacher, I want to create exercises quickly, so I can share them with students.

As a teacher, I want to simplify or vary a pattern, so I can create beginner/intermediate/advanced versions.

### Producer

As a producer, I want to sketch a groove outside my DAW, so I can focus on rhythm first and drag/export it later.

## Acceptance criteria

The first usable demo must let a user:

- open the app;
- see a default kit;
- toggle kick/snare/hat hits in a 1-bar grid;
- press play;
- hear samples;
- change tempo;
- export MIDI;
- save/load the project state.
