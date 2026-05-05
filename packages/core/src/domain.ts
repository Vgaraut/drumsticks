import { z } from "zod";

const idSchema = z.string().min(1);
const stepSchema = z.number().int().min(0).max(15);
const velocitySchema = z.number().int().min(1).max(127);

export const timeSignatureSchema = z
  .object({
    numerator: z.literal(4),
    denominator: z.literal(4)
  })
  .strict();

export const drumInstrumentTypeSchema = z.enum([
  "kick",
  "snare",
  "closed_hat",
  "open_hat",
  "tom",
  "floor_tom",
  "crash",
  "ride",
  "clap",
  "perc"
]);

export const staffPositionSchema = z
  .object({
    line: z.number().int(),
    notehead: z.enum(["normal", "x", "diamond", "triangle"]).optional()
  })
  .strict();

export const visualPositionSchema = z
  .object({
    x: z.number(),
    y: z.number()
  })
  .strict();

export const drumInstrumentSchema = z
  .object({
    id: idSchema,
    type: drumInstrumentTypeSchema,
    name: z.string().min(1),
    midiNote: z.number().int().min(0).max(127),
    sampleKey: z.string().min(1),
    staffPosition: staffPositionSchema.optional(),
    visualPosition: visualPositionSchema.optional()
  })
  .strict();

export const drumHitSchema = z
  .object({
    id: idSchema,
    instrumentId: idSchema,
    step: stepSchema,
    velocity: velocitySchema
  })
  .strict();

export const drumBarSchema = z
  .object({
    id: idSchema,
    index: z.number().int().min(0),
    events: z.array(drumHitSchema)
  })
  .strict();

export const drumSectionSchema = z
  .object({
    id: idSchema,
    name: z.string().min(1),
    bars: z.array(drumBarSchema)
  })
  .strict();

const drumProjectBaseSchema = z
  .object({
    id: idSchema,
    title: z.string().min(1),
    tempo: z.number().int().min(40).max(260),
    timeSignature: timeSignatureSchema,
    resolution: z.literal(16),
    kit: z.array(drumInstrumentSchema).min(1),
    sections: z.array(drumSectionSchema),
    createdAt: z.string().min(1).optional(),
    updatedAt: z.string().min(1).optional()
  })
  .strict();

