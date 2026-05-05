# 05 — Domain Model

## Source of truth

`DrumProject` is the source of truth.

Everything else is derived:

- grid rendering;
- playback;
- MIDI export;
- PDF export;
- AI patching.

## Type sketch

```ts
export type DrumProject = {
  id: string;
  title: string;
  tempo: number;
  timeSignature: TimeSignature;
  resolution: 16;
  kit: DrumInstrument[];
  sections: DrumSection[];
  createdAt?: string;
  updatedAt?: string;
};

export type TimeSignature = {
  numerator: number;
  denominator: number;
};

export type DrumInstrument = {
  id: string;
  type: DrumInstrumentType;
  name: string;
  midiNote: number;
  sampleKey: string;
  staffPosition?: StaffPosition;
  visualPosition?: VisualPosition;
};

export type DrumInstrumentType =
  | 'kick'
  | 'snare'
  | 'closed_hat'
  | 'open_hat'
  | 'tom'
  | 'floor_tom'
  | 'crash'
  | 'ride'
  | 'clap'
  | 'perc';

export type StaffPosition = {
  line: number;
  notehead?: 'normal' | 'x' | 'diamond' | 'triangle';
};

export type VisualPosition = {
  x: number;
  y: number;
};

export type DrumSection = {
  id: string;
  name: string;
  bars: DrumBar[];
};

export type DrumBar = {
  id: string;
  index: number;
  events: DrumHit[];
};

export type DrumHit = {
  id: string;
  instrumentId: string;
  step: number;
  velocity: number;
};
```

## Constraints

- `tempo`: 40–260 BPM for MVP.
- `resolution`: exactly 16 for MVP.
- `timeSignature`: 4/4 for MVP, represented generically for future extension.
- `step`: integer from 0 to 15.
- `velocity`: integer from 1 to 127.
- `instrumentId`: must reference an existing instrument in project.kit.
- IDs must be stable.
- Display names are not IDs.

## Default kit

```text
Kick        MIDI 36
Snare       MIDI 38
Closed Hat  MIDI 42
Open Hat    MIDI 46
Crash       MIDI 49
Ride        MIDI 51
Rack Tom    MIDI 48
Floor Tom   MIDI 41
Clap        MIDI 39
```

## Core helpers

Implement in `packages/core`:

- `createDefaultProject()`
- `createDefaultKit()`
- `validateProject(project)`
- `getAllBars(project)`
- `findBar(project, barId)`
- `findInstrument(project, instrumentId)`
- `toggleHit(project, barId, instrumentId, step)`
- `addHit(project, barId, instrumentId, step, velocity)`
- `removeHit(project, barId, hitId)`
- `updateHitVelocity(project, barId, hitId, velocity)`
- `copyBar(project, sourceBarId, targetBarId)`
- `addBar(project, sectionId)`
- `removeBar(project, sectionId, barId)`

## Immutability

Core helpers should return new objects rather than mutating arguments in place.

## Validation

Use Zod schemas aligned with TypeScript types.

Validation should reject:

- invalid tempo;
- invalid step;
- invalid velocity;
- unknown instrument references;
- duplicate IDs within the same project;
- empty kit if the grid needs instruments.
