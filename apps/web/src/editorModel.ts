import {
  createDefaultProject,
  findBar,
  getHitAtStep,
  toggleHit,
  updateProjectTempo,
  type DrumInstrument,
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

export function createInitialEditorProject(): DrumProject {
  return createDefaultProject();
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
