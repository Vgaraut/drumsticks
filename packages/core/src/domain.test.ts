import { describe, expect, it } from "vitest";

import {
  addBar,
  addHit,
  copyBar,
  createDefaultKit,
  createDefaultProject,
  findBar,
  removeHit,
  toggleHit,
  updateHitVelocity,
  validateProject
} from "./index.js";

describe("core domain model", () => {
  it("creates the default kit", () => {
    const kit = createDefaultKit();

    expect(kit).toHaveLength(9);
    expect(kit.map((instrument) => instrument.name)).toEqual([
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
  });

  it("creates a default project", () => {
    const project = createDefaultProject();

    expect(project.title).toBe("Untitled Groove");
    expect(project.tempo).toBe(120);
    expect(project.timeSignature).toEqual({ numerator: 4, denominator: 4 });
    expect(project.resolution).toBe(16);
    expect(project.sections[0]?.bars[0]?.events).toEqual([]);
  });

  it("validates the default project", () => {
    const project = createDefaultProject();

    expect(validateProject(project)).toEqual(project);
  });

  it("toggles a hit on without mutating the original project", () => {
    const project = createDefaultProject();
    const barId = getFirstBarId(project);
    const kickId = getInstrumentId(project, "Kick");

    const nextProject = toggleHit(project, barId, kickId, 0);
    const nextBar = findRequiredBar(nextProject, barId);

    expect(findRequiredBar(project, barId).events).toEqual([]);
    expect(nextBar.events).toHaveLength(1);
    expect(nextBar.events[0]).toMatchObject({
      instrumentId: kickId,
      step: 0,
      velocity: 90
    });
  });

  it("toggles a hit off", () => {
    const project = createDefaultProject();
    const barId = getFirstBarId(project);
    const kickId = getInstrumentId(project, "Kick");

    const withHit = toggleHit(project, barId, kickId, 0);
    const withoutHit = toggleHit(withHit, barId, kickId, 0);

    expect(findRequiredBar(withoutHit, barId).events).toEqual([]);
  });

  it("rejects an invalid step", () => {
    const project = createDefaultProject();

    expect(() =>
      toggleHit(project, getFirstBarId(project), getInstrumentId(project, "Kick"), 16)
    ).toThrow();
  });

  it("rejects an invalid velocity", () => {
    const project = createDefaultProject();

    expect(() =>
      addHit(project, getFirstBarId(project), getInstrumentId(project, "Kick"), 0, 0)
    ).toThrow();
  });

  it("rejects an unknown instrument ID", () => {
    const project = createDefaultProject();

    expect(() =>
      addHit(project, getFirstBarId(project), "instrument-missing", 0, 90)
    ).toThrow(/Instrument/);
  });

  it("adds a bar", () => {
    const project = createDefaultProject();
    const sectionId = project.sections[0]?.id;

    if (!sectionId) {
      throw new Error("Expected default project to include a section");
    }

    const nextProject = addBar(project, sectionId);

    expect(project.sections[0]?.bars).toHaveLength(1);
    expect(nextProject.sections[0]?.bars).toHaveLength(2);
    expect(nextProject.sections[0]?.bars[1]).toMatchObject({
      index: 1,
      events: []
    });
  });

  it("copies a bar with new hit IDs", () => {
    const project = createDefaultProject();
    const sectionId = project.sections[0]?.id;

    if (!sectionId) {
      throw new Error("Expected default project to include a section");
    }

    const barId = getFirstBarId(project);
    const kickId = getInstrumentId(project, "Kick");
    const withHit = addHit(project, barId, kickId, 4, 120);
    const withSecondBar = addBar(withHit, sectionId);
    const targetBarId = withSecondBar.sections[0]?.bars[1]?.id;

    if (!targetBarId) {
      throw new Error("Expected addBar to create a target bar");
    }

    const copied = copyBar(withSecondBar, barId, targetBarId);
    const sourceHit = findRequiredBar(copied, barId).events[0];
    const targetHit = findRequiredBar(copied, targetBarId).events[0];

    expect(targetHit).toMatchObject({
      instrumentId: kickId,
      step: 4,
      velocity: 120
    });
    expect(targetHit?.id).not.toBe(sourceHit?.id);
  });

  it("updates hit velocity", () => {
    const project = createDefaultProject();
    const barId = getFirstBarId(project);
    const kickId = getInstrumentId(project, "Kick");
    const withHit = addHit(project, barId, kickId, 0, 90);
    const hitId = findRequiredBar(withHit, barId).events[0]?.id;

    if (!hitId) {
      throw new Error("Expected addHit to create a hit");
    }

    const updated = updateHitVelocity(withHit, barId, hitId, 55);

    expect(findRequiredBar(updated, barId).events[0]?.velocity).toBe(55);
  });

  it("removes a hit", () => {
    const project = createDefaultProject();
    const barId = getFirstBarId(project);
    const kickId = getInstrumentId(project, "Kick");
    const withHit = addHit(project, barId, kickId, 0, 90);
    const hitId = findRequiredBar(withHit, barId).events[0]?.id;

    if (!hitId) {
      throw new Error("Expected addHit to create a hit");
    }

    const withoutHit = removeHit(withHit, barId, hitId);

    expect(findRequiredBar(withoutHit, barId).events).toEqual([]);
  });

  it("rejects duplicate IDs in a project", () => {
    const project = createDefaultProject();
    const duplicateInstrumentId = project.kit[0]?.id;

    if (!duplicateInstrumentId) {
      throw new Error("Expected default kit to include instruments");
    }

    expect(() =>
      validateProject({
        ...project,
        sections: [
          {
            ...project.sections[0],
            id: duplicateInstrumentId
          }
        ]
      })
    ).toThrow(/Duplicate ID/);
  });
});

function getFirstBarId(project: ReturnType<typeof createDefaultProject>): string {
  const barId = project.sections[0]?.bars[0]?.id;

  if (!barId) {
    throw new Error("Expected default project to include a bar");
  }

  return barId;
}

function getInstrumentId(
  project: ReturnType<typeof createDefaultProject>,
  name: string
): string {
  const instrumentId = project.kit.find((instrument) => instrument.name === name)?.id;

  if (!instrumentId) {
    throw new Error(`Expected default kit to include ${name}`);
  }

  return instrumentId;
}

function findRequiredBar(
  project: ReturnType<typeof createDefaultProject>,
  barId: string
) {
  const bar = findBar(project, barId);

  if (!bar) {
    throw new Error(`Expected project to include bar ${barId}`);
  }

  return bar;
}
