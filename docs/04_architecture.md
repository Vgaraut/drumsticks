# 04 — Architecture

## Core idea

The internal JSON domain model is the source of truth.

Do not store MIDI, PDF, or notation as the primary representation.

```text
DrumProject JSON
  -> Grid Editor
  -> Playback Engine
  -> MIDI Export
  -> PDF Export
  -> AI Patch API
```

## Monorepo layout

```text
apps/web
apps/api
packages/core
packages/playback
packages/export
packages/ui
docs
tasks
prompts
```

## apps/web

Responsibilities:

- render project UI;
- render kit builder;
- render grid editor;
- handle local editor state;
- run browser playback;
- call API;
- trigger exports;
- show AI patch preview.

Do not put core grid logic directly in React components.

## apps/api

Responsibilities:

- health endpoint;
- project persistence;
- AI patch endpoint;
- auth later;
- export jobs later if needed.

The backend should not be required for local playback.

## packages/core

Contains:

- domain types;
- Zod schemas;
- default kit/project factories;
- grid utilities;
- hit operations;
- selection logic;
- patch validation;
- patch application.

This is the most important package.

## packages/playback

Contains:

- sample registry;
- sample loading;
- scheduling;
- play/stop;
- loop support;
- metronome;
- mapping from DrumHit to sample trigger.

Do not mutate project state in playback code.

## packages/export

Contains:

- MIDI export;
- JSON export/import helpers;
- printable grid/PDF export;
- MusicXML later.

## packages/ui

Contains reusable UI components only.

Do not put domain behavior here.

## API boundary

The API accepts and returns validated DrumProject JSON.

Endpoints:

- `GET /health`
- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `POST /ai/patch`

## AI boundary

Input:

- project metadata;
- current kit;
- selected bars;
- transformation;
- constraints.

Output:

- structured patch operations;
- explanation;
- confidence.

The patch must be validated before preview and before apply.

## Data flow example

```text
User clicks grid cell
  -> apps/web calls toggleHit(project, barId, instrumentId, step)
  -> packages/core returns new project state
  -> apps/web renders new grid
  -> playback can read latest project snapshot
```

## Deployment direction

Early:

```text
local dev -> Docker Compose
```

Later:

```text
web app + API + Postgres + object storage
```

Do not prematurely build Kubernetes or distributed worker infrastructure.
