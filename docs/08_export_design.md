# 08 — Export Design

## Export principle

The internal DrumProject model is the source.

```text
DrumProject -> MIDI
DrumProject -> PDF
DrumProject -> JSON
DrumProject -> MusicXML later
```

Do not use MIDI or PDF as the source of truth.

## MIDI export

MIDI export must:

- preserve tempo;
- preserve instrument MIDI notes;
- preserve velocity;
- output drum hits on a conventional channel if the library supports it;
- support multiple bars;
- not crash on empty bars.

### Timing

MVP timing:

- 4/4;
- 16 steps per bar;
- one step = sixteenth note.

### MIDI notes

Use `instrument.midiNote`.

Default examples:

```text
Kick        36
Snare       38
Closed Hat  42
Open Hat    46
Crash       49
Ride        51
Clap        39
```

## JSON export

Debug JSON export should simply export the validated project model.

This is useful for:

- bug reports;
- agent debugging;
- migration testing;
- fixtures.

## PDF export

MVP PDF does not need to be professional notation.

Acceptable MVP PDF:

- title;
- tempo;
- kit legend;
- printable grid;
- bars separated clearly;
- velocity indicated by simple symbols or labels.

Later PDF:

- standard drum notation;
- noteheads;
- rests;
- beams;
- staff positions;
- MusicXML/VexFlow pipeline.

## Export UX

Buttons:

- Export MIDI
- Export PDF
- Export JSON

On export failure:

- show error;
- do not lose project state.

## Tests

MIDI tests:

- notes exist for hits;
- velocity is mapped;
- tempo is included;
- empty bar works;
- unknown instrument references are rejected before export.

PDF tests:

- simple generation does not crash;
- project title appears;
- bar count appears;
- grid has expected labels.
