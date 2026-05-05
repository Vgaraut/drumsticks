# 09 — AI Assist Contract

## Principle

AI returns patches, not entire projects.

The user remains in control:

```text
select bars -> choose action -> AI returns patch -> preview -> apply/discard
```

## Allowed AI actions

```ts
export type AiAction =
  | 'simplify'
  | 'make_heavier'
  | 'add_fill'
  | 'add_ghost_notes'
  | 'humanize_velocity'
  | 'adapt_to_kit';
```

## Request shape

```ts
export type AiPatchRequest = {
  projectId: string;
  tempo: number;
  timeSignature: TimeSignature;
  resolution: 16;
  kit: DrumInstrument[];
  selection: BarSelection;
  selectedBars: DrumBar[];
  action: AiAction;
  userInstruction?: string;
  constraints?: AiPatchConstraints;
};

export type BarSelection = {
  sectionId: string;
  startBarId: string;
  endBarId: string;
};

export type AiPatchConstraints = {
  maxDensity?: 'low' | 'medium' | 'high';
  preserveBackbeat?: boolean;
  preserveKickPattern?: boolean;
  allowedInstrumentIds?: string[];
};
```

## Response shape

```ts
export type AiPatchResponse = {
  patch: DrumPatch;
  explanation: string;
  confidence: number;
};
```

## Patch operations

```ts
export type DrumPatch = {
  id: string;
  operations: DrumPatchOperation[];
};

export type DrumPatchOperation =
  | AddHitOperation
  | RemoveHitOperation
  | UpdateHitVelocityOperation
  | ReplaceBarOperation;

export type AddHitOperation = {
  type: 'add_hit';
  barId: string;
  instrumentId: string;
  step: number;
  velocity: number;
};

export type RemoveHitOperation = {
  type: 'remove_hit';
  barId: string;
  hitId: string;
};

export type UpdateHitVelocityOperation = {
  type: 'update_hit_velocity';
  barId: string;
  hitId: string;
  velocity: number;
};

export type ReplaceBarOperation = {
  type: 'replace_bar';
  barId: string;
  events: DrumHit[];
};
```

## Validation rules

Reject patches that:

- reference unknown instruments;
- reference unknown bars;
- modify bars outside the selected range;
- use invalid step values;
- use invalid velocity values;
- create duplicate hit IDs;
- create duplicate hits for the same instrument at the same step unless explicitly supported;
- remove hits that do not exist;
- replace a bar with invalid events.

## UX

AI patch must be previewed before applying.

Preview should show:

- added hits;
- removed hits;
- velocity changes;
- replaced bars.

User choices:

- Apply;
- Discard;
- Regenerate.

## Prompting principle

The system prompt should tell the model:

- return only valid JSON;
- never invent instrument IDs;
- only modify selected bars;
- prefer small useful edits;
- preserve the core groove unless action says otherwise;
- do not output prose inside the patch.

See `prompts/ai_patch_system.md`.
