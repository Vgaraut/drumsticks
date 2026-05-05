# 11 — Roadmap Milestones

## M0 — Repo scaffold

Goal: agent-safe monorepo.

Deliverables:

- pnpm workspace;
- apps/web;
- apps/api;
- packages/core;
- packages/playback;
- packages/export;
- packages/ui;
- lint/typecheck/test scripts.

## M1 — Core model

Goal: reliable source of truth.

Deliverables:

- DrumProject types;
- Zod schemas;
- default kit/project;
- hit helpers;
- validation tests.

## M2 — Basic grid editor

Goal: clickable groove.

Deliverables:

- render default kit;
- render 1 section;
- render bars;
- toggle hits;
- tempo input;
- local project state.

## M3 — Playback

Goal: hear the groove.

Deliverables:

- sample loading;
- play/stop;
- scheduling by tempo;
- current step indicator;
- loop selected range;
- metronome optional.

## M4 — MIDI export

Goal: DAW usefulness.

Deliverables:

- convert project to MIDI;
- download MIDI;
- velocity mapping;
- tempo support;
- tests.

## M5 — Kit builder

Goal: user-controlled setup.

Deliverables:

- add/remove/rename instrument;
- type, MIDI note, sample key;
- validation;
- default kit reset.

## M6 — AI patch mock

Goal: safe AI UX without API risk.

Deliverables:

- patch types;
- patch validation;
- patch application;
- mocked transformations;
- preview/apply/discard UI.

## M7 — Project API

Goal: persistence.

Deliverables:

- Fastify API;
- CRUD endpoints;
- validation;
- in-memory or Postgres depending on phase.

## M8 — PDF export

Goal: practice/teaching output.

Deliverables:

- printable grid PDF;
- title/tempo/legend;
- basic layout.

## M9 — Real AI endpoint

Goal: useful transformation.

Deliverables:

- structured output contract;
- server-side validation;
- preview flow;
- logging of rejected patches;
- rate limits.

## M10 — Alpha polish

Goal: 10 real drummers can test.

Deliverables:

- undo/redo;
- keyboard shortcuts;
- better samples;
- bug fixes;
- onboarding template projects.
