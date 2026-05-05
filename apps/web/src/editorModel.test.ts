import { describe, expect, it } from "vitest";

import {
  addKitInstrument,
  buildGridRows,
  changeProjectTempo,
  countInstrumentHits,
  createInstrumentDraft,
  createInitialEditorProject,
  getFirstSection,
  removeKitInstrument,
  resetProjectKit,
  toggleGridCell
} from "./editorModel";

describe("editor model", () => {
  it("renders default instrument rows", () => {
    const project = createInitialEditorProject();
    const barId = getFirstSection(project).bars[0]?.id;

    if (!barId) {
      throw new Error("Expected initial project to include a bar");
    }

    const rows = buildGridRows(project, barId);

    expect(rows.map((row) => row.instrument.name)).toEqual([
      "Kick",
      "Snare",
      "Closed Hi-Hat",
      "Open Hi-Hat",
      "Crash",
      "Ride",
      "Rack Tom",
      "Floor Tom",
      "Clap"
    ]);
    expect(rows[0]?.cells).toHaveLength(16);
  });

  it("clicking a cell adds a hit", () => {
    const project = createInitialEditorProject();
    const barId = getFirstSection(project).bars[0]?.id;
    const kickId = project.kit.find((instrument) => instrument.name === "Kick")?.id;

    if (!barId || !kickId) {
      throw new Error("Expected initial project to include kick and a bar");
    }

    const updated = toggleGridCell(project, barId, kickId, 0);
    const kickRow = buildGridRows(updated, barId).find(
      (row) => row.instrument.id === kickId
    );

    expect(kickRow?.cells[0]?.active).toBe(true);
  });

  it("clicking an active cell removes the hit", () => {
    const project = createInitialEditorProject();
    const barId = getFirstSection(project).bars[0]?.id;
    const kickId = project.kit.find((instrument) => instrument.name === "Kick")?.id;

    if (!barId || !kickId) {
      throw new Error("Expected initial project to include kick and a bar");
    }

    const withHit = toggleGridCell(project, barId, kickId, 0);
    const withoutHit = toggleGridCell(withHit, barId, kickId, 0);
    const kickRow = buildGridRows(withoutHit, barId).find(
      (row) => row.instrument.id === kickId
    );

    expect(kickRow?.cells[0]?.active).toBe(false);
  });

  it("tempo update changes project state", () => {
    const project = createInitialEditorProject();
    const updated = changeProjectTempo(project, 132);

    expect(project.tempo).toBe(120);
    expect(updated.tempo).toBe(132);
  });

  it("adds a kit instrument", () => {
    const project = createInitialEditorProject();
    const updated = addKitInstrument(project, {
      type: "perc",
      name: "  Perc  ",
      midiNote: 75,
      sampleKey: "  perc  "
    });

    expect(updated.kit).toHaveLength(project.kit.length + 1);
    expect(updated.kit.at(-1)).toMatchObject({
      type: "perc",
      name: "Perc",
      midiNote: 75,
      sampleKey: "perc"
    });
  });

  it("removes a kit instrument and dependent hits", () => {
    const project = createInitialEditorProject();
    const barId = getFirstSection(project).bars[0]?.id;
    const kickId = project.kit.find((instrument) => instrument.name === "Kick")?.id;

    if (!barId || !kickId) {
      throw new Error("Expected initial project to include kick and a bar");
    }

    const withHit = toggleGridCell(project, barId, kickId, 0);
    const updated = removeKitInstrument(withHit, kickId);

    expect(updated.kit.some((instrument) => instrument.id === kickId)).toBe(false);
    expect(countInstrumentHits(updated, kickId)).toBe(0);
  });

  it("resets the project kit", () => {
    const project = createInitialEditorProject();
    const withInstrument = addKitInstrument(project, createInstrumentDraft());
    const resetProject = resetProjectKit(withInstrument);

    expect(withInstrument.kit).toHaveLength(10);
    expect(resetProject.kit).toHaveLength(9);
    expect(resetProject.kit[0]?.name).toBe("Kick");
  });
});
