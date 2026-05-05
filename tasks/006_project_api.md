# Task 006 — Project API

## Goal

Implement project CRUD endpoints in `apps/api`.

## Endpoints

- `GET /health`
- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PUT /projects/:id`
- `DELETE /projects/:id`

## Storage

For this task, in-memory storage is acceptable unless Postgres is already configured.

## Validation

Validate DrumProject payloads with `packages/core` schemas.

## Requirements

- Return JSON.
- Handle not found.
- Handle invalid payload.
- Do not accept invalid project states.

## Frontend integration

Optional in this task, unless already convenient:

- save project;
- load project list.

## Tests

- health returns ok;
- create project;
- list projects;
- get project;
- update project;
- delete project;
- invalid project rejected.

## Acceptance criteria

- API runs.
- Project endpoints work.
- Validation uses core schemas.
