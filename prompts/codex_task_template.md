# Codex Task Template

Use this template when giving a task to Codex or another coding agent.

```md
# Task — <name>

## Goal

<one clear goal>

## Context

Read:

- AGENTS.md
- code_review.md
- relevant docs in docs/

## Requirements

- <requirement 1>
- <requirement 2>
- <requirement 3>

## Constraints

- Do not implement unrelated features.
- Keep domain logic in packages/core.
- Keep editor state serializable.
- Add tests for core logic.

## Acceptance criteria

- <criterion 1>
- <criterion 2>
- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
```
