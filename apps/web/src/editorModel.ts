import {
  addInstrument,
  createDefaultProject,
  drumInstrumentTypes,
  findBar,
  getHitAtStep,
  removeInstrument,
  resetKit,
  toggleHit,
  updateInstrument,
  updateProjectTempo,
  type DrumInstrument,
  type DrumInstrumentInput,
  type DrumInstrumentPatch,
  type DrumInstrumentType,
  type DrumProject,
  type DrumSection
} from "@drumforge/core";

export const stepIndexes = Array.from({ length: 16 }, (_, step) => step);

export const stepLabels = [
  "1",
  "e",
  "&",
  "a",
  "2",
  "e",
  "&",
  "a",
  "3",
  "e",
  "&",
  "a",
  "4",
  "e",
  "&",
  "a"
] as const;

export type GridCellView = {
  step: number;
  label: string;
  active: boolean;
  hitId?: string;
  velocity?: number;
};

export type GridRowView = {
  instrument: DrumInstrument;
  cells: GridCellView[];
};

export type InstrumentDraft = Pick<
  DrumInstrumentInput,
  "type" | "name" | "midiNote" | "sampleKey"
>;

export const instrumentTypeOptions = drumInstrumentTypes;

export const instrumentTypeLabels: Record<DrumInstrumentType, string> = {
  kick: "Kick",
  snare: "Snare",
  closed_hat: "Closed Hi-Hat",
  open_hat: "Open Hi-Hat",
  tom: "Rack Tom",
  floor_tom: "Floor Tom",
  crash: "Crash",
  ride: "Ride",
  clap: "Clap",
  perc: "Perc"
};

export function createInitialEditorProject(): DrumProject {
  return createDefaultProject();
}

export function createInstrumentDraft(): InstrumentDraft {
  return {
    type: "perc",
    name: "Perc",
    midiNote: 75,
    sampleKey: "perc"
  };
}

export function getFirstSection(project: DrumProject): DrumSection {
  const section = project.sections[0];

  if (!section) {
    throw new Error("Project does not include a section");
  }

  return section;
}

export function buildGridRows(
  project: DrumProject,
  barId: string
): GridRowView[] {
  const bar = findBar(project, barId);

  if (!bar) {
    throw new Error(`Bar "${barId}" was not found`);
  }

  return project.kit.map((instrument) => ({
    instrument,
    cells: stepIndexes.map((step) => {
      const hit = getHitAtStep(project, bar.id, instrument.id, step);

      return {
        step,
        label: stepLabels[step],
        active: Boolean(hit),
        hitId: hit?.id,
        velocity: hit?.velocity
      };
    })
  }));
}

export function toggleGridCell(
  project: DrumProject,
  barId: string,
  instrumentId: string,
  step: number
): DrumProject {
  return toggleHit(project, barId, instrumentId, step);
}

export function changeProjectTempo(
  project: DrumProject,
  tempo: number
): DrumProject {
  return updateProjectTempo(project, tempo);
}

export function addKitInstrument(
  project: DrumProject,
  instrument: InstrumentDraft
): DrumProject {
  return addInstrument(project, {
    ...instrument,
    name: instrument.name.trim(),
    sampleKey: instrument.sampleKey.trim()
  });
}

export function updateKitInstrument(
  project: DrumProject,
  instrumentId: string,
  patch: DrumInstrumentPatch
): DrumProject {
  return updateInstrument(project, instrumentId, normalizeInstrumentPatch(patch));
}

export function removeKitInstrument(
  project: DrumProject,
  instrumentId: string
): DrumProject {
  return removeInstrument(project, instrumentId);
}

export function resetProjectKit(project: DrumProject): DrumProject {
  return resetKit(project);
}

export function countInstrumentHits(
  project: DrumProject,
  instrumentId: string
): number {
  return project.sections.reduce(
    (sectionCount, section) =>
      sectionCount +
      section.bars.reduce(
        (barCount, bar) =>
          barCount +
          bar.events.filter((hit) => hit.instrumentId === instrumentId).length,
        0
      ),
    0
  );
}

function normalizeInstrumentPatch(
  patch: DrumInstrumentPatch
): DrumInstrumentPatch {
  return {
    ...patch,
    name: patch.name?.trim(),
    sampleKey: patch.sampleKey?.trim()
  };
}