export const drumProjectSchema = drumProjectBaseSchema.superRefine(
  (project, context) => {
    const ids = new Set<string>();
    const instrumentIds = new Set(project.kit.map((instrument) => instrument.id));

    const addProjectId = (id: string, path: (string | number)[]) => {
      if (ids.has(id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate ID "${id}"`,
          path
        });
        return;
      }

      ids.add(id);
    };

    addProjectId(project.id, ["id"]);

    project.kit.forEach((instrument, instrumentIndex) => {
      addProjectId(instrument.id, ["kit", instrumentIndex, "id"]);
    });

    project.sections.forEach((section, sectionIndex) => {
      addProjectId(section.id, ["sections", sectionIndex, "id"]);

      section.bars.forEach((bar, barIndex) => {
        addProjectId(bar.id, ["sections", sectionIndex, "bars", barIndex, "id"]);

        bar.events.forEach((hit, hitIndex) => {
          addProjectId(hit.id, [
            "sections",
            sectionIndex,
            "bars",
            barIndex,
            "events",
            hitIndex,
            "id"
          ]);

          if (!instrumentIds.has(hit.instrumentId)) {
            context.addIssue({
              code: "custom",
              message: `Unknown instrument ID "${hit.instrumentId}"`,
              path: [
                "sections",
                sectionIndex,
                "bars",
                barIndex,
                "events",
                hitIndex,
                "instrumentId"
              ]
            });
          }
        });
      });
    });
  }
);

export type TimeSignature = z.infer<typeof timeSignatureSchema>;
export type DrumInstrumentType = z.infer<typeof drumInstrumentTypeSchema>;
export type StaffPosition = z.infer<typeof staffPositionSchema>;
export type VisualPosition = z.infer<typeof visualPositionSchema>;
export type DrumInstrument = z.infer<typeof drumInstrumentSchema>;
export type DrumHit = z.infer<typeof drumHitSchema>;
export type DrumBar = z.infer<typeof drumBarSchema>;
export type DrumSection = z.infer<typeof drumSectionSchema>;
export type DrumProject = z.infer<typeof drumProjectSchema>;

export type ProjectSummary = {
  title: string;
  instruments: string[];
};

const normalVelocity = 90;

const defaultKit: DrumInstrument[] = [
  {
    id: "instrument-kick",
    type: "kick",
    name: "Kick",
    midiNote: 36,
    sampleKey: "kick"
  },
  {
    id: "instrument-snare",
    type: "snare",
    name: "Snare",
    midiNote: 38,
    sampleKey: "snare"
  },
  {
    id: "instrument-closed-hat",
    type: "closed_hat",
    name: "Closed Hi-Hat",
    midiNote: 42,
    sampleKey: "closed_hat"
  },
  {
    id: "instrument-open-hat",
    type: "open_hat",
    name: "Open Hi-Hat",
    midiNote: 46,
    sampleKey: "open_hat"
  },
  {
    id: "instrument-crash",
    type: "crash",
    name: "Crash",
    midiNote: 49,
    sampleKey: "crash"
  },
  {
    id: "instrument-ride",
    type: "ride",
    name: "Ride",
    midiNote: 51,
    sampleKey: "ride"
  },
  {
    id: "instrument-rack-tom",
    type: "tom",
    name: "Rack Tom",
    midiNote: 48,
    sampleKey: "rack_tom"
  },
  {
    id: "instrument-floor-tom",
    type: "floor_tom",
    name: "Floor Tom",
    midiNote: 41,
    sampleKey: "floor_tom"
  },
  {
    id: "instrument-clap",
    type: "clap",
    name: "Clap",
    midiNote: 39,
    sampleKey: "clap"
  }
];

export function createDefaultKit(): DrumInstrument[] {
  return defaultKit.map((instrument) => ({
    ...instrument,
    staffPosition: cloneOptionalObject(instrument.staffPosition),
    visualPosition: cloneOptionalObject(instrument.visualPosition)
  }));
}

export function createDefaultProject(): DrumProject {
  return validateProject({
    id: "project-default",
    title: "Untitled Groove",
    tempo: 120,
    timeSignature: {
      numerator: 4,
      denominator: 4
    },
    resolution: 16,
    kit: createDefaultKit(),
    sections: [
      {
        id: "section-main",
        name: "Main",
        bars: [
          {
            id: "bar-1",
            index: 0,
            events: []
          }
        ]
      }
    ]
  });
}

export function createDefaultProjectSummary(): ProjectSummary {
  const project = createDefaultProject();

  return {
    title: project.title,
    instruments: project.kit.map((instrument) => instrument.name)
  };
}

export function validateProject(project: unknown): DrumProject {
  return drumProjectSchema.parse(project);
}

export function getAllBars(project: DrumProject): DrumBar[] {
  return project.sections.flatMap((section) => section.bars);
}

export function findBar(project: DrumProject, barId: string): DrumBar | undefined {
  return getAllBars(project).find((bar) => bar.id === barId);
}

export function findInstrument(
  project: DrumProject,
  instrumentId: string
): DrumInstrument | undefined {
  return project.kit.find((instrument) => instrument.id === instrumentId);
}

export function toggleHit(
  project: DrumProject,
  barId: string,
  instrumentId: string,
  step: number
): DrumProject {
  assertValidProject(project);
  assertInstrumentExists(project, instrumentId);
  assertValidStep(step);

  const bar = getRequiredBar(project, barId);
  const matchingHit = bar.events.find(
    (hit) => hit.instrumentId === instrumentId && hit.step === step
  );

  if (matchingHit) {
    return removeHit(project, barId, matchingHit.id);
  }

  return addHit(project, barId, instrumentId, step, normalVelocity);
}

export function addHit(
  project: DrumProject,
  barId: string,
  instrumentId: string,
  step: number,
  velocity: number
): DrumProject {
  assertValidProject(project);
  assertInstrumentExists(project, instrumentId);
  assertValidStep(step);
  assertValidVelocity(velocity);
  getRequiredBar(project, barId);

  const hit: DrumHit = {
    id: createNextId(project, "hit"),
    instrumentId,
    step,
    velocity
  };

  return replaceBar(project, barId, (bar) => ({
    ...bar,
    events: sortHits([
      ...bar.events.filter(
        (event) => event.instrumentId !== instrumentId || event.step !== step
      ),
      hit
    ])
  }));
}

export function removeHit(
  project: DrumProject,
  barId: string,
  hitId: string
): DrumProject {
  assertValidProject(project);
  const bar = getRequiredBar(project, barId);

  if (!bar.events.some((hit) => hit.id === hitId)) {
    throw new Error(`Hit "${hitId}" was not found in bar "${barId}"`);
  }

  return replaceBar(project, barId, (currentBar) => ({
    ...currentBar,
    events: currentBar.events.filter((hit) => hit.id !== hitId)
  }));
}

export function updateHitVelocity(
  project: DrumProject,
  barId: string,
  hitId: string,
  velocity: number
): DrumProject {
  assertValidProject(project);
  assertValidVelocity(velocity);
  const bar = getRequiredBar(project, barId);

  if (!bar.events.some((hit) => hit.id === hitId)) {
    throw new Error(`Hit "${hitId}" was not found in bar "${barId}"`);
  }

  return replaceBar(project, barId, (currentBar) => ({
    ...currentBar,
    events: currentBar.events.map((hit) =>
      hit.id === hitId ? { ...hit, velocity } : hit
    )
  }));
}

export function addBar(project: DrumProject, sectionId: string): DrumProject {
  assertValidProject(project);

  const section = project.sections.find((candidate) => candidate.id === sectionId);

  if (!section) {
    throw new Error(`Section "${sectionId}" was not found`);
  }

  const nextIndex =
    section.bars.length === 0
      ? 0
      : Math.max(...section.bars.map((bar) => bar.index)) + 1;
  const nextBar: DrumBar = {
    id: createNextId(project, "bar"),
    index: nextIndex,
    events: []
  };

  return validateProject({
    ...project,
    sections: project.sections.map((candidate) =>
      candidate.id === sectionId
        ? {
            ...candidate,
            bars: [...candidate.bars, nextBar]
          }
        : candidate
    )
  });
}

export function copyBar(
  project: DrumProject,
  sourceBarId: string,
  targetBarId: string
): DrumProject {
  assertValidProject(project);
  const sourceBar = getRequiredBar(project, sourceBarId);
  getRequiredBar(project, targetBarId);
  const existingIds = collectIds(project);

  const copiedEvents = sourceBar.events.map((hit, index) => ({
    ...hit,
    id: createNextIdFromSet(existingIds, `hit-copy-${index + 1}`)
  }));

  return replaceBar(project, targetBarId, (bar) => ({
    ...bar,
    events: sortHits(copiedEvents)
  }));
}

export function removeBar(
  project: DrumProject,
  sectionId: string,
  barId: string
): DrumProject {
  assertValidProject(project);

  const section = project.sections.find((candidate) => candidate.id === sectionId);

  if (!section) {
    throw new Error(`Section "${sectionId}" was not found`);
  }

  if (!section.bars.some((bar) => bar.id === barId)) {
    throw new Error(`Bar "${barId}" was not found in section "${sectionId}"`);
  }

  return validateProject({
    ...project,
    sections: project.sections.map((candidate) =>
      candidate.id === sectionId
        ? {
            ...candidate,
            bars: candidate.bars.filter((bar) => bar.id !== barId)
          }
        : candidate
    )
  });
}

function assertValidProject(project: DrumProject): void {
  validateProject(project);
}

function assertInstrumentExists(
  project: DrumProject,
  instrumentId: string
): void {
  if (!findInstrument(project, instrumentId)) {
    throw new Error(`Instrument "${instrumentId}" was not found`);
  }
}

function assertValidStep(step: number): void {
  stepSchema.parse(step);
}

function assertValidVelocity(velocity: number): void {
  velocitySchema.parse(velocity);
}

function getRequiredBar(project: DrumProject, barId: string): DrumBar {
  const bar = findBar(project, barId);

  if (!bar) {
    throw new Error(`Bar "${barId}" was not found`);
  }

  return bar;
}

function replaceBar(
  project: DrumProject,
  barId: string,
  updateBar: (bar: DrumBar) => DrumBar
): DrumProject {
  return validateProject({
    ...project,
    sections: project.sections.map((section) => ({
      ...section,
      bars: section.bars.map((bar) =>
        bar.id === barId ? updateBar(bar) : bar
      )
    }))
  });
}

function sortHits(events: DrumHit[]): DrumHit[] {
  return [...events].sort((left, right) => {
    if (left.step !== right.step) {
      return left.step - right.step;
    }

    return left.instrumentId.localeCompare(right.instrumentId);
  });
}

function createNextId(project: DrumProject, prefix: string): string {
  return createNextIdFromSet(collectIds(project), prefix);
}

function createNextIdFromSet(existingIds: Set<string>, prefix: string): string {
  let counter = 1;
  let nextId = `${prefix}-${counter}`;

  while (existingIds.has(nextId)) {
    counter += 1;
    nextId = `${prefix}-${counter}`;
  }

  existingIds.add(nextId);
  return nextId;
}

function collectIds(project: DrumProject): Set<string> {
  const ids = new Set<string>([
    project.id,
    ...project.kit.map((instrument) => instrument.id)
  ]);

  project.sections.forEach((section) => {
    ids.add(section.id);

    section.bars.forEach((bar) => {
      ids.add(bar.id);

      bar.events.forEach((hit) => {
        ids.add(hit.id);
      });
    });
  });

  return ids;
}

function cloneOptionalObject<T extends object>(value: T | undefined): T | undefined {
  return value ? { ...value } : undefined;
}
