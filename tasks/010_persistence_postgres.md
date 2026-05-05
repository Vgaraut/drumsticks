# Task 010 — Persistence with Postgres

## Goal

Replace or supplement in-memory project storage with Postgres + Drizzle.

## Requirements

- Add database config.
- Add migrations.
- Add `projects` table.
- Store validated project JSON.
- Add created/updated timestamps.
- Keep API validation at boundaries.

## Suggested schema

```text
projects
  id uuid primary key
  title text not null
  data jsonb not null
  created_at timestamp not null
  updated_at timestamp not null
```

## Constraints

- Auth can remain stubbed unless already implemented.
- Do not over-normalize drum hits/instruments in MVP.
- Project JSON is acceptable for early product velocity.

## Tests

- create project persists;
- update project persists;
- invalid project rejected;
- delete removes project;
- migration runs.

## Acceptance criteria

- API can store and retrieve projects from Postgres.
