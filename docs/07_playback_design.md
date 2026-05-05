# 07 — Playback Design

## Goal

Play drum patterns in the browser from the internal DrumProject model.

## Non-goal

Do not use MIDI as the required playback path.

MIDI is an export format. Browser playback should use samples through WebAudio/Tone.js.

## Data flow

```text
DrumProject
  -> flatten hits into timed events
  -> schedule events by tempo/resolution
  -> trigger sample by instrument.sampleKey
```

## Why samples

MIDI itself does not make sound. It carries note/control events. For immediate browser feedback, use sample playback.

## Playback package API

Suggested API:

```ts
export type PlaybackOptions = {
  loop?: boolean;
  loopStartBarId?: string;
  loopEndBarId?: string;
  metronome?: boolean;
  onStep?: (position: PlaybackPosition) => void;
};

export type PlaybackPosition = {
  sectionId: string;
  barId: string;
  step: number;
};

export type PlaybackEngine = {
  loadSamples(sampleMap: SampleMap): Promise<void>;
  playProject(project: DrumProject, options?: PlaybackOptions): Promise<void>;
  stop(): void;
  dispose(): void;
};
```

## Sample map

```ts
export type SampleMap = Record<string, string>;
```

Example:

```ts
{
  kick_basic: '/samples/kick_basic.wav',
  snare_basic: '/samples/snare_basic.wav',
  closed_hat_basic: '/samples/closed_hat_basic.wav'
}
```

## Scheduling

For 4/4 with resolution 16:

```text
one bar = 4 beats
one step = one sixteenth note
step duration = 60 / bpm / 4 seconds
```

## Metronome

MVP metronome:

- accent on beat 1;
- click on beats 2, 3, 4;
- optional off by default.

## Important constraints

- Do not schedule with `setInterval` directly for audio precision.
- Do not recreate sample players on every React render.
- Cache samples.
- Stop and dispose cleanly.
- Browser audio may require user interaction before starting.

## Tests

Core scheduling math can be tested without real audio.

Test:

- hit at step 0 is scheduled at start;
- hit at step 4 is one beat later;
- tempo affects event times;
- empty project does not crash;
- missing sample key is handled.
